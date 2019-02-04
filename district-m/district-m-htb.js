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
var Inspector = require('schema-inspector.js');
var DistrictMValidator = require('district-m-htb-validator.js');
var Scribe = require('scribe.js');
//? }

////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * DistrictMHtb Class for the creation of the Header Tag Bidder
 *
 * @class
 */
function DistrictMHtb(configs) {
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

    var __parseFuncPath;

    /* =====================================
     * Functions
     * ---------------------------------- */

    /* Utilities
     * ---------------------------------- */

    /**
     * Generates the request URL to the endpoint for the xSlots in the given
     * returnParcels.
     *
     * @param  {Object[]} returnParcels Array of parcels.
     * @return {Object}                 Request object.
     */
    function __generateRequestObj(returnParcels) {
        //? if (DEBUG){
        var results = Inspector.validate({
            type: 'array',
            exactLength: 1,
            items: {
                type: 'object',
                properties: {
                    htSlot: {
                        type: 'object'
                    },
                    xSlotRef: {
                        type: 'object'
                    },
                    xSlotName: {
                        type: 'string',
                        minLength: 1
                    }
                }
            }
        }, returnParcels);
        if (!results.valid) {
            throw Whoopsie('INVALID_ARGUMENT', results.format());
        }
        //? }

        /* MRA partners receive only one parcel in the array. */
        var returnParcel = returnParcels[0];
        var callbackId = System.generateUniqueId();
        var queryObj = {
            id: returnParcel.xSlotRef.placementId,
            size: Size.arrayToString([returnParcel.xSlotRef.sizes[0]]),
            callback: __parseFuncPath,
            callback_uid: callbackId, //jshint ignore:line
            psa: 0
        };
        /* Endpoint expects first size to be assigned to the "size" parameter,
         * while the rest are added to "promo_sizes".
         */
        if (returnParcel.xSlotRef.sizes.length > 1) {
            queryObj.promo_sizes = Size.arrayToString(returnParcel.xSlotRef.sizes.slice(1)); //jshint ignore:line
        }

        var referrer = Browser.getPageUrl();
        if (referrer) {
            queryObj.referrer = referrer;
        }

        return {
            url: __baseUrl,
            data: queryObj,
            callbackId: callbackId
        };
    }

    function adResponseCallback(adResponseData) {
        __baseClass._adResponseStore[adResponseData.callback_uid] = adResponseData; //jshint ignore:line
    }
    /* -------------------------------------------------------------------------- */

    /* Helpers
     * ---------------------------------- */

    /**
     * This function will render the ad given.
     * @param  {Object} doc The document of the iframe where the ad will go.
     * @param  {string} adm The ad code that came with the original demand.
     */
    function __render(doc, adm) {
        System.documentWrite(doc, adm);
    }

    /* Parse adResponse, put demand into outParcels.
     * AppNexus response contains a single result object.
     */
    function __parseResponse(sessionId, adResponse, returnParcels) {
        //? if (DEBUG){
        var results = Inspector.validate({
            type: 'array',
            exactLength: 1,
            items: {
                type: 'object',
                properties: {
                    htSlot: {
                        type: 'object'
                    },
                    xSlotRef: {
                        type: 'object'
                    },
                    xSlotName: {
                        type: 'string',
                        minLength: 1
                    }
                }
            }
        }, returnParcels);
        if (!results.valid) {
            throw Whoopsie('INVALID_ARGUMENT', results.format());
        }
        //? }

        var bidReceived = false;

        var returnParcel = returnParcels[0];

        /* prepare the info to send to header stats */
        var headerStatsInfo = {
            sessionId: sessionId,
            statsId: __profile.statsId,
            htSlotId: returnParcel.htSlot.getId(),
            requestId: returnParcel.requestId,
            xSlotNames: [returnParcel.xSlotName]
        };

        var adResult;
        if (adResponse && adResponse.hasOwnProperty('result')) {
            adResult = adResponse.result;
        }

        var targetingCpm = '';

        if (adResult && adResult.hasOwnProperty('ad') && !Utilities.isEmpty(adResult.ad)) {
            if ((adResult.hasOwnProperty('cpm') && adResult.cpm > 0) || adResult.deal_id) { //jshint ignore:line
                bidReceived = true;
                var bidPrice = adResult.cpm;
                var bidSize = [Number(adResult.width), Number(adResult.height)];
                var bidDealId = adResult.deal_id || ''; //jshint ignore:line
                var bidCreative = '<iframe src="' + adResult.ad +
                    '" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" topmargin="0" leftmargin="0" allowtransparency="true"' +
                    ' width="' + adResult.width + '" height="' + adResult.height + '"></iframe>';

                if (bidPrice !== undefined) {
                    // DistrictM specific config; publisher share
                    if (configs.share) {
                        bidPrice *= configs.share;
                    }

                    //? if(FEATURES.GPT_LINE_ITEMS) {
                    targetingCpm = __baseClass._bidTransformers.targeting.apply(bidPrice);
                    //? }
                }

                returnParcel.size = bidSize;
                returnParcel.targetingType = 'slot';
                returnParcel.targeting = {};

                //? if(FEATURES.GPT_LINE_ITEMS) {
                var sizeKey = Size.arrayToString(bidSize);
                if (bidDealId) {
                    returnParcel.targeting[__baseClass._configs.targetingKeys.pm] = [sizeKey + '_' + bidDealId]; //jshint ignore:line
                }

                if (targetingCpm !== undefined && targetingCpm !== '') {
                    returnParcel.targeting[__baseClass._configs.targetingKeys.om] = [sizeKey + '_' + targetingCpm];
                }

                returnParcel.targeting[__baseClass._configs.targetingKeys.id] = [returnParcel.requestId];
                //? }

                //? if(FEATURES.RETURN_CREATIVE) {
                returnParcel.adm = bidCreative;
                //? }

                //? if(FEATURES.RETURN_PRICE) {
                returnParcel.price = Number(__baseClass._bidTransformers.price.apply(bidPrice));
                //? }

                var pubKitAdId = SpaceCamp.services.RenderService.registerAd({
                    sessionId: sessionId,
                    partnerId: __profile.partnerId,
                    adm: bidCreative,
                    requestId: returnParcel.requestId,
                    size: returnParcel.size,
                    price: targetingCpm,
                    dealId: bidDealId,
                    timeOfExpiry: __profile.features.demandExpiry.enabled ? (__profile.features.demandExpiry.value + System.now()) : 0
                });

                //? if(FEATURES.INTERNAL_RENDER) {
                returnParcel.targeting.pubKitAdId = pubKitAdId;
                //? }
            }
        }

        if (!bidReceived) {
            //? if (DEBUG) {
            Scribe.info(__profile.partnerId + ' returned no demand for placement: ' + returnParcel.xSlotRef.placementId);
            //? }
            returnParcel.pass = true;
        }

        if (__profile.enabledAnalytics.requestTime) {
            var result = 'hs_slot_pass';
            if (bidReceived) {
                result = 'hs_slot_bid';
            }
            EventsService.emit(result, headerStatsInfo);
        }
    }

    /* =====================================
     * Constructors
     * ---------------------------------- */

    (function __constructor() {
        EventsService = SpaceCamp.services.EventsService;
        RenderService = SpaceCamp.services.RenderService;

        __profile = {
            partnerId: 'DistrictMHtb',
            namespace: 'DistrictMHtb',
            statsId: 'DISM',
            version: '2.2.0',
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
                id: 'ix_dism_id',
                om: 'ix_dism_om',
                pm: 'ix_dism_pm'
            },
            bidUnitInCents: 0.01,
            lineItemType: Constants.LineItemTypes.ID_AND_SIZE,
            callbackType: Partner.CallbackTypes.ID,
            architecture: Partner.Architectures.MRA,
            requestType: Partner.RequestTypes.ANY
        };

        //? if (DEBUG) {
        var PartnerSpecificValidator = DistrictMValidator;

        var results = ConfigValidators.partnerBaseConfig(configs) || PartnerSpecificValidator(configs);

        if (results) {
            throw Whoopsie('INVALID_CONFIG', results);
        }
        //? }

        __baseUrl = Browser.getProtocol() + '//secure.adnxs.com/jpt';
        __parseFuncPath = SpaceCamp.NAMESPACE + '.' + __profile.namespace + '.adResponseCallback';

        __baseClass = Partner(__profile, configs, null, {
            parseResponse: __parseResponse,
            generateRequestObj: __generateRequestObj,
            adResponseCallback: adResponseCallback
        });

        /* If wrapper is already active, we might be instantiated late so need to add our callback
           since the shell potentially missed its chance */
        if (window[SpaceCamp.NAMESPACE]) {
            window[SpaceCamp.NAMESPACE][__profile.namespace] = window[SpaceCamp.NAMESPACE][__profile.namespace] || {};
            window[SpaceCamp.NAMESPACE][__profile.namespace].adResponseCallback = adResponseCallback;
        }
    })();

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    var derivedClass = {
        /* Class Information
         * ---------------------------------- */

        //? if (DEBUG) {
        __type__: 'DistrictMHtbHtb',
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
        __parseResponse: __parseResponse,

        adResponseCallback: adResponseCallback,
        //? }
    };

    return Classify.derive(__baseClass, derivedClass);
}

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = DistrictMHtb;
