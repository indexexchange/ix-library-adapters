'use strict';

function getPartnerId() {
    return 'QuantcastHtb';
}

function getStatsId() {
    return 'QUA';
}

function getBidRequestRegex() {
    return {
        method: 'POST',
        urlRegex: /qcx\.quantserve\.com:8...\/qchb/
    };
}

function getCallbackType() {
    return 'NONE';
}

function getArchitecture() {
    return 'MRA';
}

function getConfig() {
    return {
        publisherId: '',
        xSlots: {
            1: {}
        }
    };
}

function validateBidRequest(request) {
    var r = JSON.parse(request.body);

    expect(r.publisherId).toBeDefined();
    expect(r.requestId).toBeDefined();

    expect(r.imp.length).toBe(1);

    expect(r.imp[0]).toEqual({
        banner: {
            battr: [],
            sizes: [
                {
                    width: 300,
                    height: 250
                },
                {
                    width: 300,
                    height: 600
                }
            ],
            pos: 0
        },
        placementCode: 'htSlotDesktopAId',
        bidFloor: 0
    });
}

function getValidResponse(request, creative) {
    var r = JSON.parse(request.body);
    var adm = creative || '<h1>Buy now!</h2>';
    var response = {
        bidderCode: 'quantcast',
        bids: [
            {
                ad: adm,
                cpm: 2,
                creativeId: 0,
                currency: 'USD',
                placementCode: r.imp[0].placementCode,
                statusCode: 1,
                width: r.imp[0].banner.sizes[0].width,
                height: r.imp[0].banner.sizes[0].height
            }
        ]
    };

    return JSON.stringify(response);
}

function getPassResponse(request) {
    var r = JSON.parse(request.body);
    var response = {
        bidderCode: 'quantcast',
        bids: [
            {
                placementCode: r.imp[0].placementCode,
                statusCode: 0,
                width: r.imp[0].banner.sizes[0].width,
                height: r.imp[0].banner.sizes[0].height
            }
        ]
    };

    return JSON.stringify(response);
}

function validateTargeting(targetingMap) {
    expect(targetingMap).toEqual(jasmine.objectContaining({
        ix_qua_id: jasmine.arrayContaining([jasmine.any(String)])
    }));
}

function validateBidRequestWithPrivacy(request) {
    var r = JSON.parse(request.body);

    expect(r.gdprSignal).toEqual(1);
    expect(r.gdprConsent).toEqual('TEST_GDPR_CONSENT_STRING');
}

module.exports = {
    getPartnerId: getPartnerId,
    getStatsId: getStatsId,
    getBidRequestRegex: getBidRequestRegex,
    getCallbackType: getCallbackType,
    getArchitecture: getArchitecture,
    getConfig: getConfig,
    getPassResponse: getPassResponse,
    validateBidRequest: validateBidRequest,
    getValidResponse: getValidResponse,
    validateTargeting: validateTargeting,
    validateBidRequestWithPrivacy: validateBidRequestWithPrivacy
};
