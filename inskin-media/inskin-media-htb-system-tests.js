'use strict';

function getPartnerId() {
    return 'InskinMediaHtb';
}

function getStatsId() {
    return 'ISM';
}

function getBidRequestRegex() {
    return {
        method: 'POST',
        urlRegex: /mfad\.inskinad\.com\/api\/v2/
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
        networkId: '9874',
        siteId: '1059494',
        xSlots: {
            1: {},
            2: {}
        }
    };
}

function validateBidRequest(request) {
    var adTypes = [
        5,
        9,
        163,
        2163,
        3006
    ];
    var eventIds = [
        40,
        201,
        202,
        203,
        204,
        205,
        206,
        207,
        208,
        209,
        210,
        211,
        212,
        213,
        214,
        215,
        216,
        217,
        218,
        219,
        220,
        221,
        222,
        223,
        224,
        225,
        226,
        227,
        228,
        229,
        230,
        231,
        232,
        233,
        234,
        235,
        236,
        237,
        238,
        239,
        240,
        261,
        262,
        263,
        264,
        265,
        266,
        267,
        268,
        269,
        270,
        271,
        272,
        273,
        274,
        275,
        276,
        277,
        278,
        279,
        280,
        281,
        282,
        283,
        284,
        285,
        286,
        287,
        288,
        289,
        290,
        291,
        292,
        293,
        294,
        295
    ];
    var body = JSON.parse(request.body);

    expect(body.placements.length).toBe(2);

    expect(body.placements[0].divName).toEqual('1');
    expect(body.placements[0].adTypes).toEqual(adTypes);
    expect(body.placements[0].eventIds).toEqual(eventIds);

    expect(body.placements[1].divName).toEqual('2');
    expect(body.placements[1].adTypes).toEqual(adTypes);
    expect(body.placements[1].eventIds).toEqual(eventIds);
}

function getValidResponse(request, creative) {
    var response = {
        decisions: {
            1: {
                adm: creative,
                pricing: {
                    clearPrice: 1
                }
            },
            2: {
                adm: creative,
                pricing: {
                    clearPrice: 2
                }
            }
        }
    };

    return JSON.stringify(response);
}

function getPassResponse() {
    var response = {
        decisions: {
        }
    };

    return JSON.stringify(response);
}

function validateTargeting() {
    return false;
}

function validatePixelRequests() {
    return false;
}

module.exports = {
    getPartnerId: getPartnerId,
    getStatsId: getStatsId,
    getBidRequestRegex: getBidRequestRegex,
    getCallbackType: getCallbackType,
    getArchitecture: getArchitecture,
    getConfig: getConfig,
    getPassResponse: getPassResponse,
    validateBidRequest: validateBidRequest,
    getValidResponse: getValidResponse,
    validateTargeting: validateTargeting,
    validatePixelRequests: validatePixelRequests
};
