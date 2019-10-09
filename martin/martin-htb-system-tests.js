/* eslint-disable quotes */
'use strict';

function getPartnerId() {
    return 'MartinHtb';
}

function getStatsId() {
    return 'MAR';
}

function getCallbackType() {
    return 'NONE';
}

function getConfig() {
    return {
        publisherId: '5890',
        lat: '40.712775',
        lon: '-74.005973',
        gender: 'M',
        xSlots: {
            1: {
                sizes: [[300, 250], [300, 600]]
            }
        },
        mapping: {
            htSlot1: ['1']
        }
    };
}

function getArchitecture() {
    return 'MRA';
}

function getBidRequestRegex() {
    return {
        method: 'POST',
        urlRegex: /.*mrtnsvr\.com\/bid\/indexhtb.*/
    };
}

function validateBidRequest(request) {
    expect(request.query.cachebuster).toBeDefined();

    var body = JSON.parse(request.body);
    var config = getConfig();

    expect(body.id).toBeDefined();
    expect(body.cur[0]).toEqual('USD');

    // Validate imp
    var sizes1 = config.xSlots[1].sizes;
    expect(body.imp.length).toEqual(1);
    expect(body.imp[0].banner.format).toBeDefined();
    expect(body.imp[0].banner.format.length).toEqual(sizes1.length - 1);
    expect(body.imp[0].banner.w).toEqual(sizes1[0][0]);
    expect(body.imp[0].banner.h).toEqual(sizes1[0][1]);
    expect(body.imp[0].banner.format[0].w).toEqual(sizes1[1][0]);
    expect(body.imp[0].banner.format[0].h).toEqual(sizes1[1][1]);

    // Validate site/publisher
    expect(body.site.publisher).toBeDefined();
    expect(body.site.publisher.domain).toBeDefined();
    expect(body.site.publisher.id).toEqual(config.publisherId);

    // // Validate user
    expect(body.user).toBeDefined();

    // // Validate device
    expect(body.device).toBeDefined();
    expect(body.device.h).toBeDefined();
    expect(body.device.w).toBeDefined();
    expect(body.device.geo).toBeDefined();
    expect(body.device.geo.lat).toEqual(parseFloat(config.lat));
    expect(body.device.geo.lon).toEqual(parseFloat(config.lon));
}

function getPassResponse(request) {
    return '{}';
}

function getValidResponse(request, creative) {
    var adm = creative;
    var response = {
        id: "123",
        cur: "USD",
        seatbid: [
            {
                seat: "1",
                bid: [
                    {
                        id: "1l84f9sf3k1gvrm2q",
                        impid: "456",
                        price: 2,
                        adm: adm,
                        crid: "431006.8739438078",
                        h: 250,
                        w: 300
                    }
                ]
            }
        ]
    };

    return JSON.stringify(response);
}

function validateTargeting(targetingMap) {
    var isObjEmpty = Object.keys(targetingMap).length === 0 && targetingMap.constructor === Object;
    if (!isObjEmpty) {
        expect(targetingMap).toEqual(jasmine.objectContaining({
            ix_mar_id: jasmine.arrayContaining([jasmine.any(String)]),
            ix_mar_cpm: jasmine.arrayContaining(['300x250_200'])
        }));
    }
}

function getValidResponseWithDeal(request, creative) {
    var adm = creative;
    var response = {
        id: "123",
        cur: "USD",
        seatbid: [
            {
                seat: "1",
                bid: [
                    {
                        id: "1l84f9sf3k1gvrm2q",
                        impid: "456",
                        price: 2,
                        adm: adm,
                        crid: "431006.8739438078",
                        h: 250,
                        w: 300,
                        // dealid: "123"
                    }
                ]
            }
        ]
    };

    return JSON.stringify(response);
}

function validateTargetingWithDeal(targetingMap) {
    var isObjEmpty = Object.keys(targetingMap).length === 0 && targetingMap.constructor === Object;
    if (!isObjEmpty) {
        expect(targetingMap).toEqual(jasmine.objectContaining({
            ix_mar_id: jasmine.arrayContaining([jasmine.any(String)]),
            ix_mar_cpm: jasmine.arrayContaining(['300x250_200']),
            ix_mar_dealid: jasmine.arrayContaining(['300x250_123'])
        }));
    }
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
