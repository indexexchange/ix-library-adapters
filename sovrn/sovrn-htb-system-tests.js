'use strict';

function getPartnerId() {
    return 'SovrnHtb';
}

function getStatsId() {
    return 'SVRN';
}

function getBidRequestRegex() {
    return {
        method: 'GET',
        urlRegex: /https:\/\/ap.lijit.com\/rtb\/bid.*/
    };
}

function getCallbackType() {
    return 'ID';
}

function getArchitecture() {
    return 'SRA';
}

function getConfig() {
    return {
        xSlots: {
            1: {
                tagid: '123456',
                sizes: [[300, 250]]
            },
            2: {
                tagid: '987654',
                sizes: [[300, 250], [300, 600]]
            }
        },
        mapping: {
            'Fake Unit 1 300x250': ['1'],
            'Fake Unit 2 300x250 or 300x600': ['2']
        }
    };
}

function validateBidRequest(request) {
    var q = request.query;
    expect(q.br).toBeDefined();
    expect(q.src).toBeDefined();

    var br = JSON.parse(request.query.br);

    expect(br.id).toBeDefined();

    expect(br.site.page).toBeDefined();

    expect(br.imp.length).toBe(2);

    expect(br.imp[0]).toEqual({
        id: jasmine.any(String),
        banner: {
            w: 300,
            h: 250
        },
        tagid: '123456'
    });

    expect(br.imp[1]).toEqual(jasmine.objectContaining({
        id: jasmine.any(String),
        banner: {
            format: [
                {
                    w: 300,
                    h: 250
                },
                {
                    w: 300,
                    h: 600
                }
            ]
        },
        tagid: '987654'
    }));
}

function validateBidRequestWithPrivacy(request) {
    var br = JSON.parse(request.query.br);

    expect(br.regs).toEqual(jasmine.objectContaining({
        ext: {
            gdpr: 1
        }
    }));

    expect(br.user).toEqual(jasmine.objectContaining({
        ext: {
            consent: 'TEST_GDPR_CONSENT_STRING'
        }
    }));
}

function getValidResponse(request, creative) {
    var q = request.query;
    var br = JSON.parse(q.br);

    var response = {
        id: br.id,
        seatbid: [
            {
                bid: [
                    {
                        adm: creative,
                        price: 1.00,
                        nurl: 'https://nurl.sovrn.com',
                        w: 300,
                        h: 250,
                        impid: 'htSlotDesktopAId'
                    },
                    {
                        adm: creative,
                        price: 1.00,
                        nurl: 'https://nurl.sovrn.com',
                        w: 300,
                        h: 250,
                        impid: 'htSlotDesktopAId'
                    }
                ]
            }
        ]
    };
    var jsonResponse = JSON.stringify(response);

    return 'headertag.SovrnHtb.adResponseCallback(' + jsonResponse + ')';
}

function validateTargeting(targetingMap) {
    expect(targetingMap).toEqual(jasmine.objectContaining({
        ix_sovrn_om: jasmine.arrayContaining(['300x250_100']),
        ix_sovrn_id: jasmine.arrayContaining([jasmine.any(String)])
    }));
}

function getValidResponseWithDeal(request, creative) {
    var q = request.query;
    var br = JSON.parse(q.br);

    var response = {
        id: br.id,
        seatbid: [
            {
                bid: [
                    {
                        adm: creative,
                        price: 1.00,
                        nurl: 'https://nurl.sovrn.com',
                        w: 300,
                        h: 250,
                        impid: 'htSlotDesktopAId',
                        dealid: 'soverhtb-test-deal'
                    }
                ]
            }
        ]
    };
    var jsonResponse = JSON.stringify(response);

    return 'headertag.SovrnHtb.adResponseCallback(' + jsonResponse + ')';
}

function validateTargetingWithDeal(targetingMap) {
    expect(targetingMap).toEqual(jasmine.objectContaining({
        ix_sovrn_om: jasmine.arrayContaining(['300x250_100']),
        ix_sovrn_id: jasmine.arrayContaining([jasmine.any(String)]),
        ix_sovrn_pm: jasmine.arrayContaining(['300x250_100']),
        ix_sovrn_pmid: jasmine.arrayContaining(['300x250_soverhtb-test-deal'])
    }));
}

function getPassResponse(request) {
    return 'headertag.SovrnHtb.adResponseCallback({"id": "'
        + JSON.parse(request.query.br).id + '"});';
}

module.exports = {
    getPartnerId: getPartnerId,
    getStatsId: getStatsId,
    getBidRequestRegex: getBidRequestRegex,
    getCallbackType: getCallbackType,
    getArchitecture: getArchitecture,
    getConfig: getConfig,
    validateBidRequest: validateBidRequest,
    validateBidRequestWithPrivacy: validateBidRequestWithPrivacy,
    getValidResponse: getValidResponse,
    validateTargeting: validateTargeting,
    getValidResponseWithDeal: getValidResponseWithDeal,
    validateTargetingWithDeal: validateTargetingWithDeal,
    getPassResponse: getPassResponse
};
