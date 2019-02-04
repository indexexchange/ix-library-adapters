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

var Classify = require('classify.js');
var Constants = require('constants.js');
var Network = require('network.js');
var Partner = require('partner.js');
var Size = require('size.js');
var SpaceCamp = require('space-camp.js');
var System = require('system.js');
var Utilities = require('utilities.js');
var Whoopsie = require('whoopsie.js');
var EventsService;
var RenderService;

//? if (DEBUG) {
var ConfigValidators = require('config-validators.js');
var PartnerSpecificValidator = require('facebook-htb-validator.js');
var Scribe = require('scribe.js');
//? }

////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * FacebookHtb Class for the creation of the Header Tag Bidder
 *
 * @class
 */
function FacebookHtb(configs) {
    var adapterVersion = '2.1.0'; // bump this on each commit to this adapter

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
     * Recorded mapping of placementId to xSlot name/size for duplicate checking
     *
     * @private {object}
     */
    //? if (DEBUG) {
    var __seenPlacementIds;
    //? }

    /**
     * Static creative tag fragments for fullwidth creative
     *
     * @private {object}
     */
    var __fullwidthAssets;

    /* =====================================
     * Functions
     * ---------------------------------- */

    /* Utilities
     * ---------------------------------- */

    /**
     * Generates the request URL to the endpoint for the xSlots in the given
     * returnParcels.
     *
     * @param  {object[]} returnParcels [description]
     * @return {string}            [description]
     */
    function __generateRequestObj(returnParcels) {
        var queryObj = {
            sdk: '5.5.web',
            placementids: [],
            adformats: [],
            cachebuster: System.generateUniqueId(56, 'ALPHANUM'),
            platform: '2061185240785516',
            adapterver: adapterVersion
        };

        for (var i = 0; i < returnParcels.length; i++) {

            /* If htSlot does not have an ixSlot mapping no impressions needed */
            if (!returnParcels[i].hasOwnProperty('xSlotRef')) {
                continue;
            }

            var xSlot = returnParcels[i].xSlotRef;
            var sizeString = Size.arrayToString(xSlot.size);

            /* Check for placementIds with multiple sizes */
            //? if (DEBUG) {
            if (__seenPlacementIds[xSlot.placementId]) {
                Scribe.warn('placementId "' + xSlot.placementId + '" used for multiple xSlots (' + __seenPlacementIds[xSlot.placementId] + ').');
            } else {
                __seenPlacementIds[xSlot.placementId] = 1;
            }
            //? }

            /* Add slot information to bidder query */
            queryObj.placementids.push(xSlot.placementId);
            queryObj.adformats.push(xSlot.adFormat ? xSlot.adFormat : sizeString);

            /* Include size information in parcel */
            returnParcels[i].size = xSlot.size;
            returnParcels[i].adFormat = xSlot.adFormat;
        }

        return {
            url: __baseUrl,
            data: queryObj
        };
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

    /* parses adResponse and ads any demand into outParcels */
    function __parseResponse(sessionId, bidResponse, returnParcels, outstandingXSlotNames) {
        if (!bidResponse.bids) {
            //? if (DEBUG) {
            Scribe.warn('Bidder response object missing "bids" object property.');
            //? }

            __baseClass._emitStatsEvent(sessionId, 'hs_slot_error', outstandingXSlotNames);
            return;
        }

        var unusedReturnParcels = returnParcels.slice();

        for (var placementId in bidResponse.bids) {
            if (!bidResponse.bids.hasOwnProperty(placementId)) {
                continue;
            }

            /* Response bids is object keyed by placementId */
            var placementBids = bidResponse.bids[placementId];

            for (var j = 0; j < placementBids.length; j++) {
                /* Each entry is an array of bids */
                var bid = placementBids[j];

                /* Check required parameters in bid response */
                if (!bid.hasOwnProperty('bid_id') || !bid.hasOwnProperty('bid_price_cents')) { // jshint ignore:line
                    continue;
                }

                /* Match parcel using placementId */
                var curReturnParcel;
                for (var k = unusedReturnParcels.length - 1; k >= 0; k--) {
                    if (unusedReturnParcels[k].xSlotRef.placementId === bid.placement_id) { // jshint ignore:line
                        curReturnParcel = unusedReturnParcels[k];
                        unusedReturnParcels.splice(k, 1);
                        break;
                    }
                }

                /* No matching parcel found for current bid */
                if (!curReturnParcel) {
                    continue;
                }

                // If bid has CPM of 0, pass
                if (bid.bid_price_cents <= 0) {
                    curReturnParcel.pass = true;
                    continue;
                }

                /* Analytics event for bid received */
                if (__profile.enabledAnalytics.requestTime) {
                    var curHtSlotId = curReturnParcel.htSlot.getId();
                    EventsService.emit('hs_slot_bid', {
                        sessionId: sessionId,
                        statsId: __profile.statsId,
                        htSlotId: curHtSlotId,
                        requestId: curReturnParcel.requestId,
                        xSlotNames: [curReturnParcel.xSlotName]
                    });

                    if (outstandingXSlotNames[curHtSlotId] && outstandingXSlotNames[curHtSlotId][curReturnParcel.requestId]) {
                        Utilities.arrayDelete(outstandingXSlotNames[curHtSlotId][curReturnParcel.requestId], curReturnParcel.xSlotName);
                    }
                }

                var sizeKey = Size.arrayToString(curReturnParcel.size);
                var renderFormat = curReturnParcel.adFormat ? curReturnParcel.adFormat : sizeKey;

                /* Fullwidth script tag (to be inserted in <head>) */
                var fullwidthScriptTag = curReturnParcel.adFormat !== 'fullwidth' ? '' : __fullwidthAssets.scriptTag;

                /* Fullwidth DOM elements (to be inserted at the end of <body>) */
                var fullwidthDomElements = curReturnParcel.adFormat !== 'fullwidth' ? '' : __fullwidthAssets.domElements;

                /* Native assets (to be inserted at the end of <body>) */
                var nativeAssets = curReturnParcel.adFormat !== 'native' ? '' : configs.nativeAssets;

                var bidCreative = '<html><head>' + fullwidthScriptTag + '</head><body><div style="display:none;position:relative;"><script>var data = {placementid:"' + bid.placement_id + '",format:"' + renderFormat + '",bidid:"' + bid.bid_id + '",onAdLoaded:function(e){e.style.display = "block";},onAdError:function(c,m){console.log("Audience Network [' + bid.placement_id + '] error (" + c + ") " + m);}};(function(a,b,c){var d="https://www.facebook.com",e="https://connect.facebook.net/en_US/fbadnw55.js",f={iframeLoaded:true,xhrLoaded:true},g=5,h=a.data,i=0,j=function(ea){if(ea==null)throw new Error();return ea;},k=function(ea){if(ea instanceof HTMLElement)return ea;throw new Error();},l=function(){if(Date.now){return Date.now();}else return +new Date();},m=function(ea){if(++i>g)return;var fa=d+"/audience_network/client_event",ga={cb:l(),event_name:"ADNW_ADERROR",ad_pivot_type:"audience_network_mobile_web",sdk_version:"5.5.web",app_id:h.placementid.split("_")[0],publisher_id:h.placementid.split("_")[1],error_message:ea},ha=[];for(var ia in ga)ha.push(encodeURIComponent(ia)+"="+encodeURIComponent(ga[ia]));var ja=fa+"?"+ha.join("&"),ka=new XMLHttpRequest();ka.open("GET",ja,true);ka.send();},n=function(){if(b.currentScript){return b.currentScript;}else{var ea=b.getElementsByTagName("script");return ea[ea.length-1];}},o=function(ea){try{return ea.document.referrer;}catch(fa){}return "";},p=function(){var ea=a;try{while(ea!=ea.parent){ea.parent.origin;ea=ea.parent;}}catch(fa){}return ea;},q=function(ea){var fa=ea.indexOf("/",ea.indexOf("://")+3);if(fa===-1)return ea;return ea.substring(0,fa);},r=function(ea){return ea.location.href||o(ea);},s=function(ea,fa){if(ea.sdkLoaded)return;var ga=fa.createElement("iframe");ga.name="fbadnw";ga.style.display="none";j(fa.body).appendChild(ga);ga.contentWindow.addEventListener("error",function(event){m(event.message);},false);var ha=ga.contentDocument.createElement("script");ha.src=e;ha.async=true;j(ga.contentDocument.body).appendChild(ha);ea.sdkLoaded=true;},t=function(ea){var fa=/^https?:\\/\\/www\\.google(\\.com?)?.\\w{2,3}$/;return !!ea.match(fa);},u=function(ea){return ea.endsWith("cdn.ampproject.org");},v=function(){var ea=c.ancestorOrigins||[],fa=ea[ea.length-1]||c.origin,ga=ea[ea.length-2]||c.origin;if(t(fa)&&u(ga)){return q(ga);}else return q(fa);},w=function(ea){try{return JSON.parse(ea);}catch(fa){m(fa.message);return null;}},x=function(ea,fa,ga){if(!ea.iframe){var ha=ga.createElement("iframe");ha.src=d+"/audiencenetwork/iframe/";ha.style.display="none";j(ga.body).appendChild(ha);ea.iframe=ha;ea.iframeAppendedTime=l();ea.iframeData={};}fa.iframe=j(ea.iframe);fa.iframeData=ea.iframeData;fa.tagJsIframeAppendedTime=ea.iframeAppendedTime||0;},y=function(ea){var fa=d+"/audiencenetwork/xhr/?sdk=5.5.web";for(var ga in ea)if(typeof ea[ga]!=="function")fa+="&"+ga+"="+encodeURIComponent(ea[ga]);var ha=new XMLHttpRequest();ha.open("GET",fa,true);ha.withCredentials=true;ha.onreadystatechange=function(){if(ha.readyState===4){var ia=w(ha.response);if(ia)ea.events.push({name:"xhrLoaded",source:ea.iframe.contentWindow,data:ia,postMessageTimestamp:l(),receivedTimestamp:l()});}};ha.send();},z=function(ea,fa){var ga=d+"/audiencenetwork/xhriframe/?sdk=5.5.web";for(var ha in fa)if(typeof fa[ha]!=="function")ga+="&"+ha+"="+encodeURIComponent(fa[ha]);var ia=b.createElement("iframe");ia.src=ga;ia.style.display="none";j(b.body).appendChild(ia);fa.iframe=ia;fa.iframeData={};fa.tagJsIframeAppendedTime=l();},aa=function(ea){var fa=function(event){try{var ia=event.data;if(ia.name in f)ea.events.push({name:ia.name,source:event.source,data:ia.data});}catch(ha){}},ga=j(ea.iframe).contentWindow.parent;ga.addEventListener("message",fa,false);},ba=function(ea){if(ea.context)return true;try{return !!JSON.parse(decodeURI(ea.name)).ampcontextVersion;}catch(fa){return false;}},ca=function(ea){var fa=l(),ga=p(),ha=k(n().parentElement),ia=ga!=a.top,ja=ga.$sf&&ga.$sf.ext,ka=r(ga);ga.ADNW=ga.ADNW||{};ga.ADNW.v55=ga.ADNW.v55||{ads:[]};var la=ga.ADNW.v55;s(la,ga.document);var ma={amp:ba(ga),events:[],tagJsInitTime:fa,rootElement:ha,iframe:null,tagJsIframeAppendedTime:la.iframeAppendedTime||0,url:ka,domain:v(),channel:q(r(ga)),width:screen.width,height:screen.height,pixelratio:a.devicePixelRatio,placementindex:la.ads.length,crossdomain:ia,safeframe:!!ja,placementid:h.placementid,format:h.format||"300x250",testmode:!!h.testmode,onAdLoaded:h.onAdLoaded,onAdError:h.onAdError};if(h.bidid)ma.bidid=h.bidid;if(ia){z(la,ma);}else{x(la,ma,ga.document);y(ma);}aa(ma);ma.rootElement.dataset.placementid=ma.placementid;la.ads.push(ma);};try{ca();}catch(da){m(da.message||da);throw da;}})(window,document,location);</script>' + fullwidthDomElements + nativeAssets + '</div></body></html>'; // jshint ignore:line

                curReturnParcel.targetingType = 'slot';
                curReturnParcel.targeting = {};

                var targetingCpm = '';
                //? if(FEATURES.GPT_LINE_ITEMS) {
                targetingCpm = __baseClass._bidTransformers.targeting.apply(bid.bid_price_cents); // jshint ignore:line

                curReturnParcel.targeting[__baseClass._configs.targetingKeys.om] = [sizeKey + '_' + targetingCpm];
                curReturnParcel.targeting[__baseClass._configs.targetingKeys.id] = [curReturnParcel.requestId];

                //? }

                //? if(FEATURES.RETURN_CREATIVE) {
                curReturnParcel.adm = bidCreative;
                //? }

                //? if(FEATURES.RETURN_PRICE) {
                curReturnParcel.price = Number(__baseClass._bidTransformers.price.apply(bid.bid_price_cents)); // jshint ignore:line
                //? }

                var pubKitAdId = RenderService.registerAd({
                    sessionId: sessionId,
                    partnerId: __profile.partnerId,
                    adm: bidCreative,
                    requestId: curReturnParcel.requestId,
                    size: curReturnParcel.size,
                    price: targetingCpm,
                    timeOfExpiry: __profile.features.demandExpiry.enabled ? (__profile.features.demandExpiry.value + System.now()) : 0
                });

                //? if(FEATURES.INTERNAL_RENDER) {
                curReturnParcel.targeting.pubKitAdId = pubKitAdId;
                //? }
            }
        }

        /* any requests that didn't get a response above are passes */
        for (var l = 0; l < unusedReturnParcels.length; l++) {
            unusedReturnParcels[l].pass = true;
        }

        if (__profile.enabledAnalytics.requestTime) {
            __baseClass._emitStatsEvent(sessionId, 'hs_slot_pass', outstandingXSlotNames);
        }
    }

    /* =====================================
     * Constructors
     * ---------------------------------- */

    (function __constructor() {
        EventsService = SpaceCamp.services.EventsService;
        RenderService = SpaceCamp.services.RenderService;

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
            targetingKeys: {
                id: 'ix_fb_id',
                om: 'ix_fb_om'
            },
            bidUnitInCents: 1,
            lineItemType: Constants.LineItemTypes.ID_AND_SIZE,
            callbackType: Partner.CallbackTypes.NONE,
            architecture: Partner.Architectures.SRA,
            requestType: Partner.RequestTypes.AJAX
        };

        //? if (DEBUG) {
        var results = ConfigValidators.partnerBaseConfig(configs) || PartnerSpecificValidator(configs);

        if (results) {
            throw Whoopsie('INVALID_CONFIG', results);
        }
        //? }

        //? if (DEBUG) {
        __seenPlacementIds = {};
        //? }

        __baseUrl = 'https://an.facebook.com/v2/placementbid.json';

        __fullwidthAssets = {
            scriptTag: '<script type="text/javascript">' +
                '  window.onload = function() {' +
                '      if (parent) {' +
                '          var oHead = document.getElementsByTagName("head")[0];' +
                '          var arrStyleSheets = parent.document.getElementsByTagName("style");' +
                '          for (var i = 0; i < arrStyleSheets.length; i++)' +
                '              oHead.appendChild(arrStyleSheets[i].cloneNode(true));' +
                '      }' +
                '  }' +
                '</script>',
            domElements: '<div class="thirdPartyRoot">' +
                '    <a class="fbAdLink">' +
                '        <div class="fbAdMedia thirdPartyMediaClass"></div>' +
                '        <div class="fbAdSubtitle thirdPartySubtitleClass"></div>' +
                '        <div class="fbDefaultNativeAdWrapper">' +
                '            <div class="fbAdCallToAction thirdPartyCallToActionClass"></div>' +
                '            <div class="fbAdTitle thirdPartyTitleClass"></div>' +
                '        </div>' +
                '    </a>' +
                '</div>'
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
        __type__: 'FacebookHtb',
        __baseClass: __baseClass,

        /* Data
         * ---------------------------------- */
        profile: __profile,

        /* Functions
         * ---------------------------------- */
        parseResponse: __parseResponse,
        generateRequestObj: __generateRequestObj,
    };

    return Classify.derive(__baseClass, derivedClass);
}

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = FacebookHtb;
