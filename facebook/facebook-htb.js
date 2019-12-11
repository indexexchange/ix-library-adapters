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

//? if (DEBUG) {
var ConfigValidators = require('config-validators.js');
var PartnerSpecificValidator = require('facebook-htb-validator.js');
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
function FacebookHtb(configs) {
    var adapterVersion = '2.2.0';
    var platformId = '2061185240785516';

    /* Facebook endpoint only works with AJAX */
    if (!Network.isXhrSupported()) {
        //? if (DEBUG) {
        Scribe.warn('Partner FacebookHtb requires AJAX support. Aborting instantiation.');
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
     * Base URL for the bidding end-point.
     *
     * @private {object}
     */
    var __baseUrl;

    /**
     * Recorded mapping of appId to xSlot name/size for checking dissimilarity
     *
     * @private {object}
     */
    var __appIdDict;

    /* =====================================
     * Functions
     * ---------------------------------- */

    /* Utilities
     * ---------------------------------- */

    /**
     * Returns true or false depending on whether the requested format
     * is native or not
     *
     * @param {object} parcel
     *
     * @return {boolean}
     */
    function __isNativeFormat(parcel) {
        return parcel.xSlotRef.adFormat && parcel.xSlotRef.adFormat === 'native';
    }

    /**
     * Returns true or false depending on whether the requested format
     * is either fullwidth or 300x250
     *
     * @param {object} parcel
     *
     * @return {boolean}
     */
    function __isMRectOrFullwidthFormat(parcel) {
        var isFullwidth = parcel.xSlotRef.adFormat && parcel.xSlotRef.adFormat === 'fullwidth';
        var is300x250 = parcel.xSlotRef.size[0] === 300 && parcel.xSlotRef.size[1] === 250;

        return isFullwidth || is300x250;
    }

    /**
     * Returns true or false depending on whether the requested format
     * is a banner format
     *
     * @param {object} parcel
     *
     * @return {boolean}
     */
    function __isBannerFormat(parcel) {
        var is320x50 = parcel.xSlotRef.size[0] === 320 && parcel.xSlotRef.size[1] === 50;

        return is320x50;
    }

    /**
     * Extract appId from list of placementId present in returnParcels
     * Also checks if the placementIds are unique and that the appId is
     * same for all the placementIds
     *
     * @param {object[]} returnParcels
     *
     * @return {string} appId for the given placements
     */
    function __extractAppId(returnParcels) {
        for (var i = 0; i < returnParcels.length; i++) {
            var parcel = returnParcels[i];
            var placementId = String(parcel.xSlotRef.placementId);
            var appId = String(placementId.split('_')[0]);

            if (!__appIdDict[appId]) {
                __appIdDict[appId] = 1;
            } else {
                __appIdDict[appId]++;
            }
        }

        if (Object.keys(__appIdDict).length > 1) {
            Scribe.warn('Different App IDs being used in the same request.');
        }

        // Return highest occuring AppId
        return Object
            .keys(__appIdDict)
            .reduce(function (a, b) {
                return __appIdDict[a] > __appIdDict[b] ? a : b;
            });
    }

    /**
     * Returns true or false depending on whether the domain url
     * contains "anhb_testmode" string
     *
     * @return {boolean}
     */
    function __isTestMode() {
        return Browser
        && Browser.topWindow
        && Browser.topWindow.location.href
        && Browser.topWindow.location.href.indexOf('anhb_testmode') !== -1;
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

        var auctionIdentifierId = System.generateUniqueId(25, 'ALPHANUM');
        var pageUrl = Browser.topWindow.location.href;
        var appId = __extractAppId(returnParcels);
        var userAgent = Browser.getUserAgent();
        var dnt = Browser.topWindow.navigator.doNotTrack === 'yes'
                || Browser.topWindow.navigator.doNotTrack === '1'
                || Browser.topWindow.navigator.msDoNotTrack === '1' ? 1 : 0;
        var platformVersion = SpaceCamp.version;

        /* eslint-disable camelcase */
        var queryObj = {
            id: auctionIdentifierId,
            imp: [],
            site: {
                page: pageUrl,
                publisher: {
                    id: appId
                }
            },
            device: {
                ua: userAgent,
                dnt: dnt
            },
            ext: {
                platformid: platformId,
                sdk_version: '6.0.web',
                platform_version: platformVersion,
                adapter_version: adapterVersion
            },
            at: 1,
            tmax: SpaceCamp.globalTimeout || 1000,
            test: __isTestMode() ? 1 : 0
        };

        for (var i = 0; i < returnParcels.length; i++) {
            var parcel = returnParcels[i];

            var obj = {};
            obj.id = parcel.htSlot.getId();
            obj.tagid = String(parcel.xSlotRef.placementId);

            if (__isNativeFormat(parcel)) {
                obj.native = {
                    w: -1,
                    h: -1,
                    ext: {
                        native_container: configs.nativeAssets
                    }
                };
            } else if (__isMRectOrFullwidthFormat(parcel)) {
                obj.banner = {
                    w: 300,
                    h: 250
                };
            } else if (__isBannerFormat(parcel)) {
                obj.banner = {
                    w: 320,
                    h: 50
                };
            } else {
                continue;
            }

            queryObj.imp.push(obj);
        }
        /* eslint-enable camelcase */

        /* ---------------- Craft bid request using the above returnParcels --------- */

        return {
            url: __baseUrl,
            data: queryObj,
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
            Network.ajax({
                url: decodeURIComponent(pixelUrl),
                method: 'GET',
                async: true
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
        if (adResponse
            && adResponse.seatbid
            && adResponse.seatbid.length !== 0
            && adResponse.seatbid[0].bid.length !== 0) {
            for (var m = 0; m < adResponse.seatbid.length; m++) {
                bids = bids.concat(adResponse.seatbid[m].bid);
            }
        }

        /* --------------------------------------------------------------------------------- */

        for (var j = 0; j < returnParcels.length; j++) {
            var curReturnParcel = returnParcels[j];

            var headerStatsInfo = {};
            var htSlotId = curReturnParcel.htSlot.getId();
            headerStatsInfo[htSlotId] = {};
            headerStatsInfo[htSlotId][curReturnParcel.requestId] = [curReturnParcel.xSlotName];

            var curBid;

            if (bids.length === 0) {
                if (__profile.enabledAnalytics.requestTime) {
                    __baseClass._emitStatsEvent(sessionId, 'hs_slot_pass', headerStatsInfo);
                }
                curReturnParcel.pass = true;

                continue;
            }

            for (var i = 0; i < bids.length; i++) {
                /**
                 * This section maps internal returnParcels and demand returned from the bid request.
                 * In order to match them correctly, they must be matched via some criteria. This
                 * is usually some sort of placements or inventory codes. Please replace the someCriteria
                 * key to a key that represents the placement in the configuration and in the bid responses.
                 */

                /* ----------- Fill this out to find a matching bid for the current parcel ------------- */
                if (curReturnParcel.htSlot.getId() === bids[i].impid) {
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

            /* ---------- Fill the bid variables with data from the bid response here. ------------ */

            /* Using the above variable, curBid, extract various information about the bid and assign it to
             * these local variables */

            /* The bid price for the given slot */
            var bidPrice = curBid.price;

            /* The size of the given slot */
            var bidSize = curReturnParcel.xSlotRef.size;

            /* The creative/adm for the given slot that will be rendered if is the winner.
             * Please make sure the URL is decoded and ready to be document.written.
             */
            var nativeStyle = __isNativeFormat(curReturnParcel) ? '<script type="text/javascript">'
                + '  window.onload = function() {'
                + '    if (parent) {'
                + '      var oHead = document.getElementsByTagName("head")[0];'
                + '      var arrStyleSheets = [].slice.call(parent.document.getElementsByTagName("style"));'
                + '      for (var i = 0; i < arrStyleSheets.length; i++)'
                + '        oHead.appendChild(arrStyleSheets[i].cloneNode(true));'
                + '    }'
                + '  }'
                + '</script>' : '';

            var bidCreative = '<html>'
                + '<head>' + nativeStyle + '</head>'
                + '<body>'
                + curBid.adm
                + '</body>'
                + '</html>';

            /* The dealId if applicable for this slot. */
            var bidDealId = curBid.dealid;

            /* Explicitly pass */
            var bidIsPass = bidPrice <= 0;

            /* OPTIONAL: tracking pixel url to be fired AFTER rendering a winning creative.
            * If firing a tracking pixel is not required or the pixel url is part of the adm,
            * leave empty;
            */
            var pixelUrl = '';
            if (curBid.nurl) {
                /* eslint-disable no-template-curly-in-string */
                pixelUrl = curBid.nurl.replace('${AUCTION_PRICE}', bidPrice);
                /* eslint-enable no-template-curly-in-string */
            }

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
        RenderService = SpaceCamp.services.RenderService;

        /* =============================================================================
         * STEP 1  | Partner Configuration
         * -----------------------------------------------------------------------------
         *
         * Please fill out the below partner profile according to the steps in the README doc.
         */

        /* ---------- Please fill out this partner profile according to your module ------------ */
        __profile = {
            partnerId: 'FacebookHtb',
            namespace: 'FacebookHtb',
            statsId: 'FB',
            version: adapterVersion,
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
                id: 'ix_fb_id',
                om: 'ix_fb_om'
            },

            /* The bid price unit (in cents) the endpoint returns, please refer to the readme for details */
            bidUnitInCents: 100,
            lineItemType: Constants.LineItemTypes.ID_AND_SIZE,
            callbackType: Partner.CallbackTypes.NONE,
            architecture: Partner.Architectures.FSRA,
            requestType: Partner.RequestTypes.AJAX
        };

        /* --------------------------------------------------------------------------------------- */

        //? if (DEBUG) {
        var results = ConfigValidators.partnerBaseConfig(configs) || PartnerSpecificValidator(configs);

        if (results) {
            throw Whoopsie('INVALID_CONFIG', results);
        }
        //? }

        __appIdDict = {};
        __baseUrl = 'https://an.facebook.com/placementbid.ortb/' + platformId + '/';

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
        __type__: 'FacebookHtb',
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

module.exports = FacebookHtb;
