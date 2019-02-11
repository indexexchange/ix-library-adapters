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
var Whoopsie = require('whoopsie.js');

var EventsService;
var RenderService;
var ComplianceService;

//? if (DEBUG) {
var ConfigValidators = require('config-validators.js');
var PartnerSpecificValidator = require('aol-htb-validator.js');
var Scribe = require('scribe.js');
//? }

////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * AOL Header Tag Bidder module.
 *
 * @class
 */
function AolHtb(configs) {
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

    function __addGdprParams(params) {
        var consentData = ComplianceService.gdpr.getConsent();

        if (consentData && consentData.applies) {
            params.gdpr = 1;

            if (consentData.consentString) {
                params.euconsent = consentData.consentString;
            }
        }
    }

    /**
     * Generates the request URL to the endpoint for the xSlots in the given
     * returnParcels.
     *
     * @param  {object[]} returnParcels
     * @return {string}
     */
    function __generateRequestObj(returnParcels) {
        /* MRA partners receive only one parcel in the array. */
        var returnParcel = returnParcels[0];
        var xSlot = returnParcel.xSlotRef;

        /* Generate a unique request identifier for storing request-specific information */
        var requestId = '_' + System.generateUniqueId();

        /* `sizeid` & `pageid` */
        var sizeId = xSlot.sizeId || '-1';
        var pageId = xSlot.pageId || '0';

        /* Request params */
        var requestParams = {
            cmd: 'bid',
            cors: 'yes',
            v: '2',
            misc: System.now(),
            callback: 'window.' + SpaceCamp.NAMESPACE + '.' + __profile.namespace + '.adResponseCallbacks.' + requestId
        };

        if (xSlot.bidFloor) {
            requestParams.bidFloor = xSlot.bidFloor;
        }

        if (ComplianceService.isPrivacyEnabled()) {
            __addGdprParams(requestParams);
        }

        var url = Network.buildUrl(__baseUrl, [xSlot.placementId, pageId, sizeId, 'ADTECH;']);

        /* Build url paramters */
        for (var parameter in requestParams) {
            if (!requestParams.hasOwnProperty(parameter)) {
                continue;
            }
            url += parameter + '=' + requestParams[parameter] + ';';
        }

        return {
            url: url,
            callbackId: requestId
        };
    }

    /* Helpers
     * ---------------------------------- */

    /**
     * This function will render the AOL pixel.
     * @param  {string} pixel The tracking pixel url.
     */
    function __renderPixel(pixel) {
        if (pixel) {
            var iframe = Browser.createHiddenIFrame();
            System.documentWrite(iframe.contentDocument, pixel);
        }
    }

    /* Parse adResponse, put demand into outParcels.
     * AOL response contains a single result object.
     */
    function __parseResponse(sessionId, adResponse, returnParcels) {
        /* MRA partners receive only one parcel in the array. */
        var returnParcel = returnParcels[0];

        /* Header stats information */
        var headerStatsInfo = {
            sessionId: sessionId,
            statsId: __profile.statsId,
            htSlotId: returnParcel.htSlot.getId(),
            requestId: returnParcel.requestId,
            xSlotNames: [returnParcel.xSlotName]
        };

        var ortbResponse = OpenRtb.BidResponse(adResponse);

        /* There is only one bid because mra */
        var bid = ortbResponse.getBids()[0];

        if (bid && !bid.hasOwnProperty('nbr')) {
            /* Bid response */
            var bidPrice = bid.price;

            if (Number(bidPrice) === 0) {
                //? if (DEBUG) {
                Scribe.info(__profile.partnerId + ' 0 cpm for { id: ' + returnParcel.xSlotRef.placementId + ' }.');
                //? }

                if (__profile.enabledAnalytics.requestTime) {
                    EventsService.emit('hs_slot_pass', headerStatsInfo);
                }

                returnParcel.pass = true;

                return;
            }

            if (__profile.enabledAnalytics.requestTime) {
                EventsService.emit('hs_slot_bid', headerStatsInfo);
            }

            var bidCreative = bid.adm;
            var bidSize = [Number(bid.w), Number(bid.h)];
            var pixel;
            var bidDealId = bid.hasOwnProperty('dealid') ? bid.dealid : null;

            if (adResponse.hasOwnProperty('ext')) {
                pixel = adResponse.ext.pixels || '';
            }

            returnParcel.targetingType = 'slot';
            returnParcel.targeting = {};
            returnParcel.size = bidSize;

            var targetingCpm = '';

            //? if(FEATURES.GPT_LINE_ITEMS) {
            var sizeKey = Size.arrayToString(bidSize);
            targetingCpm = __baseClass._bidTransformers.targeting.apply(bidPrice);

            /* Deal ID */
            if (bidDealId) {
                returnParcel.targeting[__baseClass._configs.targetingKeys.pm] = [sizeKey + '_' + bidDealId];
            }
            returnParcel.targeting[__baseClass._configs.targetingKeys.om] = [sizeKey + '_' + targetingCpm];
            returnParcel.targeting[__baseClass._configs.targetingKeys.id] = [returnParcel.requestId];
            //? }

            //? if(FEATURES.RETURN_CREATIVE) {
            returnParcel.adm = bidCreative;
            if (pixel) {
                returnParcel.winNotice = __renderPixel.bind(null, pixel);
            }
            //? }

            //? if(FEATURES.RETURN_PRICE) {
            returnParcel.price = Number(__baseClass._bidTransformers.price.apply(bidPrice));
            //? }

            var pubKitAdId = RenderService.registerAd({
                sessionId: sessionId,
                partnerId: __profile.partnerId,
                adm: bidCreative,
                requestId: returnParcel.requestId,
                size: returnParcel.size,
                price: targetingCpm ? targetingCpm : undefined,
                dealId: bidDealId ? bidDealId : undefined,
                timeOfExpiry: __profile.features.demandExpiry.enabled ? (__profile.features.demandExpiry.value + System.now()) : 0,
                auxFn: __renderPixel,
                auxArgs: [pixel]
            });

            //? if(FEATURES.INTERNAL_RENDER) {
            returnParcel.targeting.pubKitAdId = pubKitAdId;
            //? }
        } else {
            //? if (DEBUG) {
            Scribe.info(__profile.partnerId + ' no bid response for { id: ' + returnParcel.xSlotRef.placementId + ' }.');
            //? }

            if (__profile.enabledAnalytics.requestTime) {
                EventsService.emit('hs_slot_pass', headerStatsInfo);
            }

            returnParcel.pass = true;
        }
    }

    /* =====================================
     * Constructors
     * ---------------------------------- */

    (function __constructor() {
        EventsService = SpaceCamp.services.EventsService;
        RenderService = SpaceCamp.services.RenderService;
        ComplianceService = SpaceCamp.services.ComplianceService;

        __profile = {
            partnerId: 'AolHtb',
            namespace: 'AolHtb',
            statsId: 'AOL',
            version: '2.1.2',
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
                om: 'ix_aol_om',
                pm: 'ix_aol_pm',
                id: 'ix_aol_id'
            },
            bidUnitInCents: 100,
            lineItemType: Constants.LineItemTypes.ID_AND_SIZE,
            callbackType: Partner.CallbackTypes.CALLBACK_NAME,
            architecture: Partner.Architectures.MRA,
            requestType: Partner.RequestTypes.ANY
        };

        //? if (DEBUG) {
        var results = ConfigValidators.partnerBaseConfig(configs) || PartnerSpecificValidator(configs);

        if (results) {
            throw Whoopsie('INVALID_CONFIG', results);
        }
        //? }

        /* Base url by region */
        var endPointByRegion = {
            eu: '//adserver-eu.adtech.advertising.com',
            na: '//adserver-us.adtech.advertising.com',
            asia: '//adserver-as.adtech.advertising.com'
        };

        /* Build base bid request url */
        __baseUrl = Browser.getProtocol() + endPointByRegion[configs.region] + '/pubapi/3.0/' + configs.networkId;

        __baseClass = Partner(__profile, configs, null, {
            parseResponse: __parseResponse,
            generateRequestObj: __generateRequestObj
        });

        //? if (DEBUG) {
        /* If wrapper is already active, we might be instantiated late so need to add our callback
           since the shell potentially missed its chance */
        if (window[SpaceCamp.NAMESPACE]) {
            window[SpaceCamp.NAMESPACE][__profile.namespace] = window[SpaceCamp.NAMESPACE][__profile.namespace] || {};
            window[SpaceCamp.NAMESPACE][__profile.namespace].adResponseCallbacks = window[SpaceCamp.NAMESPACE][__profile.namespace].adResponseCallbacks;
        }
        //? }
    })();

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    var derivedClass = {
        /* Class Information
         * ---------------------------------- */

        //? if (DEBUG) {
        __type__: 'AolHtb',
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
        __parseResponse: __parseResponse
        //? }
    };

    return Classify.derive(__baseClass, derivedClass);
}

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = AolHtb;
