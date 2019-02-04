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
var Network = require('network.js');

var ComplianceService;
var EventsService;
var RenderService;

//? if (DEBUG) {
var ConfigValidators = require('config-validators.js');
var PartnerSpecificValidator = require('triple-lift-htb-validator.js');
var Scribe = require('scribe.js');
var Whoopsie = require('whoopsie.js');
//? }

////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * Triple Lift Header Tag Bidder module.
 *
 * @class
 */
function TripleLiftHtb(configs) {
    /* TripleLift endpoint only works with AJAX */
    if (!Network.isXhrSupported()) {
        //? if (DEBUG) {
        Scribe.warn('Partner TripleLift requires AJAX support. Aborting instantiation.');
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
     * @return {object} the request object
     */
    function __generateRequestObj(returnParcels) {
        /* =============================================================================
         * STEP 2  | Generate Request URL
         * -----------------------------------------------------------------------------
         *
         * Generate the URL to request demand from the partner endpoint using the provided
         * returnParcels. The returnParcels is an array of objects each object containing
         * an .xSlotRef which is a reference to the xSlot object from the partner configuration.
         * Use this to retrieve the placements/xSlots you need to request for.
         *
         * If your partner is MRA, returnParcels will be an array of length one. If your
         * partner is SRA, it will contain any number of entities. In any event, the full
         * contents of the array should be able to fit into a single request and the
         * return value of this function should similarly represent a single request to the
         * endpoint.
         *
         * Return an object containing:
         * queryUrl: the url for the request
         * data: the query object containing a map of the query string paramaters
         *
         * callbackId:
         *
         * arbitrary id to match the request with the response in the callback function. If
         * your endpoint supports passing in an arbitrary ID and returning as part of the response
         * please use the callbackType: Partner.CallbackTypes.ID and fill out the adResponseCallback.
         * Also please provide this adResponseCallback to your bid request here so that the JSONP
         * response calls it once it has completed.
         *
         * If your endpoint does not support passing in an ID, simply use
         * Partner.CallbackTypes.CALLBACK_NAME and the wrapper will take care of handling request
         * matching by generating unique callbacks for each request using the callbackId.
         *
         * If your endpoint is ajax only, please set the appropriate values in your profile for this,
         * i.e. Partner.CallbackTypes.NONE and Partner.Requesttypes.AJAX
         *
         * The return object should look something like this:
         * {
         *     url: 'http://bidserver.com/api/bids' // base request url for a GET/POST request
         *     data: { // query string object that will be attached to the base url
         *        slots: [
         *             {
         *                 placementId: 54321,
         *                 sizes: [[300, 250]]
         *             },{
         *                 placementId: 12345,
         *                 sizes: [[300, 600]]
         *             },{
         *                 placementId: 654321,
         *                 sizes: [[728, 90]]
         *             }
         *         ],
         *         site: 'http://google.com'
         *     },
         *     callbackId: '_23sd2ij4i1' //unique id used for pairing requests and responses
         * }
         */

        var gdprStatus = ComplianceService.gdpr.getConsent();
        var privacyEnabled = ComplianceService.isPrivacyEnabled();

        /* MRA partners receive only one parcel in the array. */
        var returnParcel = returnParcels[0];
        var xSlot = returnParcel.xSlotRef;

        /* request params */
        var requestParams = {
            inv_code: xSlot.inventoryCode, // jshint ignore:line
            lib: 'ix',
            fe: Browser.isFlashSupported() ? 1 : 0,
            size: Size.arrayToString(xSlot.sizes),
            referrer: Browser.getPageUrl(),
            v: '2.1'
        };

        if (privacyEnabled) {
              requestParams.gdpr = gdprStatus.applies;
              requestParams.cmp_cs = gdprStatus.consentString;
        }
        if (xSlot.floor) {
            requestParams.floor = xSlot.floor;
        }

        return {
            url: __baseUrl,
            data: requestParams
        };
    }

    /* Helpers
     * ---------------------------------- */

    /* Parse adResponse, put demand into outParcels.
     * Triple-Lift response contains a single result object.
     */
    function __parseResponse(sessionId, responseObj, returnParcels) {
        /* =============================================================================
         * STEP 4  | Parse & store demand response
         * -----------------------------------------------------------------------------
         *
         * Fill the below variables with information about the bid from the partner, using
         * the adResponse variable that contains your module adResponse.
         */

        /* This an array of all the bids in your response that will be iterated over below. Each of
         * these will be mapped back to a returnParcel object using some criteria explained below.
         * The following variables will also be parsed and attached to that returnParcel object as
         * returned demand.
         *
         * Use the adResponse variable to extract your bid information and insert it into the
         * bids array. Each element in the bids array should represent a single bid and should
         * match up to a single element from the returnParcel array.
         *
         */

        /* ---------- Process adResponse and extract the bids into the bids array ------------*/

        /* there is only one bid because mra */
        var bid = responseObj;

        /* --------------------------------------------------------------------------------- */

        /* MRA partners receive only one parcel in the array. */
        var returnParcel = returnParcels[0];

        /* header stats information */
        var headerStatsInfo = {
            sessionId: sessionId,
            statsId: __profile.statsId,
            htSlotId: returnParcel.htSlot.getId(),
            requestId: returnParcel.requestId,
            xSlotNames: [returnParcel.xSlotName]
        };

        /* If not a pass */
        if (!bid.status && bid.cpm && bid.cpm > 0) {
            if (__profile.enabledAnalytics.requestTime) {
                EventsService.emit('hs_slot_bid', headerStatsInfo);
            }

            /* ---------- Fill the bid variables with data from the bid response here. ------------*/
            /* Using the above variable, curBid, extract various information about the bid and assign it to
             * these local variables */

            var bidPrice = bid.cpm; /* the bid price for the given slot */
            var bidCreative = bid.ad; /* the creative/adm for the given slot that will be rendered if is the winner. */
            var bidSize = [Number(bid.width), Number(bid.height)]; /* the size of the given slot */

            /* the dealId if applicable for this slot. */
            var bidDealId = bid.deal_id; // jshint ignore:line

            /* ---------------------------------------------------------------------------------------*/

            returnParcel.targetingType = 'slot';
            returnParcel.targeting = {};
            returnParcel.size = bidSize;

            var targetingCpm = '';

            //? if(FEATURES.GPT_LINE_ITEMS) {
            targetingCpm = __baseClass._bidTransformers.targeting.apply(bidPrice);
            var sizeKey = Size.arrayToString(bidSize);

            if (bidDealId) {
                returnParcel.targeting[__baseClass._configs.targetingKeys.pmid] = [bidDealId];
                returnParcel.targeting[__baseClass._configs.targetingKeys.pm] = [sizeKey + '_' + targetingCpm];
            } else {
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

            var pubKitAdId = RenderService.registerAd({
                sessionId: sessionId,
                partnerId: __profile.partnerId,
                adm: bidCreative,
                requestId: returnParcel.requestId,
                size: returnParcel.size,
                price: targetingCpm ? targetingCpm : undefined,
                dealId: bidDealId ? bidDealId : undefined,
                timeOfExpiry: __profile.features.demandExpiry.enabled ? (__profile.features.demandExpiry.value + System.now()) : 0
            });

            //? if(FEATURES.INTERNAL_RENDER) {
            returnParcel.targeting.pubKitAdId = pubKitAdId;
            //? }
        } else {
            //? if (DEBUG) {
            Scribe.info(__profile.partnerId + ' no bid response for { id: ' + returnParcel.xSlotRef.inventoryCode + ' }.');
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
        ComplianceService = SpaceCamp.services.ComplianceService;
        EventsService = SpaceCamp.services.EventsService;
        RenderService = SpaceCamp.services.RenderService;

        /* =============================================================================
         * STEP 1  | Partner Configuration
         * -----------------------------------------------------------------------------
         *
         * Please review below partner profile according to the steps in the README doc.
         */

        __profile = {
            partnerId: 'TripleLiftHtb',
            namespace: 'TripleLiftHtb',
            statsId: 'TPL',
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
                }
            },
            targetingKeys: {
                om: 'ix_tpl_cpm',
                pm: 'ix_tpl_cpm',
                pmid: 'ix_tpl_dealid',
                id: 'ix_tpl_id'
            },
            bidUnitInCents: 100,
            lineItemType: Constants.LineItemTypes.ID_AND_SIZE,
            callbackType: Partner.CallbackTypes.NONE,
            architecture: Partner.Architectures.MRA,
            requestType: Partner.RequestTypes.AJAX
        };

        /* ---------------------------------------------------------------------------------------*/

        //? if (DEBUG) {
        var results = ConfigValidators.partnerBaseConfig(configs) || PartnerSpecificValidator(configs);

        if (results) {
            throw Whoopsie('INVALID_CONFIG', results);
        }
        //? }

        /* build base bid request url */
        __baseUrl = Browser.getProtocol() + '//tlx.3lift.com/header/auction';

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
        __type__: 'TripleLiftHtb',
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

module.exports = TripleLiftHtb;
