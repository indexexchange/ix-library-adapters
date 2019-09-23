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

var EventsService;
var RenderService;
var ComplianceService;

//? if (DEBUG) {
var Scribe = require('scribe.js');
var Whoopsie = require('whoopsie.js');
var Inspector = require('schema-inspector.js');
var GmsmValidator = require('gmsm-htb-validator.js');
var ConfigValidators = require('config-validators.js');
//? }

////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * Partner module template
 *
 * @class
 */
function GmsmHtb(configs) {
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
    function flattenObject(ob) {
        var toReturn = {};

        for (var i in ob) {
            if (!ob.hasOwnProperty(i)) {
                continue;
            }

            if (Utilities.isObject(ob[i]) && !Utilities.isArray(ob[i])) {
                var flatObject = flattenObject(ob[i]);

                for (var x in flatObject) {
                    if (!flatObject.hasOwnProperty(x)) {
                        continue;
                    }
                    toReturn[i + '.' + x] = flatObject[x];
                }
            } else if (Utilities.isArray(ob[i])) {
                var values = '';
                // eslint-disable-next-line no-loop-func
                ob[i].forEach(function (value) {
                    values += value + ',';
                });

                values = values.slice(0, -1);
                toReturn[i] = values;
            } else {
                toReturn[i] = ob[i];
            }
        }

        return toReturn;
    }

    /**
     * Generates the request URL and query data to the endpoint for the xSlots
     * in the given returnParcels.
     *
     * @param  {object[]} returnParcels
     *
     * @return {object}
     */

    function __generateRequestObj(returnParcels, optData) {
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

        /* ---------------- Craft bid request using the above returnParcels --------- */

        /* MRA partners receive only one parcel in the array. */
        var returnParcel = returnParcels[0];
        var callbackId = System.generateUniqueId();
        var queryObj = {
            id: returnParcel.xSlotRef.placementId,
            size: Size.arrayToString([returnParcel.xSlotRef.sizes[0]]),
            callback: __parseFuncPath,
            // eslint-disable-next-line camelcase
            callback_uid: callbackId,
            psa: 0
        };

        /* Endpoint expects first size to be assigned to the "size" parameter,
         * while the rest are added to "promo_sizes".
         */
        if (returnParcel.xSlotRef.sizes.length > 1) {
            // eslint-disable-next-line camelcase
            queryObj.promo_sizes = Size.arrayToString(returnParcel.xSlotRef.sizes.slice(1));
        }

        /* Check for a "keywords" key on the returnParcel object.
         * Expects an array of values for each keyword key -> converted to a string.
         */
        if (Utilities.isObject(returnParcel.xSlotRef.keywords) && !Utilities.isEmpty(returnParcel.xSlotRef.keywords)) {
            var keywordsObj = returnParcel.xSlotRef.keywords;
            Object.keys(keywordsObj)
                .forEach(function (key) {
                    var newKey = 'kw_' + key;
                    var values = '';

                    keywordsObj[key].forEach(function (val) {
                        values += val + ',';
                    });
                    values = values.slice(0, -1);

                    queryObj[newKey] = values;
                });
        }

        /* Check for a "optData" argument passed to __generateRequestObj();
         * Flattens any nexted keyword data, using a utility function.
         * Appends the results as top-level keys on the "returnObj"
         */
        if (Utilities.isObject(optData)) {
            if (!Utilities.isEmpty(optData.keyValues.user)) {
                var userKeywords = optData.keyValues.user;
                var flatUserKws = flattenObject(userKeywords);

                Object.keys(flatUserKws)
                    .forEach(function (key) {
                        var newUserKwKey = 'kw_user_' + key;
                        queryObj[newUserKwKey] = flatUserKws[key];
                    });
            }

            if (!Utilities.isEmpty(optData.keyValues.site)) {
                var siteKeywords = optData.keyValues.site;
                var flatSiteKws = flattenObject(siteKeywords);

                Object.keys(flatSiteKws)
                    .forEach(function (key) {
                        var newSiteKwKey = 'kw_site_' + key;
                        queryObj[newSiteKwKey] = flatSiteKws[key];
                    });
            }
        }

        var referrer = Browser.getPageUrl();
        if (referrer) {
            queryObj.referrer = referrer;
        }

        /* ------- Put GDPR consent code here if you are implementing GDPR ---------- */
        if (ComplianceService.isPrivacyEnabled()) {
            var gdprStatus = ComplianceService.gdpr.getConsent();
            queryObj.gdpr = gdprStatus.applies ? 1 : 0;
            // eslint-disable-next-line camelcase
            queryObj.gdpr_consent = gdprStatus.consentString;
        }

        /* --------------------- Final bid request object --------------------------- */
        return {
            url: __baseUrl,
            data: queryObj,
            callbackId: callbackId
        };
    }

    /* This function retrieves the id sent along with the request, and stores the
     * full response object keyed by the "callback_uid".
     */
    function adResponseCallback(adResponseData) {
        __baseClass._adResponseStore[adResponseData.callback_uid] = adResponseData;
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

        /* Prepare the info to send to header stats */
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
            if ((adResult.hasOwnProperty('cpm') && adResult.cpm > 0) || adResult.deal_id) {
                bidReceived = true;
                var bidPrice = adResult.cpm;
                var bidSize = [Number(adResult.width), Number(adResult.height)];
                var bidDealId = adResult.deal_id || '';
                var bidCreative = '<iframe src="' + adResult.ad
                    + '" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" topmargin="0" leftmargin="0"'
                    + ' allowtransparency="true" width="' + adResult.width
                    + '" height="' + adResult.height + '"></iframe>';

                if (typeof bidPrice === 'number') {
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
                    returnParcel.targeting[__baseClass._configs.targetingKeys.pm] = [sizeKey + '_' + bidDealId];
                }

                if (targetingCpm !== '') {
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
                    price: targetingCpm,
                    dealId: bidDealId,
                    timeOfExpiry: __profile.features.demandExpiry.enabled ? __profile.features.demandExpiry.value
                        + System.now() : 0
                });

                //? if(FEATURES.INTERNAL_RENDER) {
                returnParcel.targeting.pubKitAdId = pubKitAdId;
                //? }
            }
        }

        if (!bidReceived) {
            //? if (DEBUG) {
            Scribe.info(__profile.partnerId + ' returned no demand for placement: '
                + returnParcel.xSlotRef.placementId);
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
        ComplianceService = SpaceCamp.services.ComplianceService;

        __profile = {
            partnerId: 'GmsmHtb',
            namespace: 'GmsmHtb',
            statsId: 'GMSM',
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
            targetingKeys: {
                id: 'ix_gmsm_id',
                om: 'ix_gmsm_om',
                pm: 'ix_gmsm_dealid'
            },
            bidUnitInCents: 0.01,
            lineItemType: Constants.LineItemTypes.ID_AND_SIZE,
            callbackType: Partner.CallbackTypes.ID,
            architecture: Partner.Architectures.MRA,
            requestType: Partner.RequestTypes.ANY
        };

        /* --------------------------------------------------------------------------------------- */

        //? if (DEBUG) {
        var PartnerSpecificValidator = GmsmValidator;

        var results = ConfigValidators.partnerBaseConfig(configs) || PartnerSpecificValidator(configs);

        if (results) {
            throw Whoopsie('INVALID_CONFIG', results);
        }
        //? }

        __baseUrl = 'https://secure.adnxs.com/jpt';
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
        __type__: 'GmsmHtb',
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
        adResponseCallback: adResponseCallback
        //? }
    };

    return Classify.derive(__baseClass, derivedClass);
}

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = GmsmHtb;
