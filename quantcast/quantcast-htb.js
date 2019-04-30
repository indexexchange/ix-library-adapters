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

var ComplianceService;
var RenderService;

//? if (DEBUG) {
var ConfigValidators = require('config-validators.js');
var PartnerSpecificValidator = require('quantcast-htb-validator.js');
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
function QuantcastHtb(configs) {
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

    /* Helpers
     * ---------------------------------- */

    function makeSizesFromHtSlot(sizes) {
        var res = [];
        for (var i = 0; i < sizes.length; i++) {
            res.push({
                width: sizes[i][0],
                height: sizes[i][1]
            });
        }

        return res;
    }

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
        var parcel = returnParcels[0];
        var queryObj = {
            publisherId: configs.publisherId,
            requestId: parcel.requestId,
            imp: [
                {
                    banner: {
                        battr: parcel.xSlotRef.battr || configs.battr || [],
                        sizes: parcel.xSlotRef.sizes || makeSizesFromHtSlot(parcel.htSlot.getSizes()),
                        pos: parcel.xSlotRef.adPos || configs.adPos || 0
                    },
                    placementCode: parcel.htSlot.getId(),
                    bidFloor: parcel.xSlotRef.bidFloor || configs.bidFloor || 0
                }
            ]
        };

        /* Change this to your bidder endpoint. */
        var port = Browser.getProtocol() === 'http:' ? 8080 : 8443;
        var baseUrl = Browser.getProtocol() + '//qcx.quantserve.com:' + port + '/qchb';

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
        var gdprStatus = ComplianceService.gdpr.getConsent();
        var privacyEnabled = ComplianceService.isPrivacyEnabled();

        queryObj.gdprSignal = Number(privacyEnabled && gdprStatus.applies);
        if (queryObj.gdprSignal === 1) {
            queryObj.gdprConsent = gdprStatus.consentString;
        }

        /* ---------------- Craft bid request using the above returnParcels --------- */

        /* ------- Put GDPR consent code here if you are implementing GDPR ---------- */

        /* -------------------------------------------------------------------------- */

        return {
            url: baseUrl,
            data: queryObj,
            networkParamOverrides: {
                method: 'POST'
            }
        };
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

        var parcel = returnParcels[0];
        var bid = adResponse.bids[0];

        var headerStatsInfo = {};
        var htSlotId = parcel.htSlot.getId();
        headerStatsInfo[htSlotId] = {};
        headerStatsInfo[htSlotId][parcel.requestId] = [parcel.xSlotName];

        if (adResponse.bidderCode !== 'quantcast'
            || htSlotId !== bid.placementCode
            || bid.statusCode !== 1) {
            if (__profile.enabledAnalytics.requestTime) {
                __baseClass._emitStatsEvent(sessionId, 'hs_slot_pass', headerStatsInfo);
            }
            parcel.pass = true;
        } else {
            if (__profile.enabledAnalytics.requestTime) {
                __baseClass._emitStatsEvent(sessionId, 'hs_slot_bid', headerStatsInfo);
            }

            parcel.pass = false;
            parcel.size = [Number(bid.width), Number(bid.height)];
            parcel.targetingType = 'slot';
            parcel.targeting = {};
            var targetingCpm = __baseClass._bidTransformers.targeting.apply(bid.cpm);

            //? if (FEATURES.GPT_LINE_ITEMS) {
            var sizeKey = Size.arrayToString(parcel.size);
            parcel.targeting[__baseClass._configs.targetingKeys.om] = [sizeKey + '_' + targetingCpm];
            parcel.targeting[__baseClass._configs.targetingKeys.id] = [parcel.requestId];
            //?

            //? if (FEATURES.RETURN_CREATIVE) {
            parcel.adm = bid.ad;
            //?

            //? if (FEATURES.RETURN_PRICE) {
            parcel.price = Number(__baseClass._bidTransformers.price.apply(bid.cpm));
            //?

            var expiryTime = __profile.features.demandExpiry.value + System.now();
            var pubKitAdId = RenderService.registerAd({
                sessionId: sessionId,
                partnerId: __profile.partnerId,
                adm: bid.ad,
                requestId: parcel.requestId,
                size: parcel.size,
                price: targetingCpm,
                dealId: '',
                timeOfExpiry: __profile.features.demandExpiry.enabled ? expiryTime : 0
            });

            //? if (FEATURES.INTERNAL_RENDER) {
            parcel.targeting.pubKitAdId = pubKitAdId;
            //? }
        }
    }

    /* =====================================
     * Constructors
     * ---------------------------------- */

    (function __constructor() {
        ComplianceService = SpaceCamp.services.ComplianceService;
        RenderService = SpaceCamp.services.RenderService;

        /* =============================================================================
         * STEP 1  | Partner Configuration
         * -----------------------------------------------------------------------------
         *
         * Please fill out the below partner profile according to the steps in the README doc.
         */

        /* ---------- Please fill out this partner profile according to your module ------------ */
        __profile = {
            partnerId: 'QuantcastHtb',
            namespace: 'QuantcastHtb',
            statsId: 'QUA',
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
                id: 'ix_qua_id',
                om: 'ix_qua_cpm'
            },

            /* The bid price unit (in cents) the endpoint returns, please refer to the readme for details */
            bidUnitInCents: 100,
            lineItemType: Constants.LineItemTypes.ID_AND_SIZE,
            callbackType: Partner.CallbackTypes.NONE,
            architecture: Partner.Architectures.MRA,
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
        __type__: 'QuantcastHtb',
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
        generateRequestObj: __generateRequestObj
        //? }
    };

    return Classify.derive(__baseClass, derivedClass);
}

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = QuantcastHtb;
