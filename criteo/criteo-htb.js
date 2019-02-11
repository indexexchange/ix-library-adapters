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
var Prms = require('prms.js');
var Partner = require('partner.js');
var Size = require('size.js');
var SpaceCamp = require('space-camp.js');
var System = require('system.js');
var Utilities = require('utilities.js');
var Whoopsie = require('whoopsie.js');
var EventsService;
var RenderService;

//? if (DEBUG) {
var ConfigValidators = require('config-validators.js');
var PartnerSpecificValidator = require('criteo-htb-validator.js');
var Scribe = require('scribe.js');
//? }

////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * CriteoModule Class for the creation of the Header Tag Bidder
 *
 * @class
 */
function CriteoHtb(configs) {
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
     * Tracking request timeout objects
     *
     * @private {object}
     */
    var __requestTimeouts;

    /**
     * Unique identifier provided by Criteo.
     *
     * @private {number}
     */
    var __profileId;

    /* =====================================
     * Functions
     * ---------------------------------- */

    /* Utilities
     * ---------------------------------- */

    /**
     * Generates the list of bidding objects the Criteo library expects.
     *
     * @param  {object[]} returnParcels [list of return parcels]
     * @return {array}            [list of Criteo bidding objects]
     */
    function __generateCriteoSlots(returnParcels) {
        var criteoSlots = [];

        for (var i = 0; i < returnParcels.length; i++) {

            var zoneId = returnParcels[i].xSlotRef.zoneId;

            if (!Utilities.isNumeric(zoneId)) {
                continue;
            }

            criteoSlots.push(new window.Criteo.PubTag.DirectBidding.DirectBiddingSlot(returnParcels[i].htSlot.getName(), Number(zoneId)));
        }
        return criteoSlots;
    }

    function __parseResponse(sessionId, bidResponse, returnParcels, outstandingXSlotNames) {
        var unusedReturnParcels = returnParcels.slice();

        if (bidResponse.slots && Utilities.isArray(bidResponse.slots)) {
            for (var i = 0; i < bidResponse.slots.length; i++) {
                var bid = bidResponse.slots[i];

                /* Match parcel using xSlotName (impid) */
                var curReturnParcel;
                for (var k = unusedReturnParcels.length - 1; k >= 0; k--) {
                    if (unusedReturnParcels[k].htSlot.getName() === bid.impid && unusedReturnParcels[k].xSlotRef.zoneId === String(bid.zoneid)) {
                        curReturnParcel = unusedReturnParcels[k];
                        unusedReturnParcels.splice(k, 1);
                        break;
                    }
                }

                /* No matching parcel found for current bid */
                if (!curReturnParcel) {
                    continue;
                }

                /* Analytics event for bid received */
                if (__profile.enabledAnalytics.requestTime) {
                    var curHtSlotId = curReturnParcel.htSlot.getId();

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

                /* Check price */
                var bidCpm = Number(bid.cpm);
                if (!Utilities.isNumber(bidCpm) || bidCpm <= 0) {
                    curReturnParcel.pass = true;
                    continue;
                }

                /* Check other required parameters in bid response */
                if (!bid.hasOwnProperty('creative') || !bid.hasOwnProperty('width') || !bid.hasOwnProperty('height')) {
                    continue;
                }

                /* Grab size from bid */
                curReturnParcel.size = [bid.width, bid.height];
                curReturnParcel.targetingType = 'slot';
                curReturnParcel.targeting = {};

                var targetingCpm = '';

                //? if(FEATURES.GPT_LINE_ITEMS) {
                var sizeKey = Size.arrayToString(curReturnParcel.size);
                targetingCpm = __baseClass._bidTransformers.targeting.apply(bidCpm);

                curReturnParcel.targeting[__baseClass._configs.targetingKeys.om] = [sizeKey + '_' + targetingCpm];
                curReturnParcel.targeting[__baseClass._configs.targetingKeys.id] = [curReturnParcel.requestId];
                //? }

                //? if(FEATURES.RETURN_CREATIVE) {
                curReturnParcel.adm = bid.creative;
                //? }

                //? if(FEATURES.RETURN_PRICE) {
                curReturnParcel.price = Number(__baseClass._bidTransformers.price.apply(bidCpm));
                //? }

                var pubKitAdId = RenderService.registerAd({
                    sessionId: sessionId,
                    partnerId: __profile.partnerId,
                    adm: bid.creative,
                    requestId: curReturnParcel.requestId,
                    size: curReturnParcel.size,
                    price: targetingCpm,
                    timeOfExpiry: __profile.features.demandExpiry.enabled ? (__profile.features.demandExpiry.value + System.now()) : 0
                });

                //? if(FEATURES.INTERNAL_RENDER) {
                curReturnParcel.targeting.pubKitAdId = pubKitAdId;
                //? }
            }
        }

        /* any requests that didn't get a response above are passes */
        if (__profile.enabledAnalytics.requestTime) {
            __baseClass._emitStatsEvent(sessionId, 'hs_slot_pass', outstandingXSlotNames);
        }

        /* Mark all unused parcels as pass */
        for (var j = 0; j < unusedReturnParcels.length; j++) {
            unusedReturnParcels[j].pass = true;
        }
    }

    function __demandSuccess(sessionId, critRequestId, returnParcels, xSlotNames, criteoSlots, defer, returnedDemand) {
        var requestStatus = 'success';
        if (!__requestTimeouts.hasOwnProperty(critRequestId)) {
            defer.resolve(returnParcels);
            return;
        }
        clearTimeout(__requestTimeouts[critRequestId]);
        delete __requestTimeouts[critRequestId];

        try {
            var responseObj = JSON.parse(returnedDemand);
            __parseResponse(sessionId, responseObj, returnParcels, xSlotNames);
        } catch (ex) {
            EventsService.emit('internal_error', __profile.partnerId + ' error parsing demand: ' + ex, ex.stack);
            requestStatus = 'error';
        }

        EventsService.emit('partner_request_complete', {
            partner: __profile.partnerId,
            status: requestStatus,
            //? if (DEBUG) {
            parcels: returnParcels,
            request: criteoSlots
                //? }
        });

        defer.resolve(returnParcels);
    }

    function __demandTimeout(sessionId, critRequestId, returnParcels, xSlotNames, criteoSlots, defer) {
        if (!__requestTimeouts.hasOwnProperty(critRequestId)) {
            defer.resolve(returnParcels);
            return;
        }
        clearTimeout(__requestTimeouts[critRequestId]);
        delete __requestTimeouts[critRequestId];

        EventsService.emit('partner_request_complete', {
            partner: __profile.partnerId,
            status: 'timeout',
            //? if (DEBUG) {
            parcels: returnParcels,
            request: criteoSlots
                //? }
        });

        if (__profile.enabledAnalytics.requestTime) {
            __baseClass._emitStatsEvent(sessionId, 'hs_slot_timeout', xSlotNames);
        }

        defer.resolve(returnParcels);
    }

    function __demandError(sessionId, critRequestId, returnParcels, xSlotNames, criteoSlots, defer, readyState, statusCode) {
        var requestStatus = 'error';

        /* statusCode 204 is considered a pass */
        if (statusCode === 204) {
            requestStatus = 'success';

            /* Mark all parcels as pass */
            for (var k = 0; k < returnParcels.length; k++) {
                returnParcels[k].pass = true;
            }
        }

        //? if (DEBUG) {
        if (requestStatus === 'error') {
            Scribe.warn('Criteo bidder error, returned status ' + statusCode);
        }
        //? }

        if (!__requestTimeouts.hasOwnProperty(critRequestId)) {
            defer.resolve(returnParcels);
            return;
        }
        clearTimeout(__requestTimeouts[critRequestId]);
        delete __requestTimeouts[critRequestId];

        EventsService.emit('partner_request_complete', {
            partner: __profile.partnerId,
            status: requestStatus,
            //? if (DEBUG) {
            parcels: returnParcels,
            request: criteoSlots
                //? }
        });

        if (__profile.enabledAnalytics.requestTime) {
            __baseClass._emitStatsEvent(sessionId, requestStatus === 'error' ? 'hs_slot_error' : 'hs_slot_pass', xSlotNames);
        }

        defer.resolve(returnParcels);
    }

    function __sendDemandRequest(sessionId, returnParcels) {
        if (returnParcels.length === 0) {
            return Prms.resolve([]);
        }

        /* create a new defer promise */
        var defer = Prms.defer();

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
        }

        window.Criteo.events.push(function () {
            if (__profile.enabledAnalytics.requestTime) {
                __baseClass._emitStatsEvent(sessionId, 'hs_slot_request', xSlotNames);
            }

            var critRequestId = '_' + System.generateUniqueId();

            /* This uses the criteo API, so must be called in criteo's queue (to ensure the lib is there) */
            var criteoSlots = __generateCriteoSlots(returnParcels);

            if (criteoSlots.length === 0) {
                return Prms.resolve([]);
            }

            /* Criteo bidder callbacks */
            var demandSuccess = __demandSuccess.bind(null, sessionId, critRequestId, returnParcels, xSlotNames, criteoSlots, defer);
            var demandTimeout = __demandTimeout.bind(null, sessionId, critRequestId, returnParcels, xSlotNames, criteoSlots, defer);
            var demandError = __demandError.bind(null, sessionId, critRequestId, returnParcels, xSlotNames, criteoSlots, defer);

            var criteoBidUrl = new window.Criteo.PubTag.DirectBidding.DirectBiddingUrlBuilder(false);
            var biddingEvent = new window.Criteo.PubTag.DirectBidding.DirectBiddingEvent(
                __profileId,
                criteoBidUrl,
                criteoSlots,
                demandSuccess,
                demandError,
                demandTimeout);

            /* __requestTimeouts is also used as a flag to check if the callbacks have been called, so it has
               to be set or the callbacks will refuse to fire */
            __requestTimeouts[critRequestId] = configs.timeout ? setTimeout(demandTimeout, configs.timeout) : null;
            SpaceCamp.services.TimerService.addTimerCallback(sessionId, demandTimeout);

            window.criteo_pubtag.push(biddingEvent); // jshint ignore:line
        });

        return defer.promise;
    }

    /* -------------------------------------------------------------------------- */
    /* Entry Point
     * ---------------------------------- */

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
        EventsService = SpaceCamp.services.EventsService;
        RenderService = SpaceCamp.services.RenderService;

        __profile = {
            partnerId: 'CriteoHtb',
            namespace: 'CriteoHtb',
            statsId: 'CRTB',
            version: '2.1.0',
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
                id: 'ix_cdb_id',
                om: 'ix_cdb_om'
            },
            bidUnitInCents: 100,
            lineItemType: Constants.LineItemTypes.ID_AND_SIZE,
            callbackType: Partner.CallbackTypes.ID,
            architecture: Partner.Architectures.SRA,
            requestType: Partner.RequestTypes.ANY
        };

        //? if (DEBUG) {
        var results = ConfigValidators.partnerBaseConfig(configs) || PartnerSpecificValidator(configs);

        if (results) {
            throw Whoopsie('INVALID_CONFIG', results);
        }
        //? }

        __requestTimeouts = {};

        /* Constants */
        __profileId = 154;

        /* Setup Criteo library */
        window.Criteo = window.Criteo || {};
        window.Criteo.events = window.Criteo.events || [];
        var criteoLibrary = Browser.getProtocol() + '//static.criteo.net/js/ld/publishertag.js';

        __baseClass = Partner(__profile, configs, [criteoLibrary], {
            retriever: __retriever
        });
    })();

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    var derivedClass = {
        /* Class Information
         * ---------------------------------- */

        //? if (DEBUG) {
        __type__: 'CriteoModule',
        //? }

        //? if (TEST) {
        __baseClass: __baseClass,
        //? }

        /* Data
         * ---------------------------------- */

        //? if (TEST) {
        __profile: __profile,
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

module.exports = CriteoHtb;
