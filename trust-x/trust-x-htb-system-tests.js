'use strict';

function getPartnerId() {
    return 'TrustXHtb';
}

function getStatsId() {
    return 'TRSTX';
}

function getCallbackType() {
    return 'NAME';
}

function getArchitecture() {
    return 'SRA';
}

function getConfig() {
    return {
        timeout: 1000,
        xSlots: {
            1: {
                adSlotId: '44',
                sizes: [[300, 250], [300, 600]]
            },
            2: {
                adSlotId: '45',
                sizes: [[300, 600]]
            }
        }
    };
}

function getBidRequestRegex() {
    return {
        method: 'GET',
        urlRegex: /.*sofia\.trustx\.org\/hb\?.*/
    };
}

function validateBidRequest(request) {
    // Check query string parameters.
    expect(request.query.auids).toBe('44,45');
    expect(request.query.pt).toBe('net');
    expect(request.query.wtimeout).toBe('1000');
}

function getValidResponse(request, creative) {
    var adm = creative || '<div>test content</div>';
    var response = {
        seatbid: [
            {
                bid: [
                    {
                        price: 1,
                        adm: adm,
                        auid: 44,
                        h: 250,
                        w: 300
                    }
                ],
                seat: '1'
            },
            {
                bid: [
                    {
                        price: 2,
                        adm: adm,
                        auid: 45,
                        h: 600,
                        w: 300
                    }
                ],
                seat: '1'
            }
        ]
    };

    return request.query.cb + '(' + JSON.stringify(response) + ')';
}

function validateTargeting(targetingMap) {
    expect(targetingMap).toEqual(jasmine.objectContaining({
        ix_trstx_cpm: jasmine.arrayContaining(['300x250_100', '300x600_200']),
        ix_trstx_id: jasmine.arrayContaining([jasmine.any(String)])
    }));
}

function getPassResponse(request) {
    return request.query.cb + '({})';
}

function getValidResponseWithDeal(request, creative) {
    var adm = creative || '<div>test content</div>';
    var response = {
        seatbid: [
            {
                bid: [
                    {
                        price: 1,
                        adm: adm,
                        auid: 44,
                        h: 250,
                        w: 300,
                        dealid: '123'
                    }
                ],
                seat: '1'
            },
            {
                bid: [
                    {
                        price: 2,
                        adm: adm,
                        auid: 45,
                        h: 600,
                        w: 300,
                        dealid: '456'
                    }
                ],
                seat: '1'
            }
        ]
    };

    return request.query.cb + '(' + JSON.stringify(response) + ')';
}

function validateTargetingWithDeal(targetingMap) {
    expect(targetingMap).toEqual(jasmine.objectContaining({
        ix_trstx_cpm: jasmine.arrayContaining(['300x250_100', '300x600_200']),
        ix_trstx_dealid: jasmine.arrayContaining(['300x250_123', '300x600_456']),
        ix_trstx_id: jasmine.arrayContaining([jasmine.any(String)])
    }));
}

module.exports = {
    getPartnerId: getPartnerId,
    getStatsId: getStatsId,
    getBidRequestRegex: getBidRequestRegex,
    getCallbackType: getCallbackType,
    getConfig: getConfig,
    validateBidRequest: validateBidRequest,
    getValidResponse: getValidResponse,
    validateTargeting: validateTargeting,
    getArchitecture: getArchitecture,
    getPassResponse: getPassResponse,
    getValidResponseWithDeal: getValidResponseWithDeal,
    validateTargetingWithDeal: validateTargetingWithDeal
};
