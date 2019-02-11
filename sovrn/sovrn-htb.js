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
var Constants = require('constants.js');
var OpenRtb = require('openrtb.js');
var Partner = require('partner.js');
var Size = require('size.js');
var SpaceCamp = require('space-camp.js');
var System = require('system.js');
var Network = require('network.js');
var Utilities = require('utilities.js');
var EventsService;
var RenderService;
var ComplianceService;

//? if (DEBUG) {
var ConfigValidators = require('config-validators.js');
var PartnerSpecificValidator = require('sovrn-htb-validator.js');
var Whoopsie = require('whoopsie.js');
//? }

////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * Sovrn Header Tag Bidder module.
 *
 * @class
 */
function SovrnHtb(configs) {
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
     * @private {object}
     */
    var __profile;

    /**
     * Base url for bid requests.
     *
     * @private {object}
     */
    var __baseUrl;

    /* =====================================
     * Functions
     * ---------------------------------- */

    /* Utilities
     * ---------------------------------- */

    /**
     * Generates the request URL to the endpoint for the xSlots in the given
     * returnParcels.
     *
     * @param  {object[]} returnParcels
     * @return {string}
     */
    function __generateRequestObj(returnParcels) {
        /* generate a unique request identifier for storing request-specific information */
        var requestId = '_' + System.generateUniqueId();

        /* build imps */
        var imps = [];
        for (var i = 0; i < returnParcels.length; i++) {

            /* If htSlot does not have an ixSlot mapping no impressions needed */
            if (!returnParcels[i].hasOwnProperty('xSlotRef')) {
                continue;
            }
            var curParcel = returnParcels[i];
            var xSlot = curParcel.xSlotRef;
            curParcel.size = xSlot.size;
            var impid = System.generateUniqueId();

            imps.push({
                id: impid,
                banner: {
                    w: xSlot.size[0],
                    h: xSlot.size[1]
                },
                tagid: xSlot.tagId
            });
            curParcel.impid = impid;
        }

        /* build request params */
        var br = {
            id: requestId,
            site: {
                domain: Browser.getHostname(),
                page: Browser.getPathname()
            },
            imp: imps
        };

        if(ComplianceService.isPrivacyEnabled()) {
            var gdprStatus = ComplianceService.gdpr.getConsent();
            if(gdprStatus.applies !== null) {
                br.regs = {
                    ext: {
                        gdpr: gdprStatus.applies ? 1 : 0
                    }
                }
            }

            if(gdprStatus.consentString !== null && gdprStatus.consentString !== "") {
                br.user = {
                    ext: {
                        consent: gdprStatus.consentString
                    }
                }
            }
        }

        return {
            callbackId: requestId,
            networkParamOverrides: {
                url: __baseUrl,
                contentType: false,
                data: {
                    callback: 'window.' + SpaceCamp.NAMESPACE + '.' + __profile.namespace + '.adResponseCallback',
                    br: JSON.stringify(br)
                }
            }
        };
    }

    /**
     * Callback for sovrn ad responses that stores the response under the id provided
     * in the response object.
     *
     * @param {object} adResponse
     */
    function adResponseCallback(adResponse) {
        try {
            var ortbResponse = OpenRtb.BidResponse(adResponse);
            __baseClass._adResponseStore[ortbResponse.getId()] = ortbResponse;
        } catch (ex) {
            EventsService.emit('internal_error', 'Error occurred while saving response for "' + __profile.partnerId + '".', ex.stack);
        }
    }

    /* Helpers
     * ---------------------------------- */

    /**
     * This function will render the pixel given.
     * @param  {string} nurl Tracking pixel img url.
     */
    function __renderPixel(nurl) {
        if (nurl) {
            Network.img({
                url: decodeURIComponent(nurl),
                method: 'GET',
            });
        }
    }

    /* Parse adResponse, put demand into outParcels.
     */
    function __parseResponse(sessionId, ortbResponse, returnParcels, outstandingXSlotNames) {
        var bids = ortbResponse.getBids();

        var unusedReturnParcels = returnParcels.slice();

        for (var i = 0; i < bids.length; i++) {
            var curReturnParcel;
            var bid = bids[i];

            for (var j = unusedReturnParcels.length - 1; j >= 0; j--) {
                if (unusedReturnParcels[j].impid === bid.impid) {
                    curReturnParcel = unusedReturnParcels[j];
                    unusedReturnParcels.splice(j, 1);
                    break;
                }
            }

            if (!curReturnParcel) {
                continue;
            }

            if (!bid.hasOwnProperty('price') || bid.price <= 0) {
                curReturnParcel.pass = true;
                continue;
            }

            var bidPriceLevel = bid.price;
            var curHtSlotId = curReturnParcel.htSlot.getId();

            if (__profile.enabledAnalytics.requestTime) {
                EventsService.emit('hs_slot_bid', {
                    sessionId: sessionId,
                    statsId: __profile.statsId,
                    htSlotId: curHtSlotId,
                    requestId: curReturnParcel.requestId,
                    xSlotNames: [curReturnParcel.xSlotName]
                });

                if (outstandingXSlotNames[curHtSlotId] && outstandingXSlotNames[curHtSlotId][curReturnParcel.requestId]) {
                    Utilities.arrayDelete(outstandingXSlotNames[curHtSlotId][curReturnParcel.requestId], curReturnParcel.xSlotName);
                }
            }

            var bidCreative = decodeURIComponent(bid.adm);

            curReturnParcel.targetingType = 'slot';
            curReturnParcel.targeting = {};

            var targetingCpm = '';

            //? if(FEATURES.GPT_LINE_ITEMS) {
            targetingCpm = __baseClass._bidTransformers.targeting.apply(bidPriceLevel);
            var sizeKey = Size.arrayToString(curReturnParcel.size);

            curReturnParcel.targeting[__baseClass._configs.targetingKeys.om] = [sizeKey + '_' + targetingCpm];
            curReturnParcel.targeting[__baseClass._configs.targetingKeys.id] = [curReturnParcel.requestId];
            //? }

            ////? if(FEATURES.RETURN_CREATIVE) {
            curReturnParcel.adm = bidCreative;
            if (bid.nurl) {
                curReturnParcel.winNotice = __renderPixel.bind(null, bid.nurl);
            }
            //? }

            //? if(FEATURES.RETURN_PRICE) {
            curReturnParcel.price = Number(__baseClass._bidTransformers.price.apply(bidPriceLevel));
            //? }

            var pubKitAdId = RenderService.registerAd({
                sessionId: sessionId,
                partnerId: __profile.partnerId,
                adm: bidCreative,
                requestId: curReturnParcel.requestId,
                size: curReturnParcel.size,
                price: targetingCpm,
                timeOfExpiry: __profile.features.demandExpiry.enabled ? (__profile.features.demandExpiry.value + System.now()) : 0,
                auxFn: __renderPixel,
                auxArgs: [bid.nurl]
            });

            //? if(FEATURES.INTERNAL_RENDER) {
            curReturnParcel.targeting.pubKitAdId = pubKitAdId;
            //? }
        }

        /* all parcels which didn't get a match are passes */
        for (var k = 0; k < unusedReturnParcels.length; k++) {
            unusedReturnParcels[k].pass = true;
        }

        /* any requests that didn't get a response above are passes */
        if (__profile.enabledAnalytics.requestTime) {
            __baseClass._emitStatsEvent(sessionId, 'hs_slot_pass', outstandingXSlotNames);
        }
    }

    /* =====================================
     * Constructors
     * ---------------------------------- */

    (function __constructor() {
        ComplianceService = SpaceCamp.services.ComplianceService;
        EventsService = SpaceCamp.services.EventsService;
        RenderService = SpaceCamp.services.RenderService;

        __profile = {
            partnerId: 'SovrnHtb',
            namespace: 'SovrnHtb',
            statsId: 'SVRN',
            version: '2.2.1',
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
                }
            },
            targetingKeys: {
                om: 'ix_sovrn_om',
                id: 'ix_sovrn_id'
            },
            bidUnitInCents: 100,
            lineItemType: Constants.LineItemTypes.ID_AND_SIZE,
            callbackType: Partner.CallbackTypes.ID,
            architecture: Partner.Architectures.FSRA,
            requestType: Partner.RequestTypes.ANY
        };

        //? if (DEBUG) {
        var results = ConfigValidators.partnerBaseConfig(configs) || PartnerSpecificValidator(configs);

        if (results) {
            throw Whoopsie('INVALID_CONFIG', results);
        }
        //? }

        /* build base bid request url */
        __baseUrl = Browser.getProtocol() + '//ap.lijit.com/rtb/bid';

        __baseClass = Partner(__profile, configs, null, {
            parseResponse: __parseResponse,
            generateRequestObj: __generateRequestObj,
            adResponseCallback: adResponseCallback
        });

        //? if (DEBUG) {
        /* If wrapper is already active, we might be instantiated late so need to add our callback
           since the shell potentially missed its chance */
        if (window[SpaceCamp.NAMESPACE]) {
            window[SpaceCamp.NAMESPACE][__profile.namespace] = window[SpaceCamp.NAMESPACE][__profile.namespace] || {};
            window[SpaceCamp.NAMESPACE][__profile.namespace].adResponseCallback = adResponseCallback;
        }
        //?}
    })();

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    var derivedClass = {
        /* Class Information
         * ---------------------------------- */

        //? if (DEBUG) {
        __type__: 'SovrnHtb',
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
        __generateRequestObj: __generateRequestObj,
        __parseResponse: __parseResponse,
        adResponseCallback: adResponseCallback
            //? }
    };

    return Classify.derive(__baseClass, derivedClass);
}

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = SovrnHtb;
