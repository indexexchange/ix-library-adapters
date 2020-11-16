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
var RenderService;

//? if (DEBUG) {
var ConfigValidators = require('config-validators.js');
var PartnerSpecificValidator = require('concert-htb-validator.js');
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
function ConcertHtb(configs) {
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
     * Local-storage key for Concert UID.
     *
     * @private {string}
     */
    var CONCERT_UID_KEY = 'c_uid';

    /**
     * Local-storage key for whethere user has opted-out of Concert personalization.
     *
     * @private {string}
     */
    var CONCERT_NO_PERSONALIZATION_KEY = 'c_nap';

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
        var callbackId = System.generateUniqueId();
        var pageUrl = Browser.getPageUrl();

        var queryObj = {
            callbackId: callbackId,
            slots: returnParcels.map(function (parcel) {
                return {
                    name: parcel.xSlotName,
                    sizes: parcel.xSlotRef.sizes,
                    placementId: parcel.xSlotRef.placementId,
                    site: parcel.xSlotRef.site,
                    partnerId: configs.partnerId
                };
            }),
            meta: {
                adapterVersion: __profile.version,
                pageUrl: pageUrl,
                screen: Size.arrayToString([Browser.getScreenWidth(), Browser.getScreenHeight()]),
                // eslint-disable-next-line no-use-before-define
                uid: __getUid()
            }
        };

        if (typeof URLSearchParams === 'function') {
            if (new URLSearchParams(pageUrl)
                .has('debug_concert_ads')) {
                queryObj.meta.debug = true;
            }
        }

        var baseUrl = Browser.getProtocol() + '//bids.concert.io/bids/ix';

        // eslint-disable-next-line no-use-before-define
        queryObj.meta.optedOut = __hasOptedOutOfPersonalization();

        if (ComplianceService.isPrivacyEnabled()) {
            var uspConsent = ComplianceService.usp && ComplianceService.usp.getConsent();
            if (typeof uspConsent === 'object') {
                queryObj.meta.uspConsent = uspConsent.uspString;
            }

            var gdprConsent = ComplianceService.gdpr && ComplianceService.gdpr.getConsent();
            if (typeof gdprConsent === 'object') {
                if (typeof gdprConsent.applies === 'boolean') {
                    queryObj.meta.gdprApplies = Number(gdprConsent.applies);
                }
                queryObj.meta.gdprConsent = gdprConsent.consentString;
            }
        }

        return {
            url: baseUrl,
            data: queryObj,
            callbackId: callbackId,
            networkParamOverrides: {
                method: 'POST',
                contentType: 'application/json',
                withCredentials: false
            }
        };
    }

    function adResponseCallback(adResponse) {
        /* Get callbackId from adResponse here */
        var callbackId = 0;
        __baseClass._adResponseStore[callbackId] = adResponse;
    }

    /* -------------------------------------------------------------------------- */

    /* Helpers
     * ---------------------------------- */

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
     * Returns random data using the Crypto API if available and
     * Math.random if not Method is from
     * https://gist.github.com/jed/982883 like generateUUID, direct
     * link https://gist.github.com/jed/982883#gistcomment-45104
     */
    function __getRandomData() {
        if (window && window.crypto && window.crypto.getRandomValues) {
            // eslint-disable-next-line no-undef
            return crypto.getRandomValues(new Uint8Array(1))[0] % 16;
        }

        return Math.random() * 16;
    }

    /**
     * Returns a random v4 UUID of the form xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx,
     * where each x is replaced with a random hexadecimal digit from 0 to f,
     * and y is replaced with a random hexadecimal digit from 8 to b.
     * https://gist.github.com/jed/982883 via node-uuid
     */
    function __generateUUID(placeholder) {
        // eslint-disable-next-line no-bitwise,no-mixed-operators
        return placeholder ? (placeholder ^ __getRandomData() >> placeholder / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, __generateUUID);
    }

    /**
     * Returns presence of "opted-out of personalization" cookie
     */
    function __hasOptedOutOfPersonalization() {
        return window.localStorage.getItem(CONCERT_NO_PERSONALIZATION_KEY) === 'true';
    }

    /**
     * Retrieve or generate a UID for the current user.
     */
    function __getUid() {
        if (ComplianceService.isPrivacyEnabled()
            || !Browser.isLocalStorageSupported()
            || __hasOptedOutOfPersonalization()) {
            return false;
        }
        var uid = window.localStorage.getItem(CONCERT_UID_KEY);
        if (!uid) {
            uid = __generateUUID();
            window.localStorage.setItem(CONCERT_UID_KEY, uid);
        }

        return uid;
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
        var bids = adResponse.bids;

        for (var j = 0; j < returnParcels.length; j++) {
            var curReturnParcel = returnParcels[j];

            var headerStatsInfo = {};
            var htSlotId = curReturnParcel.htSlot.getId();
            headerStatsInfo[htSlotId] = {};
            headerStatsInfo[htSlotId][curReturnParcel.requestId] = [curReturnParcel.xSlotName];

            var curBid;

            for (var i = 0; i < bids.length; i++) {
                if (curReturnParcel.xSlotName === bids[i].bidId) {
                    curBid = bids[i];
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

            /* The bid price for the given slot */
            var bidPrice = Number(curBid.cpm);

            /* The size of the given slot */
            var bidSize = [Number(curBid.width), Number(curBid.height)];

            /* The creative/adm for the given slot that will be rendered if is the winner.
             * Please make sure the URL is decoded and ready to be document.written.
             */
            var bidCreative = curBid.ad;

            /* The dealId if applicable for this slot. */
            var bidDealId = curBid.dealid;

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
                Scribe.info(__profile.partnerId + ' returned pass for { id: ' + adResponse.id + ' }.');
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
            if (pixelUrl) {
                curReturnParcel.winNotice = __renderPixel.bind(null, pixelUrl);
            }
            //? }

            //? if (FEATURES.RETURN_PRICE) {
            curReturnParcel.price = Number(__baseClass._bidTransformers.price.apply(bidPrice));
            //? }

            var expiry = 0;
            if (__profile.features.demandExpiry.enabled) {
                expiry = __profile.features.demandExpiry.value + System.now();
            }

            var pubKitAdId = RenderService.registerAd({
                sessionId: sessionId,
                partnerId: __profile.partnerId,
                adm: bidCreative,
                requestId: curReturnParcel.requestId,
                size: curReturnParcel.size,
                price: targetingCpm,
                dealId: bidDealId || null,
                timeOfExpiry: expiry,
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
        ComplianceService = SpaceCamp.services.ComplianceService;
        RenderService = SpaceCamp.services.RenderService;

        __profile = {
            partnerId: 'ConcertHtb',
            namespace: 'ConcertHtb',
            statsId: 'CON',
            version: '2.0.0',
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

            /* Targeting keys for demand, should follow format ix_{statsId}_id */
            targetingKeys: {
                id: 'ix_con_id',
                om: 'ix_con_cpm',
                pm: 'ix_con_cpm',
                pmid: 'ix_con_dealid'
            },

            /* The bid price unit (in cents) the endpoint returns, please refer to the readme for details */
            bidUnitInCents: 1,
            lineItemType: Constants.LineItemTypes.ID_AND_SIZE,
            callbackType: Partner.CallbackTypes.NONE,
            architecture: Partner.Architectures.SRA,
            requestType: Partner.RequestTypes.ANY
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
        __type__: 'ConcertHtb',
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

module.exports = ConcertHtb;
