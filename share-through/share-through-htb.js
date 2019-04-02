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
var ComplianceService;
var EventsService;
var RenderService;

//? if (DEBUG) {
var ConfigValidators = require('config-validators.js');
var PartnerSpecificValidator = require('share-through-htb-validator.js');
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
function ShareThroughHtb(configs) {
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

    /**
     * Generates the request URL and query data to the endpoint for the xSlots
     * in the given returnParcels.
     *
     * @param  {object[]} returnParcels
     *
     * @return {object}
     */
    function __generateRequestObj(returnParcels) {
        var baseUrl = Browser.getProtocol() + '//btlr.sharethrough.com/header-bid/v1';

        var queryObj = {
            placement_key: returnParcels[0].xSlotRef.placementKey,
            bidId: returnParcels[0].requestId,
            instant_play_capable: __canAutoPlayHTML5Video(),
            hbSource: "indexExchange",
            hbVersion: "2.1.2",
            cbust: System.now()
        };

        var unifiedID = __getUnifiedID(returnParcels);
        if (unifiedID) {
            queryObj.ttduid = unifiedID;
        }

        var privacyEnabled = ComplianceService.isPrivacyEnabled();
        var gdprStatus = ComplianceService.gdpr.getConsent();
        if (privacyEnabled && gdprStatus) {
            queryObj.consent_required = gdprStatus.applies;
            queryObj.consent_string = gdprStatus.consentString;
        }

        return {
            url: baseUrl,
            data: queryObj,
        };
    }

    /* Helpers
     * ---------------------------------- */

    function __getUnifiedID(returnParcels) {
        var uids = []
        try {
            uids = returnParcels[0].identityData.AdserverOrgIp.data.uids;
        } catch (err) {
            return null;
        }

        var unifiedID;
        for (var i = 0; i < uids.length; i++) {
            if (uids[i].ext.rtiPartner === "TDID") {
                unifiedID = uids[i].id;
                break;
            }
        };
        return unifiedID;
    }

    function __canAutoPlayHTML5Video() {
        var userAgent = Browser.getUserAgent();
        if (!userAgent) return false;

        var isAndroid = /Android/i.test(userAgent);
        var isiOS = /iPhone|iPad|iPod/i.test(userAgent);
        var chromeVersion = parseInt((/Chrome\/([0-9]+)/.exec(userAgent) || [0, 0])[1]);
        var chromeiOSVersion = parseInt((/CriOS\/([0-9]+)/.exec(userAgent) || [0, 0])[1]);
        var safariVersion = parseInt((/Version\/([0-9]+)/.exec(userAgent) || [0, 0])[1]);

        if (
            (isAndroid && chromeVersion >= 53) ||
            (isiOS && (safariVersion >= 10 || chromeiOSVersion >= 53)) ||
            !(isAndroid || isiOS)
        ) {
            return true;
        } else {
            return false;
        }
    }

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
                method: 'GET',
            });
        }
    }

    function __generateAdm(bid, placementKey) {
        var stxResponseName = "str_response_" + bid.bidId;
        var encodedBid = __b64EncodeUnicode(JSON.stringify(bid));

        return "<div data-str-native-key='" + placementKey + "' data-stx-response-name='" + stxResponseName + "' data-str-replace-iframe-container='true'></div>" +
            "<script>var " + stxResponseName + " = '" + encodedBid + "' </script>" +
            "<script src='//native.sharethrough.com/assets/sfp-set-targeting.js'></script>" +
            "<script type='text/javascript'>" +
            "(function() {" +
            "var sfp_js = document.createElement('script');" +
            "sfp_js.src = '//native.sharethrough.com/assets/sfp.js';" +
            "sfp_js.type = 'text/javascript';" +
            "sfp_js.charset = 'utf-8';" +
            "try {" +
            "if (!(window.top.STR && window.top.STR.Tag)) {" +
            "window.top.document.getElementsByTagName('body')[0].appendChild(sfp_js);" +
            "}" +
            "} catch (e) {" +
            "console.log(e);" +
            "}" +
            "})();" +
            "</script>";
    }

    // See https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_Unicode_Problem
    function __b64EncodeUnicode(str) {
        try {
            return btoa(
                encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
                    function toSolidBytes(match, p1) {
                        return String.fromCharCode('0x' + p1);
                    })
            );
        } catch (e) {
            return str;
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
        var curBid = adResponse;
        var curReturnParcel = returnParcels[0];

        var headerStatsInfo = {};
        var htSlotId = curReturnParcel.htSlot.getId();
        headerStatsInfo[htSlotId] = {};
        headerStatsInfo[htSlotId][curReturnParcel.requestId] = [curReturnParcel.xSlotName];

        /* No response or no creatives returned so its a pass */
        if (!curBid || !curBid.creatives || curBid.creatives.length === 0) {
            if (__profile.enabledAnalytics.requestTime) {
                __baseClass._emitStatsEvent(sessionId, 'hs_slot_pass', headerStatsInfo);
            }
            curReturnParcel.pass = true;
            return;
        }

        /* ---------- Fill the bid variables with data from the bid response here. ------------*/

        // Already checked if creatives array is present
        var bidPrice = curBid.creatives[0].cpm;
        var bidSize = [1, 1];
        // var bidCreative = __generateAdm(curBid, curReturnParcel.xSlotRef.placementKey);
        var bidCreative = adResponse.ixTestResponse ? curBid.creatives[0].adm : __generateAdm(curBid, curReturnParcel.xSlotRef.placementKey);
        var bidDealId = null;
        var pixelUrl = '';

        /* explicitly pass */
        var bidIsPass = bidPrice <= 0 ? true : false;
        /* ---------------------------------------------------------------------------------------*/

        if (bidIsPass) {
            //? if (DEBUG) {
            Scribe.info(__profile.partnerId + ' returned pass for { id: ' + adResponse.id + ' }.');
            //? }
            if (__profile.enabledAnalytics.requestTime) {
                __baseClass._emitStatsEvent(sessionId, 'hs_slot_pass', headerStatsInfo);
            }
            curReturnParcel.pass = true;
            return;
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

        var pubKitAdId = RenderService.registerAd({
            sessionId: sessionId,
            partnerId: __profile.partnerId,
            adm: bidCreative,
            requestId: curReturnParcel.requestId,
            size: curReturnParcel.size,
            price: targetingCpm,
            dealId: bidDealId || undefined,
            timeOfExpiry: __profile.features.demandExpiry.enabled ? (__profile.features.demandExpiry.value + System.now()) : 0,
            auxFn: __renderPixel,
            auxArgs: [pixelUrl]
        });

        //? if (FEATURES.INTERNAL_RENDER) {
        curReturnParcel.targeting.pubKitAdId = pubKitAdId;
        //? }
    }

    /* =====================================
     * Constructors
     * ---------------------------------- */

    (function __constructor() {
        ComplianceService = SpaceCamp.services.ComplianceService;
        EventsService = SpaceCamp.services.EventsService;
        RenderService = SpaceCamp.services.RenderService;

        /* =============================================================================
         * STEP 1  | Partner Configuration
         * -----------------------------------------------------------------------------
         *
         * Please fill out the below partner profile according to the steps in the README doc.
         */

        /* ---------- Please fill out this partner profile according to your module ------------*/
        __profile = {
            partnerId: 'ShareThroughHtb', // PartnerName
            namespace: 'ShareThroughHtb', // Should be same as partnerName
            statsId: 'SHTH', // Unique partner identifier
            version: '2.1.2',
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
            targetingKeys: { // Targeting keys for demand, should follow format ix_{statsId}_id
                id: 'ix_shth_id',
                om: 'ix_shth_cpm',
                pm: 'ix_shth_cpm',
                pmid: 'ix_shth_dealid'
            },
            bidUnitInCents: 100, // The bid price unit (in cents) the endpoint returns, please refer to the readme for details
            lineItemType: Constants.LineItemTypes.ID_AND_SIZE,
            callbackType: Partner.CallbackTypes.NONE, // Callback type, please refer to the readme for details
            architecture: Partner.Architectures.MRA, // Request architecture, please refer to the readme for details
            requestType: Partner.RequestTypes.AJAX // Request type, jsonp, ajax, or any.
        };
        /* ---------------------------------------------------------------------------------------*/

        //? if (DEBUG) {
        var results = ConfigValidators.partnerBaseConfig(configs) || PartnerSpecificValidator(configs);

        if (results) {
            throw Whoopsie('INVALID_CONFIG', results);
        }
        //? }

        __baseClass = Partner(__profile, configs, null, {
            parseResponse: __parseResponse,
            generateRequestObj: __generateRequestObj,
            b64EncodeUnicode: __b64EncodeUnicode
        });
    })();

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    var derivedClass = {
        /* Class Information
         * ---------------------------------- */

        //? if (DEBUG) {
        __type__: 'ShareThroughHtb',
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
        //? }
    };

    return Classify.derive(__baseClass, derivedClass);
}

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = ShareThroughHtb;
