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

var ComplianceService;
var RenderService;

//? if (DEBUG) {
var ConfigValidators = require('config-validators.js');
var PartnerSpecificValidator = require('martin-htb-validator.js');
var Scribe = require('scribe.js');
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
                country: _parseSlotParam('lon', __globalConfigs.country),
                region: _parseSlotParam('lon', __globalConfigs.region),
                zip: _parseSlotParam('lon', __globalConfigs.zip)
            }
        };
    }

    function __populateUserInfo(rp, idData) {
        var userObj = {
            geo: {
                lat: _parseSlotParam('lat', __globalConfigs.lat),
                lon: _parseSlotParam('lon', __globalConfigs.lon),
                country: _parseSlotParam('lon', __globalConfigs.country),
                region: _parseSlotParam('lon', __globalConfigs.region),
                zip: _parseSlotParam('lon', __globalConfigs.zip)
            }
        };

        if (idData && idData.hasOwnProperty('AdserverOrgIp') && idData.AdserverOrgIp.hasOwnProperty('data')) {
            userObj.eids = [idData.AdserverOrgIp.data];
        }

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
        
        var baseUrl = Browser.getProtocol() + '//east.martin.ai/bid/index';
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

        var privacyEnabled = ComplianceService.isPrivacyEnabled();
        if (privacyEnabled) {
            var gdprStatus = ComplianceService.gdpr.getConsent();
            requestBody.user.ext = {
                consent: gdprStatus.consentString
            };
            requestBody.regs = {
                ext: {
                    gdpr: gdprStatus.applies ? 1 : 0
                }
            };
        }

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

        // Ad response is 0 or 1 seat bids
        var returnParcel = returnParcels[0];
        var headerStatsInfo = {};
        var htSlotId = returnParcel.htSlot.getId();
        headerStatsInfo[htSlotId] = {};
        headerStatsInfo[htSlotId][returnParcel.requestId] = [returnParcel.xSlotName];

        if (!adResponse
            || !adResponse.hasOwnProperty('seatbid')
            || !Array.isArray(adResponse.seatbid)
            || adResponse.seatbid.length === 0) {
            
            returnParcel.pass = true;

            if (__profile.enabledAnalytics.requestTime) {
                __baseClass._emitStatsEvent(sessionId, 'hs_slot_pass', headerStatsInfo);
            }

            return;
        }

        // Process bid
        var bid = adResponse.seatbid[0].bid[0];
        if (!bid || bid.price === 0) {
            returnParcel.pass = true;

            if (__profile.enabledAnalytics.requestTime) {
                __baseClass._emitStatsEvent(sessionId, 'hs_slot_pass', headerStatsInfo);
            }

            return;
        }

        if (__profile.enabledAnalytics.requestTime) {
            __baseClass._emitStatsEvent(sessionId, 'hs_slot_bid', headerStatsInfo);
        }

        // Things that should be unconditionally added to the return parcel
        returnParcel.size = [Number(bid.width), Number(bid.height)];
        returnParcel.targeting = {};
        returnParcel.targetingType = 'slot';

        // Things that may be conditionally added to the return parcel
        var bidDealId = bid.dealid;
        var targetingCpm = '';

        //? if (FEATURES.GPT_LINE_ITEMS) {
        targetingCpm = __baseClass._bidTransformers.targeting.apply(bid.price);
        var sizeKey = Size.arrayToString([Number(bid.w), Number(bid.h)]);

        if (bidDealId) {
            returnParcel.targeting[__baseClass._configs.targetingKeys.pmid] = [sizeKey + '_' + bidDealId];
            returnParcel.targeting[__baseClass._configs.targetingKeys.pm] = [sizeKey + '_' + targetingCpm];
        } else {
            returnParcel.targeting[__baseClass._configs.targetingKeys.om] = [sizeKey + '_' + targetingCpm];
        }
        returnParcel.targeting[__baseClass._configs.targetingKeys.id] = [returnParcel.requestId];
        //? }

        //? if (FEATURES.RETURN_CREATIVE) {
        returnParcel.adm = bid.adm;
        //? }

        //? if (FEATURES.RETURN_PRICE) {
        returnParcel.price = Number(__baseClass._bidTransformers.price.apply(bid.price));
        //? }

        var expiry = 0;
        if (__profile.features.demandExpiry.enabled) {
            expiry = __profile.features.demandExpiry.value + System.now();
        }

        var pubKitAdId = RenderService.registerAd({
            sessionId: sessionId,
            partnerId: __profile.partnerId,
            adm: bid.adm,
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

        __globalConfigs = {
          pubId: configs.publisherId,

          /* Martin specific values. required in the api request */
          lat: configs.lat || undef,
          lon: configs.lon || undef,
          country: configs.country || undef,
          region: configs.region || undef,
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
