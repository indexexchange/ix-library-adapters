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
var OpenRtb = require('openrtb.js');
var Partner = require('partner.js');
var Size = require('size.js');
var SpaceCamp = require('space-camp.js');
var System = require('system.js');
var Network = require('network.js');

var EventsService;
var RenderService;
var ComplianceService;

//? if (DEBUG) {
var ConfigValidators = require('config-validators.js');
var SovrnValidator = require('sovrn-htb-validator.js');
var Whoopsie = require('whoopsie.js');
//? }

////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * Sovrn Header Tag Bidder module.
 *
 * @class
 */
function SovrnHtb(configs) {
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
     * Base url for bid requests.
     *
     * @private {object}
     */
    var __baseUrl;

    /* =====================================
     * Functions
     * ---------------------------------- */

    function _getDigiTrustQueryParams() {
        function getDigiTrustId() {
            var digiTrustUser;
            var _window;

            if (!Browser.isTopFrame()) {
                try {
                    _window = window.top;
                } catch (e) {
                    _window = Browser.topWindow;
                }
            } else {
                _window = window;
            }

            try {
                // TO DO: find digitrust member id
                digiTrustUser = _window.DigiTrust.getUser({ member: 'kCw195nJ1fs' });
            } catch (e) {}

            return (digiTrustUser && digiTrustUser.success && digiTrustUser.identity) || null;
        }
        var digiTrustId = configs.digitrustId || getDigiTrustId();

        // Verify there is an ID and this user has not opted out
        if (!digiTrustId || (digiTrustId.privacy && digiTrustId.privacy.optout)) {
            return {};
        }
        var _dt = {
            id: digiTrustId.id,
            keyv: digiTrustId.keyv
        };

        return _dt;
    }

    /* Utilities
     * ---------------------------------- */

    /**
     * Generates the request object to the endpoint for the xSlots in the given
     * returnParcels.
     *
     * @param  {object[]} returnParcels
     * @return {Object}                 Request object
     */
    function __generateRequestObj(returnParcels) {
        /* Generate a unique request identifier for storing request-specific information */
        var requestId = '_' + System.generateUniqueId();

        /* Build imps */
        var imps = returnParcels.map(function (parcel) {
            var banner = {};
            if (parcel.xSlotRef.sizes) {
                if (parcel.xSlotRef.sizes.length === 1) {
                    banner.w = parcel.xSlotRef.sizes[0][0];
                    banner.h = parcel.xSlotRef.sizes[0][1];
                } else {
                    var format = [];
                    parcel.xSlotRef.sizes.forEach(function (size) {
                        format.push({
                            w: size[0],
                            h: size[1]
                        });
                    });
                    banner.format = format;
                }
            } else {
                banner.w = 1;
                banner.h = 1;
            }

            return {
                id: parcel.htSlot.getId(),
                tagid: parcel.xSlotRef.tagid,
                banner: banner
            };
        });

        /* Build request params */
        var br = {
            id: requestId,
            site: {
                domain: Browser.getHostname(),
                page: Browser.getPageUrl()
            },
            imp: imps
        };

        if (ComplianceService.isPrivacyEnabled()) {
            var gdprStatus = ComplianceService.gdpr.getConsent();
            if (gdprStatus.applies !== null) {
                br.regs = {
                    ext: {
                        gdpr: gdprStatus.applies ? 1 : 0
                    }
                };
            }

            if (gdprStatus.consentString !== null && gdprStatus.consentString !== '') {
                br.user = {
                    ext: {
                        consent: gdprStatus.consentString
                    }
                };
            }

            var uspStatus = ComplianceService.usp.getConsent();
            if (uspStatus) {
                br.regs = br.regs || {};
                br.regs.ext = br.regs.ext || {};
                // eslint-disable-next-line camelcase
                br.regs.ext.us_privacy = uspStatus.uspString;
            }

            var dt = _getDigiTrustQueryParams();
            if (dt) {
                br.user = br.user || {};
                br.user.ext = br.user.ext || {};
                br.user.ext.digitrust = dt;
            }
        }

        return {
            url: __baseUrl,
            callbackId: requestId,
            data: {
                callback: 'window.' + SpaceCamp.NAMESPACE + '.' + __profile.namespace + '.adResponseCallback',
                br: JSON.stringify(br),
                src: 'ix_' + __profile.version
            }
        };
    }

    /**
     * Callback for sovrn ad responses that stores the response under the id provided
     * in the response object.
     *
     * @param {object} adResponse
     */
    function adResponseCallback(adResponse) {
        try {
            var ortbResponse = OpenRtb.BidResponse(adResponse);
            __baseClass._adResponseStore[ortbResponse.getId()] = ortbResponse;
        } catch (ex) {
            EventsService.emit('internal_error',
                'Error occurred while saving response for "' + __profile.partnerId + '".', ex.stack);
        }
    }

    /* Helpers
     * ---------------------------------- */

    /**
     * This function will render the pixel given.
     * @param  {string} nurl Tracking pixel img url.
     */
    function __renderPixel(nurl) {
        if (nurl) {
            Network.img({
                url: decodeURIComponent(nurl),
                method: 'GET'
            });
        }
    }

    /* Parse adResponse, put demand into outParcels.
     */
    function __parseResponse(sessionId, ortbResponse, returnParcels) {
        var bids = ortbResponse.getBids();

        var unusedReturnParcels = returnParcels.slice();

        for (var i = 0; i < bids.length; i++) {
            var curReturnParcel;
            var bid = bids[i];

            for (var j = unusedReturnParcels.length - 1; j >= 0; j--) {
                if (unusedReturnParcels[j].htSlot.getId() === bid.impid) {
                    curReturnParcel = unusedReturnParcels[j];
                    unusedReturnParcels.splice(j, 1);

                    break;
                }
            }

            if (!curReturnParcel) {
                continue;
            }

            if (!bid.hasOwnProperty('price') || bid.price <= 0) {
                curReturnParcel.pass = true;

                continue;
            }

            var bidPriceLevel = bid.price;

            if (__profile.enabledAnalytics.requestTime) {
                var curHtSlotId = curReturnParcel.htSlot.getId();
                var headerStatsInfo = {
                    sessionId: sessionId,
                    statsId: __profile.statsId,
                    htSlotId: curHtSlotId,
                    requestId: curReturnParcel.requestId,
                    xSlotNames: [curReturnParcel.xSlotName]
                };
                EventsService.emit('hs_slot_bid', headerStatsInfo);
            }

            curReturnParcel.size = [Number(bid.w), Number(bid.h)];
            curReturnParcel.targetingType = 'slot';
            curReturnParcel.targeting = {};

            //? if(FEATURES.GPT_LINE_ITEMS) {
            var targetingCpm = __baseClass._bidTransformers.targeting.apply(bidPriceLevel);
            var sizeKey = Size.arrayToString(curReturnParcel.size);

            curReturnParcel.targeting[__baseClass._configs.targetingKeys.om] = [sizeKey + '_' + targetingCpm];
            curReturnParcel.targeting[__baseClass._configs.targetingKeys.id] = [curReturnParcel.requestId];
            if (bid.dealid) {
                curReturnParcel.targeting[__baseClass._configs.targetingKeys.pmid] = [sizeKey + '_' + bid.dealid];
                curReturnParcel.targeting[__baseClass._configs.targetingKeys.pm] = [sizeKey + '_' + targetingCpm];
            }
            //? }

            var bidCreative = bid.adm;
            //? if(FEATURES.RETURN_CREATIVE) {
            curReturnParcel.adm = bidCreative;
            if (bid.nurl) {
                curReturnParcel.winNotice = __renderPixel.bind(null, bid.nurl);
            }
            //? }

            //? if(FEATURES.RETURN_PRICE) {
            curReturnParcel.price = Number(__baseClass._bidTransformers.price.apply(bidPriceLevel));
            //? }

            var pubKitAdId = RenderService.registerAd({
                sessionId: sessionId,
                partnerId: __profile.partnerId,
                adm: bidCreative,
                requestId: curReturnParcel.requestId,
                size: curReturnParcel.size,
                price: targetingCpm,
                timeOfExpiry:
                    __profile.features.demandExpiry.enabled ? __profile.features.demandExpiry.value
                        + System.now() : 0,
                auxFn: __renderPixel,
                auxArgs: [bid.nurl]
            });

            //? if(FEATURES.INTERNAL_RENDER) {
            curReturnParcel.targeting.pubKitAdId = pubKitAdId;
            //? }
        }

        /* All parcels which didn't get a match are passes */
        for (var k = 0; k < unusedReturnParcels.length; k++) {
            var unusedParcel = unusedReturnParcels[k];
            unusedParcel.pass = true;

            if (__profile.enabledAnalytics.requestTime) {
                var unusedHtSlotId = unusedParcel.htSlot.getId();
                var unusedHeaderStatsInfo = {
                    sessionId: sessionId,
                    statsId: __profile.statsId,
                    htSlotId: unusedHtSlotId,
                    requestId: unusedParcel.requestId,
                    xSlotNames: [unusedParcel.xSlotName]
                };
                EventsService.emit('hs_slot_pass', unusedHeaderStatsInfo);
            }
        }
    }

    /* =====================================
     * Constructors
     * ---------------------------------- */

    (function __constructor() {
        ComplianceService = SpaceCamp.services.ComplianceService;
        EventsService = SpaceCamp.services.EventsService;
        RenderService = SpaceCamp.services.RenderService;

        __profile = {
            partnerId: 'SovrnHtb',
            namespace: 'SovrnHtb',
            statsId: 'SVRN',
            version: '2.2.1',
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
                id: 'ix_sovrn_id',
                om: 'ix_sovrn_om',
                pm: 'ix_sovrn_pm',
                pmid: 'ix_sovrn_pmid'
            },
            bidUnitInCents: 100,
            lineItemType: Constants.LineItemTypes.ID_AND_SIZE,
            callbackType: Partner.CallbackTypes.ID,
            architecture: Partner.Architectures.SRA,
            requestType: Partner.RequestTypes.ANY
        };

        //? if (DEBUG) {
        var results = ConfigValidators.partnerBaseConfig(configs) || SovrnValidator(configs);

        if (results) {
            throw Whoopsie('INVALID_CONFIG', results);
        }
        //? }

        /* Build base bid request url */
        __baseUrl = 'https://ap.lijit.com/rtb/bid';

        __baseClass = Partner(__profile, configs, null, {
            parseResponse: __parseResponse,
            generateRequestObj: __generateRequestObj,
            adResponseCallback: adResponseCallback
        });

        //? if (DEBUG) {
        /* If wrapper is already active, we might be instantiated late so need to add our callback
           since the shell potentially missed its chance */
        if (window[SpaceCamp.NAMESPACE]) {
            window[SpaceCamp.NAMESPACE][__profile.namespace] = window[SpaceCamp.NAMESPACE][__profile.namespace] || {};
            window[SpaceCamp.NAMESPACE][__profile.namespace].adResponseCallback = adResponseCallback;
        }
        //? }
    })();

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    var derivedClass = {
        /* Class Information
         * ---------------------------------- */

        //? if (DEBUG) {
        __type__: 'SovrnHtb',
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
        __generateRequestObj: __generateRequestObj,
        __parseResponse: __parseResponse,
        adResponseCallback: adResponseCallback
        //? }
    };

    return Classify.derive(__baseClass, derivedClass);
}

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = SovrnHtb;
