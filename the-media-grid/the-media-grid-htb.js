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
var PartnerSpecificValidator = require('the-media-grid-htb-validator.js');
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
function TheMediaGridHtb(configs) {
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

    function createVideoCreative(adUnitCode, adm, nurl, sizes) {
        var RENDERER_URL = 'https://js-sec.indexww.com/htv/video-player.js';

        if (adm || nurl) {
            var creative = [];
            creative.push('<head></head><script src="' + RENDERER_URL + '"></script></head>');
            creative.push('<body><div id="'+adUnitCode+'"></div><script>');
            creative.push('try {');
            creative.push('window.IXOutstreamPlayer("'+(adm || nurl).replace(/"/g, '\\"').replace(/\n/g, '\\n')+'", "'+adUnitCode+'", {"width": '+sizes[0]+', "height": '+sizes[1]+', "timeout": 3000});');
            creative.push('} catch(err) { console.log("TheMediaGrid RENDER ERROR", err); }');
            creative.push('</script></body>');
            return creative.join('\n');
        }
    }

    function __pubItemProcessing(formatedPublisher, pubItem) {
        if (typeof pubItem === 'object' && pubItem.name) {
            var formatedPubItem = {
                name: pubItem.name,
                segments: []
            };
            Object.keys(pubItem)
                .forEach(function (key) {
                    if (Utilities.isArray(pubItem[key])) {
                        pubItem[key]
                            .forEach(function (keyword) {
                                if (keyword) {
                                    if (typeof keyword === 'string') {
                                        formatedPubItem.segments.push({
                                            name: key,
                                            value: keyword
                                        });
                                    } else if (
                                        key === 'segments'
                                        && typeof keyword.name === 'string'
                                        && typeof keyword.value === 'string'
                                    ) {
                                        formatedPubItem.segments.push(keyword);
                                    }
                                }
                            });
                    }
                });
            if (formatedPubItem.segments.length) {
                formatedPublisher.push(formatedPubItem);
            }
        }
    }

    function __reformatKeywords(pageKeywords) {
        var formatedPageKeywords = {};
        Object.keys(pageKeywords)
            .forEach(function (key) {
                var keywords = pageKeywords[key];
                if (keywords) {
                    if (key === 'site' || key === 'user') {
                        var formatedKeywords = {};
                        Object.keys(keywords)
                            .forEach(function (pubName) {
                                if (Utilities.isArray(keywords[pubName])) {
                                    var formatedPublisher = [];
                                    keywords[pubName].forEach(__pubItemProcessing.bind(null, formatedPublisher));
                                    if (formatedPublisher.length) {
                                        formatedKeywords[pubName] = formatedPublisher;
                                    }
                                }
                            });
                        formatedPageKeywords[key] = formatedKeywords;
                    } else {
                        formatedPageKeywords[key] = keywords;
                    }
                }
            });

        return Object.keys(formatedPageKeywords).length && formatedPageKeywords;
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
        var callbackId = System.generateUniqueId();
        var pageUrl = Browser.getPageUrl();

        var source = {
            tid: System.generateUniqueId(),
            ext: {
                wrapper: 'IX_js',
                // eslint-disable-next-line camelcase
                wrapper_version: SpaceCamp.version
            }
        };

        var pageKeywords;
        var imps = returnParcels.map(function (parcel) {
            var xSlot = parcel.xSlotRef;
            var impObj = {
                id: parcel.requestId.toString(),
                tagid: xSlot.uid.toString()
            };
            if (parcel.ref) {
                var impExt;
                if (parcel.ref.getSlotElementId) {
                    var divid = parcel.ref.getSlotElementId();
                    if (divid) {
                        impExt = impExt || {};
                        impExt.divid = divid.toString();
                    }
                }

                if (parcel.ref.getAdUnitPath) {
                    var gpid = parcel.ref.getAdUnitPath();
                    if (gpid) {
                        impExt = impExt || {};
                        impExt.gpid = gpid.toString();
                        impExt.data = {
                            adserver: {
                                name: 'gam',
                                adslot: gpid
                            },
                            pbadslot: gpid
                        };
                    }
                }

                if (impExt) {
                    impObj.ext = impExt;
                }
            }

            if (xSlot.keywords) {
                if (!pageKeywords) {
                    pageKeywords = xSlot.keywords;
                }
                impObj.ext.bidder = { keywords: xSlot.keywords };
            }

            if (xSlot.bidFloor) {
                impObj.bidfloor = xSlot.bidFloor;
            }

            if (xSlot.video) {
                impObj.video = Object.assign({}, xSlot.video);
            }

            if (xSlot.sizes) {
                var format = [];
                var banner = {};
                for (var sizeIdx = 0; sizeIdx < xSlot.sizes.length; ++sizeIdx) {
                    var size = xSlot.sizes[sizeIdx];
                    format.push({
                        w: size[0],
                        h: size[1]
                    });
                }

                if (format[0]) {
                    banner.w = format[0].w;
                    banner.h = format[0].h;
                    banner.format = format;
                }
                impObj.banner = banner;
            }

            return impObj;
        });

        var queryObj = {
            id: callbackId.toString(),
            site: {
                page: encodeURIComponent(pageUrl)
            },
            source: source,
            imp: imps
        };

        if (SpaceCamp.globalTimeout) {
            queryObj.tmax = SpaceCamp.globalTimeout;
        }

        if (pageKeywords) {
            pageKeywords = __reformatKeywords(pageKeywords);
            if (pageKeywords) {
                queryObj.ext = {
                    keywords: pageKeywords
                };
            }
        }

        /* Change this to your bidder endpoint. */
        var baseUrl = Browser.getProtocol() + '//grid.bidswitch.net/hbjson';

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
        var gdprConsent = ComplianceService.gdpr.getConsent();
        var privacyEnabled = ComplianceService.isPrivacyEnabled();
        var uspConsentObj = ComplianceService.usp && ComplianceService.usp.getConsent();

        /* ---------------- Craft bid request using the above returnParcels --------- */

        /* ------- Put GDPR consent code here if you are implementing GDPR ---------- */

        if (privacyEnabled) {
            if (gdprConsent) {
                queryObj.user = {
                    ext: {
                        consent: gdprConsent.consentString
                    }
                };

                if (gdprConsent) {
                    queryObj.regs = {
                        ext: {
                            gdpr: gdprConsent.applies ? 1 : 0
                        }
                    };
                }
            }

            if (uspConsentObj) {
                if (!queryObj.regs) {
                    queryObj.regs = { ext: {} };
                }
                // eslint-disable-next-line camelcase
                queryObj.regs.ext.us_privacy = uspConsentObj;
            }
        }

        /* -------------------------------------------------------------------------- */

        return {
            url: baseUrl,
            data: queryObj,
            networkParamOverrides: {
                method: 'POST',
                contentType: 'text/plain',
                withCredentials: true
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

        /* ---------- Process adResponse and extract the bids into the bids array ------------ */

        // FOR DEBUG
        // var __id = returnParcels[0].requestId.toString();
        // adResponse = {"seatbid":[{"bid":[{"id":"585d8318-b4b2-43e5-ad20-c9facbbd2eaf","auid":11,
        //             "nurl":"https://media.grid.bidswitch.net/supply_win_notice/0n_pFLYEh9cF5zYi6MIekkLGKg8ifEq_8nMHxgfGu6zFeVobWx4tWOuqAjQAcBwZLPpmAWX2Ii8NIfJT0q9vof9GP7S957tK0mSjgBdezgKw0BKwQ6F9V_yZlNd9Rp4eAd9_S3e27f1qBOe_gNn-Tv0V7MbwelP8dJKMlbv1bLx__zs9ICvgrOJoWAFP7Db95uTeQ51rgKYg8wuVe5n6xyavhBTYioCvGQgPijUEYU0KzKZmvw89o8jyZWCs4XVXoKbKiZX_WmuyqlY5KgBLd-7I3BYNKPanWvS8ehp_LkQh_cIxtVKz01C3b9eMmm5gPkZYdaPGuQpkDVuHnUlbq7v9Odhf6V2ymNqmQazSteUjnJjisdlgLgLfKU0TtsMKpg0DAQKt1UzXfK7GqmngZ_xsfACyIltjqpDhVtxcj_7ixgKlZebDORiyrVX13fOyZfO4Wn4cUTvxFNoQOLShlCV6J3ZW0yuCN_sNv8uXWEM0_cZrxRS4blLfEaMkbxavlTfrdhM1zODnBb61dbZVJZC4HEeqJX-60BDK28nEuRSoBW-7Xmsaw6g1URxHaAIDspJ84JTxSB_NJZ57F5aZxGqNeg",
        //             "content_type":"video","adomain":["wwf.panda.org"],"w":640,
        //             "adm":"<VAST version=\"3.0\">\n\t<Ad id=\"70ae714b_585d8318-b4b2-43e5-ad20-c9facbbd2eaf\">\n\t\t<Wrapper>\n\t\t\t<AdSystem>BidSwitch</AdSystem>\n\t\t\t<VASTAdTagURI>\n\t\t\t\t<![CDATA[https://sandbox.bidswitch.net/vast/CrtFj-DimD3VLm3x3m5lf5xNX9bMPnqGbt-mufGU72BcZ4U16tVfcde8I7iSnIU7eqzuqtvqOIC1bnQl_Oep-W-msd0F8_fsrHXaVOF8u4Svx80V-8kzFCJTGMnb74wVsLv2B4M-DUY-am85-9nsLEHKLPAKcr3E53shcE2pTA5MSzXS-TY8xTaDUlqSu2LYo1RhjfTc0fR3Ctj_1H3Bq6spc26swTgDAkMsHnT2ZiAeF4fe5723NhUpIDbqQKDoDMz5ZxMz52cfqMlKZDIyKJhhz0EKJte9jG2iu5ZSyF_AJZRvHte3bOG96v6vIpY6aad5TlJt-yDxf-IgngRnh-8ObwwyopTTpmYjS1QovPsHUQca8x1XlUzJzDz68TnOazqxHgbb5DPm2pjzfb_S4KBfoh0i]]>\n\t\t\t</VASTAdTagURI>\n\t\t\t<Error>\n\t\t\t\t<![CDATA[https://aws-fr.bidswitch.net/vast_error/zELd7nf4LggaqYjTzjApeMciQUIuKUWEcjeRJITtcJbtT8w6aDdFJH5k0rp1rBsclG0ceRbtXUbGgd3PUtXmm8r_FO2ryCyOQjXNmZDjyObgPDcnZE5ZN7JvMV7ZPuvUL2fQOC_-tBQtkwhe2t7oNbKv36Lsjp36F1HWFaX0NWwQ0s_Ryklh8YsJhLkjXqrE-_1HJxUG6FvWC72Z-LfDJUF3bsPAftD_B0LvBFhDyedE_CL9JvjCOUiT0IxX16AHUjUKEmSTanWwCT2VUD4JJuvlxW_0BUd8XlzXnGqE7wCnNhuve8OHIjkD6ASy4RoJJcGPnlOCARPfzpfwy6--5xiYYT4rX0D6cLXYCtrxVUshZH00qELI5qKvVU-iolnPEVPz5fAHl51NuF9MHFgLnWpSFQ1lwV_Jns7Ohct7YStVO_9eru0gb0xtphzTJNupAMusc5_NV2JMeUhLMANPFKa8ejDQFLVFk07R0D7DFo3IhOwaLreggffU-0d3LRY01Dr1uKMnNpcSlwU1cTrHENbgQcUE1WDAz6d4PVVSizjpZmFkRkWB9YcKcW_jhkGKEw04_LvVtehuI5VIFLzYWSzbBfteMqfSLiTx0B9Gm-G5xa-Nveoz2qyi5sksfV03YnNnINoCSITJxcqxfu1xEJTy3jUvUeNimYc5awqb3ow0e-vITY9G2GhcrY3RMMnu2_h5har4R3NpT6Jvl9hbVOWRP2MPZ249VH9Q7AGZVFGjLl8rYsB--ora9aXwj6tJLwj_G-iB7IEpniAcNCh545JDMnsGwoPlAoPZ5t4w4meQBZrhcsj0R9hk6f5-eg0ua1e1Cwj62Mgyf0Tm6RWQC6hCJYLOX8-MU5aPcKsizW3OctS4-2VdxlrNIvfvExS5evTkjTffWTcxdWvNpT_KeUGR_faHa8f0by3QbPA/]]>\n\t\t\t</Error>\n\t\t\t<Impression>\n\t\t\t\t<![CDATA[https://aws-fr.bidswitch.net/imp/10/BSWhttp_A_B_Bsandbox.bidswitch.net_Bimp_Btracker_BCrtFj4AyFDPYLdRfqyVdaMCkpvzZgnZzZBR1KdepYjD-E1BD0rKHxi73tb1LI2teTCsXTDDkHqjVXdFzJpsj-fqYL4dCPvWAErp5RobHU9b9KaxxoazUBf9__7LiZwRcJHlcUk0jKhMbPOhbWaxG675wAgbgOzd5RiKW__m3SsY90WdEGc__4RNIefO5orBubVdGRdrwPrwSJ9YTgS3-cnTl7JP30bBs8dpg2__0nAEHnXdRADHPjTAfvEoEycox1zGL7SqWmDU63eyAtEkWFccdZPaisf21FgadoPKQyKP0PgKiYCugOpZefsV__YT5wHOInprye4tFTMqwabi__VEnzCqL-O0O4EsZ0DWOXuIrS-h7YPqlxo6yqro0dEUexGmaHPfQl6__zmEhQbxgDtatKywXiCEAZPT_B_I_WAUCTION__PRICE_AHMAC__SHA1_X/zELd7nf4LggaqYjTzjApeMciQUIuKUWEcjeRJITtcJbtT8w6aDdFJH5k0rp1rBsclG0ceRbtXUbGgd3PUtXmm8r_FO2ryCyOQjXNmZDjyObgPDcnZE5ZN7JvMV7ZPuvUL2fQOC_-tBQtkwhe2t7oNbKv36Lsjp36F1HWFaX0NWwQ0s_Ryklh8YsJhLkjXqrE-_1HJxUG6FvWC72Z-LfDJUF3bsPAftD_B0LvBFhDyedE_CL9JvjCOUiT0IxX16AHUjUKEmSTanWwCT2VUD4JJuvlxW_0BUd8XlzXnGqE7wCnNhuve8OHIjkD6ASy4RoJJcGPnlOCARPfzpfwy6--5xiYYT4rX0D6cLXYCtrxVUshZH00qELI5qKvVU-iolnPEVPz5fAHl51NuF9MHFgLnWpSFQ1lwV_Jns7Ohct7YStVO_9eru0gb0xtphzTJNupAMusc5_NV2JMeUhLMANPFKa8ejDQFLVFk07R0D7DFo3IhOwaLreggffU-0d3LRY01Dr1uKMnNpcSlwU1cTrHENbgQcUE1WDAz6d4PVVSizjpZmFkRkWB9YcKcW_jhkGKEw04_LvVtehuI5VIFLzYWSzbBfteMqfSLiTx0B9Gm-G5xa-Nveoz2qyi5sksfV03YnNnINoCSITJxcqxfu1xEJTy3jUvUeNimYc5awqb3ow0e-vITY9G2GhcrY3RMMnu2_h5har4R3NpT6Jvl9hbVOWRP2MPZ249VH9Q7AGZVFGjLl8rYsB--ora9aXwj6tJLwj_G-iB7IEpniAcNCh545JDMnsGwoPlAoPZ5t4w4meQBZrhcsj0R9hk6f5-eg0ua1e1Cwj62Mgyf0Tm6RWQC6hCJYLOX8-MU5aPcKsizW3OctS4-2VdxlrNIvfvExS5evTkjTffWTcxdWvNpT_KeUGR_faHa8f0by3QbPA/]]>\n\t\t\t</Impression>\n\t\t\t<Impression>\n\t\t\t\t<![CDATA[https://aws-fr-sync.bidswitch.net/sync_cors?ssp=themediagrid&dsp_id=13&imp=1]]>\n\t\t\t</Impression>\n\t\t\t<Creatives>\n\t\t\t\t<Creative>\n\t\t\t\t\t<Linear>\n\t\t\t\t\t\t<TrackingEvents>\n\t\t\t\t\t\t\t<Tracking event=\"skip\">\n\t\t\t\t\t\t\t\t<![CDATA[https://media.grid.bidswitch.net/vast_event/0n_pFLYEh9cF5zYi6MIekkLGKg8ifEq_8nMHxgfGu6zFeVobWx4tWOuqAjQAcBwZLPpmAWX2Ii8NIfJT0q9vof9GP7S957tK0mSjgBdezgKw0BKwQ6F9V_yZlNd9Rp4eAd9_S3e27f1qBOe_gNn-Tv0V7MbwelP8dJKMlbv1bLx__zs9ICvgrOJoWAFP7Db95uTeQ51rgKYg8wuVe5n6xyavhBTYioCvGQgPijUEYU0KzKZmvw89o8jyZWCs4XVXoKbKiZX_WmuyqlY5KgBLd-7I3BYNKPanWvS8ehp_LkQh_cIxtVKz01C3b9eMmm5gPkZYdaPGuQpkDVuHnUlbq7v9Odhf6V2ymNqmQazSteUjnJjisdlgLgLfKU0TtsMKpg0DAQKt1UzXfK7GqmngZ_xsfACyIltjqpDhVtxcj_7ixgKlZebDORiyrVX13fOyZfO4Wn4cUTvxFNoQOLShlCV6J3ZW0yuCN_sNv8uXWEM0_cZrxRS4blLfEaMkbxavlTfrdhM1zODnBb61dbZVJZC4HEeqJX-60BDK28nEuRSoBW-7Xmsaw6g1URxHaAIDspJ84JTxSB_NJZ57F5aZxGqNeg/skip]]>\n\t\t\t\t\t\t\t</Tracking>\n\t\t\t\t\t\t\t<Tracking event=\"close\">\n\t\t\t\t\t\t\t\t<![CDATA[https://media.grid.bidswitch.net/vast_event/0n_pFLYEh9cF5zYi6MIekkLGKg8ifEq_8nMHxgfGu6zFeVobWx4tWOuqAjQAcBwZLPpmAWX2Ii8NIfJT0q9vof9GP7S957tK0mSjgBdezgKw0BKwQ6F9V_yZlNd9Rp4eAd9_S3e27f1qBOe_gNn-Tv0V7MbwelP8dJKMlbv1bLx__zs9ICvgrOJoWAFP7Db95uTeQ51rgKYg8wuVe5n6xyavhBTYioCvGQgPijUEYU0KzKZmvw89o8jyZWCs4XVXoKbKiZX_WmuyqlY5KgBLd-7I3BYNKPanWvS8ehp_LkQh_cIxtVKz01C3b9eMmm5gPkZYdaPGuQpkDVuHnUlbq7v9Odhf6V2ymNqmQazSteUjnJjisdlgLgLfKU0TtsMKpg0DAQKt1UzXfK7GqmngZ_xsfACyIltjqpDhVtxcj_7ixgKlZebDORiyrVX13fOyZfO4Wn4cUTvxFNoQOLShlCV6J3ZW0yuCN_sNv8uXWEM0_cZrxRS4blLfEaMkbxavlTfrdhM1zODnBb61dbZVJZC4HEeqJX-60BDK28nEuRSoBW-7Xmsaw6g1URxHaAIDspJ84JTxSB_NJZ57F5aZxGqNeg/close]]>\n\t\t\t\t\t\t\t</Tracking>\n\t\t\t\t\t\t\t<Tracking event=\"rewind\">\n\t\t\t\t\t\t\t\t<![CDATA[https://media.grid.bidswitch.net/vast_event/0n_pFLYEh9cF5zYi6MIekkLGKg8ifEq_8nMHxgfGu6zFeVobWx4tWOuqAjQAcBwZLPpmAWX2Ii8NIfJT0q9vof9GP7S957tK0mSjgBdezgKw0BKwQ6F9V_yZlNd9Rp4eAd9_S3e27f1qBOe_gNn-Tv0V7MbwelP8dJKMlbv1bLx__zs9ICvgrOJoWAFP7Db95uTeQ51rgKYg8wuVe5n6xyavhBTYioCvGQgPijUEYU0KzKZmvw89o8jyZWCs4XVXoKbKiZX_WmuyqlY5KgBLd-7I3BYNKPanWvS8ehp_LkQh_cIxtVKz01C3b9eMmm5gPkZYdaPGuQpkDVuHnUlbq7v9Odhf6V2ymNqmQazSteUjnJjisdlgLgLfKU0TtsMKpg0DAQKt1UzXfK7GqmngZ_xsfACyIltjqpDhVtxcj_7ixgKlZebDORiyrVX13fOyZfO4Wn4cUTvxFNoQOLShlCV6J3ZW0yuCN_sNv8uXWEM0_cZrxRS4blLfEaMkbxavlTfrdhM1zODnBb61dbZVJZC4HEeqJX-60BDK28nEuRSoBW-7Xmsaw6g1URxHaAIDspJ84JTxSB_NJZ57F5aZxGqNeg/rewind]]>\n\t\t\t\t\t\t\t</Tracking>\n\t\t\t\t\t\t\t<Tracking event=\"acceptInvitation\">\n\t\t\t\t\t\t\t\t<![CDATA[https://media.grid.bidswitch.net/vast_event/0n_pFLYEh9cF5zYi6MIekkLGKg8ifEq_8nMHxgfGu6zFeVobWx4tWOuqAjQAcBwZLPpmAWX2Ii8NIfJT0q9vof9GP7S957tK0mSjgBdezgKw0BKwQ6F9V_yZlNd9Rp4eAd9_S3e27f1qBOe_gNn-Tv0V7MbwelP8dJKMlbv1bLx__zs9ICvgrOJoWAFP7Db95uTeQ51rgKYg8wuVe5n6xyavhBTYioCvGQgPijUEYU0KzKZmvw89o8jyZWCs4XVXoKbKiZX_WmuyqlY5KgBLd-7I3BYNKPanWvS8ehp_LkQh_cIxtVKz01C3b9eMmm5gPkZYdaPGuQpkDVuHnUlbq7v9Odhf6V2ymNqmQazSteUjnJjisdlgLgLfKU0TtsMKpg0DAQKt1UzXfK7GqmngZ_xsfACyIltjqpDhVtxcj_7ixgKlZebDORiyrVX13fOyZfO4Wn4cUTvxFNoQOLShlCV6J3ZW0yuCN_sNv8uXWEM0_cZrxRS4blLfEaMkbxavlTfrdhM1zODnBb61dbZVJZC4HEeqJX-60BDK28nEuRSoBW-7Xmsaw6g1URxHaAIDspJ84JTxSB_NJZ57F5aZxGqNeg/acceptInvitation]]>\n\t\t\t\t\t\t\t</Tracking>\n\t\t\t\t\t\t\t<Tracking event=\"collapse\">\n\t\t\t\t\t\t\t\t<![CDATA[https://media.grid.bidswitch.net/vast_event/0n_pFLYEh9cF5zYi6MIekkLGKg8ifEq_8nMHxgfGu6zFeVobWx4tWOuqAjQAcBwZLPpmAWX2Ii8NIfJT0q9vof9GP7S957tK0mSjgBdezgKw0BKwQ6F9V_yZlNd9Rp4eAd9_S3e27f1qBOe_gNn-Tv0V7MbwelP8dJKMlbv1bLx__zs9ICvgrOJoWAFP7Db95uTeQ51rgKYg8wuVe5n6xyavhBTYioCvGQgPijUEYU0KzKZmvw89o8jyZWCs4XVXoKbKiZX_WmuyqlY5KgBLd-7I3BYNKPanWvS8ehp_LkQh_cIxtVKz01C3b9eMmm5gPkZYdaPGuQpkDVuHnUlbq7v9Odhf6V2ymNqmQazSteUjnJjisdlgLgLfKU0TtsMKpg0DAQKt1UzXfK7GqmngZ_xsfACyIltjqpDhVtxcj_7ixgKlZebDORiyrVX13fOyZfO4Wn4cUTvxFNoQOLShlCV6J3ZW0yuCN_sNv8uXWEM0_cZrxRS4blLfEaMkbxavlTfrdhM1zODnBb61dbZVJZC4HEeqJX-60BDK28nEuRSoBW-7Xmsaw6g1URxHaAIDspJ84JTxSB_NJZ57F5aZxGqNeg/collapse]]>\n\t\t\t\t\t\t\t</Tracking>\n\t\t\t\t\t\t\t<Tracking offset=\"00:00:05\" event=\"progress\">\n\t\t\t\t\t\t\t\t<![CDATA[https://media.grid.bidswitch.net/vast_event/0n_pFLYEh9cF5zYi6MIekkLGKg8ifEq_8nMHxgfGu6zFeVobWx4tWOuqAjQAcBwZLPpmAWX2Ii8NIfJT0q9vof9GP7S957tK0mSjgBdezgKw0BKwQ6F9V_yZlNd9Rp4eAd9_S3e27f1qBOe_gNn-Tv0V7MbwelP8dJKMlbv1bLx__zs9ICvgrOJoWAFP7Db95uTeQ51rgKYg8wuVe5n6xyavhBTYioCvGQgPijUEYU0KzKZmvw89o8jyZWCs4XVXoKbKiZX_WmuyqlY5KgBLd-7I3BYNKPanWvS8ehp_LkQh_cIxtVKz01C3b9eMmm5gPkZYdaPGuQpkDVuHnUlbq7v9Odhf6V2ymNqmQazSteUjnJjisdlgLgLfKU0TtsMKpg0DAQKt1UzXfK7GqmngZ_xsfACyIltjqpDhVtxcj_7ixgKlZebDORiyrVX13fOyZfO4Wn4cUTvxFNoQOLShlCV6J3ZW0yuCN_sNv8uXWEM0_cZrxRS4blLfEaMkbxavlTfrdhM1zODnBb61dbZVJZC4HEeqJX-60BDK28nEuRSoBW-7Xmsaw6g1URxHaAIDspJ84JTxSB_NJZ57F5aZxGqNeg/view]]>\n\t\t\t\t\t\t\t</Tracking>\n\t\t\t\t\t\t\t<Tracking event=\"thirdQuartile\">\n\t\t\t\t\t\t\t\t<![CDATA[https://media.grid.bidswitch.net/vast_event/0n_pFLYEh9cF5zYi6MIekkLGKg8ifEq_8nMHxgfGu6zFeVobWx4tWOuqAjQAcBwZLPpmAWX2Ii8NIfJT0q9vof9GP7S957tK0mSjgBdezgKw0BKwQ6F9V_yZlNd9Rp4eAd9_S3e27f1qBOe_gNn-Tv0V7MbwelP8dJKMlbv1bLx__zs9ICvgrOJoWAFP7Db95uTeQ51rgKYg8wuVe5n6xyavhBTYioCvGQgPijUEYU0KzKZmvw89o8jyZWCs4XVXoKbKiZX_WmuyqlY5KgBLd-7I3BYNKPanWvS8ehp_LkQh_cIxtVKz01C3b9eMmm5gPkZYdaPGuQpkDVuHnUlbq7v9Odhf6V2ymNqmQazSteUjnJjisdlgLgLfKU0TtsMKpg0DAQKt1UzXfK7GqmngZ_xsfACyIltjqpDhVtxcj_7ixgKlZebDORiyrVX13fOyZfO4Wn4cUTvxFNoQOLShlCV6J3ZW0yuCN_sNv8uXWEM0_cZrxRS4blLfEaMkbxavlTfrdhM1zODnBb61dbZVJZC4HEeqJX-60BDK28nEuRSoBW-7Xmsaw6g1URxHaAIDspJ84JTxSB_NJZ57F5aZxGqNeg/thirdQuartile]]>\n\t\t\t\t\t\t\t</Tracking>\n\t\t\t\t\t\t\t<Tracking event=\"complete\">\n\t\t\t\t\t\t\t\t<![CDATA[https://media.grid.bidswitch.net/vast_event/0n_pFLYEh9cF5zYi6MIekkLGKg8ifEq_8nMHxgfGu6zFeVobWx4tWOuqAjQAcBwZLPpmAWX2Ii8NIfJT0q9vof9GP7S957tK0mSjgBdezgKw0BKwQ6F9V_yZlNd9Rp4eAd9_S3e27f1qBOe_gNn-Tv0V7MbwelP8dJKMlbv1bLx__zs9ICvgrOJoWAFP7Db95uTeQ51rgKYg8wuVe5n6xyavhBTYioCvGQgPijUEYU0KzKZmvw89o8jyZWCs4XVXoKbKiZX_WmuyqlY5KgBLd-7I3BYNKPanWvS8ehp_LkQh_cIxtVKz01C3b9eMmm5gPkZYdaPGuQpkDVuHnUlbq7v9Odhf6V2ymNqmQazSteUjnJjisdlgLgLfKU0TtsMKpg0DAQKt1UzXfK7GqmngZ_xsfACyIltjqpDhVtxcj_7ixgKlZebDORiyrVX13fOyZfO4Wn4cUTvxFNoQOLShlCV6J3ZW0yuCN_sNv8uXWEM0_cZrxRS4blLfEaMkbxavlTfrdhM1zODnBb61dbZVJZC4HEeqJX-60BDK28nEuRSoBW-7Xmsaw6g1URxHaAIDspJ84JTxSB_NJZ57F5aZxGqNeg/complete]]>\n\t\t\t\t\t\t\t</Tracking>\n\t\t\t\t\t\t\t<Tracking event=\"creativeView\">\n\t\t\t\t\t\t\t\t<![CDATA[https://media.grid.bidswitch.net/vast_event/0n_pFLYEh9cF5zYi6MIekkLGKg8ifEq_8nMHxgfGu6zFeVobWx4tWOuqAjQAcBwZLPpmAWX2Ii8NIfJT0q9vof9GP7S957tK0mSjgBdezgKw0BKwQ6F9V_yZlNd9Rp4eAd9_S3e27f1qBOe_gNn-Tv0V7MbwelP8dJKMlbv1bLx__zs9ICvgrOJoWAFP7Db95uTeQ51rgKYg8wuVe5n6xyavhBTYioCvGQgPijUEYU0KzKZmvw89o8jyZWCs4XVXoKbKiZX_WmuyqlY5KgBLd-7I3BYNKPanWvS8ehp_LkQh_cIxtVKz01C3b9eMmm5gPkZYdaPGuQpkDVuHnUlbq7v9Odhf6V2ymNqmQazSteUjnJjisdlgLgLfKU0TtsMKpg0DAQKt1UzXfK7GqmngZ_xsfACyIltjqpDhVtxcj_7ixgKlZebDORiyrVX13fOyZfO4Wn4cUTvxFNoQOLShlCV6J3ZW0yuCN_sNv8uXWEM0_cZrxRS4blLfEaMkbxavlTfrdhM1zODnBb61dbZVJZC4HEeqJX-60BDK28nEuRSoBW-7Xmsaw6g1URxHaAIDspJ84JTxSB_NJZ57F5aZxGqNeg/creativeView]]>\n\t\t\t\t\t\t\t</Tracking>\n\t\t\t\t\t\t\t<Tracking event=\"resume\">\n\t\t\t\t\t\t\t\t<![CDATA[https://media.grid.bidswitch.net/vast_event/0n_pFLYEh9cF5zYi6MIekkLGKg8ifEq_8nMHxgfGu6zFeVobWx4tWOuqAjQAcBwZLPpmAWX2Ii8NIfJT0q9vof9GP7S957tK0mSjgBdezgKw0BKwQ6F9V_yZlNd9Rp4eAd9_S3e27f1qBOe_gNn-Tv0V7MbwelP8dJKMlbv1bLx__zs9ICvgrOJoWAFP7Db95uTeQ51rgKYg8wuVe5n6xyavhBTYioCvGQgPijUEYU0KzKZmvw89o8jyZWCs4XVXoKbKiZX_WmuyqlY5KgBLd-7I3BYNKPanWvS8ehp_LkQh_cIxtVKz01C3b9eMmm5gPkZYdaPGuQpkDVuHnUlbq7v9Odhf6V2ymNqmQazSteUjnJjisdlgLgLfKU0TtsMKpg0DAQKt1UzXfK7GqmngZ_xsfACyIltjqpDhVtxcj_7ixgKlZebDORiyrVX13fOyZfO4Wn4cUTvxFNoQOLShlCV6J3ZW0yuCN_sNv8uXWEM0_cZrxRS4blLfEaMkbxavlTfrdhM1zODnBb61dbZVJZC4HEeqJX-60BDK28nEuRSoBW-7Xmsaw6g1URxHaAIDspJ84JTxSB_NJZ57F5aZxGqNeg/resume]]>\n\t\t\t\t\t\t\t</Tracking>\n\t\t\t\t\t\t\t<Tracking event=\"mute\">\n\t\t\t\t\t\t\t\t<![CDATA[https://media.grid.bidswitch.net/vast_event/0n_pFLYEh9cF5zYi6MIekkLGKg8ifEq_8nMHxgfGu6zFeVobWx4tWOuqAjQAcBwZLPpmAWX2Ii8NIfJT0q9vof9GP7S957tK0mSjgBdezgKw0BKwQ6F9V_yZlNd9Rp4eAd9_S3e27f1qBOe_gNn-Tv0V7MbwelP8dJKMlbv1bLx__zs9ICvgrOJoWAFP7Db95uTeQ51rgKYg8wuVe5n6xyavhBTYioCvGQgPijUEYU0KzKZmvw89o8jyZWCs4XVXoKbKiZX_WmuyqlY5KgBLd-7I3BYNKPanWvS8ehp_LkQh_cIxtVKz01C3b9eMmm5gPkZYdaPGuQpkDVuHnUlbq7v9Odhf6V2ymNqmQazSteUjnJjisdlgLgLfKU0TtsMKpg0DAQKt1UzXfK7GqmngZ_xsfACyIltjqpDhVtxcj_7ixgKlZebDORiyrVX13fOyZfO4Wn4cUTvxFNoQOLShlCV6J3ZW0yuCN_sNv8uXWEM0_cZrxRS4blLfEaMkbxavlTfrdhM1zODnBb61dbZVJZC4HEeqJX-60BDK28nEuRSoBW-7Xmsaw6g1URxHaAIDspJ84JTxSB_NJZ57F5aZxGqNeg/mute]]>\n\t\t\t\t\t\t\t</Tracking>\n\t\t\t\t\t\t\t<Tracking event=\"pause\">\n\t\t\t\t\t\t\t\t<![CDATA[https://media.grid.bidswitch.net/vast_event/0n_pFLYEh9cF5zYi6MIekkLGKg8ifEq_8nMHxgfGu6zFeVobWx4tWOuqAjQAcBwZLPpmAWX2Ii8NIfJT0q9vof9GP7S957tK0mSjgBdezgKw0BKwQ6F9V_yZlNd9Rp4eAd9_S3e27f1qBOe_gNn-Tv0V7MbwelP8dJKMlbv1bLx__zs9ICvgrOJoWAFP7Db95uTeQ51rgKYg8wuVe5n6xyavhBTYioCvGQgPijUEYU0KzKZmvw89o8jyZWCs4XVXoKbKiZX_WmuyqlY5KgBLd-7I3BYNKPanWvS8ehp_LkQh_cIxtVKz01C3b9eMmm5gPkZYdaPGuQpkDVuHnUlbq7v9Odhf6V2ymNqmQazSteUjnJjisdlgLgLfKU0TtsMKpg0DAQKt1UzXfK7GqmngZ_xsfACyIltjqpDhVtxcj_7ixgKlZebDORiyrVX13fOyZfO4Wn4cUTvxFNoQOLShlCV6J3ZW0yuCN_sNv8uXWEM0_cZrxRS4blLfEaMkbxavlTfrdhM1zODnBb61dbZVJZC4HEeqJX-60BDK28nEuRSoBW-7Xmsaw6g1URxHaAIDspJ84JTxSB_NJZ57F5aZxGqNeg/pause]]>\n\t\t\t\t\t\t\t</Tracking>\n\t\t\t\t\t\t\t<Tracking event=\"midpoint\">\n\t\t\t\t\t\t\t\t<![CDATA[https://media.grid.bidswitch.net/vast_event/0n_pFLYEh9cF5zYi6MIekkLGKg8ifEq_8nMHxgfGu6zFeVobWx4tWOuqAjQAcBwZLPpmAWX2Ii8NIfJT0q9vof9GP7S957tK0mSjgBdezgKw0BKwQ6F9V_yZlNd9Rp4eAd9_S3e27f1qBOe_gNn-Tv0V7MbwelP8dJKMlbv1bLx__zs9ICvgrOJoWAFP7Db95uTeQ51rgKYg8wuVe5n6xyavhBTYioCvGQgPijUEYU0KzKZmvw89o8jyZWCs4XVXoKbKiZX_WmuyqlY5KgBLd-7I3BYNKPanWvS8ehp_LkQh_cIxtVKz01C3b9eMmm5gPkZYdaPGuQpkDVuHnUlbq7v9Odhf6V2ymNqmQazSteUjnJjisdlgLgLfKU0TtsMKpg0DAQKt1UzXfK7GqmngZ_xsfACyIltjqpDhVtxcj_7ixgKlZebDORiyrVX13fOyZfO4Wn4cUTvxFNoQOLShlCV6J3ZW0yuCN_sNv8uXWEM0_cZrxRS4blLfEaMkbxavlTfrdhM1zODnBb61dbZVJZC4HEeqJX-60BDK28nEuRSoBW-7Xmsaw6g1URxHaAIDspJ84JTxSB_NJZ57F5aZxGqNeg/midpoint]]>\n\t\t\t\t\t\t\t</Tracking>\n\t\t\t\t\t\t\t<Tracking event=\"start\">\n\t\t\t\t\t\t\t\t<![CDATA[https://media.grid.bidswitch.net/vast_event/0n_pFLYEh9cF5zYi6MIekkLGKg8ifEq_8nMHxgfGu6zFeVobWx4tWOuqAjQAcBwZLPpmAWX2Ii8NIfJT0q9vof9GP7S957tK0mSjgBdezgKw0BKwQ6F9V_yZlNd9Rp4eAd9_S3e27f1qBOe_gNn-Tv0V7MbwelP8dJKMlbv1bLx__zs9ICvgrOJoWAFP7Db95uTeQ51rgKYg8wuVe5n6xyavhBTYioCvGQgPijUEYU0KzKZmvw89o8jyZWCs4XVXoKbKiZX_WmuyqlY5KgBLd-7I3BYNKPanWvS8ehp_LkQh_cIxtVKz01C3b9eMmm5gPkZYdaPGuQpkDVuHnUlbq7v9Odhf6V2ymNqmQazSteUjnJjisdlgLgLfKU0TtsMKpg0DAQKt1UzXfK7GqmngZ_xsfACyIltjqpDhVtxcj_7ixgKlZebDORiyrVX13fOyZfO4Wn4cUTvxFNoQOLShlCV6J3ZW0yuCN_sNv8uXWEM0_cZrxRS4blLfEaMkbxavlTfrdhM1zODnBb61dbZVJZC4HEeqJX-60BDK28nEuRSoBW-7Xmsaw6g1URxHaAIDspJ84JTxSB_NJZ57F5aZxGqNeg/start]]>\n\t\t\t\t\t\t\t</Tracking>\n\t\t\t\t\t\t\t<Tracking event=\"firstQuartile\">\n\t\t\t\t\t\t\t\t<![CDATA[https://media.grid.bidswitch.net/vast_event/0n_pFLYEh9cF5zYi6MIekkLGKg8ifEq_8nMHxgfGu6zFeVobWx4tWOuqAjQAcBwZLPpmAWX2Ii8NIfJT0q9vof9GP7S957tK0mSjgBdezgKw0BKwQ6F9V_yZlNd9Rp4eAd9_S3e27f1qBOe_gNn-Tv0V7MbwelP8dJKMlbv1bLx__zs9ICvgrOJoWAFP7Db95uTeQ51rgKYg8wuVe5n6xyavhBTYioCvGQgPijUEYU0KzKZmvw89o8jyZWCs4XVXoKbKiZX_WmuyqlY5KgBLd-7I3BYNKPanWvS8ehp_LkQh_cIxtVKz01C3b9eMmm5gPkZYdaPGuQpkDVuHnUlbq7v9Odhf6V2ymNqmQazSteUjnJjisdlgLgLfKU0TtsMKpg0DAQKt1UzXfK7GqmngZ_xsfACyIltjqpDhVtxcj_7ixgKlZebDORiyrVX13fOyZfO4Wn4cUTvxFNoQOLShlCV6J3ZW0yuCN_sNv8uXWEM0_cZrxRS4blLfEaMkbxavlTfrdhM1zODnBb61dbZVJZC4HEeqJX-60BDK28nEuRSoBW-7Xmsaw6g1URxHaAIDspJ84JTxSB_NJZ57F5aZxGqNeg/firstQuartile]]>\n\t\t\t\t\t\t\t</Tracking>\n\t\t\t\t\t\t\t<Tracking event=\"unmute\">\n\t\t\t\t\t\t\t\t<![CDATA[https://media.grid.bidswitch.net/vast_event/0n_pFLYEh9cF5zYi6MIekkLGKg8ifEq_8nMHxgfGu6zFeVobWx4tWOuqAjQAcBwZLPpmAWX2Ii8NIfJT0q9vof9GP7S957tK0mSjgBdezgKw0BKwQ6F9V_yZlNd9Rp4eAd9_S3e27f1qBOe_gNn-Tv0V7MbwelP8dJKMlbv1bLx__zs9ICvgrOJoWAFP7Db95uTeQ51rgKYg8wuVe5n6xyavhBTYioCvGQgPijUEYU0KzKZmvw89o8jyZWCs4XVXoKbKiZX_WmuyqlY5KgBLd-7I3BYNKPanWvS8ehp_LkQh_cIxtVKz01C3b9eMmm5gPkZYdaPGuQpkDVuHnUlbq7v9Odhf6V2ymNqmQazSteUjnJjisdlgLgLfKU0TtsMKpg0DAQKt1UzXfK7GqmngZ_xsfACyIltjqpDhVtxcj_7ixgKlZebDORiyrVX13fOyZfO4Wn4cUTvxFNoQOLShlCV6J3ZW0yuCN_sNv8uXWEM0_cZrxRS4blLfEaMkbxavlTfrdhM1zODnBb61dbZVJZC4HEeqJX-60BDK28nEuRSoBW-7Xmsaw6g1URxHaAIDspJ84JTxSB_NJZ57F5aZxGqNeg/unmute]]>\n\t\t\t\t\t\t\t</Tracking>\n\t\t\t\t\t\t\t<Tracking event=\"fullscreen\">\n\t\t\t\t\t\t\t\t<![CDATA[https://media.grid.bidswitch.net/vast_event/0n_pFLYEh9cF5zYi6MIekkLGKg8ifEq_8nMHxgfGu6zFeVobWx4tWOuqAjQAcBwZLPpmAWX2Ii8NIfJT0q9vof9GP7S957tK0mSjgBdezgKw0BKwQ6F9V_yZlNd9Rp4eAd9_S3e27f1qBOe_gNn-Tv0V7MbwelP8dJKMlbv1bLx__zs9ICvgrOJoWAFP7Db95uTeQ51rgKYg8wuVe5n6xyavhBTYioCvGQgPijUEYU0KzKZmvw89o8jyZWCs4XVXoKbKiZX_WmuyqlY5KgBLd-7I3BYNKPanWvS8ehp_LkQh_cIxtVKz01C3b9eMmm5gPkZYdaPGuQpkDVuHnUlbq7v9Odhf6V2ymNqmQazSteUjnJjisdlgLgLfKU0TtsMKpg0DAQKt1UzXfK7GqmngZ_xsfACyIltjqpDhVtxcj_7ixgKlZebDORiyrVX13fOyZfO4Wn4cUTvxFNoQOLShlCV6J3ZW0yuCN_sNv8uXWEM0_cZrxRS4blLfEaMkbxavlTfrdhM1zODnBb61dbZVJZC4HEeqJX-60BDK28nEuRSoBW-7Xmsaw6g1URxHaAIDspJ84JTxSB_NJZ57F5aZxGqNeg/fullscreen]]>\n\t\t\t\t\t\t\t</Tracking>\n\t\t\t\t\t\t\t<Tracking event=\"expand\">\n\t\t\t\t\t\t\t\t<![CDATA[https://media.grid.bidswitch.net/vast_event/0n_pFLYEh9cF5zYi6MIekkLGKg8ifEq_8nMHxgfGu6zFeVobWx4tWOuqAjQAcBwZLPpmAWX2Ii8NIfJT0q9vof9GP7S957tK0mSjgBdezgKw0BKwQ6F9V_yZlNd9Rp4eAd9_S3e27f1qBOe_gNn-Tv0V7MbwelP8dJKMlbv1bLx__zs9ICvgrOJoWAFP7Db95uTeQ51rgKYg8wuVe5n6xyavhBTYioCvGQgPijUEYU0KzKZmvw89o8jyZWCs4XVXoKbKiZX_WmuyqlY5KgBLd-7I3BYNKPanWvS8ehp_LkQh_cIxtVKz01C3b9eMmm5gPkZYdaPGuQpkDVuHnUlbq7v9Odhf6V2ymNqmQazSteUjnJjisdlgLgLfKU0TtsMKpg0DAQKt1UzXfK7GqmngZ_xsfACyIltjqpDhVtxcj_7ixgKlZebDORiyrVX13fOyZfO4Wn4cUTvxFNoQOLShlCV6J3ZW0yuCN_sNv8uXWEM0_cZrxRS4blLfEaMkbxavlTfrdhM1zODnBb61dbZVJZC4HEeqJX-60BDK28nEuRSoBW-7Xmsaw6g1URxHaAIDspJ84JTxSB_NJZ57F5aZxGqNeg/expand]]>\n\t\t\t\t\t\t\t</Tracking>\n\t\t\t\t\t\t</TrackingEvents>\n\t\t\t\t\t\t<VideoClicks>\n\t\t\t\t\t\t\t<ClickTracking>\n\t\t\t\t\t\t\t\t<![CDATA[]]>\n\t\t\t\t\t\t\t</ClickTracking>\n\t\t\t\t\t\t</VideoClicks>\n\t\t\t\t\t</Linear>\n\t\t\t\t</Creative>\n\t\t\t</Creatives>\n\t\t\t<Impression>\n\t\t\t\t<![CDATA[https://media.grid.bidswitch.net/imp/0n_pFLYEh9cF5zYi6MIekkLGKg8ifEq_8nMHxgfGu6zFeVobWx4tWOuqAjQAcBwZLPpmAWX2Ii8NIfJT0q9vof9GP7S957tK0mSjgBdezgKw0BKwQ6F9V_yZlNd9Rp4eAd9_S3e27f1qBOe_gNn-Tv0V7MbwelP8dJKMlbv1bLx__zs9ICvgrOJoWAFP7Db95uTeQ51rgKYg8wuVe5n6xyavhBTYioCvGQgPijUEYU0KzKZmvw89o8jyZWCs4XVXoKbKiZX_WmuyqlY5KgBLd-7I3BYNKPanWvS8ehp_LkQh_cIxtVKz01C3b9eMmm5gPkZYdaPGuQpkDVuHnUlbq7v9Odhf6V2ymNqmQazSteUjnJjisdlgLgLfKU0TtsMKpg0DAQKt1UzXfK7GqmngZ_xsfACyIltjqpDhVtxcj_7ixgKlZebDORiyrVX13fOyZfO4Wn4cUTvxFNoQOLShlCV6J3ZW0yuCN_sNv8uXWEM0_cZrxRS4blLfEaMkbxavlTfrdhM1zODnBb61dbZVJZC4HEeqJX-60BDK28nEuRSoBW-7Xmsaw6g1URxHaAIDspJ84JTxSB_NJZ57F5aZxGqNeg/http_A_B_Bghent-aws-fr.bidswitch.net_Bwin__notice_Bverona__bid_Crid_RzELd7nf4LggaqYjTzjApeMciQUIuKUWEcjeRJITtcJbtT8w6aDdFJH5k0rp1rBsclG0ceRbtXUbGgd3PUtXmm8r__FO2ryCyOQjXNmZDjyObgPDcnZE5ZN7JvMV7ZPuvUL2fQOC__-tBQtkwhe2t7oNbKv36Lsjp36F1HWFaX0NWwQ0s__Ryklh8YsJhLkjXqrE-__1HJxUG6FvWC72Z-LfDJUF3bsPAftD__B0LvBFhDyedE__CL9JvjCOUiT0IxX16AHUjUKEmSTanWwCT2VUD4JJuvlxW__0BUd8XlzXnGqE7wCnNhuve8OHIjkD6ASy4RoJJcGPnlOCARPfzpfwy6--5xiYYT4rX0D6cLXYCtrxVUshZH00qELI5qKvVU-iolnPEVPz5fAHl51NuF9MHFgLnWpSFQ1lwV__Jns7Ohct7YStVO__9eru0gb0xtphzTJNupAMusc5__NV2JMeUhLMANPFKa8ejDQFLVFk07R0D7DFo3IhOwaLreggffU-0d3LRY01Dr1uKMnNpcSlwU1cTrHENbgQcUE1WDAz6d4PVVSizjpZmFkRkWB9YcKcW__jhkGKEw04__LvVtehuI5VIFLzYWSzbBfteMqfSLiTx0B9Gm-G5xa-Nveoz2qyi5sksfV03YnNnINoCSITJxcqxfu1xEJTy3jUvUeNimYc5awqb3ow0e-vITY9G2GhcrY3RMMnu2__h5har4R3NpT6Jvl9hbVOWRP2MPZ249VH9Q7AGZVFGjLl8rYsB--ora9aXwj6tJLwj__G-iB7IEpniAcNCh545JDMnsGwoPlAoPZ5t4w4meQBZrhcsj0R9hk6f5-eg0ua1e1Cwj62Mgyf0Tm6RWQC6hCJYLOX8-MU5aPcKsizW3OctS4-2VdxlrNIvfvExS5evTkjTffWTcxdWvNpT__KeUGR__faHa8f0by3QbPA_Jp_R_I_WAUCTION__PRICE_X_Jaid_R]]>\n\t\t\t</Impression>\n\t\t\t<Error>\n\t\t\t\t<![CDATA[https://media.grid.bidswitch.net/vast_error/0n_pFLYEh9cF5zYi6MIekkLGKg8ifEq_8nMHxgfGu6zFeVobWx4tWOuqAjQAcBwZLPpmAWX2Ii8NIfJT0q9vof9GP7S957tK0mSjgBdezgKw0BKwQ6F9V_yZlNd9Rp4eAd9_S3e27f1qBOe_gNn-Tv0V7MbwelP8dJKMlbv1bLx__zs9ICvgrOJoWAFP7Db95uTeQ51rgKYg8wuVe5n6xyavhBTYioCvGQgPijUEYU0KzKZmvw89o8jyZWCs4XVXoKbKiZX_WmuyqlY5KgBLd-7I3BYNKPanWvS8ehp_LkQh_cIxtVKz01C3b9eMmm5gPkZYdaPGuQpkDVuHnUlbq7v9Odhf6V2ymNqmQazSteUjnJjisdlgLgLfKU0TtsMKpg0DAQKt1UzXfK7GqmngZ_xsfACyIltjqpDhVtxcj_7ixgKlZebDORiyrVX13fOyZfO4Wn4cUTvxFNoQOLShlCV6J3ZW0yuCN_sNv8uXWEM0_cZrxRS4blLfEaMkbxavlTfrdhM1zODnBb61dbZVJZC4HEeqJX-60BDK28nEuRSoBW-7Xmsaw6g1URxHaAIDspJ84JTxSB_NJZ57F5aZxGqNeg?err_code=[ERRORCODE]]]>\n\t\t\t</Error>\n\t\t</Wrapper>\n\t</Ad>\n</VAST>\n\n",
        //             // "adm": "<VAST version=\"3.0\">\n\t<Ad id=\"97517771\">\n\t\t<Wrapper>\n\t\t\t<AdSystem version=\"3.0\">adnxs</AdSystem>\n\t\t\t<VASTAdTagURI>\n\t\t\t\t<![CDATA[https://media.grid.bidswitch.net/imp/Y87oy_2_IMbasYrAikVUj5fuk0L6yZzsb91cpY1PwPje_cGdhV6ibY_Ab42SZEhSi0vxP7wwCMOkY5EnmvA77Zm9Ihw3WhPaRCqYAVLw_Ei-oPaSDGSxbnT0IPs8fIdIymVaroW_plHPSVZBHAxBeJljaqptTs42as7y-NdLCEf31xd6mD7oZQ6vDDUcyDou0706e67MbFATwUvPTQdxT4qPnYXhmb7QEd7lLbLzaccGPql4cDGEIY_FueXiaJpKmoc7jqf9pGiaV-u2pqjnNBTrwSVvoXcFhVmES9_uhHIoqrKjMYk-vVgjJTuP6uosARjT-xissypeBjEKKHnZvjsloZetYBgi6uri6GQD1hCu_v5aXV_IGBHXiOVQv9ualVmgK8ZubT1FdSrC99AX1pJmr_6aJK-kp5L00T8kFF-kCckA60W8Vl6gnuQM7x8_aC5h4GkfSZbZHSJk76UoqfA9kyJ7K3n6BbahZm6Pnu2mSikUMq6jgYxYVbN52DaY-pFQhCBcyxY-4ysqGE9VYfjl5tUz-3CkW-NXXZaDwq6Ut3ZYSA//https_A_B_Bfra1-ib.adnxs.com_Bab_Can__audit_R0_Jreferrer_Rhttp_U3A_U2F_U2Fprebid.localhost.ru_U2Fintegrationexamples_U2Fgpt_U2Fvideo__outstream.html_U3Fpbjs__debug_U3Dtrue_Je_RwqT__3QL9DKB9BgAAAwDWAAUBCJXi7owGEM6D94HOro6uOhj9vrHXvdzwg2sqNgkAAAECCCRAEQEHEAAAJEAZEQkAIREJACkRCQAxEQmoMIHSpwY47UhA7UhIAlDLgcAuWJzxW2AAaOWljwF49NYFgAEBigEDVVNEkgUG8FKYAQGgAQGoAQGwAQC4AQPAAQPIAQLQAQnYAQDgAQDwAQCKAjt1ZignYScsIDI1Mjk4ODUsIDE2Mzc1OTMzNjUpO3VmKCdyJywgOTc1MTc3NzEsIC4eAPCakgLhAyF0a3hGbEFqWS1Md0tFTXVCd0M0WUFDQ2M4VnN3QURnQVFBUkk3VWhRZ2RLbkJsZ0FZUDBEYUFCd0dIZ0lnQUhxQVlnQkNKQUJBSmdCQUtBQkFhZ0JBN0FCQUxrQjg2MXFwQUFBSkVEQkFmT3RhcVFBQUNSQXlRR2RaUDNaWThQVlA5a0JBQUFBQUFBQThEX2dBUUQxQVEBDyxDWUFnQ2dBZ0MxQWcFEAA5CQjgRGdBZ0RvQWdENEFnQ0FBd0dZQXdHNkF3bEdVa0V4T2pRMk5UWGdBX3NzaUFRQWtBUUFtQVFCd1FRAUUJAQhNa0UJCQEBGERZQkFEeEIBCw0BHGlBV3ZKS2tGDQ8YQThELXhCUREOEEFBd1FVGQ0ATRkoDEFBRFIuKAAAMi4oALhPQUZ3SVE5OEFXY3c5OEMtQVhkdEpvQmdnWURWVk5FaUFZQWtBWUJtQVlBb1FZQQ1hLGtRS2dHQWJJR0pBaw0TDEFBQUIdvwRCawESCQEAQx0YRExnR0NnLi6aApUBITZ3OUJ2UTblASRuUEZiSUFRb0FEFTVUa1FEb0pSbEpCTVRvME5qVTFRUHNzUxH5DFBBX1URDAxBQUFXHQwAWR0MAGEdDABjHQwQZUFDSkEdEPBGwgI4aHR0cDovL3ByZWJpZC5vcmcvZGV2LWRvY3Mvc2hvdy1vdXRzdHJlYW0tdmlkZW8tYWRzLmh0bWzYAgDgAq2YSOoCV2gyQwCQbG9jYWxob3N0LnJ1L2ludGVncmF0aW9uZXhhbXBsZXMvZ3B0LwVMAF8VXAAuAVJ0P3BianNfZGVidWc9dHJ1ZfICEQoGQURWX0lEEgcyaVsFFAhDUEcFFBg1NzU5Mzg4ARQIBUNQARM0CDIxOTcwMDA48gIPCggBPGxGUkVREgMxMTfyAg0KCFJFTV9VU0VSEgEw8gIMCSIUQ09ERRIABQ8BWREPEAsKB0NQFQ4QCQoFSU8BYgQA8gEaBElPFRo4EwoPQ1VTVE9NX01PREVMDSQIGgoWMhYAHExFQUZfTkFNBWoIHgoaNh0ACEFTVAE-EElGSUVEAWIcDQoIU1BMSVQBTfCVATCAAwCIAwGQAwCYAxSgAwGqAwDAA-CoAcgDANgDAOADAOgDAPgDA4AEAJIECS9vcGVucnRiMpgEAKIEDDkxLjc5LjE1LjIzNagEkNsbsgQQCAAQABiABSDgAygCMAA4A7gEAMAEAMgEANIEDjkzMjUjRlJBMTo0NjU12gQCCAHgBADwBMuBwC6IBQGYBQCgBf____________AQW4AaoFJGJhMmJhZTVhLTMzNGUtNDRkMi1iNjliLTM4ODU0ZGExOGI5N8AFAMkFAAABAhTwP9IFCQkBCgEBcNgFAeAFAfAFw5UL-gUECAAQAJAGAZgGALgGAMEGASEwAADwP9AG9S__aBhYKEAkRGQFcEAAYAOAGBPIGAggAgAcBiAcAoAdAugcPAUhIGAAgADAAOIcZQADIB__TWBdIHDRV2ATgI2gcGCSdI4AcA6gcCCADwB96U7gGKCAIQAA.._Js_Rf49ba62298d72ea09397b35b04a8befd9f8eb4e4_Jpp_R_I_WAUCTION__PRICE_X]]>\n\t\t\t</VASTAdTagURI>\n\t\t\t<Impression>\n\t\t\t\t<![CDATA[https://ib.adnxs.com/nop]]>\n\t\t\t</Impression>\n\t\t\t<Creatives>\n\t\t\t\t<Creative adID=\"97517771\">\n\t\t\t\t\t<Linear>\n\t\t\t\t\t\t<TrackingEvents>\n\t\t\t\t\t\t\t<Tracking event=\"skip\">\n\t\t\t\t\t\t\t\t<![CDATA[https://media.grid.bidswitch.net/vast_event/Y87oy_2_IMbasYrAikVUj5fuk0L6yZzsb91cpY1PwPje_cGdhV6ibY_Ab42SZEhSi0vxP7wwCMOkY5EnmvA77Zm9Ihw3WhPaRCqYAVLw_Ei-oPaSDGSxbnT0IPs8fIdIymVaroW_plHPSVZBHAxBeJljaqptTs42as7y-NdLCEf31xd6mD7oZQ6vDDUcyDou0706e67MbFATwUvPTQdxT4qPnYXhmb7QEd7lLbLzaccGPql4cDGEIY_FueXiaJpKmoc7jqf9pGiaV-u2pqjnNBTrwSVvoXcFhVmES9_uhHIoqrKjMYk-vVgjJTuP6uosARjT-xissypeBjEKKHnZvjsloZetYBgi6uri6GQD1hCu_v5aXV_IGBHXiOVQv9ualVmgK8ZubT1FdSrC99AX1pJmr_6aJK-kp5L00T8kFF-kCckA60W8Vl6gnuQM7x8_aC5h4GkfSZbZHSJk76UoqfA9kyJ7K3n6BbahZm6Pnu2mSikUMq6jgYxYVbN52DaY-pFQhCBcyxY-4ysqGE9VYfjl5tUz-3CkW-NXXZaDwq6Ut3ZYSA/skip]]>\n\t\t\t\t\t\t\t</Tracking>\n\t\t\t\t\t\t\t<Tracking event=\"close\">\n\t\t\t\t\t\t\t\t<![CDATA[https://media.grid.bidswitch.net/vast_event/Y87oy_2_IMbasYrAikVUj5fuk0L6yZzsb91cpY1PwPje_cGdhV6ibY_Ab42SZEhSi0vxP7wwCMOkY5EnmvA77Zm9Ihw3WhPaRCqYAVLw_Ei-oPaSDGSxbnT0IPs8fIdIymVaroW_plHPSVZBHAxBeJljaqptTs42as7y-NdLCEf31xd6mD7oZQ6vDDUcyDou0706e67MbFATwUvPTQdxT4qPnYXhmb7QEd7lLbLzaccGPql4cDGEIY_FueXiaJpKmoc7jqf9pGiaV-u2pqjnNBTrwSVvoXcFhVmES9_uhHIoqrKjMYk-vVgjJTuP6uosARjT-xissypeBjEKKHnZvjsloZetYBgi6uri6GQD1hCu_v5aXV_IGBHXiOVQv9ualVmgK8ZubT1FdSrC99AX1pJmr_6aJK-kp5L00T8kFF-kCckA60W8Vl6gnuQM7x8_aC5h4GkfSZbZHSJk76UoqfA9kyJ7K3n6BbahZm6Pnu2mSikUMq6jgYxYVbN52DaY-pFQhCBcyxY-4ysqGE9VYfjl5tUz-3CkW-NXXZaDwq6Ut3ZYSA/close]]>\n\t\t\t\t\t\t\t</Tracking>\n\t\t\t\t\t\t\t<Tracking event=\"rewind\">\n\t\t\t\t\t\t\t\t<![CDATA[https://media.grid.bidswitch.net/vast_event/Y87oy_2_IMbasYrAikVUj5fuk0L6yZzsb91cpY1PwPje_cGdhV6ibY_Ab42SZEhSi0vxP7wwCMOkY5EnmvA77Zm9Ihw3WhPaRCqYAVLw_Ei-oPaSDGSxbnT0IPs8fIdIymVaroW_plHPSVZBHAxBeJljaqptTs42as7y-NdLCEf31xd6mD7oZQ6vDDUcyDou0706e67MbFATwUvPTQdxT4qPnYXhmb7QEd7lLbLzaccGPql4cDGEIY_FueXiaJpKmoc7jqf9pGiaV-u2pqjnNBTrwSVvoXcFhVmES9_uhHIoqrKjMYk-vVgjJTuP6uosARjT-xissypeBjEKKHnZvjsloZetYBgi6uri6GQD1hCu_v5aXV_IGBHXiOVQv9ualVmgK8ZubT1FdSrC99AX1pJmr_6aJK-kp5L00T8kFF-kCckA60W8Vl6gnuQM7x8_aC5h4GkfSZbZHSJk76UoqfA9kyJ7K3n6BbahZm6Pnu2mSikUMq6jgYxYVbN52DaY-pFQhCBcyxY-4ysqGE9VYfjl5tUz-3CkW-NXXZaDwq6Ut3ZYSA/rewind]]>\n\t\t\t\t\t\t\t</Tracking>\n\t\t\t\t\t\t\t<Tracking event=\"acceptInvitation\">\n\t\t\t\t\t\t\t\t<![CDATA[https://media.grid.bidswitch.net/vast_event/Y87oy_2_IMbasYrAikVUj5fuk0L6yZzsb91cpY1PwPje_cGdhV6ibY_Ab42SZEhSi0vxP7wwCMOkY5EnmvA77Zm9Ihw3WhPaRCqYAVLw_Ei-oPaSDGSxbnT0IPs8fIdIymVaroW_plHPSVZBHAxBeJljaqptTs42as7y-NdLCEf31xd6mD7oZQ6vDDUcyDou0706e67MbFATwUvPTQdxT4qPnYXhmb7QEd7lLbLzaccGPql4cDGEIY_FueXiaJpKmoc7jqf9pGiaV-u2pqjnNBTrwSVvoXcFhVmES9_uhHIoqrKjMYk-vVgjJTuP6uosARjT-xissypeBjEKKHnZvjsloZetYBgi6uri6GQD1hCu_v5aXV_IGBHXiOVQv9ualVmgK8ZubT1FdSrC99AX1pJmr_6aJK-kp5L00T8kFF-kCckA60W8Vl6gnuQM7x8_aC5h4GkfSZbZHSJk76UoqfA9kyJ7K3n6BbahZm6Pnu2mSikUMq6jgYxYVbN52DaY-pFQhCBcyxY-4ysqGE9VYfjl5tUz-3CkW-NXXZaDwq6Ut3ZYSA/acceptInvitation]]>\n\t\t\t\t\t\t\t</Tracking>\n\t\t\t\t\t\t\t<Tracking event=\"collapse\">\n\t\t\t\t\t\t\t\t<![CDATA[https://media.grid.bidswitch.net/vast_event/Y87oy_2_IMbasYrAikVUj5fuk0L6yZzsb91cpY1PwPje_cGdhV6ibY_Ab42SZEhSi0vxP7wwCMOkY5EnmvA77Zm9Ihw3WhPaRCqYAVLw_Ei-oPaSDGSxbnT0IPs8fIdIymVaroW_plHPSVZBHAxBeJljaqptTs42as7y-NdLCEf31xd6mD7oZQ6vDDUcyDou0706e67MbFATwUvPTQdxT4qPnYXhmb7QEd7lLbLzaccGPql4cDGEIY_FueXiaJpKmoc7jqf9pGiaV-u2pqjnNBTrwSVvoXcFhVmES9_uhHIoqrKjMYk-vVgjJTuP6uosARjT-xissypeBjEKKHnZvjsloZetYBgi6uri6GQD1hCu_v5aXV_IGBHXiOVQv9ualVmgK8ZubT1FdSrC99AX1pJmr_6aJK-kp5L00T8kFF-kCckA60W8Vl6gnuQM7x8_aC5h4GkfSZbZHSJk76UoqfA9kyJ7K3n6BbahZm6Pnu2mSikUMq6jgYxYVbN52DaY-pFQhCBcyxY-4ysqGE9VYfjl5tUz-3CkW-NXXZaDwq6Ut3ZYSA/collapse]]>\n\t\t\t\t\t\t\t</Tracking>\n\t\t\t\t\t\t\t<Tracking offset=\"00:00:05\" event=\"progress\">\n\t\t\t\t\t\t\t\t<![CDATA[https://media.grid.bidswitch.net/vast_event/Y87oy_2_IMbasYrAikVUj5fuk0L6yZzsb91cpY1PwPje_cGdhV6ibY_Ab42SZEhSi0vxP7wwCMOkY5EnmvA77Zm9Ihw3WhPaRCqYAVLw_Ei-oPaSDGSxbnT0IPs8fIdIymVaroW_plHPSVZBHAxBeJljaqptTs42as7y-NdLCEf31xd6mD7oZQ6vDDUcyDou0706e67MbFATwUvPTQdxT4qPnYXhmb7QEd7lLbLzaccGPql4cDGEIY_FueXiaJpKmoc7jqf9pGiaV-u2pqjnNBTrwSVvoXcFhVmES9_uhHIoqrKjMYk-vVgjJTuP6uosARjT-xissypeBjEKKHnZvjsloZetYBgi6uri6GQD1hCu_v5aXV_IGBHXiOVQv9ualVmgK8ZubT1FdSrC99AX1pJmr_6aJK-kp5L00T8kFF-kCckA60W8Vl6gnuQM7x8_aC5h4GkfSZbZHSJk76UoqfA9kyJ7K3n6BbahZm6Pnu2mSikUMq6jgYxYVbN52DaY-pFQhCBcyxY-4ysqGE9VYfjl5tUz-3CkW-NXXZaDwq6Ut3ZYSA/view]]>\n\t\t\t\t\t\t\t</Tracking>\n\t\t\t\t\t\t\t<Tracking event=\"thirdQuartile\">\n\t\t\t\t\t\t\t\t<![CDATA[https://media.grid.bidswitch.net/vast_event/Y87oy_2_IMbasYrAikVUj5fuk0L6yZzsb91cpY1PwPje_cGdhV6ibY_Ab42SZEhSi0vxP7wwCMOkY5EnmvA77Zm9Ihw3WhPaRCqYAVLw_Ei-oPaSDGSxbnT0IPs8fIdIymVaroW_plHPSVZBHAxBeJljaqptTs42as7y-NdLCEf31xd6mD7oZQ6vDDUcyDou0706e67MbFATwUvPTQdxT4qPnYXhmb7QEd7lLbLzaccGPql4cDGEIY_FueXiaJpKmoc7jqf9pGiaV-u2pqjnNBTrwSVvoXcFhVmES9_uhHIoqrKjMYk-vVgjJTuP6uosARjT-xissypeBjEKKHnZvjsloZetYBgi6uri6GQD1hCu_v5aXV_IGBHXiOVQv9ualVmgK8ZubT1FdSrC99AX1pJmr_6aJK-kp5L00T8kFF-kCckA60W8Vl6gnuQM7x8_aC5h4GkfSZbZHSJk76UoqfA9kyJ7K3n6BbahZm6Pnu2mSikUMq6jgYxYVbN52DaY-pFQhCBcyxY-4ysqGE9VYfjl5tUz-3CkW-NXXZaDwq6Ut3ZYSA/thirdQuartile]]>\n\t\t\t\t\t\t\t</Tracking>\n\t\t\t\t\t\t\t<Tracking event=\"complete\">\n\t\t\t\t\t\t\t\t<![CDATA[https://media.grid.bidswitch.net/vast_event/Y87oy_2_IMbasYrAikVUj5fuk0L6yZzsb91cpY1PwPje_cGdhV6ibY_Ab42SZEhSi0vxP7wwCMOkY5EnmvA77Zm9Ihw3WhPaRCqYAVLw_Ei-oPaSDGSxbnT0IPs8fIdIymVaroW_plHPSVZBHAxBeJljaqptTs42as7y-NdLCEf31xd6mD7oZQ6vDDUcyDou0706e67MbFATwUvPTQdxT4qPnYXhmb7QEd7lLbLzaccGPql4cDGEIY_FueXiaJpKmoc7jqf9pGiaV-u2pqjnNBTrwSVvoXcFhVmES9_uhHIoqrKjMYk-vVgjJTuP6uosARjT-xissypeBjEKKHnZvjsloZetYBgi6uri6GQD1hCu_v5aXV_IGBHXiOVQv9ualVmgK8ZubT1FdSrC99AX1pJmr_6aJK-kp5L00T8kFF-kCckA60W8Vl6gnuQM7x8_aC5h4GkfSZbZHSJk76UoqfA9kyJ7K3n6BbahZm6Pnu2mSikUMq6jgYxYVbN52DaY-pFQhCBcyxY-4ysqGE9VYfjl5tUz-3CkW-NXXZaDwq6Ut3ZYSA/complete]]>\n\t\t\t\t\t\t\t</Tracking>\n\t\t\t\t\t\t\t<Tracking event=\"creativeView\">\n\t\t\t\t\t\t\t\t<![CDATA[https://media.grid.bidswitch.net/vast_event/Y87oy_2_IMbasYrAikVUj5fuk0L6yZzsb91cpY1PwPje_cGdhV6ibY_Ab42SZEhSi0vxP7wwCMOkY5EnmvA77Zm9Ihw3WhPaRCqYAVLw_Ei-oPaSDGSxbnT0IPs8fIdIymVaroW_plHPSVZBHAxBeJljaqptTs42as7y-NdLCEf31xd6mD7oZQ6vDDUcyDou0706e67MbFATwUvPTQdxT4qPnYXhmb7QEd7lLbLzaccGPql4cDGEIY_FueXiaJpKmoc7jqf9pGiaV-u2pqjnNBTrwSVvoXcFhVmES9_uhHIoqrKjMYk-vVgjJTuP6uosARjT-xissypeBjEKKHnZvjsloZetYBgi6uri6GQD1hCu_v5aXV_IGBHXiOVQv9ualVmgK8ZubT1FdSrC99AX1pJmr_6aJK-kp5L00T8kFF-kCckA60W8Vl6gnuQM7x8_aC5h4GkfSZbZHSJk76UoqfA9kyJ7K3n6BbahZm6Pnu2mSikUMq6jgYxYVbN52DaY-pFQhCBcyxY-4ysqGE9VYfjl5tUz-3CkW-NXXZaDwq6Ut3ZYSA/creativeView]]>\n\t\t\t\t\t\t\t</Tracking>\n\t\t\t\t\t\t\t<Tracking event=\"resume\">\n\t\t\t\t\t\t\t\t<![CDATA[https://media.grid.bidswitch.net/vast_event/Y87oy_2_IMbasYrAikVUj5fuk0L6yZzsb91cpY1PwPje_cGdhV6ibY_Ab42SZEhSi0vxP7wwCMOkY5EnmvA77Zm9Ihw3WhPaRCqYAVLw_Ei-oPaSDGSxbnT0IPs8fIdIymVaroW_plHPSVZBHAxBeJljaqptTs42as7y-NdLCEf31xd6mD7oZQ6vDDUcyDou0706e67MbFATwUvPTQdxT4qPnYXhmb7QEd7lLbLzaccGPql4cDGEIY_FueXiaJpKmoc7jqf9pGiaV-u2pqjnNBTrwSVvoXcFhVmES9_uhHIoqrKjMYk-vVgjJTuP6uosARjT-xissypeBjEKKHnZvjsloZetYBgi6uri6GQD1hCu_v5aXV_IGBHXiOVQv9ualVmgK8ZubT1FdSrC99AX1pJmr_6aJK-kp5L00T8kFF-kCckA60W8Vl6gnuQM7x8_aC5h4GkfSZbZHSJk76UoqfA9kyJ7K3n6BbahZm6Pnu2mSikUMq6jgYxYVbN52DaY-pFQhCBcyxY-4ysqGE9VYfjl5tUz-3CkW-NXXZaDwq6Ut3ZYSA/resume]]>\n\t\t\t\t\t\t\t</Tracking>\n\t\t\t\t\t\t\t<Tracking event=\"mute\">\n\t\t\t\t\t\t\t\t<![CDATA[https://media.grid.bidswitch.net/vast_event/Y87oy_2_IMbasYrAikVUj5fuk0L6yZzsb91cpY1PwPje_cGdhV6ibY_Ab42SZEhSi0vxP7wwCMOkY5EnmvA77Zm9Ihw3WhPaRCqYAVLw_Ei-oPaSDGSxbnT0IPs8fIdIymVaroW_plHPSVZBHAxBeJljaqptTs42as7y-NdLCEf31xd6mD7oZQ6vDDUcyDou0706e67MbFATwUvPTQdxT4qPnYXhmb7QEd7lLbLzaccGPql4cDGEIY_FueXiaJpKmoc7jqf9pGiaV-u2pqjnNBTrwSVvoXcFhVmES9_uhHIoqrKjMYk-vVgjJTuP6uosARjT-xissypeBjEKKHnZvjsloZetYBgi6uri6GQD1hCu_v5aXV_IGBHXiOVQv9ualVmgK8ZubT1FdSrC99AX1pJmr_6aJK-kp5L00T8kFF-kCckA60W8Vl6gnuQM7x8_aC5h4GkfSZbZHSJk76UoqfA9kyJ7K3n6BbahZm6Pnu2mSikUMq6jgYxYVbN52DaY-pFQhCBcyxY-4ysqGE9VYfjl5tUz-3CkW-NXXZaDwq6Ut3ZYSA/mute]]>\n\t\t\t\t\t\t\t</Tracking>\n\t\t\t\t\t\t\t<Tracking event=\"pause\">\n\t\t\t\t\t\t\t\t<![CDATA[https://media.grid.bidswitch.net/vast_event/Y87oy_2_IMbasYrAikVUj5fuk0L6yZzsb91cpY1PwPje_cGdhV6ibY_Ab42SZEhSi0vxP7wwCMOkY5EnmvA77Zm9Ihw3WhPaRCqYAVLw_Ei-oPaSDGSxbnT0IPs8fIdIymVaroW_plHPSVZBHAxBeJljaqptTs42as7y-NdLCEf31xd6mD7oZQ6vDDUcyDou0706e67MbFATwUvPTQdxT4qPnYXhmb7QEd7lLbLzaccGPql4cDGEIY_FueXiaJpKmoc7jqf9pGiaV-u2pqjnNBTrwSVvoXcFhVmES9_uhHIoqrKjMYk-vVgjJTuP6uosARjT-xissypeBjEKKHnZvjsloZetYBgi6uri6GQD1hCu_v5aXV_IGBHXiOVQv9ualVmgK8ZubT1FdSrC99AX1pJmr_6aJK-kp5L00T8kFF-kCckA60W8Vl6gnuQM7x8_aC5h4GkfSZbZHSJk76UoqfA9kyJ7K3n6BbahZm6Pnu2mSikUMq6jgYxYVbN52DaY-pFQhCBcyxY-4ysqGE9VYfjl5tUz-3CkW-NXXZaDwq6Ut3ZYSA/pause]]>\n\t\t\t\t\t\t\t</Tracking>\n\t\t\t\t\t\t\t<Tracking event=\"midpoint\">\n\t\t\t\t\t\t\t\t<![CDATA[https://media.grid.bidswitch.net/vast_event/Y87oy_2_IMbasYrAikVUj5fuk0L6yZzsb91cpY1PwPje_cGdhV6ibY_Ab42SZEhSi0vxP7wwCMOkY5EnmvA77Zm9Ihw3WhPaRCqYAVLw_Ei-oPaSDGSxbnT0IPs8fIdIymVaroW_plHPSVZBHAxBeJljaqptTs42as7y-NdLCEf31xd6mD7oZQ6vDDUcyDou0706e67MbFATwUvPTQdxT4qPnYXhmb7QEd7lLbLzaccGPql4cDGEIY_FueXiaJpKmoc7jqf9pGiaV-u2pqjnNBTrwSVvoXcFhVmES9_uhHIoqrKjMYk-vVgjJTuP6uosARjT-xissypeBjEKKHnZvjsloZetYBgi6uri6GQD1hCu_v5aXV_IGBHXiOVQv9ualVmgK8ZubT1FdSrC99AX1pJmr_6aJK-kp5L00T8kFF-kCckA60W8Vl6gnuQM7x8_aC5h4GkfSZbZHSJk76UoqfA9kyJ7K3n6BbahZm6Pnu2mSikUMq6jgYxYVbN52DaY-pFQhCBcyxY-4ysqGE9VYfjl5tUz-3CkW-NXXZaDwq6Ut3ZYSA/midpoint]]>\n\t\t\t\t\t\t\t</Tracking>\n\t\t\t\t\t\t\t<Tracking event=\"start\">\n\t\t\t\t\t\t\t\t<![CDATA[https://media.grid.bidswitch.net/vast_event/Y87oy_2_IMbasYrAikVUj5fuk0L6yZzsb91cpY1PwPje_cGdhV6ibY_Ab42SZEhSi0vxP7wwCMOkY5EnmvA77Zm9Ihw3WhPaRCqYAVLw_Ei-oPaSDGSxbnT0IPs8fIdIymVaroW_plHPSVZBHAxBeJljaqptTs42as7y-NdLCEf31xd6mD7oZQ6vDDUcyDou0706e67MbFATwUvPTQdxT4qPnYXhmb7QEd7lLbLzaccGPql4cDGEIY_FueXiaJpKmoc7jqf9pGiaV-u2pqjnNBTrwSVvoXcFhVmES9_uhHIoqrKjMYk-vVgjJTuP6uosARjT-xissypeBjEKKHnZvjsloZetYBgi6uri6GQD1hCu_v5aXV_IGBHXiOVQv9ualVmgK8ZubT1FdSrC99AX1pJmr_6aJK-kp5L00T8kFF-kCckA60W8Vl6gnuQM7x8_aC5h4GkfSZbZHSJk76UoqfA9kyJ7K3n6BbahZm6Pnu2mSikUMq6jgYxYVbN52DaY-pFQhCBcyxY-4ysqGE9VYfjl5tUz-3CkW-NXXZaDwq6Ut3ZYSA/start]]>\n\t\t\t\t\t\t\t</Tracking>\n\t\t\t\t\t\t\t<Tracking event=\"firstQuartile\">\n\t\t\t\t\t\t\t\t<![CDATA[https://media.grid.bidswitch.net/vast_event/Y87oy_2_IMbasYrAikVUj5fuk0L6yZzsb91cpY1PwPje_cGdhV6ibY_Ab42SZEhSi0vxP7wwCMOkY5EnmvA77Zm9Ihw3WhPaRCqYAVLw_Ei-oPaSDGSxbnT0IPs8fIdIymVaroW_plHPSVZBHAxBeJljaqptTs42as7y-NdLCEf31xd6mD7oZQ6vDDUcyDou0706e67MbFATwUvPTQdxT4qPnYXhmb7QEd7lLbLzaccGPql4cDGEIY_FueXiaJpKmoc7jqf9pGiaV-u2pqjnNBTrwSVvoXcFhVmES9_uhHIoqrKjMYk-vVgjJTuP6uosARjT-xissypeBjEKKHnZvjsloZetYBgi6uri6GQD1hCu_v5aXV_IGBHXiOVQv9ualVmgK8ZubT1FdSrC99AX1pJmr_6aJK-kp5L00T8kFF-kCckA60W8Vl6gnuQM7x8_aC5h4GkfSZbZHSJk76UoqfA9kyJ7K3n6BbahZm6Pnu2mSikUMq6jgYxYVbN52DaY-pFQhCBcyxY-4ysqGE9VYfjl5tUz-3CkW-NXXZaDwq6Ut3ZYSA/firstQuartile]]>\n\t\t\t\t\t\t\t</Tracking>\n\t\t\t\t\t\t\t<Tracking event=\"unmute\">\n\t\t\t\t\t\t\t\t<![CDATA[https://media.grid.bidswitch.net/vast_event/Y87oy_2_IMbasYrAikVUj5fuk0L6yZzsb91cpY1PwPje_cGdhV6ibY_Ab42SZEhSi0vxP7wwCMOkY5EnmvA77Zm9Ihw3WhPaRCqYAVLw_Ei-oPaSDGSxbnT0IPs8fIdIymVaroW_plHPSVZBHAxBeJljaqptTs42as7y-NdLCEf31xd6mD7oZQ6vDDUcyDou0706e67MbFATwUvPTQdxT4qPnYXhmb7QEd7lLbLzaccGPql4cDGEIY_FueXiaJpKmoc7jqf9pGiaV-u2pqjnNBTrwSVvoXcFhVmES9_uhHIoqrKjMYk-vVgjJTuP6uosARjT-xissypeBjEKKHnZvjsloZetYBgi6uri6GQD1hCu_v5aXV_IGBHXiOVQv9ualVmgK8ZubT1FdSrC99AX1pJmr_6aJK-kp5L00T8kFF-kCckA60W8Vl6gnuQM7x8_aC5h4GkfSZbZHSJk76UoqfA9kyJ7K3n6BbahZm6Pnu2mSikUMq6jgYxYVbN52DaY-pFQhCBcyxY-4ysqGE9VYfjl5tUz-3CkW-NXXZaDwq6Ut3ZYSA/unmute]]>\n\t\t\t\t\t\t\t</Tracking>\n\t\t\t\t\t\t\t<Tracking event=\"fullscreen\">\n\t\t\t\t\t\t\t\t<![CDATA[https://media.grid.bidswitch.net/vast_event/Y87oy_2_IMbasYrAikVUj5fuk0L6yZzsb91cpY1PwPje_cGdhV6ibY_Ab42SZEhSi0vxP7wwCMOkY5EnmvA77Zm9Ihw3WhPaRCqYAVLw_Ei-oPaSDGSxbnT0IPs8fIdIymVaroW_plHPSVZBHAxBeJljaqptTs42as7y-NdLCEf31xd6mD7oZQ6vDDUcyDou0706e67MbFATwUvPTQdxT4qPnYXhmb7QEd7lLbLzaccGPql4cDGEIY_FueXiaJpKmoc7jqf9pGiaV-u2pqjnNBTrwSVvoXcFhVmES9_uhHIoqrKjMYk-vVgjJTuP6uosARjT-xissypeBjEKKHnZvjsloZetYBgi6uri6GQD1hCu_v5aXV_IGBHXiOVQv9ualVmgK8ZubT1FdSrC99AX1pJmr_6aJK-kp5L00T8kFF-kCckA60W8Vl6gnuQM7x8_aC5h4GkfSZbZHSJk76UoqfA9kyJ7K3n6BbahZm6Pnu2mSikUMq6jgYxYVbN52DaY-pFQhCBcyxY-4ysqGE9VYfjl5tUz-3CkW-NXXZaDwq6Ut3ZYSA/fullscreen]]>\n\t\t\t\t\t\t\t</Tracking>\n\t\t\t\t\t\t\t<Tracking event=\"expand\">\n\t\t\t\t\t\t\t\t<![CDATA[https://media.grid.bidswitch.net/vast_event/Y87oy_2_IMbasYrAikVUj5fuk0L6yZzsb91cpY1PwPje_cGdhV6ibY_Ab42SZEhSi0vxP7wwCMOkY5EnmvA77Zm9Ihw3WhPaRCqYAVLw_Ei-oPaSDGSxbnT0IPs8fIdIymVaroW_plHPSVZBHAxBeJljaqptTs42as7y-NdLCEf31xd6mD7oZQ6vDDUcyDou0706e67MbFATwUvPTQdxT4qPnYXhmb7QEd7lLbLzaccGPql4cDGEIY_FueXiaJpKmoc7jqf9pGiaV-u2pqjnNBTrwSVvoXcFhVmES9_uhHIoqrKjMYk-vVgjJTuP6uosARjT-xissypeBjEKKHnZvjsloZetYBgi6uri6GQD1hCu_v5aXV_IGBHXiOVQv9ualVmgK8ZubT1FdSrC99AX1pJmr_6aJK-kp5L00T8kFF-kCckA60W8Vl6gnuQM7x8_aC5h4GkfSZbZHSJk76UoqfA9kyJ7K3n6BbahZm6Pnu2mSikUMq6jgYxYVbN52DaY-pFQhCBcyxY-4ysqGE9VYfjl5tUz-3CkW-NXXZaDwq6Ut3ZYSA/expand]]>\n\t\t\t\t\t\t\t</Tracking>\n\t\t\t\t\t\t</TrackingEvents>\n\t\t\t\t\t\t<VideoClicks>\n\t\t\t\t\t\t\t<ClickTracking>\n\t\t\t\t\t\t\t\t<![CDATA[]]>\n\t\t\t\t\t\t\t</ClickTracking>\n\t\t\t\t\t\t</VideoClicks>\n\t\t\t\t\t</Linear>\n\t\t\t\t</Creative>\n\t\t\t</Creatives>\n\t\t\t<Error>\n\t\t\t\t<![CDATA[https://media.grid.bidswitch.net/vast_error/Y87oy_2_IMbasYrAikVUj5fuk0L6yZzsb91cpY1PwPje_cGdhV6ibY_Ab42SZEhSi0vxP7wwCMOkY5EnmvA77Zm9Ihw3WhPaRCqYAVLw_Ei-oPaSDGSxbnT0IPs8fIdIymVaroW_plHPSVZBHAxBeJljaqptTs42as7y-NdLCEf31xd6mD7oZQ6vDDUcyDou0706e67MbFATwUvPTQdxT4qPnYXhmb7QEd7lLbLzaccGPql4cDGEIY_FueXiaJpKmoc7jqf9pGiaV-u2pqjnNBTrwSVvoXcFhVmES9_uhHIoqrKjMYk-vVgjJTuP6uosARjT-xissypeBjEKKHnZvjsloZetYBgi6uri6GQD1hCu_v5aXV_IGBHXiOVQv9ualVmgK8ZubT1FdSrC99AX1pJmr_6aJK-kp5L00T8kFF-kCckA60W8Vl6gnuQM7x8_aC5h4GkfSZbZHSJk76UoqfA9kyJ7K3n6BbahZm6Pnu2mSikUMq6jgYxYVbN52DaY-pFQhCBcyxY-4ysqGE9VYfjl5tUz-3CkW-NXXZaDwq6Ut3ZYSA?err_code=[ERRORCODE]]]>\n\t\t\t</Error>\n\t\t\t<Impression>\n\t\t\t\t<![CDATA[https://ads.pubmatic.com/AdServer/js/user_sync.html?p=161235&gdpr=0&gdpr_consent=${GDPR_SONSENT}&us_privacy=&predirect=https%3A%2F%2Fmedia.grid.bidswitch.net%2Fsync%3Ftp_id%3D27%26tp_uid%3D]]>\n\t\t\t</Impression>\n\t\t</Wrapper>\n\t</Ad>\n</VAST>\n\n",
        //             "price":8.7,"dealid":"TMG-TEST-1","h":480,"crid":"452_13_2036","impid":__id,"adid":"452_13_2036"}],"seat":"13"}]};
        // delete adResponse.seatbid[0].bid[0].adm;
        // adResponse.seatbid[0].bid[0].nurl = "https://ams1-ib.adnxs.com/vast_track/v2?info=aAAAAAMArgAFAQn5T5thAAAAABFVd8KyrGlDXxn5T5thAAAAACDLgcAuKAAw7Ug47UhA0-hISLuv1AFQgdKnBljDlQtiAlJVaAFwAXgAgAECiAEEkAGABZgB4AOgAQCoAcuBwC6wAQE.&s=c5ff3c7126bb30346a5593447fab5f2bfa352258&event_type=1&redir=https%3A%2F%2Fams1-ib.adnxs.com%2Fab%3Fro%3D1%26an_audit%3D0%26referrer%3Dhttp%253A%252F%252Fprebid.localhost.ru%252FintegrationExamples%252Fgpt%252Fpbjs_video_adUnit.html%253Fpbjs_debug%253Dtrue%26e%3DwqT_3QLpDKBpBgAAAwDWAAUBCPmf7YwGENXuiZbLtdqhXxj9vrHXvdzwg2sqNgkAAAECCCRAEQEHEAAAJEAZEQkAIREJACkRCQAxEQmoMIHSpwY47UhA7UhIAlDLgcAuWJzxW2AAaOWljwF4xJAFgAEBigEDVVNEkgUG8F6YAQGgAQGoAQGwAQC4AQPAAQTIAQLQAQDYAQDgAQDwAQD6AQhvdXQtdGVzdIoCO3VmKCdhJywgMjUyOTg4NSwgMTYzNzU2ODUwNSk7dWYoJ3InLCA5NzUxNzc3MSwgMR0e8PWSAuEDIXRVc0w1UWpZLUx3S0VNdUJ3QzRZQUNDYzhWc3dBRGdBUUFSSTdVaFFnZEtuQmxnQVlQMERhQUJ3RUhpV0FZQUI0Z0dJQVpZQmtBRUFtQUVBb0FFQnFBRURzQUVBdVFIenJXcWtBQUFrUU1FQjg2MXFwQUFBSkVESkFXd250QjR0ZGRJXzJRRUFBQUFBQUFEd1AtQUJBUFVCQUFBQUFKZ0NBS0FDQUxVQ0FBQUFBTDBDQUFBQUFPQUNBT2dDQVBnQ0FJQURBWmdEQWJvRENVRk5VekU2TXprNE5lQUQteXlJQkFDUUJBQ1lCQUhCQkFBQUENagh5UVENCiRBQUFOZ0VBUEVFAQsJASBDSUJaRWZxUVUJDxhBRHdQN0VGDQ0UQUFBREJCHT8AeRUoAUwyKAAAWi4oALg0QVhBaEQzd0JaekQzd0w0QmQyMG1nR0NCZ05WVTBTSUJnQ1FCZ0dZQmdDaEJnQQFONEFBQ1JBcUFZQnNnWWtDHXQARR0MAEcdDABJHQw4dUFZS5oClQEhLUFfMndBNuUBJG5QRmJJQVFvQUQV-FRrUURvSlFVMVRNVG96T1RnMVFQc3NTEVEMUEFfVREMDEFBQVcdDABZHQwAYR0MAGMdDBBlQUNKQR0Q8EbCAjhodHRwOi8vcHJlYmlkLm9yZy9kZXYtZG9jcy9zaG93LW91dHN0cmVhbS12aWRlby1hZHMuaHRtbNgCAOACrZhI6gJZaDJDANhsb2NhbGhvc3QucnUvaW50ZWdyYXRpb25FeGFtcGxlcy9ncHQvcGJqc192aWRlb19hZFVuaXQuAVQAPwUXWGRlYnVnPXRydWXyAhEKBkFEVl9JRBIHbV0FFAhDUEcFFBg1NzU5Mzg4ARQIBUNQARM0CDIxOTcwMDA48gIPCggBPGxGUkVREgMxMTPyAg0KCFJFTV9VU0VSEgEw8gIMCSIUQ09ERRIABQ8BWREPEAsKB0NQFQ4QCQoFSU8BYgQA8gEaBElPFRo4EwoPQ1VTVE9NX01PREVMDSQIGgoWMhYAHExFQUZfTkFNBWoIHgoaNh0ACEFTVAE-EElGSUVEAWIcDQoIU1BMSVQBTdABMIADAIgDAZADAJgDF6ADAaoDAMAD4KgByAMA2AMA4AMA6AMA-AMBgAQAkgQNL3V0L3YzLynQ8F6YBACiBAw5MS43OS4xNS4yMzWoBPLXG7IEEggEEAQYgAUg4AMoASgCMAA4A7gEAMAEAMgEANIEDjkzMjUjQU1TMTozOTg12gQCCAHgBADwBMuBwC6IBQGYBQCgBf___wkDFAHABQDJBalrFPA_0gUJCQkMeAAA2AUB4AUB8AXDlQv6BQQIABAAkAYBmAYAuAYAwQYJJSjwP9AG9S_aBhYKEAkRGQFcEAAYAOAGBPIGAggAgAcBiAcAoAdAugcPAUhIGAAgADAAOIcZQADIB8SQBdIHDRV2ATgI2gcGCSdI4AcA6gcCCADwB96U7gGKCAIQAA..%26s%3D80a2c4c3117544dc6b164571ee17304d31ba6ff7";

        var bids = [];
        if (adResponse.seatbid && adResponse.seatbid.length) {
            adResponse.seatbid.forEach(function (seatbid) {
                if (seatbid.bid && seatbid.bid.length) {
                    bids = bids.concat(seatbid.bid);
                }
            });
        }

        /* --------------------------------------------------------------------------------- */

        for (var j = 0; j < returnParcels.length; j++) {
            var curReturnParcel = returnParcels[j];

            var headerStatsInfo = {};
            var htSlotId = curReturnParcel.htSlot.getId();
            headerStatsInfo[htSlotId] = {};
            headerStatsInfo[htSlotId][curReturnParcel.requestId] = [curReturnParcel.xSlotName];

            var curBid;

            for (var i = 0; i < bids.length; i++) {
                /**
                 * This section maps internal returnParcels and demand returned from the bid request.
                 * In order to match them correctly, they must be matched via some criteria. This
                 * is usually some sort of placements or inventory codes. Please replace the someCriteria
                 * key to a key that represents the placement in the configuration and in the bid responses.
                 */

                /* ----------- Fill this out to find a matching bid for the current parcel ------------- */
                if (curReturnParcel.requestId.toString() === bids[i].impid) {
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
            var bidSize = [Number(curBid.w), Number(curBid.h)];

            /* The creative/adm for the given slot that will be rendered if is the winner.
             * Please make sure the URL is decoded and ready to be document.written.
             */
            var bidCreative = curBid.adm;
            if (curBid['content_type'] === 'video') {
                bidCreative = createVideoCreative(curReturnParcel.ref.getSlotElementId(), curBid.adm, curBid.nurl, bidSize);
            }

            /* The dealId if applicable for this slot. */
            var bidDealId = curBid.dealid;

            /* Explicitly pass */
            var bidIsPass = bidPrice <= 0 || !bidCreative;

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

        /* =============================================================================
         * STEP 1  | Partner Configuration
         * -----------------------------------------------------------------------------
         *
         * Please fill out the below partner profile according to the steps in the README doc.
         */

        /* ---------- Please fill out this partner profile according to your module ------------ */
        __profile = {
            partnerId: 'TheMediaGridHtb',
            namespace: 'TheMediaGridHtb',
            statsId: 'GRID',
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
                id: 'ix_grid_id',
                om: 'ix_grid_cpm',
                pm: 'ix_grid_cpm',
                pmid: 'ix_grid_dealid'
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
        __type__: 'TheMediaGridHtb',
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

module.exports = TheMediaGridHtb;
