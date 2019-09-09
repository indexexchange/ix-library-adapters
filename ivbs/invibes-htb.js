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
var PartnerSpecificValidator = require('invibes-htb-validator.js');
var Scribe = require('scribe.js');
var Whoopsie = require('whoopsie.js');

//? }
var CONSTANTS = {
    BIDDER_CODE: 'invibes',
    BID_ENDPOINT: '//localhost/KWEB.Website/bid/videoadcontent',
    SYNC_ENDPOINT: '//k.r66net.com/GetUserSync',

    TIME_TO_LIVE: 300,
    DEFAULT_CURRENCY: 'EUR',
    PREBID_VERSION: 3,
    METHOD: 'GET',
    INVIBES_VENDOR_ID: 436
};

////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
function renderCreative(bidModel) {
    return '<html>'
    + '<head><script type=\'text/javascript\'>inDapIF=true;'
    + '</script></head><body style=\'margin : 0; padding: 0;\'>'
    + 'creativeHtml </body> </html>'
        .replace('creativeHtml', bidModel.CreativeHtml);
}

function generateRandomId() {
    return Math.round(Math.random() * 1e12)
        .toString(36)
        .substring(0, 10);
}

var cookieDomain;

function getCappedCampaignsAsString() {
    var key = 'ivvcap';

    function loadData() {
        try {
            return JSON.parse(localStorage.getItem(key)) || {};
        } catch (e) {
            return {};
        }
    }

    function saveData(data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    function clearExpired() {
        var now = new Date()
            .getTime();
        var data = loadData();
        var dirty = false;
        Object.keys(data)
            .forEach(function (k) {
                var exp = data[k][1];
                if (exp <= now) {
                    delete data[k];
                    dirty = true;
                }
            });
        if (dirty) {
            saveData(data);
        }
    }

    function getCappedCampaigns() {
        clearExpired();
        var data = loadData();

        return Object.keys(data)
            .filter(function (k) {
                return data.hasOwnProperty(k);
            })
            .sort()
            .map(function (k) {
                return [k, data[k][0]];
            });
    }

    return getCappedCampaigns()
        .map(function (record) {
            return record.join('=');
        })
        .join(',');
}

// eslint-disable-next-line consistent-return
function getCookie(cName) {
    var i;
    var x;
    var y;
    var cookies = document.cookie.split(';');
    for (i = 0; i < cookies.length; i++) {
        x = cookies[i].substr(0, cookies[i].indexOf('='));
        y = cookies[i].substr(cookies[i].indexOf('=') + 1);
        x = x.replace(/^\s+|\s+$/g, '');
        if (x === cName) {
            return unescape(y);
        }
    }
}

var keywords = (function () {
    var cap = 300;
    var headTag = document.getElementsByTagName('head')[0];
    var metaTag = headTag ? headTag.getElementsByTagName('meta') : [];

    // eslint-disable-next-line no-shadow
    function parse(str, cap) {
        var parsedStr = str.replace(/[<>~|\\"`!@#$%^&*()=+?]/g, '');

        // eslint-disable-next-line no-shadow
        function onlyUnique(value, index, self) {
            return value !== '' && self.indexOf(value) === index;
        }

        var words = parsedStr.split(/[\s,;.:]+/);
        var uniqueWords = words.filter(onlyUnique);
        parsedStr = '';

        for (var i = 0; i < uniqueWords.length; i++) {
            parsedStr += uniqueWords[i];
            if (parsedStr.length >= cap) {
                return parsedStr;
            }

            if (i < uniqueWords.length - 1) {
                parsedStr += ',';
            }
        }

        return parsedStr;
    }

    // eslint-disable-next-line no-shadow
    function gt(cap, prefix) {
        cap = cap || 300;
        prefix = prefix || '';
        // eslint-disable-next-line
        var title = document.title || headTag ? headTag.getElementsByTagName('title')[0] ? headTag.getElementsByTagName('title')[0].innerHTML : '' : '';

        return parse(prefix + ',' + title, cap);
    }

    // eslint-disable-next-line no-shadow
    function gmeta(metaName, cap, prefix) {
        metaName = metaName || 'keywords';
        cap = cap || 100;
        prefix = prefix || '';
        var fallbackKw = prefix;

        for (var i = 0; i < metaTag.length; i++) {
            if (metaTag[i].name && metaTag[i].name.toLowerCase() === metaName.toLowerCase()) {
                // eslint-disable-next-line no-shadow
                var kw = prefix + ',' + metaTag[i].content || '';

                return parse(kw, cap);
            } else if (metaTag[i].name && metaTag[i].name.toLowerCase()
                .indexOf(metaName.toLowerCase()) > -1) {
                fallbackKw = prefix + ',' + metaTag[i].content || '';
            }
        }

        return parse(fallbackKw, cap);
    }

    var kw = gmeta('keywords', cap);
    if (!kw || kw.length < cap - 8) {
        kw = gmeta('description', cap, kw);
        if (!kw || kw.length < cap - 8) {
            kw = gt(cap, kw);
        }
    }

    return kw;
})();

function getBiggerSize(array) {
    var result = [0, 0];
    for (var i = 0; i < array.length; i++) {
        if (array[i][0] * array[i][1] > result[0] * result[1]) {
            result = array[i];
        }
    }

    return result;
}

/**
 * Partner module template
 *
 * @class
 */
function InvibesHtb(configs) {
    // Endpoint w/ AJAX only
    if (!Network.isXhrSupported()) {
        // ? if (DEBUG) {
        Scribe.warn('Partner Invibes requires AJAX support. Aborting instantiation.');
        // ? }

        return null;
    }

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
     * Generates the request URL and query data to the endpoint for the xSlots
     * in the given returnParcels.
     *
     * @param  {object[]} returnParcels
     *
     * @return {object}
     */
    function getTopMostWindow() {
        var res = window;

        try {
            while (top !== res) {
                if (res.parent.location.href.length) {
                    res = res.parent;
                }
            }
        } catch (e) { }

        return res;
    }

    var topWin = getTopMostWindow();
    // eslint-disable-next-line no-multi-assign
    var invibes = Browser.topWindow.invibes = Browser.topWindow.invibes || {};

    // eslint-disable-next-line consistent-return
    function detectTopmostCookieDomain() {
        var testCookie = invibes.Uid.generate();
        var hostParts = location.hostname.split('.');
        if (hostParts.length === 1) {
            return location.hostname;
        }

        for (var i = hostParts.length - 1; i >= 0; i--) {
            var domain = '.' + hostParts.slice(i)
                .join('.');
            invibes.setCookie(testCookie, testCookie, 1, domain);
            var val = invibes.getCookie(testCookie);
            if (val === testCookie) {
                invibes.setCookie(testCookie, testCookie, -1, domain);

                return domain;
            }
        }
    }

    invibes.Uid = {
        generate: function () {
            var maxRand = parseInt('zzzzzz', 36);
            function mkRand() {
                return Math.floor(Math.random() * maxRand)
                    .toString(36);
            }
            var rand1 = mkRand();
            var rand2 = mkRand();

            return rand1 + rand2;
        }
    };

    function __generateRequestObj(returnParcels) {
        var baseUrl = CONSTANTS.BID_ENDPOINT;
        var bidderRequest = returnParcels || {};
        var _placementIds = [];

        var _ivAuctionStart = bidderRequest.auctionStart || Date.now();

        returnParcels.forEach(function (parcel) {
            bidderRequest.auctionStart = new Date()
                .getTime();
            parcel.xSlotRef.placementIds.forEach(function (placementId) {
                _placementIds.push(placementId);
            });
        });

        function getDocumentLocation() {
            return topWin.location.href.substring(0, 300)
                .split(/[?#]/)[0];
        }
        invibes.visitId = invibes.visitId || generateRandomId();
        cookieDomain = detectTopmostCookieDomain();
        invibes.noCookies = invibes.noCookies || getCookie('ivNoCookie');
        invibes.optIn = invibes.optIn || getCookie('ivOptIn');

        var data = {
            location: getDocumentLocation(topWin),
            videoAdHtmlId: 1,

            // GenerateRandomId(),
            showFallback: false,
            ivbsCampIdsLocal: getCookie('IvbsCampIdsLocal'),

            // CurrentQueryStringParams['advs'] === '0',

            bidParamsJson: JSON.stringify({
                placementIds: _placementIds,
                auctionStartTime: _ivAuctionStart,
                bidVersion: CONSTANTS.PREBID_VERSION
            }),

            capCounts: getCappedCampaignsAsString(),
            BvId: 101632,
            vId: invibes.visitId,

            width: topWin.innerWidth,
            height: topWin.innerHeight,

            noc: !cookieDomain,
            oi: invibes.optIn,
            kw: keywords
        };

        return {
            method: CONSTANTS.METHOD,
            url: baseUrl,
            data: data,
            bidRequests: returnParcels,
            contentType: 'application/json'
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
        __baseClass._adResponseStore[Partner.CallbackTypes.CALLBACK_NAME] = adResponse;
    }

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
        // eslint-disable-next-line no-multi-assign
        invibes = Browser.topWindow.invibes = Browser.topWindow.invibes || {};
        var bids = [];
        if (returnParcels[0].htSlot.getSizes() === null || returnParcels.length === 0) {
            Scribe.Info('Invibes Adapter - No bids have been requested');

            return [];
        }

        if (!adResponse) {
            Scribe.Info('Invibes Adapter - Bid response is empty');

            return [];
        }
        adResponse.videoAdContentResult.Ads.forEach(function (uniqueAd) {
            bids.push(uniqueAd);
        });

        var responseObj = adResponse.videoAdContentResult || adResponse;
        var bidModel = responseObj.BidModel;

        if (typeof bidModel !== 'object') {
            Scribe.Info('Invibes Adapter - Bidding is not configured');

            return [];
        }

        if ((typeof invibes.bidResponse === 'object') && (adResponse.videoAdContentResult.invibes === null)) {
            Scribe.Info('Invibes Adapter - Bid response received. Invibes responds to one bid request per user visit');

            return [];
        }

        if (!Array.isArray(bids) || bids.length < 1) {
            if (responseObj.AdReason !== null) {
                Scribe.Info('Invibes Adapter - ' + responseObj.AdReason);
            }
            Scribe.Info('Invibes Adapter - No ads available');

            return [];
        }

        /* --------------------------------------------------------------------------------- */

        for (var j = 0; j < returnParcels.length; j++) {
            var curReturnParcel = returnParcels[j];

            var headerStatsInfo = {};
            var htSlotId = curReturnParcel.htSlot.getId();
            headerStatsInfo[htSlotId] = {};
            headerStatsInfo[htSlotId][curReturnParcel.requestId] = [curReturnParcel.xSlotName];

            var ad = bids[0];

            bidModel = adResponse.videoAdContentResult.BidModel;
            invibes.bidResponse = adResponse.videoAdContentResult;

            /* No matching bid found so its a pass */
            if (!ad) {
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
            var bidPrice = ad.BidPrice;

            /* The size of the given slot */
            // Var bidSize = returnParcels[0].htSlot.getSizes();
            var sizes = getBiggerSize(returnParcels[j].htSlot.getSizes());
            var bidSize = [bidModel.width || sizes[0], bidModel.height || sizes[1]];

            /* The creative/adm for the given slot that will be rendered if is the winner.
             * Please make sure the URL is decoded and ready to be document.written.
             */
            var bidCreative = renderCreative(bidModel);

            /* The dealId if applicable for this slot. */
            var bidDealId = returnParcels[0].requestId;

            /* Explicitly pass */
            var bidIsPass = bidPrice <= 0;

            /* OPTIONAL: tracking pixel url to be fired AFTER rendering a winning creative.
            * If firing a tracking pixel is not required or the pixel url is part of the adm,
            * leave empty;
            */
            var pixelUrl = '';

            /* --------------------------------------------------------------------------------------- */

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
            partnerId: 'InvibesHtb',
            namespace: 'InvibesHtb',
            statsId: 'IVBS',
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
                id: 'ix_ivbs_id',
                om: 'ix_ivbs_cpm',
                pm: 'ix_ivbs_cpm',
                pmid: 'ix_ivbs_dealid'
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
        __type__: 'InvibesHtb',
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

module.exports = InvibesHtb;
