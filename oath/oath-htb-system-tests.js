'use strict';

function getPartnerId() {
    return 'OathHtb';
}

function getStatsId() {
    return 'OATH';
}

function getCallbackType() {
    return 'NONE';
}

function getArchitecture() {
    return 'MRA';
}

function getConfig() {
    return {
        xSlots: {
            1: {
                region: 'us',
                networkId: '9599.1',
                placementId: '4601516'
            }
        }
    };
}

function getBidRequestRegex() {
    return {
        method: 'GET',
        urlRegex: /adserver-us\.adtech\.advertising\.com\/pubapi/
    };
}

function validateBidRequest(request) {
    var pathBits = request.pathname.split('/');
    var params = request.pathname.split('ADTECH;')[1].split(';');

    expect(request.protocol).toBe('https:');
    expect(request.pathname).toContain('ADTECH;');

    expect(pathBits).toContain('9599.1');
    expect(pathBits).toContain('4601516');
    expect(pathBits).toContain('-1');
    expect(pathBits).toContain('0');

    expect(params).toContain('v=2');
    expect(params).toContain('cmd=bid');
    expect(params).toContain('cors=yes');
}

function getValidResponse(request, creative) {
    var response = {
        id: '135118129423453799',
        seatbid: [
            {
                bid: [
                    {
                        id: '135118129423453799',
                        price: '2.00',
                        adm: creative || '<div id="oath-test-adm">HELLO WORLD</div>',
                        crid: '19992723',
                        w: 300,
                        h: 250
                    }
                ]
            }
        ],
        ext: {}
    };

    return JSON.stringify(response);
}

function getPassResponse() {
    var response = {
        id: '135118129423453799',
        seatbid: [],
        nbr: 1
    };

    return JSON.stringify(response);
}

function validateTargeting(targetingMap) {
    expect(targetingMap).toEqual(
        jasmine.objectContaining({
            ix_oath_cpm: jasmine.arrayWithExactContents(['300x250_200']),
            ix_oath_id: jasmine.arrayWithExactContents([jasmine.any(String)])
        })
    );
}

function validateBidRequestWithPrivacy(request) {
    var params = request.pathname.split('ADTECH;')[1].split(';');
    expect(params).toContain('gdpr=1');
    expect(params).toContain('euconsent=TEST_GDPR_CONSENT_STRING');
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
    validateBidRequestWithPrivacy: validateBidRequestWithPrivacy
};
