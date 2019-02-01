'use strict';

function getPartnerId() {
    return 'RhythmOneHtb';
}

function getStatsId() {
    return 'RONE';
}

function getBidRequestRegex() {
    return {
        method: 'GET',
        urlRegex: /^http?:|https?:\/\/tag\.1rx\.io\/rmp.*/
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
                placementId: '471141',
                zone: 'autoqa',
                path: 'mvo',
                imp: '1',
                adType: 'banner',
                floor: '100',
                sizes: [[300, 250]]
            },
            2: {
                placementId: '471141',
                zone: 'autoqa',
                path: 'mvo',
                imp: '2',
                floor: '100',
                adType: 'banner',
                sizes: [[300, 250]]
            }
        }
    };
}

function validateBidRequest(request) {
    expect(request.host).toBe('tag.1rx.io');
    expect(request.pathname).toContain('mvo');
    expect(request.query.z).toBeDefined();
    expect(request.query.imp).toBeDefined();
    expect(request.query.w).toBeDefined();
    expect(request.query.h).toBeDefined();
    expect(request.query.t).toBeDefined();
}

function getValidResponse(request, creative) {
    var response = {
        cur: 'USD',
        id: '567841330',
        seatbid: [
            {
                bid: [
                    {
                        adid: '1487603',
                        adm: creative,
                        adomain: ['www.rhythmone.com'],
                        ext: {
                            advbrand: 'R1',
                            advbrandid: '25661',
                            pricelevel: '200'
                        },
                        id: 567841330,
                        impid: '1',
                        price: 200,
                        h: '250',
                        w: '300'
                    },
                    {
                        adid: '1487603',
                        adm: creative,
                        adomain: ['www.rhythmone.com'],
                        ext: {
                            advbrand: 'R1',
                            advbrandid: '25661',
                            pricelevel: '100'
                        },
                        id: 567841330,
                        impid: '2',
                        price: 200,
                        h: '250',
                        w: '300'
                    }
                ],
                seat: '470013'
            }
        ]
    };

    return JSON.stringify(response);
}

function getPassResponse() {
    var response = {
        id: 'Test',
        seatbid: [
            {
                bid: []
            }
        ]
    };

    return JSON.stringify(response);
}

function validateTargeting(targetingMap) {
    expect(targetingMap).toEqual(jasmine.objectContaining({
        ix_rone_cpm: jasmine.arrayContaining(['300x250_200', '300x250_200']),
        ix_rone_id: jasmine.arrayContaining([jasmine.any(String), jasmine.any(String)])
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
    getPassResponse: getPassResponse
};
