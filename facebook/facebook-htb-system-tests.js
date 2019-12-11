'use strict';

function getPartnerId() {
    return 'FacebookHtb';
}

function getStatsId() {
    return 'FB';
}

function getBidRequestRegex() {
    return {
        method: 'POST',
        urlRegex: /an\.facebook\.com\/placementbid\.ortb\/2061185240785516/
    };
}

function getCallbackType() {
    return 'NONE';
}

function getArchitecture() {
    return 'FSRA';
}

function getConfig() {
    return {
        timeout: 1000,
        xSlots: {
            1: {
                placementId: '2354122411472512_2484913318393420',
                size: [300, 250]
            },
            2: {
                placementId: '2354122411472512_2484910865060332',
                size: [200, 200],
                adFormat: 'native'
            }
        },
        nativeAssets: '<style>...</style>\n<div class="thirdPartyRoot">...</div>'
    };
}

function validateBidRequest(request) {
    expect(request.host).toEqual('an.facebook.com');
    var requestBody = JSON.parse(request.body);
    expect(requestBody.id).toBeDefined();
    expect(requestBody.site.page).toBeDefined();
    expect(requestBody.site.publisher.id).toBeDefined();
    expect(requestBody.device.ua).toBeDefined();
    expect(requestBody.imp.length).toBe(2);
    expect(requestBody.imp[0].banner).toEqual({
        w: 300,
        h: 250
    });
    expect(requestBody.imp[0].id).toBeDefined();
    expect(requestBody.imp[0].tagid).toEqual('2354122411472512_2484913318393420');
    expect(requestBody.imp[1].native).toEqual({
        w: -1,
        h: -1,
        ext: {
            native_container: '<style>...</style>\n<div class="thirdPartyRoot">...</div>'
        }
    });
    expect(requestBody.imp[1].id).toBeDefined();
    expect(requestBody.imp[1].tagid).toEqual('2354122411472512_2484910865060332');
    expect(requestBody.ext.platformid).toBeDefined();
    expect(requestBody.ext.sdk_version).toBeDefined();
    expect(requestBody.ext.platform_version).toBeDefined();
    expect(requestBody.ext.adapter_version).toBeDefined();
}

function getValidResponse(request, creative) {
    var requestBody = JSON.parse(request.body);
    var response = {
        id: requestBody.id,
        seatbid: [
            {
                bid: [
                    {
                        id: '5370310878739583665',
                        impid: requestBody.imp[0].id,
                        price: 2,
                        adm: creative,
                        nurl: '',
                        lurl: ''
                    },
                    {
                        id: '1038245249008980657',
                        impid: requestBody.imp[1].id,
                        price: 2,
                        adm: creative,
                        nurl: '',
                        lurl: ''
                    }
                ]
            }
        ],
        bidid: '6918104966745398877',
        cur: 'USD'
    };

    return JSON.stringify(response);
}

function getPassResponse(request) {
    var requestBody = JSON.parse(request.body);
    var response = {
        id: requestBody.id,
        seatbid: [
            {
                bid: []
            }
        ],
        bidid: '6918104966745398877',
        cur: 'USD'
    };

    return JSON.stringify(response);
}

function validateTargeting(targetingMap) {
    expect(targetingMap).toEqual(jasmine.objectContaining({
        ix_fb_om: jasmine.arrayContaining([jasmine.any(String), jasmine.any(String)]),
        ix_fb_id: jasmine.arrayContaining([jasmine.any(String), jasmine.any(String)])
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
