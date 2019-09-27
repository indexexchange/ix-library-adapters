'use strict';

function getPartnerId() {
    return 'ColossusHtb';
}

function getStatsId() {
    return 'CLSS';
}

function getBidRequestRegex() {
    return {
        method: 'POST',
        urlRegex: /\.*colossusssp.com\/\?c=o&m=multi/
    };
}

function getCallbackType() {
    return 'NONE';
}

function getArchitecture() {
    return 'SRA';
}

function getConfig() {
    return {
        xSlots: {
            1: {
                size: [300, 250],
                placementId: 123
            },
            2: {
                size: [300, 250],
                placementId: 124
            }
        }
    };
}

function validateBidRequest(request) {
    expect(request).toEqual(jasmine.objectContaining({
        host: 'colossusssp.com',
        query: jasmine.objectContaining({
            c: 'o',
            m: 'multi'
        }),
        body: jasmine.any(String)
    }));
    var body = JSON.parse(request.body);
    expect(body).toEqual(jasmine.objectContaining({
        host: jasmine.any(String),
        page: jasmine.any(String),
        deviceHeight: jasmine.any(Number),
        deviceWidth: jasmine.any(Number),
        secure: jasmine.any(Number),
        wrapper: 'index',
        placements: jasmine.arrayContaining([
            jasmine.objectContaining({
                bidId: jasmine.any(String),
                placementId: jasmine.any(Number)
            }),
            jasmine.objectContaining({
                bidId: jasmine.any(String),
                placementId: jasmine.any(Number)
            })
        ])
    }));
}

function getValidResponse(request, creative) {
    var response = [];
    var body = JSON.parse(request.body);
    var placements = body.placements;
    var len = placements.length;
    for (var i = 0; i < len; i++) {
        var placement = placements[i];
        var cpm = (i + 1) * 100;
        response.push({
            width: 300,
            height: 250,
            cpm: cpm,
            ad: creative,
            requestId: placement.bidId,
            ttl: 120,
            creativeId: '123',
            currency: 'USD',
            mediaType: 'banner'
        });
    }

    return JSON.stringify(response);
}

function validateTargeting(targetingMap) {
    expect(targetingMap).toEqual(jasmine.objectContaining({
        ix_clss_cpm: jasmine.arrayContaining(['300x250_200', '300x250_100']),
        ix_clss_id: jasmine.arrayContaining([jasmine.any(String), jasmine.any(String)])
    }));
}

function getPassResponse() {
    return '[]';
}

function getValidBidResponseWithDeal(request, creative) {
    var response = [];
    var body = JSON.parse(request.body);
    var placements = body.placements;
    var len = placements.length;
    for (var i = 0; i < len; i++) {
        var placement = placements[i];
        var cpm = (i + 1) * 100;
        response.push({
            width: 300,
            height: 250,
            cpm: cpm,
            ad: creative,
            requestId: placement.bidId,
            ttl: 120,
            creativeId: '123',
            dealId: 'deal_test_' + i,
            currency: 'USD',
            mediaType: 'banner'
        });
    }

    return JSON.stringify(response);
}

function validateTargetingWithDeal(targetingMap) {
    expect(targetingMap).toEqual(jasmine.objectContaining({
        ix_clss_cpm: jasmine.arrayContaining(['300x250_200', '300x250_100']),
        ix_clss_dealid: jasmine.arrayContaining(['300x250_deal_test_0', '300x250_deal_test_1']),
        ix_clss_id: jasmine.arrayContaining([jasmine.any(String), jasmine.any(String)])
    }));
}

module.exports = {
    getPartnerId: getPartnerId,
    getStatsId: getStatsId,
    getBidRequestRegex: getBidRequestRegex,
    getCallbackType: getCallbackType,
    getArchitecture: getArchitecture,
    getConfig: getConfig,
    validateBidRequest: validateBidRequest,
    getValidResponse: getValidResponse,
    validateTargeting: validateTargeting,
    getPassResponse: getPassResponse,
    getValidBidResponseWithDeal: getValidBidResponseWithDeal,
    validateTargetingWithDeal: validateTargetingWithDeal
};
