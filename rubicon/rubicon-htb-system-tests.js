'use strict';

function getPartnerId() {
    return 'RubiconHtb';
}

function getBidRequestRegex() {
    return {
        method: 'GET',
        urlRegex: /.*fastlane\.rubiconproject\.com\/a\/api\/fastlane.json.*/
    };
}

function getCallbackType() {
    return 'NONE';
}

function getArchitecture() {
    return 'MRA';
}

function getStatsId() {
    return 'RUBI';
}

function validateBidRequest(request) {
    var r = request.query;

    expect(r.account_id).toBe('1234');

    expect(r.site_id).toBe('112233');

    expect(r.zone_id).toBe('556677');

    expect(r.size_id).toBe('15');

    expect(r.alt_size_ids).toBe('10');

    expect(r.rf).toEqual(jasmine.anything());

    expect(r.rp_schain).toBeDefined();
}

function validateBidRequestWithPrivacy(request) {
    var r = request.query;

    expect(r.gdpr).toBe('1');

    expect(r.gdpr_consent).toBe('TEST_GDPR_CONSENT_STRING');

    expect(r.us_privacy).toBeDefined();
}

function getConfig() {
    return {
        accountId: '1234',
        xSlots: {
            1: {
                siteId: '112233',
                zoneId: '556677',
                sizes: [[300, 250], [300, 600]]
            }
        },
        schain: {
            ver: '1.0',
            complete: 1,
            nodes: [
                {
                    asi: 'indirectseller.com',
                    sid: '00001',
                    hp: 1
                },
                {
                    asi: 'indirectseller-2.com',
                    sid: '00002',
                    hp: 1
                }
            ]
        }
    };
}

function getValidResponse(request, creative) {
    var adm = '</script>' + creative + '<script>';
    var response = {
        status: 'ok',
        account_id: 1234,
        site_id: 112233,
        zone_id: 556677,
        size_id: 15,
        tracking: '',
        inventory: {
        },
        ads: [
            {
                status: 'ok',
                impression_id: '1234test-1234-12q1-12e4-c08098test',
                size_id: '15',
                ad_id: '6789',
                advertiser: 5678,
                network: 1902,
                creative_id: '1902:12345',
                type: 'script',
                script: adm,
                campaign_id: 48985,
                rtb_rule_id: 1598010,
                cpm: 2,
                targeting: [
                    {
                        key: 'rpfl_1234',
                        values: ['15_tier00015']
                    }
                ]
            }
        ]
    };

    return JSON.stringify(response);
}

function validateTargeting(targetingMap) {
    expect(targetingMap).toEqual(jasmine.objectContaining({
        ix_rubi_om: jasmine.arrayContaining(['300x250_200']),
        ix_rubi_id: jasmine.arrayContaining([jasmine.any(String)])
    }));
}

function getPassResponse() {
    var skipResponse = {
        status: 'ok',
        account_id: 1234,
        site_id: 112233,
        zone_id: 556677,
        size_id: 15,
        alt_size_ids: [10],
        tracking: '',
        inventory: {
        },
        ads: [
            {
                status: 'no-ads',
                reason: 'floor-not-met',
                error_code: '10',
                impression_id: '1234test-1234-12q1-12e4-c08098test'
            }
        ]
    };

    return JSON.stringify(skipResponse);
}

function getValidResponseWithDeal(request, creative) {
    var adm = '</script>' + creative + '<script>';
    var response = {
        status: 'ok',
        account_id: 1234,
        site_id: 112233,
        zone_id: 556677,
        size_id: 15,
        tracking: '',
        inventory: {
        },
        ads: [
            {
                status: 'ok',
                impression_id: '1234test-1234-12q1-12e4-c08098test',
                size_id: '15',
                ad_id: '6789',
                advertiser: 5678,
                network: 1902,
                creative_id: '1902:12345',
                type: 'script',
                script: adm,
                campaign_id: 48985,
                rtb_rule_id: 1598010,
                cpm: 2,
                deal: 12345,
                targeting: [
                    {
                        key: 'rpfl_1234',
                        values: ['deal_tierAll']
                    }
                ]
            }
        ]
    };

    return JSON.stringify(response);
}

function validateTargetingWithDeal(targetingMap) {
    expect(targetingMap).toEqual(jasmine.objectContaining({
        ix_rubi_om: jasmine.arrayContaining(['300x250_200']),
        ix_rubi_id: jasmine.arrayContaining([jasmine.any(String)]),
        rpfl_1234: jasmine.arrayContaining(['deal_tierAll'])
    }));
}

module.exports = {
    getPartnerId: getPartnerId,
    getBidRequestRegex: getBidRequestRegex,
    getCallbackType: getCallbackType,
    getConfig: getConfig,
    getArchitecture: getArchitecture,
    getStatsId: getStatsId,
    validateBidRequest: validateBidRequest,
    validateBidRequestWithPrivacy: validateBidRequestWithPrivacy,
    getValidResponse: getValidResponse,
    validateTargeting: validateTargeting,
    getPassResponse: getPassResponse,
    getValidResponseWithDeal: getValidResponseWithDeal,
    validateTargetingWithDeal: validateTargetingWithDeal
};
