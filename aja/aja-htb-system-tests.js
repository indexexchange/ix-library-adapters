'use strict';

function getPartnerId() {
    return 'AJAHtb';
}

function getStatsId() {
    return 'AJA';
}

function getCallbackType() {
    return 'NONE';
}

function getArchitecture() {
    return 'MRA';
}

function getConfig() {
    return {
        xSlots: {
            1: {
                asi: 'abc123',
                sizes: [[320, 100]]
            }
        }
    };
}

function getBidRequestRegex() {
    return {
        method: 'GET',
        urlRegex: /.*ad\.as\.amanad\.adtdp\.com/
    };
}

function validateBidRequest(request) {
    var config = getConfig();
    expect(request.query.asi).toEqual(config.xSlots['1'].asi);
    expect(request.query.prebid_id).toBeDefined();
}

function getValidResponse(request, creative) {
    var prebid_id = request.query.prebid_id;

    var response = {
        is_ad_return: true,
        ad: {
            ad_type: 1,
            banner: {
                w: 320,
                h: 100,
                tag: creative,
                imps: [],
                inviews: []
            },
            prebid_id: prebid_id,
            price: 2,
            currency: 'JPY',
            creative_id: '10410582'
        },
        syncs: [],
        sync_htmls: []
    };

    return JSON.stringify(response);
}

function validateTargeting(targetingMap) {
    expect(targetingMap).toEqual(
        jasmine.objectContaining({
            ix_aja_cpm: jasmine.arrayWithExactContents(['320x100_200']),
            ix_aja_id: jasmine.arrayWithExactContents([jasmine.any(String)])
        })
    );
}

function getPassResponse() {
    return JSON.stringify({ is_ad_return: false });
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
