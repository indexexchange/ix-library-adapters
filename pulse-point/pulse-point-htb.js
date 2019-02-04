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
var Network = require('network.js');
var Partner = require('partner.js');
var Size = require('size.js');
var SpaceCamp = require('space-camp.js');
var System = require('system.js');
var Whoopsie = require('whoopsie.js');
var EventsService;
var RenderService;

//? if (DEBUG) {
var ConfigValidators = require('config-validators.js');
var PartnerSpecificValidator = require('pulse-point-htb-validator.js');
var Scribe = require('scribe.js');
//? }

////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * PulsePointHtb Class for the creation of the Header Tag Bidder
 *
 * @class
 */
function PulsePointHtb(configs) {

    /* pulsePoint endpoint only works with AJAX */
    if (!Network.isXhrSupported()) {
        //? if (DEBUG) {
        Scribe.warn('Partner PulsePointHtb requires AJAX support. Aborting instantiation.');
        //? }

        return null;
    }

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
     * Base URL for the bidding end-point.
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
     * @param  {object[]} returnParcels [description]
     * @return {string}            [description]
     */
    function __generateRequestObj(returnParcels) {
        /* pulsePoint is MRA, thus parcel only contains one slot */
        var xSlot = returnParcels[0].xSlotRef;

        var queryObj = {
            imp: [],
            site: {
                publisher: {
                    id: Number(configs.publisherId)
                },
                ref: Browser.getReferrer(),
                page: Browser.getPageUrl()
            },
            device: {
                ua: Browser.getUserAgent(),
                language: Browser.getLanguage()
            }
        };

        /* Generate the imp object for each size */
        for (var i = 0; i < xSlot.sizes.length; i++) {
            var size = xSlot.sizes[i];

            queryObj.imp.push({
                banner: {
                    w: size[0],
                    h: size[1],
                    id: Number(xSlot.tagId)
                }
            });
        }

        return {
            url: __baseUrl,
            data: queryObj,
            networkParamOverrides: {
                method: 'POST',
                contentType: 'text/plain'
            }
        };
    }

    /* -------------------------------------------------------------------------- */

    /* Helpers
     * ---------------------------------- */

    /* parses adResponse and ads any demand into outParcels */
    function __parseResponse(sessionId, bidResponse, returnParcels) {
        /* MRA, so there will always only be one slot involved */
        var htSlotId = returnParcels[0].htSlot.getId();
        var xSlotName = returnParcels[0].xSlotName;
        var curReturnParcel = returnParcels[0];

        /* Check for missing seat bid (bidder error) */
        if (!bidResponse.seatbid) {
            //? if (DEBUG) {
            Scribe.warn('Bidder response object missing "seatbid" object property.');
            //? }

            EventsService.emit('hs_slot_error', {
                sessionId: sessionId,
                statsId: __profile.statsId,
                htSlotId: htSlotId,
                requestId: curReturnParcel.requestId,
                xSlotNames: [xSlotName]
            });

            return;
        }

        /* Check for zero length seat bid (bidder pass) */
        if (!bidResponse.seatbid.length) {
            EventsService.emit('hs_slot_pass', {
                sessionId: sessionId,
                statsId: __profile.statsId,
                htSlotId: htSlotId,
                requestId: curReturnParcel.requestId,
                xSlotNames: [xSlotName]
            });

            curReturnParcel.pass = true;

            return;
        }

        /* Check for missing bid (bidder error) */
        if (!bidResponse.seatbid[0].bid) {
            //? if (DEBUG) {
            Scribe.warn('Seatbid object missing "bid" object property.');
            //? }

            EventsService.emit('hs_slot_error', {
                sessionId: sessionId,
                statsId: __profile.statsId,
                htSlotId: htSlotId,
                requestId: curReturnParcel.requestId,
                xSlotNames: [xSlotName]
            });

            return;
        }

        /* Check for zero length bid (bidder pass) */
        if (!bidResponse.seatbid[0].bid.length || Number(bidResponse.seatbid[0].bid[0].price) <= 0) {
            EventsService.emit('hs_slot_pass', {
                sessionId: sessionId,
                statsId: __profile.statsId,
                htSlotId: htSlotId,
                requestId: curReturnParcel.requestId,
                xSlotNames: [xSlotName]
            });

            curReturnParcel.pass = true;

            return;
        }

        var bid = bidResponse.seatbid[0].bid[0];

        /* Check for required bid object parameters */
        if (!bid.hasOwnProperty('price') || !bid.hasOwnProperty('w') || !bid.hasOwnProperty('h') || !bid.hasOwnProperty('adm')) {
            //? if (DEBUG) {
            Scribe.warn('Bid object missing required properties.');
            //? }

            EventsService.emit('hs_slot_error', {
                sessionId: sessionId,
                statsId: __profile.statsId,
                htSlotId: htSlotId,
                requestId: curReturnParcel.requestId,
                xSlotNames: [xSlotName]
            });

            return;
        }

        /* Analytics event for bid received */
        if (__profile.enabledAnalytics.requestTime) {
            EventsService.emit('hs_slot_bid', {
                sessionId: sessionId,
                statsId: __profile.statsId,
                htSlotId: htSlotId,
                requestId: curReturnParcel.requestId,
                xSlotNames: [xSlotName]
            });
        }

        var bidPrice = bid.price;
        var bidCreative = bid.adm;
        var bidSize = [bid.w, bid.h];

        curReturnParcel.targetingType = 'slot';
        curReturnParcel.size = bidSize;
        curReturnParcel.targeting = {};
        var targetingCpm = '';

        //? if(FEATURES.GPT_LINE_ITEMS) {
        var sizeKey = Size.arrayToString(bidSize);
        targetingCpm = __baseClass._bidTransformers.targeting.apply(bidPrice);

        curReturnParcel.targeting[__baseClass._configs.targetingKeys.om] = [sizeKey + '_' + targetingCpm];
        curReturnParcel.targeting[__baseClass._configs.targetingKeys.id] = [curReturnParcel.requestId];
        //? }

        //? if(FEATURES.RETURN_CREATIVE) {
        curReturnParcel.adm = bidCreative;
        //? }

        //? if(FEATURES.RETURN_PRICE) {
        /* Universal and PostBid both need to return the price */
        curReturnParcel.price = Number(__baseClass._bidTransformers.price.apply(bidPrice));
        //? }

        var pubKitAdId = RenderService.registerAd({
            sessionId: sessionId,
            partnerId: __profile.partnerId,
            adm: bidCreative,
            requestId: curReturnParcel.requestId,
            size: bidSize,
            price: targetingCpm,
            timeOfExpiry: __profile.features.demandExpiry.enabled ? (__profile.features.demandExpiry.value + System.now()) : 0
        });

        //? if(FEATURES.INTERNAL_RENDER) {
        curReturnParcel.targeting.pubKitAdId = pubKitAdId;
        //? }
    }

    /* =====================================
     * Constructors
     * ---------------------------------- */

    (function __constructor() {
        EventsService = SpaceCamp.services.EventsService;
        RenderService = SpaceCamp.services.RenderService;

        __profile = {
            partnerId: 'PulsePointHtb',
            namespace: 'PulsePointHtb',
            statsId: 'PP',
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
                id: 'ix_pp_id',
                om: 'ix_pp_om'
            },
            bidUnitInCents: 100,
            lineItemType: Constants.LineItemTypes.ID_AND_SIZE,
            callbackType: Partner.CallbackTypes.NONE,
            architecture: Partner.Architectures.MRA,
            requestType: Partner.RequestTypes.AJAX
        };

        //? if (DEBUG) {
        var results = ConfigValidators.partnerBaseConfig(configs) || PartnerSpecificValidator(configs);

        if (results) {
            throw Whoopsie('INVALID_CONFIG', results);
        }
        //? }

        __baseUrl = Browser.getProtocol() + '//bid.contextweb.com/header/ortb';

        __baseClass = Partner(__profile, configs, null, {
            parseResponse: __parseResponse,
            generateRequestObj: __generateRequestObj
        });
    })();

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    var derivedClass = {
        /* Class Information
         * ---------------------------------- */

        //? if (DEBUG) {
        __type__: 'PulsePointHtb',
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
        __render: __render,
        __parseResponse: __parseResponse
        //? }
    };

    return Classify.derive(__baseClass, derivedClass);
}

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = PulsePointHtb;
