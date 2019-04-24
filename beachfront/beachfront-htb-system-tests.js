'use strict';

function getPartnerId() {
    return 'BeachfrontHtb';
}

function getStatsId() {
    return 'BFT';
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
                appId: '3b16770b-17af-4d22-daff-9606bdf2c9c3',
                bidfloor: 0.01,
                sizes: [[728, 90], [468, 60]]
            },
            2: {
                appId: '3b16770b-17af-4d22-daff-9606bdf2c9c3',
                bidfloor: 0.02,
                sizes: [[300, 250]]
            }
        }
    };
}

function getBidRequestRegex() {
    return {
        method: 'POST',
        urlRegex: /display\.bfmio\.com\/prebid_display/
    };
}

function validateBidRequest(request) {
    var data = JSON.parse(request.body);
    expect(data.slots).toEqual([
        {
            slot: '1',
            id: '3b16770b-17af-4d22-daff-9606bdf2c9c3',
            bidfloor: 0.01,
            sizes: [
                {
                    w: 728,
                    h: 90
                },
                {
                    w: 468,
                    h: 60
                }
            ]
        },
        {
            slot: '2',
            id: '3b16770b-17af-4d22-daff-9606bdf2c9c3',
            bidfloor: 0.02,
            sizes: [
                {
                    w: 300,
                    h: 250
                }
            ]
        }
    ]);
    expect(request.query.cb).toBeDefined();
}

function getValidResponse(request, creative) {
    var response = [
        {
            slot: '1',
            w: 728,
            h: 90,
            price: 2.00,
            crid: 'crid_1',
            adm: creative || '<div id="1"></div>'
        },
        {
            slot: '2',
            w: 300,
            h: 250,
            price: 2.00,
            crid: 'crid_2',
            adm: creative || '<div id="2"></div>'
        }
    ];

    return JSON.stringify(response);
}

function validateTargeting(targetingMap) {
    expect(targetingMap).toEqual(
        jasmine.objectContaining({
            ix_bft_cpm: jasmine.arrayWithExactContents(['728x90_200', '300x250_200']),
            ix_bft_id: jasmine.arrayWithExactContents([jasmine.any(String), jasmine.any(String)])
        })
    );
}

function getPassResponse() {
    var response = [
        {
            sync: '//sync.bfmio.com/sync_iframe?ifpl=5&ifg=1&id=example&gdpr=1&gc=GDPR_CONSENT_STRING&gce=1&cb=123'
        }
    ];

    return JSON.stringify(response);
}

function validateBidRequestWithPrivacy(request) {
    var data = JSON.parse(request.body);
    expect(data.gdpr).toBe(1);
    expect(data.gdprConsent).toBe('TEST_GDPR_CONSENT_STRING');
}

function validateBidRequestWithAdSrvrOrg(request) {
    var data = JSON.parse(request.body);
    expect(data.tdid).toBe('TEST_ADSRVR_ORG_STRING');
}

module.exports = {
    getPartnerId: getPartnerId,
    getStatsId: getStatsId,
    getCallbackType: getCallbackType,
    getArchitecture: getArchitecture,
    getConfig: getConfig,
    getBidRequestRegex: getBidRequestRegex,
    validateBidRequest: validateBidRequest,
    getValidResponse: getValidResponse,
    validateTargeting: validateTargeting,
    getPassResponse: getPassResponse,
    validateBidRequestWithPrivacy: validateBidRequestWithPrivacy,
    validateBidRequestWithAdSrvrOrg: validateBidRequestWithAdSrvrOrg
};
