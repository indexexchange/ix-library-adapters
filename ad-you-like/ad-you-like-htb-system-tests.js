'use strict';

function getPartnerId() {
    return 'AdYouLikeHtb';
}

function getStatsId() {
    return 'ADY';
}

function getCallbackType() {
    return 'NONE';
}

function getArchitecture() {
    return 'FSRA';
}

function getBidRequestRegex() {
    return {
        method: 'GET',
        urlRegex: /.*hb-api\.omnitagjs\.com\/hb-api\/ix\/v1.*/
    };
}

function getConfig() {
    return {
        xSlots: {
            1: {
                placementId: 'e622af275681965d3095808561a1e510',
                sizes: [[300, 250]]
            },
            2: {
                placementId: 'e622af275681965d3095808561a1e510',
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
    var query = request.query;
    var slotConf = JSON.parse(query.Bids).htSlotDesktopAId;
    var consentData = JSON.parse(query.gdprConsent);

    expect(query.PageRefreshed).toMatch(/(true|false)/);
    expect(consentData.consentString).toBeDefined();
    expect(consentData.consentRequired).toBeDefined();

    expect(slotConf.PlacementID).toBe('e622af275681965d3095808561a1e510');
    expect(slotConf.AvailableSizes).toBe('300x250,300x600');
}

function getValidResponse(request, creative) {
    var response = [
        {
            Price: 2,
            Attempt: '0aa4828b26ba4869e622af275681965d',
            Placement: 'e622af275681965d3095808561a1e510',
            Width: 300,
            Height: 250,
            Ad: creative,
            CreativeID: '858f255f656ea3d3dcae8256ca30775c',
            BidID: '2ec156839b9502'
        }
    ];

    return JSON.stringify(response);
}

function validateBidRequestWithPrivacy(request) {
    var r = JSON.parse(request.query.r);

    expect(r.gdprConsent).toEqual(jasmine.objectContaining({
        consentRequired: 1,
        consentString: 'TEST_GDPR_CONSENT_STRING'
    }));
}

function validateBidRequestWithUAdSrvrOrg(request) {
    var r = JSON.parse(request.query.r);

    expect(r.user.eids).toEqual(jasmine.arrayContaining([
        {
            source: 'adserver.org',
            uids: jasmine.arrayContaining([
                {
                    id: 'TEST_ADSRVR_ORG_STRING',
                    ext: {
                        rtiPartner: 'TDID'
                    }
                }
            ])
        }
    ]));
}

function validateTargeting(targetingMap) {
    expect(targetingMap).toEqual(jasmine.objectContaining({
        ix_ady_cpm: jasmine.arrayContaining(['300x250_200']),
        ix_ady_id: jasmine.arrayContaining([jasmine.any(String)])
    }));
}

module.exports = {
    getPartnerId: getPartnerId,
    getStatsId: getStatsId,
    getCallbackType: getCallbackType,
    getArchitecture: getArchitecture,
    getBidRequestRegex: getBidRequestRegex,
    getConfig: getConfig,
    validateBidRequest: validateBidRequest,
    getValidResponse: getValidResponse,
    validateBidRequestWithPrivacy: validateBidRequestWithPrivacy,
    validateBidRequestWithUAdSrvrOrg: validateBidRequestWithUAdSrvrOrg,
    validateTargeting: validateTargeting
};
