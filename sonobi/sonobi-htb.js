/**
 * @author:    Partner
 * @license:   UNLICENSED
 *
 * @copyright: Copyright (c) 2017 by Index Exchange. All rights reserved.
 *
 * The information contained within this document is confidential, copyrighted
 * and or a trade secret. No part of this document may be reproduced or
 * distributed in any form or by any means, in whole or in part, without the
 * prior written permission of Index Exchange.
 */

'use strict';

////////////////////////////////////////////////////////////////////////////////
// Dependencies ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var Browser = require('browser.js');
var Classify = require('classify.js');
var Network = require('network.js');
var Prms = require('prms.js');
var Constants = require('constants.js');
var Partner = require('partner.js');
var Size = require('size.js');
var SpaceCamp = require('space-camp.js');
var System = require('system.js');
var Utilities = require('utilities.js');
var ComplianceService;
var EventsService;
var RenderService;

//? if (DEBUG) {
var ConfigValidators = require('config-validators.js');
var PartnerSpecificValidator = require('sonobi-htb-validator.js');
var Scribe = require('scribe.js');
var Whoopsie = require('whoopsie.js');
//? }

////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * Sonobi Header Tag Bidder Module
 *
 * @class
 */
function SonobiHtb(configs) {
    /* =====================================
     * Data
     * ---------------------------------- */

    /* Private
     * ---------------------------------- */

    /**
     * Reference to the partner base class.
     *
     * @private {object}
     */
    var __baseClass;

    /**
     * Profile for this partner.
     *
     * @private  {object}
     */
    var __profile;

    /**
     * Base url for bid requests.
     *
     * @private {object}
     */
    var __baseUrl;

    /**
     * Ad response storage for different requests;
     *
     * @private {object}
     */
    var __adResponseStore;

    /* Public
     * ---------------------------------- */

    /**
     * Storage for dynamically generated ad respsonse callbacks.
     *
     * @private {object}
     */
    var adResponseCallbacks;

    /* =====================================
     * Functions
     * ---------------------------------- */

    /* Utilities
     * ---------------------------------- */

    /**
     * Generates the request URL and query data to the endpoint for the xSlots
     * in the given returnParcels.
     *
     * @param  {object[]} returnParcels
     *
     * @return {object}
     */
    function __generateRequestObj(returnParcels) {
        var keyMaker = {};

        /* Sonobi is SRA so iterate through all returnParcels for xSlotName and sonobiKey */
        for (var i = 0; i < returnParcels.length; i++) {
            var slotName = returnParcels[i].htSlot.getName() + '-' + returnParcels[i].xSlotName;
            keyMaker[slotName] = returnParcels[i].xSlotRef.key;
        }

        /* Make the request inside an iframe and store the iframe for later access */
        var iFrame = Browser.createHiddenIFrame(null, window);
        var requestId = '_' + System.generateUniqueId();

        var w = window;
        iFrame.contentWindow.sbi = function (responseText) {
            w[SpaceCamp.NAMESPACE][__profile.namespace].adResponseCallbacks[requestId](responseText);
        };

        /* build data */
        var data = {
            key_maker: JSON.stringify(keyMaker), // jshint ignore:line
            cv: 'sbi',
            lib_v: __profile.version,
            lib_name: 'ix',
            vp: SpaceCamp.DeviceTypeChecker.getDeviceType(),
            ref: Browser.getPageUrl()
        };

        var gdprStatus = ComplianceService.gdpr.getConsent();
        var privacyEnabled = ComplianceService.isPrivacyEnabled();
        if (privacyEnabled && gdprStatus) {
            data.gdpr = gdprStatus.applies;
            if(gdprStatus.consentString) {
                data.consent_string = gdprStatus.consentString;
            }
        }

        return {
            url: __baseUrl,
            callbackId: requestId,
            iframe: iFrame,
            data: data
        };
    }

    /* Helpers
     * ---------------------------------- */

    /* Parses and extracts demand from adResponse according to the adapter and then attaches it
     * to the corresponding bid's returnParcel in the correct format using targeting keys.
     */
    function __parseResponse(sessionId, adResponse, returnParcels, outstandingXSlotNames) {
        var bids = adResponse.slots;

        for (var i = 0; i < returnParcels.length; i++) {
            var curReturnParcel = returnParcels[i];

            var slotName = curReturnParcel.htSlot.getName() + '-' + curReturnParcel.xSlotName;

            /* Make sure returnParcel has matching bid */
            if (!Utilities.isObject(bids) || !bids.hasOwnProperty(slotName)) {
                continue;
            }

            var bid = bids[slotName];

            if (Utilities.isObject(bid) && !Utilities.isEmpty(bid)) {
                var htSlotId = curReturnParcel.htSlot.getId();
                var requestId = curReturnParcel.requestId;

                var bidPriceLevel = bid.sbi_mouse; // jshint ignore: line

                if (bidPriceLevel <= 0) {
                    curReturnParcel.pass = true;
                    continue;
                }

                /* Send analytics if enabled by partner */
                if (__profile.enabledAnalytics.requestTime) {
                    EventsService.emit('hs_slot_bid', {
                        sessionId: sessionId,
                        statsId: __profile.statsId,
                        htSlotId: htSlotId,
                        xSlotNames: [curReturnParcel.xSlotName],
                        requestId: requestId
                    });

                    if (outstandingXSlotNames[htSlotId] && outstandingXSlotNames[htSlotId][requestId]) {
                        Utilities.arrayDelete(outstandingXSlotNames[htSlotId][requestId], curReturnParcel.xSlotName);
                    }
                }

                /* Extract size */
                var sizeString = bid.sbi_size; // jshint ignore: line
                curReturnParcel.size = Size.stringToArray(sizeString)[0];

                /* Attach targeting keys to returnParcel slots */
                curReturnParcel.targetingType = 'slot';
                curReturnParcel.targeting = {};

                var targetingCpm = '';

                var bidCreative = '<html><body><script type="text/javascript"src="//' + adResponse.sbi_dc + 'apex.go.sonobi.com/sbi.js?as=null&aid=' + bid.sbi_aid + '&ref='+ Browser.getPageUrl() +'"></script></body></html>'; // jshint ignore: line

                /* custom mode sets all the targeting keys that are returned by sonobi */
                //? if(FEATURES.GPT_LINE_ITEMS) {
                if (__baseClass._configs.lineItemType === Constants.LineItemTypes.CUSTOM) {
                    for (var targetingKey in bid) {
                        if (!bid.hasOwnProperty(targetingKey)) {
                            continue;
                        }
                        if (targetingKey === 'sbi_mouse') {
                            curReturnParcel.targeting[targetingKey] = __baseClass._bidTransformers.targeting.apply(bid[targetingKey]);
                        } else {
                            curReturnParcel.targeting[targetingKey] = bid[targetingKey];
                        }
                    }

                    /* server to use for creative, technically page level but assign to every slot because it is used with slot demand */
                    if (adResponse.hasOwnProperty('sbi_dc')) {
                        returnParcels[i].targeting.sbi_dc = adResponse.sbi_dc; // jshint ignore: line
                    }

                } else {
                    if (Utilities.isNumeric(bidPriceLevel)) {
                        targetingCpm = __baseClass._bidTransformers.targeting.apply(bidPriceLevel);
                    } else {
                        targetingCpm = bidPriceLevel;
                    }

                    curReturnParcel.targeting[__baseClass._configs.targetingKeys.om] = [sizeString + '_' + targetingCpm];
                    curReturnParcel.targeting[__baseClass._configs.targetingKeys.id] = [curReturnParcel.requestId];
                }
                //? }

                //? if(FEATURES.RETURN_CREATIVE) {
                curReturnParcel.adm = bidCreative;
                //? }

                //? if(FEATURES.RETURN_PRICE) {
                if (Utilities.isNumeric(bidPriceLevel)) {
                    curReturnParcel.price = Number(__baseClass._bidTransformers.price.apply(bidPriceLevel));
                }
                //? }

                var pubKitAdId = RenderService.registerAd({
                    sessionId: sessionId,
                    partnerId: __profile.partnerId,
                    adm: bidCreative,
                    requestId: curReturnParcel.requestId,
                    size: curReturnParcel.size,
                    price: targetingCpm,
                    timeOfExpiry: __profile.features.demandExpiry.enabled ? (__profile.features.demandExpiry.value + System.now()) : 0
                });

                //? if(FEATURES.INTERNAL_RENDER) {
                curReturnParcel.targeting.pubKitAdId = pubKitAdId;
                //? }

            } else {
                curReturnParcel.pass = true;
            }
        }

        /* any requests that didn't get a response above are passes */
        if (__profile.enabledAnalytics.requestTime) {
            __baseClass._emitStatsEvent(sessionId, 'hs_slot_pass', outstandingXSlotNames);
        }
    }

    /**
     * Generate an ad response callback that stores ad responses under
     * callbackId and then deletes itself.
     *
     * @param {any} callbackId
     * @returns {fun}
     */
    function __generateAdResponseCallback(callbackId) {
        return function (adResponse) {
            __adResponseStore[callbackId] = adResponse;
            delete adResponseCallbacks[callbackId];
        };
    }

    /**
     * Send a demand request to the partner and store the demand back in the returnParcels.
     *
     * @param {any} sessionId
     * @param {any} returnParcels
     */
    function __sendDemandRequest(sessionId, returnParcels) {
        if (returnParcels.length === 0) {
            return Prms.resolve([]);
        }

        var request = __generateRequestObj(returnParcels);
        var iFrame = request.iframe;
        adResponseCallbacks[request.callbackId] = __generateAdResponseCallback(request.callbackId);

        var xSlotNames = {};

        if (__profile.enabledAnalytics.requestTime) {
            for (var i = 0; i < returnParcels.length; i++) {
                var parcel = returnParcels[i];
                var htSlotId = parcel.htSlot.getId();
                var requestId = parcel.requestId;

                if (!xSlotNames.hasOwnProperty(htSlotId)) {
                    xSlotNames[htSlotId] = {};
                }
                if (!xSlotNames[htSlotId].hasOwnProperty(requestId)) {
                    xSlotNames[htSlotId][requestId] = [];
                }

                xSlotNames[htSlotId][requestId].push(parcel.xSlotName);
            }

            __baseClass._emitStatsEvent(sessionId, 'hs_slot_request', xSlotNames);
        }

        return new Prms(function (resolve) {
            EventsService.emit('partner_request_sent', {
                partner: __profile.partnerId,
                //? if (DEBUG) {
                parcels: returnParcels,
                request: request
                    //? }
            });

            Network.jsonp({
                url: request.url,
                timeout: __baseClass._configs.timeout,
                sessionId: sessionId,
                data: request.data,
                globalTimeout: true,
                scope: iFrame.contentWindow,

                //? if (DEBUG) {
                initiatorId: __profile.partnerId,
                //? }

                onSuccess: function (responseText) {
                    if (responseText) {
                        eval.call(null, responseText);
                    }
                    var responseObj = __adResponseStore[request.callbackId];
                    delete __adResponseStore[request.callbackId];

                    var status = 'success';

                    try {
                        __parseResponse(sessionId, responseObj, returnParcels, xSlotNames);
                    } catch (ex) {
                        EventsService.emit('internal_error', __profile.partnerId + ' error parsing demand: ' + ex, ex.stack);
                        status = 'error';
                    }

                    EventsService.emit('partner_request_complete', {
                        partner: __profile.partnerId,
                        sessionId: sessionId,
                        status: status,
                        //? if (DEBUG) {
                        parcels: returnParcels,
                        request: request
                            //? }
                    });
                    resolve(returnParcels);
                },

                onTimeout: function () {
                    EventsService.emit('partner_request_complete', {
                        partner: __profile.partnerId,
                        sessionId: sessionId,
                        status: 'timeout',
                        //? if (DEBUG) {
                        parcels: returnParcels,
                        request: request
                            //? }
                    });

                    __baseClass._emitStatsEvent(sessionId, 'hs_slot_timeout', xSlotNames);

                    resolve(returnParcels);
                },

                onFailure: function () {
                    EventsService.emit('partner_request_complete', {
                        partner: __profile.partnerId,
                        sessionId: sessionId,
                        status: 'error',
                        //? if (DEBUG) {
                        parcels: returnParcels,
                        request: request
                            //? }
                    });

                    __baseClass._emitStatsEvent(sessionId, 'hs_slot_error', xSlotNames);

                    resolve(returnParcels);
                }
            });
        });
    }

    /* send requests for all slots in inParcels */
    function __retriever(sessionId, inParcels) {
        var returnParcelSets = __baseClass._generateReturnParcels(inParcels);
        var demandRequestPromises = [];

        for (var i = 0; i < returnParcelSets.length; i++) {
            demandRequestPromises.push(__sendDemandRequest(sessionId, returnParcelSets[i]));
        }

        return demandRequestPromises;
    }

    /* =====================================
     * Constructors
     * ---------------------------------- */

    (function __constructor() {
      ComplianceService = SpaceCamp.services.ComplianceService;
        EventsService = SpaceCamp.services.EventsService;
        RenderService = SpaceCamp.services.RenderService;

        __profile = {
            partnerId: 'SonobiHtb',
            namespace: 'SonobiHtb',
            statsId: 'SBI',
            version: '2.1.1',
            targetingType: 'slot',
            enabledAnalytics: {
                requestTime: true
            },
            features: {
                demandExpiry: {
                    enabled: false,
                    value: 0
                },
                rateLimiting: {
                    enabled: false,
                    value: 0
                },
                prefetchDisabled: {
                    enabled: true
                }
            },
            targetingKeys: {
                id: 'ix_sbi_id',
                om: 'ix_sbi_om'
            },
            bidUnitInCents: 100,
            lineItemType: Constants.LineItemTypes.ID_AND_SIZE,
            callbackType: Partner.CallbackTypes.CALLBACK_NAME,
            architecture: Partner.Architectures.SRA,
            requestType: Partner.RequestTypes.JSONP
        };

        //? if (DEBUG) {
        var results = ConfigValidators.partnerBaseConfig(configs) || PartnerSpecificValidator(configs);

        if (results) {
            throw Whoopsie('INVALID_CONFIG', results);
        }
        //? }

        __baseUrl = Browser.getProtocol() + '//apex.go.sonobi.com/trinity.js';

        __baseClass = Partner(__profile, configs, null, {
            retriever: __retriever
        });

        /* adstorage vars */
        adResponseCallbacks = {};
        __adResponseStore = {};

        __baseClass._setDirectInterface({
            adResponseCallbacks: adResponseCallbacks
        });
    })();

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    var derivedClass = {
        /* Class Information
         * ---------------------------------- */

        //? if (DEBUG) {
        __type__: 'SonobiHtb',
        //? }

        //? if (TEST) {
        __baseClass: __baseClass,
        //? }

        /* Data
         * ---------------------------------- */

        //? if (TEST) {
        __profile: __profile,
        __baseUrl: __baseUrl,
        //? }

        /* Functions
         * ---------------------------------- */

        //? if (TEST) {
        __parseResponse: __parseResponse
            //? }
    };

    return Classify.derive(__baseClass, derivedClass);
}

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = SonobiHtb;
