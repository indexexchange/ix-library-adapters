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

var RenderService;
var ComplianceService;

//? if (DEBUG) {
var ConfigValidators = require('config-validators.js');
var PartnerSpecificValidator = require('kargo-htb-validator.js');
var Scribe = require('scribe.js');
var Whoopsie = require('whoopsie.js');
//? }

////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * Kargo Header Tag Bidder module.
 *
 * @class
 */
function KargoHtb(configs) {
    /* Kargo endpoint only works with AJAX */
    if (!Network.isXhrSupported()) {
        //? if (DEBUG) {
        Scribe.warn('Partner KargoHtb requires AJAX support. Aborting instantiation.');
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
     * Session ID.
     *
     * @private {string}
     */
    var __sessionId;

    /* =====================================
     * Functions
     * ---------------------------------- */

    /* Utilities
     * ---------------------------------- */

    function __getLocalStorageSafely(key) {
        try {
            return localStorage.getItem(key);
        } catch (ex) {
            return '';
        }
    }

    function __getTDID(returnParcels) {
        var unifiedID = '';
        var uids = []
        if (returnParcels &&
            returnParcels.length &&
            returnParcels[0].identityData &&
            returnParcels[0].identityData.AdserverOrgIp &&
            returnParcels[0].identityData.AdserverOrgIp.data &&
            returnParcels[0].identityData.AdserverOrgIp.data.uids) {
            uids = returnParcels[0].identityData.AdserverOrgIp.data.uids;
        } else {
            return unifiedID;
        }
        for (var i = 0; i < uids.length; i++) {
            if (uids[i].ext &&
                uids[i].ext.rtiPartner &&
                uids[i].ext.rtiPartner === 'TDID') {
                unifiedID = uids[i].id;
                break;
            }
        };
        return unifiedID;
    }

    function __getIDLEnvelope(returnParcels) {
        var idlEnvelope = '';
        var uids = []
        if (returnParcels &&
            returnParcels.length &&
            returnParcels[0].identityData &&
            returnParcels[0].identityData.LiveRampIp &&
            returnParcels[0].identityData.LiveRampIp.data &&
            returnParcels[0].identityData.LiveRampIp.data.uids) {
            uids = returnParcels[0].identityData.LiveRampIp.data.uids;
        } else {
            return idlEnvelope;
        }
        for (var i = 0; i < uids.length; i++) {
            if (uids[i].ext &&
                uids[i].ext.rtiPartner &&
                uids[i].ext.rtiPartner === 'idl') {
                idlEnvelope = uids[i].id;
                break;
            }
        };
        return idlEnvelope;
    }

    function __getIdentityData(returnParcels) {
        if (returnParcels && returnParcels.length) {
            return returnParcels[0].identityData;
        } else {
            return null;
        }
    }

    function __getCrbFromCookie() {
        try {
            var crb = JSON.parse(decodeURIComponent(Browser.readCookie('krg_crb')));
            if (crb && crb.v) {
                var vParsed = JSON.parse(atob(crb.v));
                if (vParsed) {
                    return vParsed;
                }
            }

            return {};
        } catch (ex) {
            //? if (DEBUG) {
            Scribe.error('Unable to get Crb from cookie for Kargo');
            Scribe.error(ex);
            //? }

            return {};
        }
    }

    function __getCrbFromLocalStorage() {
        try {
            return JSON.parse(atob(__getLocalStorageSafely('krg_crb')));
        } catch (ex) {
            //? if (DEBUG) {
            Scribe.error('Unable to get Crb from localstorage for Kargo');
            Scribe.error(ex);
            //? }

            return {};
        }
    }

    function __getCrb() {
        var localStorageCrb = __getCrbFromLocalStorage();
        if (Object.keys(localStorageCrb).length) {
            return localStorageCrb;
        }

        return __getCrbFromCookie();
    }

    function __getUserIds(returnParcels) {
        var crb = __getCrb();
        var privacyEnabled = ComplianceService.isPrivacyEnabled();
        var uspConsentObj = ComplianceService.usp && ComplianceService.usp.getConsent();

        return {
            kargoID: crb.userId || '',
            clientID: crb.clientId || '',
            tdID: __getTDID(returnParcels),
            idlEnv: __getIDLEnvelope(returnParcels),
            identityData: __getIdentityData(returnParcels),
            crbIDs: crb.syncIds || {},
            optOut: crb.optOut || false,
            usp: privacyEnabled && uspConsentObj ? uspConsentObj.uspString : null
        };
    }

    function __getKruxDmpData() {
        var segmentsStr = __getLocalStorageSafely('kxkar_segs');
        var segments = [];

        if (segmentsStr) {
            segments = segmentsStr.split(',');
        }

        return {
            userID: __getLocalStorageSafely('kxkar_user'),
            segments: segments
        };
    }

    function __generateRandomUuid() {
        try {
            // The function crypto.getRandomValues is supported everywhere but Opera Mini for years
            var buffer = new Uint8Array(16); // eslint-disable-line no-undef
            crypto.getRandomValues(buffer);
            buffer[6] = (buffer[6] & ~176) | 64; // eslint-disable-line no-bitwise
            buffer[8] = (buffer[8] & ~64) | 128; // eslint-disable-line no-bitwise
            // eslint-disable-next-line no-undef
            var hex = Array.prototype.map.call(new Uint8Array(buffer), function (x) {
                return ('00' + x.toString(16)).slice(-2);
            })
                .join('');

            return hex.slice(0, 8) + '-' + hex.slice(8, 12) + '-' + hex.slice(12, 16) + '-' + hex.slice(16, 20)
                + '-' + hex.slice(20);
        } catch (e) {
            return '';
        }
    }

    function __getSessionId() {
        if (!__sessionId) {
            __sessionId = __generateRandomUuid();
        }

        return __sessionId;
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

        /* Change this to your bidder endpoint. */
        var baseUrl = Browser.getProtocol() + '//krk.kargo.com/api/v1/bid';

        /* ---------------- Craft bid request using the above returnParcels --------- */

        /* Grab all requred adSlotIds */
        var adSlotIds = [];
        for (var i = 0; i < returnParcels.length; i++) {
            /* If htSlot does not have an ixSlot mapping no impressions needed */
            if (!returnParcels[i].hasOwnProperty('xSlotRef')) {
                continue;
            }
            adSlotIds.push(returnParcels[i].xSlotRef.adSlotId);
        }

        /* Craft json object for the bid request */
        var json = {
            sessionId: __getSessionId(),
            timeout: SpaceCamp.globalTimeout,
            adSlotIDs: adSlotIds,
            timestamp: (new Date())
                .getTime(),
            userIDs: __getUserIds(returnParcels),
            krux: __getKruxDmpData(),
            pageURL: Browser.getPageUrl(),
            rawCRB: Browser.readCookie('krg_crb'),
            rawCRBLocalStorage: __getLocalStorageSafely('krg_crb')
        };

        /* -------------------------------------------------------------------------- */

        return {
            url: baseUrl,
            data: {
                json: JSON.stringify(json)
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
        /**
         * OMITTING THIS FUNCTION DUE TO CALLBACK_NONE
         */
        var callbackId = 0;
        __baseClass._adResponseStore[callbackId] = adResponse;
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

        /* ---------- Process adResponse and extract the bids into the bids array ------------ */

        var bids = [];

        for (var adSlotId in adResponse) {
            if (!adResponse.hasOwnProperty(adSlotId)) {
                continue;
            }

            bids.push({
                adSlotId: adSlotId,
                adSlotDemand: adResponse[adSlotId]
            });
        }

        /* --------------------------------------------------------------------------------- */
        for (var j = 0; j < returnParcels.length; j++) {
            var curReturnParcel = returnParcels[j];

            var headerStatsInfo = {};
            var htSlotId = curReturnParcel.htSlot.getId();
            headerStatsInfo[htSlotId] = {};
            headerStatsInfo[htSlotId][curReturnParcel.requestId] = [curReturnParcel.xSlotName];

            var curBid;
            var curAdSlotId;
            for (var i = 0; i < bids.length; i++) {
                /**
                 * This section maps internal returnParcels and demand returned from the bid request.
                 * In order to match them correctly, they must be matched via some criteria. This
                 * is usually some sort of placements or inventory codes. Please replace the someCriteria
                 * key to a key that represents the placement in the configuration and in the bid responses.
                 */

                /* ----------- Fill this out to find a matching bid for the current parcel ------------- */
                if (curReturnParcel.xSlotRef.adSlotId === bids[i].adSlotId) {
                    curBid = bids[i].adSlotDemand;
                    curAdSlotId = bids[i].adSlotId;
                    bids.splice(i, 1);

                    break;
                }
            }

            /* No matching bid found so its a pass */
            if (!curBid) {
                if (__profile.enabledAnalytics.requestTime) {
                    __baseClass._emitStatsEvent(sessionId, 'hs_slot_pass', headerStatsInfo);
                }
                curReturnParcel.pass = true;

                continue;
            }

            /* ---------- Fill the bid variables with data from the bid response here. ------------ */

            /* Using the above variable, curBid, extract various information about the bid and assign it to
             * these local variables */

            /* The bid price for the given slot */
            var bidPrice = curBid.cpm;

            /* The size of the given slot */
            var sizes = curBid.targetingPrefix.split(/x|_/)
                .slice(0, 2);
            var bidSize = [Number(sizes[0]), Number(sizes[1])];

            /* The creative/adm for the given slot that will be rendered if is the winner.
             * Please make sure the URL is decoded and ready to be document.written.
             */
            var bidCreative = curBid.adm;

            /* The dealId if applicable for this slot. */
            var bidDealId = curBid.hasOwnProperty('targetingCustom') ? curBid.targetingCustom : null;

            /* Explicitly pass */
            var bidIsPass = bidPrice <= 0;

            /* OPTIONAL: tracking pixel url to be fired AFTER rendering a winning creative.
             * If firing a tracking pixel is not required or the pixel url is part of the adm,
             * leave empty;
             */
            var pixelUrl = '';

            /* --------------------------------------------------------------------------------------- */

            curBid = null;

            if (bidIsPass) {
                //? if (DEBUG) {
                Scribe.info(__profile.partnerId + ' returned pass for { id: ' + curAdSlotId + ' }.');
                //? }
                if (__profile.enabledAnalytics.requestTime) {
                    __baseClass._emitStatsEvent(sessionId, 'hs_slot_pass', headerStatsInfo);
                }
                curReturnParcel.pass = true;

                continue;
            }

            if (__profile.enabledAnalytics.requestTime) {
                __baseClass._emitStatsEvent(sessionId, 'hs_slot_bid', headerStatsInfo);
            }

            curReturnParcel.size = bidSize;
            curReturnParcel.targetingType = 'slot';
            curReturnParcel.targeting = {};

            var targetingCpm = '';

            //? if (FEATURES.GPT_LINE_ITEMS) {
            targetingCpm = __baseClass._bidTransformers.targeting.apply(bidPrice);
            var sizeKey = Size.arrayToString(curReturnParcel.size);

            if (bidDealId) {
                curReturnParcel.targeting[__baseClass._configs.targetingKeys.pmid] = [sizeKey + '_' + bidDealId];
                curReturnParcel.targeting[__baseClass._configs.targetingKeys.pm] = [sizeKey + '_' + targetingCpm];
            } else {
                curReturnParcel.targeting[__baseClass._configs.targetingKeys.om] = [sizeKey + '_' + targetingCpm];
            }
            curReturnParcel.targeting[__baseClass._configs.targetingKeys.id] = [curReturnParcel.requestId];
            //? }

            //? if (FEATURES.RETURN_CREATIVE) {
            curReturnParcel.adm = bidCreative;
            //? }

            //? if (FEATURES.RETURN_PRICE) {
            curReturnParcel.price = Number(__baseClass._bidTransformers.price.apply(bidPrice));
            //? }

            var demandExpiry = __profile.features.demandExpiry;

            var pubKitAdId = RenderService.registerAd({
                sessionId: sessionId,
                partnerId: __profile.partnerId,
                adm: bidCreative,
                requestId: curReturnParcel.requestId,
                size: curReturnParcel.size,
                // eslint-disable-next-line no-undefined
                price: targetingCpm ? targetingCpm : undefined,
                // eslint-disable-next-line no-undefined
                dealId: bidDealId ? bidDealId : undefined,
                timeOfExpiry: demandExpiry.enabled ? demandExpiry.value + System.now() : 0,
                auxFn: __renderPixel,
                auxArgs: [pixelUrl]
            });

            //? if (FEATURES.INTERNAL_RENDER) {
            curReturnParcel.targeting.pubKitAdId = pubKitAdId;
            //? }
        }
    }

    /* =====================================
     * Constructors
     * ---------------------------------- */

    (function __constructor() {
        RenderService = SpaceCamp.services.RenderService;
        ComplianceService = SpaceCamp.services.ComplianceService;

        /* =============================================================================
         * STEP 1  | Partner Configuration
         * -----------------------------------------------------------------------------
         *
         * Please fill out the below partner profile according to the steps in the README doc.
         */

        /* ---------- Please fill out this partner profile according to your module ------------ */
        __profile = {

            // PartnerName
            partnerId: 'KargoHtb',

            // Should be same as partnerName
            namespace: 'KargoHtb',

            // Unique partner identifier
            statsId: 'KARG',
            version: '2.4.0',
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

            // Targeting keys for demand, should follow format ix_{statsId}_id
            targetingKeys: {
                id: 'ix_karg_id',
                om: 'ix_karg_om',
                pm: 'ix_karg_pm',
                pmid: 'ix_karg_pmid'
            },

            // The bid price unit (in cents) the endpoint returns, please refer to the readme for details
            bidUnitInCents: 100,
            lineItemType: Constants.LineItemTypes.ID_AND_SIZE,

            // Callback type, please refer to the readme for details
            callbackType: Partner.CallbackTypes.NONE,

            // Request architecture, please refer to the readme for details
            architecture: Partner.Architectures.SRA,

            // Request type, jsonp, ajax, or any.
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
        __type__: 'KargoHtb',
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

module.exports = KargoHtb;
