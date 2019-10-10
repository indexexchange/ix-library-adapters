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
      publisherId: "5890",
      lat: "40.712775",
      lon: "-74.005973",
      xSlots: {
        1: {
          sizes: [[300, 250]]
        },
        2: {
          sizes: [[300, 600]]
        }
      },
      mapping: {
        htSlot1: ["1"],
        htSlot2: ["2"]
      }
    };
}

function getArchitecture() {
    return 'SRA';
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

    console.log("body:", JSON.stringify(body));

    expect(body.id).toBeDefined();
    expect(body.cur[0]).toEqual('USD');

    // Validate imp
    expect(body.imp.length).toEqual(2);

    for (var i = 0; i < body.imp.length; i++) {
        var sizes = config.xSlots[i + 1].sizes;
        var imp = body.imp[i];
        expect(imp.banner.w).toEqual(sizes[0][0]);
        expect(imp.banner.h).toEqual(sizes[0][1]);
    }

    // Validate site/publisher
    expect(body.site.publisher).toBeDefined();
    expect(body.site.publisher.domain).toBeDefined();
    expect(body.site.publisher.id).toEqual(config.publisherId);

    // Validate user
    expect(body.user).toBeDefined();

    // Validate device
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
                        dealid: "123"
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
