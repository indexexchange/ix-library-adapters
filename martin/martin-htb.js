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

// Everything related to ComplianceService is for gdpr.
// Disabled for now, but we may implement it at some point.
// eslint-disable-next-line capitalized-comments
// var ComplianceService;
var RenderService;

//? if (DEBUG) {
var ConfigValidators = require('config-validators.js');
var PartnerSpecificValidator = require('martin-htb-validator.js');
var Whoopsie = require('whoopsie.js');
//? }

// Declare a variable and don't define it to get around the linter undefined rule
var undef;

////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * Partner module template
 *
 * @class
 */
function MartinHtb(configs) {
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
     * Profile for this partner.
     *
     * @private {object}
     */
    var __globalConfigs;

    /* =====================================
     * Functions
     * ---------------------------------- */

    /* Utilities
     * ---------------------------------- */

    function _parseSlotParam(paramName, paramValue) {
        if (Utilities.isString(paramValue)) {
            switch (paramName) {
                case 'pmzoneid':

                    return paramValue.split(',')
                        .slice(0, 50)
                        .map(function (id) {
                            return id.trim();
                        })
                        .join();
                case 'lat':
                case 'lon':

                    return parseFloat(paramValue) || undef;

                default:

                    return paramValue;
            }
        } else {
            return undef;
        }
    }

    function __populateImprObject(returnParcels) {
        var retArr = [];
        var impObj = {};
        var sizes = [];
        var sizeIndex = 0;

        returnParcels.forEach(function (rp) {
            sizeIndex = 0;
            impObj = {
                id: rp.htSlot.getId(),
                secure: 1
            };

            // Add banner sizes
            sizes = rp.xSlotRef.sizes;
            impObj.banner = {};
            impObj.banner.format = [];
            sizes.forEach(function (size) {
                if (size.length === 2) {
                    if (sizeIndex === 0) {
                        impObj.banner.w = size[0];
                        impObj.banner.h = size[1];
                        sizeIndex++;
                    } else {
                        impObj.banner.format.push(
                            {
                                w: size[0],
                                h: size[1]
                            }
                        );
                    }
                }
            });
            if (impObj.banner.format.length === 0) {
                delete impObj.banner.format;
            }

            retArr.push(impObj);
        });

        return retArr;
    }

    function __populateSiteObject(publisherId) {
        var retObj = {
            page: Browser.topWindow.location.href,
            ref: Browser.topWindow.document.referrer,
            publisher: {
                id: publisherId,
                domain: Browser.topWindow.location.hostname
            },
            domain: Browser.topWindow.location.hostname
        };

        return retObj;
    }

    function __populateDeviceInfo() {
        var dnt = Browser.topWindow.navigator.doNotTrack === 'yes'
            || Browser.topWindow.navigator.doNotTrack === '1'
            || Browser.topWindow.navigator.msDoNotTrack === '1' ? 1 : 0;

        return {
            ua: Browser.getUserAgent(),
            js: 1,
            dnt: dnt,
            h: Browser.getScreenHeight(),
            w: Browser.getScreenWidth(),
            language: Browser.getLanguage(),
            geo: {
                lat: _parseSlotParam('lat', __globalConfigs.lat),
                lon: _parseSlotParam('lon', __globalConfigs.lon),
                country: _parseSlotParam('country', __globalConfigs.country),
                region: _parseSlotParam('region', __globalConfigs.region),
                metro: _parseSlotParam('metro', __globalConfigs.metro),
                zip: _parseSlotParam('zip', __globalConfigs.zip)
            }
        };
    }

    function __populateUserInfo() {
        var userObj = {
        };

        return userObj;
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

        var baseUrl
          = Browser.getProtocol()
          + '//east.mrtnsvr.com/bid/indexhtb?cachebuster='
          + System.generateUniqueId();
        var idData = returnParcels[0] && returnParcels[0].identityData;
        var requestBody = {
            id: String(new Date()
                .getTime()),
            cur: ['USD'],
            imp: __populateImprObject(returnParcels),
            site: __populateSiteObject(__globalConfigs.pubId),
            device: __populateDeviceInfo(),
            user: __populateUserInfo(returnParcels[0], idData)
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

        // Var privacyEnabled = ComplianceService.isPrivacyEnabled();
        // If (privacyEnabled) {
        //     Var gdprStatus = ComplianceService.gdpr.getConsent();
        //     RequestBody.user.ext = {
        //         Consent: gdprStatus.consentString
        //     };
        //     RequestBody.regs = {
        //         Ext: {
        //             Gdpr: gdprStatus.applies ? 1 : 0
        //         }
        //     };
        // }

        return {
            url: baseUrl,
            data: requestBody,
            networkParamOverrides: {
                method: 'POST',
                contentType: 'application/json'
            }
        };
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
     * Returns the bid that matches the returnParcel, or null if none match
     * @param {object} returnParcel
     * @param {object[]} bids
     * @return {object|null}
     */
    function __getMatchingBid(returnParcel, bids) {
        // Check parcel against each bid
        for (var i = 0; i < bids.length; i++) {
            // Check parcel against each bid's sizes
            for (var j = 0; j < returnParcel.xSlotRef.sizes.length; j++) {
                var sizes = returnParcel.xSlotRef.sizes[j];
                if (bids[i].impid === returnParcel.htSlot.getId()) {
                    if (parseInt(bids[i].w, 10) === parseInt(sizes[0], 10)
                        && parseInt(bids[i].h, 10) === parseInt(sizes[1], 10)) {
                        // Return upon finding a match
                        return bids[i];
                    }
                }
            }
        }

        return null;
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
     * generateRequestObj to signal which slots need demand. In this function, the demand needs to be
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

        // Extract bids
        var bids = [];
        if (
            adResponse
            && adResponse.seatbid
            && Utilities.isArray(adResponse.seatbid)
            && adResponse.seatbid.length > 0
        ) {
            for (var i = 0; i < adResponse.seatbid.length; i++) {
                bids = bids.concat(adResponse.seatbid[i].bid);
            }
        }

        // Process each return parcel
        for (var j = 0; j < returnParcels.length; j++) {
            var returnParcel = returnParcels[j];
            var headerStatsInfo = {};
            var htSlotId = returnParcel.htSlot.getId();
            headerStatsInfo[htSlotId] = {};
            headerStatsInfo[htSlotId][returnParcel.requestId] = [returnParcel.xSlotName];

            var matchingBid = __getMatchingBid(returnParcel, bids);
            if (!bids || bids.length === 0 || !matchingBid) {
                if (__profile.enabledAnalytics.requestTime) {
                    __baseClass._emitStatsEvent(
                        sessionId,
                        'hs_slot_pass',
                        headerStatsInfo
                    );
                }
                returnParcel.pass = true;

                continue;
            }

            if (__profile.enabledAnalytics.requestTime) {
                __baseClass._emitStatsEvent(
                    sessionId,
                    'hs_slot_bid',
                    headerStatsInfo
                );
            }

            // Things that should be unconditionally added to the return parcel
            returnParcel.size = [Number(matchingBid.width), Number(matchingBid.height)];
            returnParcel.targeting = {};
            returnParcel.targetingType = 'slot';

            // Things that may be conditionally added to the return parcel
            var bidDealId = matchingBid.dealid;
            var targetingCpm = '';

            //? if (FEATURES.GPT_LINE_ITEMS) {
            targetingCpm = __baseClass._bidTransformers.targeting.apply(
                matchingBid.price
            );
            var sizeKey = Size.arrayToString([Number(matchingBid.w), Number(matchingBid.h)]);

            if (bidDealId) {
                returnParcel.targeting[
                    __baseClass._configs.targetingKeys.pmid
                ] = [sizeKey + '_' + bidDealId];
                returnParcel.targeting[
                    __baseClass._configs.targetingKeys.pm
                ] = [sizeKey + '_' + targetingCpm];
            } else {
                returnParcel.targeting[
                    __baseClass._configs.targetingKeys.om
                ] = [sizeKey + '_' + targetingCpm];
            }
            returnParcel.targeting[
                __baseClass._configs.targetingKeys.id
            ] = [returnParcel.requestId];
            //? }

            //? if (FEATURES.RETURN_CREATIVE) {
            returnParcel.adm = matchingBid.adm;
            //? }

            //? if (FEATURES.RETURN_PRICE) {
            returnParcel.price = Number(
                __baseClass._bidTransformers.price.apply(matchingBid.price)
            );
            //? }

            var expiry = 0;
            if (__profile.features.demandExpiry.enabled) {
                expiry
              = __profile.features.demandExpiry.value + System.now();
            }

            var pubKitAdId = RenderService.registerAd({
                sessionId: sessionId,
                partnerId: __profile.partnerId,
                adm: matchingBid.adm,
                requestId: returnParcel.requestId,
                size: returnParcel.size,
                price: targetingCpm,
                dealId: bidDealId || null,
                timeOfExpiry: expiry,
                auxFn: __renderPixel
            });

            //? if (FEATURES.INTERNAL_RENDER) {
            returnParcel.targeting.pubKitAdId = pubKitAdId;
            //? }
        }
    }

    /* =====================================
     * Constructors
     * ---------------------------------- */

    (function __constructor() {
        // ComplianceService = SpaceCamp.services.ComplianceService;
        RenderService = SpaceCamp.services.RenderService;

        /* =============================================================================
         * STEP 1  | Partner Configuration
         * -----------------------------------------------------------------------------
         *
         * Please fill out the below partner profile according to the steps in the README doc.
         */

        /* ---------- Please fill out this partner profile according to your module ------------ */
        __profile = {
            partnerId: 'MartinHtb',
            namespace: 'MartinHtb',
            statsId: 'MAR',
            version: '1.0.0',
            targetingType: 'slot',
            enabledAnalytics: {
                // You're not actually allowed to set this to false, it will fail the headerStats tests if you do
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
                id: 'ix_mar_id',
                om: 'ix_mar_cpm',
                pm: 'ix_mar_cpm',
                pmid: 'ix_mar_dealid'
            },

            /* The bid price unit (in cents) the endpoint returns, please refer to the readme for details */
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

        __globalConfigs = {
            pubId: configs.publisherId,

            /* Martin specific values. required in the api request */
            lat: configs.lat || undef,
            lon: configs.lon || undef,
            country: configs.country || undef,
            region: configs.region || undef,
            metro: configs.metro || undef,
            zip: configs.zip || undef,
            profile: configs.profile || undef,
            version: configs.version || undef
        };

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
        __type__: 'MartinHtb',
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

module.exports = MartinHtb;
