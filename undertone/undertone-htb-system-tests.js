'use strict';

function getPartnerId() {
    return 'UndertoneHtb';
}

function getStatsId() {
    return 'UNDR';
}

function getCallbackType() {
    return 'NONE';
}

function getArchitecture() {
    return 'SRA';
}

function getConfig() {
    return {
        publisherId: '12345',
        xSlots: {
            1: {
                sizes: [[300, 250]],
                placementId: '1234'
            },
            2: {
                sizes: [[300, 600]]
            }
        }
    };
}

function getBidRequestRegex() {
    return {
        method: 'POST',
        urlRegex: /hb\.undertone\.com\/hb.*/
    };
}

function validateBidRequest(request) {
    expect(request.query.pid).toBe('12345');
    expect(request.query.domain).toBeDefined();
}

function getValidResponse(request, creative) {
    var response = JSON.stringify([
        {
            ad: creative || '<div id="1"></div>',
            publisherId: 12345,
            bidRequestId: JSON.parse(request.body)['x-ut-hb-params'][0].bidRequestId,
            adId: 15,
            campaignId: 2,
            height: 250,
            width: 300,
            ttl: 720,
            currency: 'USD',
            cpm: 2,
            adaptor: 'indexexchange',
            netRevenue: true
        },
        {
            ad: creative || '<div id="1"></div>',
            publisherId: 12345,
            bidRequestId: JSON.parse(request.body)['x-ut-hb-params'][1].bidRequestId,
            adId: 15,
            campaignId: 2,
            height: 600,
            width: 300,
            ttl: 720,
            currency: 'USD',
            cpm: 2,
            adaptor: 'indexexchange',
            netRevenue: true
        }
    ]);

    return response;
}

function validateTargeting(targetingMap) {
    expect(targetingMap).toEqual(jasmine.objectContaining({
        ix_undr_cpm: jasmine.arrayContaining(['300x250_200'])
    }));
}

function getPassResponse(request) {
    var response = JSON.stringify([
        {
            ad: null,
            publisherId: 12345,
            bidRequestId: JSON.parse(request.body)['x-ut-hb-params'][0].bidRequestId,
            adId: 15,
            campaignId: 2,
            height: 250,
            width: 300,
            ttl: 720,
            currency: 'USD',
            cpm: 0,
            adaptor: 'indexexchange',
            netRevenue: true
        },
        {
            ad: null,
            publisherId: 12345,
            bidRequestId: JSON.parse(request.body)['x-ut-hb-params'][1].bidRequestId,
            adId: 15,
            campaignId: 2,
            height: 600,
            width: 300,
            ttl: 720,
            currency: 'USD',
            cpm: 0,
            adaptor: 'indexexchange',
            netRevenue: true
        }
    ]);

    return response;
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
