'use strict';

function getPartnerId() {
    return 'NanoInteractiveHtb';
}

function getStatsId() {
    return 'NANO';
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
                sizes: ['300x250'],
                pid: '58bfec94eb0a1916fa380163',
                nq: 'header bidding'
            },
            2: {
                sizes: ['300x600'],
                pid: '58bfec94eb0a1916fa380163',
                nq: 'testing'
            }
        }
    };
}

function getBidRequestRegex() {
    return {
        method: 'POST',
        urlRegex: /.*\.audiencemanager\.de\/hb.*/
    };
}

function validateBidRequest(request) {
    expect(request.host).toBe('ad.audiencemanager.de');
}

function getValidResponse(request, creative) {
    var response = [
        {
            id: '1',
            bidderCode: 'nanointeractive',
            cpm: 0.15,
            width: 300,
            height: 250,
            ad: creative || '<div id="nano1"></div>',
            ttl: 360,
            creativeId: '6615ccc6185d77bc038c470e807f9b39',
            netRevenue: false,
            currency: 'EUR'
        },
        {
            id: '2',
            bidderCode: 'nanointeractive',
            cpm: 2,
            width: 300,
            height: 600,
            ad: creative || '<div id="nano2"></div>',
            ttl: 360,
            creativeId: 'b4be30748bdf9227b032bc71bda8f577',
            netRevenue: false,
            currency: 'EUR'
        }
    ];

    return JSON.stringify(response);
}

function validateTargeting(targetingMap) {
    expect(targetingMap).toEqual(jasmine.objectContaining({
        ix_nano_cpm: jasmine.arrayContaining(['300x250_15', '300x600_200']),
        ix_nano_id: jasmine.arrayContaining([jasmine.any(String)])
    }));
}

function getPassResponse() {
    var response = [
        {
            id: '1',
            bidderCode: 'nanointeractive',
            cpm: 0,
            width: 300,
            height: 250,
            ad: '<div id="nano1"></div>',
            ttl: 360,
            creativeId: '6615ccc6185d77bc038c470e807f9b39',
            netRevenue: false,
            currency: 'EUR'
        },
        {
            id: '2',
            bidderCode: 'nanointeractive',
            cpm: 0,
            width: 300,
            height: 600,
            ad: '<div id="nano2"></div>',
            ttl: 360,
            creativeId: 'b4be30748bdf9227b032bc71bda8f577',
            netRevenue: false,
            currency: 'EUR'
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
