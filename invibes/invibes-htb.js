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
var PartnerSpecificValidator = require('invibes-htb-validator.js');
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
function InvibesHtb(configs) {
    /* Invibes endpoint only works with AJAX */
    if (!Network.isXhrSupported()) {
        Scribe.warn('Invibes requires AJAX support. Aborting instantiation.');

        return null;
    }

    /* =====================================
     * Data
     * ---------------------------------- */

    /* Private
     * ---------------------------------- */
    var CONSTANTS = {
        BID_ENDPOINT: '//bid.videostep.com/Bid/VideoAdContent',
        BID_VERSION: 3
    };

    Browser.topWindow.invibes = Browser.topWindow.invibes || {};
    var invibes = Browser.topWindow.invibes;

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

    var _cookieDomain;

    /* =====================================
     * Functions
     * ---------------------------------- */
    function generateRandomId() {
        return Math.round(Math.random() * 1e12)
            .toString(36)
            .substring(0, 10);
    }

    function getDocumentLocation() {
        return Browser.topWindow.location.href
            .substring(0, 300)
            .split(/[?#]/)[0];
    }

    function parseQueryStringParams() {
        var params = {};
        try {
            params = JSON.parse(localStorage.ivbs);
        } catch (e) { }
        var re = /[\\?&]([^=]+)=([^\\?&#]+)/g;
        var m = re.exec(Browser.topWindow.location.href);
        while (m !== null) {
            if (m.index === re.lastIndex) {
                re.lastIndex++;
            }
            params[m[1].toLowerCase()] = m[2];
            m = re.exec(Browser.topWindow.location.href);
        }

        return params;
    }

    function renderCreative(bidModel) {
        return '<html><head><script type="text/javascript">inDapIF=true;</script></head>'
            + '<body style="margin : 0; padding: 0;">'
            + bidModel.CreativeHtml
            + '</body></html>';
    }

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

    function getBiggerSize(array) {
        var result = [0, 0];
        for (var i = 0; i < array.length; i++) {
            if (array[i][0] * array[i][1] > result[0] * result[1]) {
                result = array[i];
            }
        }

        return result;
    }

    /* Utilities
     * ---------------------------------- */

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

    invibes.getCookie = function (cookieName) {
        var i;
        var x;
        var y;
        var cookies = document.cookie.split(';');
        for (i = 0; i < cookies.length; i++) {
            x = cookies[i].substr(0, cookies[i].indexOf('='));
            y = cookies[i].substr(cookies[i].indexOf('=') + 1);
            x = x.replace(/^\s+|\s+$/g, '');
            if (x === cookieName) {
                return unescape(y);
            }
        }

        return null;
    };

    invibes.setCookie = function (cookieName, value, exdays, domain) {
        var whiteListed = cookieName === 'ivNoCookie' || cookieName === 'IvbsCampIdsLocal';
        if (invibes.noCookies && !whiteListed && (exdays || 0) >= 0) {
            return;
        }

        if (exdays > 365) {
            exdays = 365;
        }

        domain = domain || _cookieDomain;
        var exdate = new Date();
        var exms = exdays * 24 * 60 * 60 * 1000;
        exdate.setTime(exdate.getTime() + exms);
        var cookieValue = value + (!exdays ? '' : '; expires=' + exdate.toUTCString());
        cookieValue += ';domain=' + domain + ';path=/';
        document.cookie = cookieName + '=' + cookieValue;
    };

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

        return null;
    }

    function initDomainId(options) {
        if (invibes.dom) {
            return;
        }

        options = options || { };
        var cookiePersistence = {
            cname: 'ivbsdid',
            load: function () {
                var str = invibes.getCookie(this.cname) || '';
                try {
                    return JSON.parse(str);
                } catch (e) { }

                return null;
            },
            save: function (obj) {
                invibes.setCookie(this.cname, JSON.stringify(obj), 365);
            }
        };

        var persistence = options.persistence || cookiePersistence;
        var state;
        var minHC = 2;

        function validGradTime(innerState) {
            if (!innerState.cr) {
                return false;
            }

            var min = 151 * 10e9;
            if (innerState.cr < min) {
                return false;
            }

            var now = new Date()
                .getTime();
            var age = now - innerState.cr;
            var minAge = 24 * 60 * 60 * 1000;

            return age > minAge;
        }

        state = persistence.load() || {
            id: invibes.Uid
                .generate(),
            cr: new Date()
                .getTime(),
            hc: 1
        };

        if (state.id.match(/\./)) {
            state.id = invibes.Uid
                .generate();
        }

        function graduate() {
            if (!state.cr) {
                return;
            }

            delete state.cr;
            delete state.hc;
            persistence.save(state);
        }

        function regenerateId() {
            state.id = invibes.Uid
                .generate();
            persistence.save(state);
        }

        function setId() {
            invibes.dom = {
                get id() {
                    return !state.cr && invibes.optIn > 0 ? state.id : null;
                },
                get tempId() {
                    return invibes.optIn > 0 ? state.id : null;
                },
                graduate: graduate,
                regen: regenerateId
            };
        }

        if (state.cr && !options.noVisit) {
            if (state.hc < minHC) {
                state.hc++;
            }

            if ((state.hc >= minHC && validGradTime(state)) || options.skipGraduation) {
                graduate();
            }
        }

        persistence.save(state);
        setId();
    }

    function keywords() {
        var cap = 300;
        var headTag = document.getElementsByTagName('head')[0];
        var metaTag = headTag ? headTag.getElementsByTagName('meta') : [];

        function parse(str, innerCap) {
            var parsedStr = str.replace(/[<>~|\\"`!@#$%^&*()=+?]/g, '');

            function onlyUnique(value, index, theArray) {
                return value !== '' && theArray.indexOf(value) === index;
            }

            var words = parsedStr.split(/[\s,;.:]+/);
            var uniqueWords = words.filter(onlyUnique);
            parsedStr = '';

            for (var i = 0; i < uniqueWords.length; i++) {
                parsedStr += uniqueWords[i];
                if (parsedStr.length >= innerCap) {
                    return parsedStr;
                }

                if (i < uniqueWords.length - 1) {
                    parsedStr += ',';
                }
            }

            return parsedStr;
        }

        function gt(innerCap, prefix) {
            innerCap = innerCap || 300;
            prefix = prefix || '';

            var title = '';
            if (document.title) {
                title = document.title;
            } else if (headTag) {
                var headTagTitle = headTag.getElementsByTagName('title')[0];
                if (headTagTitle) {
                    title = headTagTitle.innerHTML;
                }
            }

            return parse(prefix + ',' + title, innerCap);
        }

        function gmeta(metaName, innerCap, prefix) {
            metaName = metaName || 'keywords';
            innerCap = innerCap || 100;
            prefix = prefix || '';
            var fallbackKw = prefix;

            for (var i = 0; i < metaTag.length; i++) {
                if (metaTag[i].name && metaTag[i].name.toLowerCase() === metaName.toLowerCase()) {
                    var innerKw = prefix + ',' + metaTag[i].content || '';

                    return parse(innerKw, innerCap);
                } else if (metaTag[i].name && metaTag[i].name.toLowerCase()
                    .indexOf(metaName.toLowerCase()) > -1) {
                    fallbackKw = prefix + ',' + metaTag[i].content || '';
                }
            }

            return parse(fallbackKw, innerCap);
        }

        var kw = gmeta('keywords', cap);
        if (!kw || kw.length < cap - 8) {
            kw = gmeta('description', cap, kw);
            if (!kw || kw.length < cap - 8) {
                kw = gt(cap, kw);
            }
        }

        return kw;
    }

    function passAllParcels(returnParcels, sessionId, message) {
        Scribe.info(message);

        if (returnParcels !== null) {
            for (var j = 0; j < returnParcels.length; j++) {
                var curReturnParcel = returnParcels[j];

                var headerStatsInfo = {};
                var htSlotId = curReturnParcel.htSlot.getId();
                headerStatsInfo[htSlotId] = {};
                headerStatsInfo[htSlotId][curReturnParcel.requestId] = [curReturnParcel.xSlotName];

                if (__profile.enabledAnalytics.requestTime) {
                    __baseClass._emitStatsEvent(sessionId, 'hs_slot_pass', headerStatsInfo);
                }
                curReturnParcel.pass = true;
            }
        }
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

        var _placementIds = [];
        var _customEndpoint;
        var _ivAuctionStart = Date.now();

        returnParcels.forEach(function (bidRequest) {
            _placementIds.push(bidRequest.xSlotRef.placementId);
            _customEndpoint = _customEndpoint || bidRequest.xSlotRef.customEndpoint;
        });

        invibes.visitId = invibes.visitId || generateRandomId();

        _cookieDomain = detectTopmostCookieDomain();
        invibes.noCookies = invibes.noCookies || invibes.getCookie('ivNoCookie');
        invibes.optIn = invibes.optIn || invibes.getCookie('ivOptIn');

        initDomainId(invibes.domainOptions);

        var currentQueryStringParams = parseQueryStringParams();

        var data = {
            location: getDocumentLocation(),
            videoAdHtmlId: generateRandomId(),
            showFallback: currentQueryStringParams.advs === '0',
            ivbsCampIdsLocal: invibes.getCookie('IvbsCampIdsLocal'),
            bidParamsJson: JSON.stringify({
                placementIds: _placementIds,
                auctionStartTime: _ivAuctionStart,
                bidVersion: CONSTANTS.BID_VERSION
            }),
            capCounts: getCappedCampaignsAsString(),
            vId: invibes.visitId,
            width: Browser.topWindow.innerWidth,
            height: Browser.topWindow.innerHeight,
            noc: !_cookieDomain,
            oi: invibes.optIn,
            kw: keywords()
        };

        if (ComplianceService.isPrivacyEnabled() && ComplianceService.gdpr) {
            var gdprStatus = ComplianceService.gdpr.getConsent();
            data.gdprApplies = gdprStatus.applies;
            data.gdprConsent = gdprStatus.consentString;
        }

        if (invibes.dom.id) {
            data.lId = invibes.dom.id;
        }

        var parametersToPassForward = 'videoaddebug,advs,bvci,bvid,istop,trybvid,trybvci'.split(',');
        for (var key in currentQueryStringParams) {
            if (currentQueryStringParams.hasOwnProperty(key)) {
                var value = currentQueryStringParams[key];
                if (parametersToPassForward.indexOf(key) > -1 || (/^vs|^invib/i).test(key)) {
                    data[key] = value;
                }
            }
        }

        return {
            url: Browser.getProtocol() + (_customEndpoint || CONSTANTS.BID_ENDPOINT),
            data: data
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
        var responseObj = adResponse.body || adResponse;
        responseObj = responseObj.videoAdContentResult || responseObj;

        if (!responseObj) {
            passAllParcels(returnParcels, sessionId, 'Invibes Partner - Bid response is empty');

            return;
        }

        var bidModel = responseObj.BidModel;
        if (typeof bidModel !== 'object') {
            passAllParcels(returnParcels, sessionId, 'Invibes Partner - Bidding is not configured');

            return;
        }

        if (bidModel.PlacementId === null) {
            passAllParcels(returnParcels, sessionId, 'Invibes Partner - No Placement Id in response');

            return;
        }

        if (typeof invibes.bidResponse === 'object') {
            passAllParcels(returnParcels, sessionId,
                'Invibes Partner - Bid response already received. Invibes responds to one bid request per visit');

            return;
        }

        if (!Array.isArray(responseObj.Ads) || responseObj.Ads.length < 1) {
            passAllParcels(returnParcels, sessionId, 'Invibes Partner - No ads available');

            return;
        }

        var ad = responseObj.Ads[0];
        invibes.bidResponse = responseObj;

        /* --------------------------------------------------------------------------------- */

        for (var j = 0; j < returnParcels.length; j++) {
            var curReturnParcel = returnParcels[j];

            var headerStatsInfo = {};
            var htSlotId = curReturnParcel.htSlot.getId();
            headerStatsInfo[htSlotId] = {};
            headerStatsInfo[htSlotId][curReturnParcel.requestId] = [curReturnParcel.xSlotName];

            if ((curReturnParcel.xSlotRef.placementId !== bidModel.PlacementId
                && Number(curReturnParcel.xSlotRef.placementId) !== Number(bidModel.PlacementId))
                || ad.Price <= 0) {
                Scribe.info(__profile.partnerId + ' returned pass for { id: ' + adResponse.id + ' }.');

                if (__profile.enabledAnalytics.requestTime) {
                    __baseClass._emitStatsEvent(sessionId, 'hs_slot_pass', headerStatsInfo);
                }

                curReturnParcel.pass = true;

                continue;
            }

            if (__profile.enabledAnalytics.requestTime) {
                __baseClass._emitStatsEvent(sessionId, 'hs_slot_bid', headerStatsInfo);
            }

            /* The bid price for the given slot */
            var bidPrice = ad.BidPrice;

            /* The size of the given slot */
            var parcelSize = getBiggerSize(curReturnParcel.xSlotRef.sizes);
            var bidSize = [bidModel.Width || parcelSize[0], bidModel.Height || parcelSize[1]];

            /* The creative/adm for the given slot that will be rendered if is the winner.
             * Please make sure the URL is decoded and ready to be document.written.
             */
            var bidCreative = renderCreative(bidModel);

            /* The dealId if applicable for this slot. */
            var bidDealId = bidModel.dealid;

            /* OPTIONAL: tracking pixel url to be fired AFTER rendering a winning creative.
            * If firing a tracking pixel is not required or the pixel url is part of the adm,
            * leave empty;
            */
            var pixelUrl = '';

            /* --------------------------------------------------------------------------------------- */

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
            statsId: 'INV',
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
                id: 'ix_inv_id',
                om: 'ix_inv_cpm',
                pm: 'ix_inv_cpm',
                pmid: 'ix_inv_dealid'
            },

            /* The bid price unit (in cents) the endpoint returns, please refer to the readme for details */
            bidUnitInCents: 1,
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
        generateRequestObj: __generateRequestObj
        //? }
    };

    return Classify.derive(__baseClass, derivedClass);
}

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = InvibesHtb;
