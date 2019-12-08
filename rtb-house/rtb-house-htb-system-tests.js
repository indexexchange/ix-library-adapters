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
        bidfloor: 0.01,
    };
}

function getBidRequestRegex() {
    return {
        method: 'POST',
        urlRegex: /prebid-eu|asia|us\.creativecdn\.com\/bidder\/prebid\/bids/
    };
}

function validateBidRequest(request) {
    expect(request).toEqual(jasmine.objectContaining({
        host: jasmine.stringMatching('creativecdn'), //TODO finalize
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
        }
            ),
        test: 0,
        cur: ["USD"],
        imp: jasmine.any(Array),
        id: jasmine.any(String),
        })
        );
    var imp = body.imp;
    for (var i = 0; i < imp.length; i++){
        var imp_part = imp[i];
        expect(imp_part).toEqual(jasmine.objectContaining({
            id: jasmine.any(String),
            banner: jasmine.objectContaining({
                w: jasmine.any(Number),
                h: jasmine.any(Number),
                format: jasmine.any(Array),
            })
        }))
    }
}



module.exports = {
    getPartnerId: getPartnerId,
    getStatsId: getStatsId,
    getBidRequestRegex: getBidRequestRegex,
    getCallbackType: getCallbackType,
    getArchitecture: getArchitecture,
    getConfig: getConfig,
    // getPassResponse: getPassResponse,
    validateBidRequest: validateBidRequest,
    // getValidResponse: getValidResponse,
    // validateTargeting: validateTargeting
};
