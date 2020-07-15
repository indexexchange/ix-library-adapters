'use strict';

function getPartnerId() {
    return 'AolHtb';
}

function getStatsId() {
    return 'AOL';
}

function getCallbackType() {
    return 'NONE';
}

function getArchitecture() {
    return 'MRA';
}

function getConfig() {
    return {
        region: 'us',
        networkId: '9599.1',
        xSlots: {
            1: {
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
                        adm: creative || '<div id="aol-test-adm">HELLO WORLD</div>',
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
            ix_aol_om: jasmine.arrayWithExactContents(['300x250_200']),
            ix_aol_id: jasmine.arrayWithExactContents([jasmine.any(String)])
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
