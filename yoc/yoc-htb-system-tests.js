'use strict';

function getPartnerId() {
    return 'YocHtb';
}

function getStatsId() {
    return 'YOC';
}

function getCallbackType() {
    return 'NAME';
}

function getArchitecture() {
    return 'SRA';
}

function getConfig() {
    return {
        xSlots: {
            1: {
                auid: '903535',
                sizes: [[300, 250], [300, 600]]
            },
            2: {
                auid: '903536',
                sizes: [[300, 600]]
            }
        }
    };
}

function getBidRequestRegex() {
    return {
        method: 'GET',
        urlRegex: /.*t\.visx\.net\/hb\?.*/
    };
}

function validateBidRequest(request) {
    // Check query string parameters.
    expect(request.query.auids).toBe('903535,903536');
    expect(request.query.wrapperType).toBe('IX');
    expect(request.query.wrapperVersion).toMatch(/\d+\.\d+\.\d+/);
    expect(request.query.adapterVersion).toMatch(/\d+\.\d+\.\d+/);
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
                        auid: 903535,
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
                        auid: 903536,
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
        ix_yoc_cpm: jasmine.arrayContaining(['300x250_100', '300x600_200']),
        ix_yoc_id: jasmine.arrayContaining([jasmine.any(String)])
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
                        auid: 903535,
                        h: 250,
                        w: 300,
                        dealid: 11
                    }
                ],
                seat: '1'
            },
            {
                bid: [
                    {
                        price: 2,
                        adm: adm,
                        auid: 903536,
                        h: 600,
                        w: 300,
                        dealid: 12
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
        ix_yoc_cpm: jasmine.arrayContaining(['300x250_100', '300x600_200']),
        ix_yoc_dealid: jasmine.arrayContaining(['300x250_11', '300x600_12']),
        ix_yoc_id: jasmine.arrayContaining([jasmine.any(String)])
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
