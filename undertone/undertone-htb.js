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
var Utilities = require('utilities.js');

var RenderService;

//? if (DEBUG) {
var ConfigValidators = require('config-validators.js');
var PartnerSpecificValidator = require('undertone-htb-validator.js');
var Scribe = require('scribe.js');
var Whoopsie = require('whoopsie.js');
//? }

////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * Partner module template
 *
 * @class
 */
function UndertoneHtb(configs) {
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

    /* =====================================
     * Functions
     * ---------------------------------- */

    /* Utilities
     * ---------------------------------- */
    var publisherId = configs.publisherId;

    function getPublisherId() {
        return publisherId;
    }

    /**
     * Generates the request URL and query data to the endpoint for the xSlots
     * in the given returnParcels.
     *
     * @param  {object[]} returnParcels
     *
     * @return {object}
     */
    function __generateRequestObj(returnParcels) {
        /* =============================================================================
         * STEP 2  | Generate Request URL
         * -----------------------------------------------------------------------------
         *
         * Genferate the URL to request demand from the partner endpoint using the provided
         * returnParcels. The returnParcels is an array of objects each object containing
         * an .xSlotRef which is a reference to the xSlot object from the partner configuration.
         * Use this to retrieve the placements/xSlots you need to request or.
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
         * your endpoint supports passing in an arbitrary ID and returning it as part of the response
         * please use the callbackType: Partner.CallbackTypes.ID and fill out the adResponseCallback.
         * Also please provide this adResponseCallback to your bid request here so that the JSONP
         * response calls it once it has completed.
         *
         * If your endpoint does not support passing in an ID, simply use
         * Partner.CallbackTypes.CALLBACK_NAME and the wrapper will take care of handling request
         * matching by generating unique callbacks for each request using the callbackId.
         *
         * If your endpoint is ajax only, please set the appropriate values in your profile for this,
         * i.e. Partner.CallbackTypes.NONE and Partner.Requesttypes.AJAX. You also do not need to provide
         * a callbackId in this case because there is no callback.
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

        /* ---------------------- PUT CODE HERE ------------------------------------ */
        /* MRA partners receive only one parcel in the array. */
        var requestUrl = null;
        var bidsArray = [];
        var pubId = getPublisherId();
        for (var index = 0; index < returnParcels.length; index++) {
            var returnParcel = returnParcels[index];
            var xSlot = returnParcel.xSlotRef;

            var currBidId = System.generateUniqueId();
            var sizes = xSlot.sizes;
            xSlot.bidId = currBidId;

            var placementId = xSlot.placementId;
            var pageUrl = Browser.getPageUrl();
            var hostname = Browser.getHostname();
            var domains = (/[-\w]+\.([-\w]+|[-\w]{3,}|[-\w]{1,3}\.[-\w]{2})$/i).exec(hostname);
            var domain = null;
            if (domains !== null && domains.length > 0) {
                domain = domains[0];
                for (var domainsIdx = 1; domainsIdx < domains.length; domainsIdx++) {
                    if (domains[domainsIdx].length > domain.length) {
                        domain = domains[domainsIdx];
                    }
                }
            }

            var baseUrl = Browser.getProtocol() + '//hb.undertone.com/hb';
            requestUrl = baseUrl + '?pid=' + pubId + '&domain=' + domain;

            bidsArray.push({
                bidRequestId: currBidId,
                hbadaptor: 'indexexchange',
                url: pageUrl,
                domain: domain,
                placementId: placementId,
                publisherId: parseInt(pubId, 10),
                sizes: sizes
            });
        }
        var queryObj = {
            'x-ut-hb-params': bidsArray
        };

        /* ------------------------ Get consent information -------------------------
         * If you want to implement GDPR consent in your adapter, use the function
         * ComplianceService.gdpr.getConsent() which will return an object.
         *
         * Here is what the values in that object mean:
         *      - applies: the boolean value indicating if the request is subject to
         *      GDPR regulations
         *      - consentString: the consent string developed by GDPR Consent Working
         *      Group under the auspices of IAB Europe
         *
         * The return object should look something like this:
         * {
         *      applies: true,
         *      consentString: "BOQ7WlgOQ7WlgABABwAAABJOACgACAAQABA"
         * }
         *
         * You can also determine whether or not the publisher has enabled privacy
         * features in their wrapper by querying ComplianceService.isPrivacyEnabled().
         *
         * This function will return a boolean, which indicates whether the wrapper's
         * privacy features are on (true) or off (false). If they are off, the values
         * returned from gdpr.getConsent() are safe defaults and no attempt has been
         * made by the wrapper to contact a Consent Management Platform.
         */

        /* ---------------- Craft bid request using the above returnParcels --------- */

        /* ------- Put GDPR consent code here if you are implementing GDPR ---------- */

        /* -------------------------------------------------------------------------- */

        return {
            url: requestUrl,
            data: queryObj,
            callbackId: System.generateUniqueId(),
            networkParamOverrides: {
                method: 'POST',
                contentType: 'text/plain'
            }
        };
    }

    /* =============================================================================
     * STEP 3  | Response callback
     * -----------------------------------------------------------------------------
     *
     * This generator is only necessary if the partner's endpoint has the ability
     * to return an arbitrary ID that is sent to it. It should retrieve that ID from
     * the response and save the response to adResponseStore keyed by that ID.
     *
     * If the endpoint does not have an appropriate field for this, set the profile's
     * callback type to CallbackTypes.CALLBACK_NAME and omit this function.
     */
    function adResponseCallback(adResponse) {
        /* Get callbackId from adResponse here */
        if (adResponse === null || !Utilities.isArray(adResponse) || adResponse.length === 0) {
            return;
        }

        for (var i = 0; i < adResponse.length; i++) {
            var currBidResponse = adResponse[i];
            __baseClass._adResponseStore[currBidResponse.bidRequestId] = currBidResponse;
        }
    }

    /* -------------------------------------------------------------------------- */

    /* Helpers
     * ---------------------------------- */

    /* =============================================================================
     * STEP 5  | Rendering Pixel
     * -----------------------------------------------------------------------------
     *
    */

    /**
     * This function will render the pixel given.
     * @param  {string} pixelUrl Tracking pixel img url.
     */
    function __renderPixel(pixelUrl) {
        if (pixelUrl) {
            Network.img({
                url: decodeURIComponent(pixelUrl),
                method: 'GET'
            });
        }
    }

    /**
     * Parses and extracts demand from adResponse according to the adapter and then attaches it
     * to the corresponding bid's returnParcel in the correct format using targeting keys.
     *
     * @param {string} sessionId The sessionId, used for stats and other events.
     *
     * @param {any} adResponse This is the bid response as returned from the bid request, that was either
     * passed to a JSONP callback or simply sent back via AJAX.
     *
     * @param {object[]} returnParcels The array of original parcels, SAME array that was passed to
     * generateRequestObj to signal which slots need demand. In this funciton, the demand needs to be
     * generateRequestObj to signal which slots need demand. In this funciton, the demand needs to be
     * attached to each one of the objects for which the demand was originally requested for.
     */
    function __parseResponse(sessionId, adResponse, returnParcels) {
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

        var adResponseDic = {};
        if (typeof adResponse !== 'undefined') {
            for (var idx = 0; idx < adResponse.length; idx++) {
                adResponseDic[adResponse[idx].bidRequestId] = adResponse[idx];
            }
        }

        /* MRA partners receive only one parcel in the array. */
        for (var parcelIdx = 0; parcelIdx < returnParcels.length; parcelIdx++) {
            var returnParcel = returnParcels[parcelIdx];

            /* Header stats information */
            var headerStatsInfo = {};
            var htSlotId = returnParcel.htSlot.getId();
            headerStatsInfo[htSlotId] = {};
            headerStatsInfo[htSlotId][returnParcel.requestId] = [returnParcel.xSlotName];

            returnParcel.targetingType = 'slot';
            returnParcel.targeting = {};
            returnParcel.pass = false;

            var currAdResponse = adResponseDic[returnParcel.xSlotRef.bidId];
            if (typeof currAdResponse === 'undefined') {
                currAdResponse = {};
            }

            if (typeof currAdResponse.ad === 'undefined' || currAdResponse.cpm <= 0) {
                if (__profile.enabledAnalytics.requestTime) {
                    __baseClass._emitStatsEvent(sessionId, 'hs_slot_pass', headerStatsInfo);
                }
                returnParcel.pass = true;

                continue;
            }

            var bidCreative = currAdResponse.ad || '';
            var bidPrice = currAdResponse.cpm || 0;
            var bidDealId = '';
            var pixelUrl = '';

            if (typeof currAdResponse.width !== 'undefined') {
                returnParcel.size = [Number(currAdResponse.width), Number(currAdResponse.height)];
            } else {
                returnParcel.size = [0, 0];
            }

            var targetingCpm = '';
            //? if (FEATURES.GPT_LINE_ITEMS) {
            targetingCpm = __baseClass._bidTransformers.targeting.apply(bidPrice);
            var sizeKey = Size.arrayToString(returnParcel.size);

            if (bidDealId) {
                returnParcel.targeting[__baseClass._configs.targetingKeys.pmid] = [sizeKey + '_' + bidDealId];
                returnParcel.targeting[__baseClass._configs.targetingKeys.pm] = [sizeKey + '_' + targetingCpm];
            } else {
                returnParcel.targeting[__baseClass._configs.targetingKeys.om] = [sizeKey + '_' + targetingCpm];
            }
            returnParcel.targeting[__baseClass._configs.targetingKeys.id] = [returnParcel.requestId];
            //? }

            //? if (FEATURES.RETURN_CREATIVE) {
            returnParcel.adm = bidCreative;
            if (pixelUrl) {
                returnParcel.winNotice = __renderPixel.bind(null, pixelUrl);
            }
            //? }

            //? if (FEATURES.RETURN_PRICE) {
            returnParcel.price = Number(__baseClass._bidTransformers.price.apply(bidPrice));
            //? }

            var expirationTime = 0;
            if (__profile.features.demandExpiry.enabled) {
                expirationTime = __profile.features.demandExpiry.value + System.now();
            }

            if (returnParcel.pass) {
                //? if (DEBUG) {
                Scribe.info(__profile.partnerId + ' returned pass for { id: ' + adResponse.id + ' }.');
                //? }
                if (__profile.enabledAnalytics.requestTime) {
                    __baseClass._emitStatsEvent(sessionId, 'hs_slot_pass', headerStatsInfo);
                }
            } else {
                if (__profile.enabledAnalytics.requestTime) {
                    __baseClass._emitStatsEvent(sessionId, 'hs_slot_bid', headerStatsInfo);
                }

                var pubKitAdId = RenderService.registerAd({
                    sessionId: sessionId,
                    partnerId: __profile.partnerId,
                    adm: bidCreative,
                    requestId: returnParcel.requestId,
                    size: returnParcel.size,
                    price: targetingCpm,
                    timeOfExpiry: expirationTime
                });

                //? if (FEATURES.INTERNAL_RENDER) {
                returnParcel.targeting.pubKitAdId = pubKitAdId;
                //? }
            }
        }
    }

    /* =====================================
     * Constructors
     * ---------------------------------- */

    (function __constructor() {
        RenderService = SpaceCamp.services.RenderService;

        /* =============================================================================
         * STEP 1  | Partner Configuration
         * -----------------------------------------------------------------------------
         *
         * Please fill out the below partner profile according to the steps in the README doc.
         */

        __profile = {
            partnerId: 'UndertoneHtb',
            namespace: 'UndertoneHtb',
            statsId: 'UNDR',
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
                id: 'ix_undr_id',
                om: 'ix_undr_cpm',
                pm: 'ix_undr_cpm',
                pmid: 'ix_undr_dealid'
            },
            bidUnitInCents: 100,
            lineItemType: Constants.LineItemTypes.ID_AND_SIZE,
            callbackType: Partner.CallbackTypes.NONE,
            architecture: Partner.Architectures.SRA,
            requestType: Partner.RequestTypes.AJAX
        };

        /* --------------------------------------------------------------------------------------- */

        //? if (DEBUG) {
        var results = ConfigValidators.partnerBaseConfig(configs) || PartnerSpecificValidator(configs);

        if (results) {
            throw Whoopsie('INVALID_CONFIG', results);
        }
        //? }

        __baseClass = Partner(__profile, configs, null, {
            parseResponse: __parseResponse,
            generateRequestObj: __generateRequestObj,
            adResponseCallback: adResponseCallback
        });
    })();

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    var derivedClass = {
        /* Class Information
         * ---------------------------------- */

        //? if (DEBUG) {
        __type__: 'UndertoneHtb',
        //? }

        //? if (TEST) {
        __baseClass: __baseClass,
        //? }

        /* Data
         * ---------------------------------- */

        //? if (TEST) {
        profile: __profile,
        //? }

        /* Functions
         * ---------------------------------- */

        //? if (TEST) {
        parseResponse: __parseResponse,
        generateRequestObj: __generateRequestObj,
        adResponseCallback: adResponseCallback
        //? }
    };

    return Classify.derive(__baseClass, derivedClass);
}

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = UndertoneHtb;
