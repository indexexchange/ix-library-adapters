'use strict';

function getPartnerId() {
    return 'IASHtb';
}

function getStatsId() {
    return 'IAS';
}

function getCallbackType() {
    return 'NONE';
}

function getArchitecture() {
    return 'FSRA';
}

function getConfig() {
    return {
        xSlots: {
            1: {
                pubId: '99',
                placementId: 1,
                sizes: [[320, 50]],
                adUnitPath: '/57514611/news.com'
            },
            2: {
                pubId: '99',
                placementId: 1,
                sizes: [[320, 50]],
                adUnitPath: '/57514611/news.com'
            }
        }
    };
}

function getBidRequestRegex() {
    return {
        method: 'GET',
        urlRegex: /.*pixel\.adsafeprotected\.com\/services\/pub.*/
    };
}

function validateBidRequest(request) {
    console.error(request.query);
    expect(request.query.anId).toBeDefined();
    expect(request.query.slot).toBeDefined();
    expect(request.query.wr).toBeDefined();
    expect(request.query.sr).toBeDefined();
}

function getValidResponse(request, creative) {
    var response = [
        {
            slot: '1',
            w: 320,
            h: 50,
            price: 200,
            crid: 'crid_1',
            adm: creative || '<div id="1"></div>'
        },
        {
            slot: '2',
            w: 320,
            h: 250,
            price: 200,
            crid: 'crid_2',
            adm: creative || '<div id="2"></div>'
        }
    ];

    return JSON.stringify(response);
}

function validateTargeting(targetingMap) {
    expect(targetingMap).toEqual(jasmine.objectContaining({
    }));
}

function getPassResponse(request) {
    var response = {
        brandSafety: {
            adt: 'veryLow',
            alc: 'veryLow',
            dlm: 'veryLow',
            drg: 'veryLow',
            hat: 'veryLow',
            off: 'veryLow',
            vio: 'veryLow'
        },
        fr: 'false',
        slots: {
            htSlotDesktopAId: {
                id: 'fdfcfa8b-d8ac-11e9-82e4-14dda9d4b6a0',
                vw: ['40', '50'],
                grm: ['40'],
                price: 2.00
            }
        }
    };

    return JSON.stringify(response);
}

module.exports = {
    getPartnerId: getPartnerId,
    getStatsId: getStatsId,
    getCallbackType: getCallbackType,
    getArchitecture: getArchitecture,
    getConfig: getConfig,
    getBidRequestRegex: getBidRequestRegex,
    validateBidRequest: validateBidRequest,
    getValidResponse: getValidResponse,
    validateTargeting: validateTargeting,
    getPassResponse: getPassResponse
};
