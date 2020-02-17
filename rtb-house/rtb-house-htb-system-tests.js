'use strict';

function getPartnerId() {
    return 'RTBHouseHtb';
}

function getCallbackType() {
    return 'NONE';
}

function getArchitecture() {
    return 'SRA';
}

function getStatsId() {
    return 'RTB';
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
        },
        region: 'prebid-eu',
        publisherId: '_TEST_ID',
        bidfloor: 0.01
    };
}

function getBidRequestRegex() {
    return {
        method: 'POST',
        urlRegex: /ixwrapper-c2s-(eu|us|asia).creativecdn\.com\/bidder\/ixwrapper\/bids/
    };
}

function validateBidRequest(request) {
    expect(request).toEqual(jasmine.objectContaining({
        host: jasmine.any(String),
        body: jasmine.any(String)
    }));
    var body = JSON.parse(request.body);
    expect(body).toEqual(jasmine.objectContaining({
        site: jasmine.objectContaining({
            page: jasmine.any(String),
            name: jasmine.any(String),
            publisher: jasmine.objectContaining({
                id: jasmine.any(String)
            })
        }),
        test: 0,
        cur: ['USD'],
        imp: jasmine.any(Array),
        id: jasmine.any(String)
    }));
    var imp = body.imp;
    for (var i = 0; i < imp.length; i++) {
        var imp_part = imp[i];
        expect(imp_part).toEqual(jasmine.objectContaining({
            id: jasmine.any(String),
            banner: jasmine.objectContaining({
                w: jasmine.any(Number),
                h: jasmine.any(Number),
                format: jasmine.any(Array)
            })
        }));
    }
}

function validateTargeting(targetingMap) {
    expect(targetingMap).toEqual(jasmine.objectContaining({
        ix_rtb_cpm: jasmine.arrayContaining(['300x250_200']),
        ix_rtb_id: jasmine.arrayContaining([jasmine.any(String)])
    }));
}

function getPassResponse() {
    return '{}';
}

function getValidResponse(request, creative) {
    var body = JSON.parse(request.body);
    var response
        = [
            {
                id: body.imp[0].id,
                impid: '301a387bd0aac8',
                price: 2,
                adid: '3aZh9mMlUJkW57mUB4kN',
                adm: creative,
                adomain: ['rtbhouse.com'],
                cid: 'dH7Yk9plMI2QrA05L0TT',
                w: 300,
                h: 250
            },
            {
                id: body.imp[1].id,
                impid: '301a387bd0aac8',
                price: 2,
                adid: '3aZh9mMlUJkW57mUB4kN',
                adm: creative,
                adomain: ['rtbhouse.com'],
                cid: 'dH7Yk9plMI2QrA05L0TT',
                w: 300,
                h: 250
            }
        ];

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
