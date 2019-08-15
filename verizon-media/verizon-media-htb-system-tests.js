'use strict';

function getPartnerId() {
    return 'VerizonMediaHtb';
}

function getStatsId() {
    return 'VZM';
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
                dcn: '2c9d2b4f015f5f7dd437918a83ea020c',
                pos: 'hb_index_leader1'
            }
        }
    };
}

function getBidRequestRegex() {
    return {
        method: 'GET',
        urlRegex: /c2shb\.ssp\.yahoo\.com\/bidRequest/
    };
}

function validateBidRequest(request) {
    expect(request.query.secure).toBe('1');
    expect(request.query.dcn).toBe('2c9d2b4f015f5f7dd437918a83ea020c');
    expect(request.query.pos).toBe('hb_index_leader1');
}

function getValidResponse(request, creative) {
    var response = {
        id: 'cd0f678ac97e4e4ea2261fa23d50ca35',
        seatbid: [
            {
                bid: [
                    {
                        id: 'cd0f678ac97e4e4ea2261fa23d50ca35',
                        price: '200',
                        adm: creative || '<div id="vzm-test-adm">HELLO WORLD</div>',
                        adomain: ['https://www.verizonmedia.com'],
                        crid: '202551',
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

function getPassResponse(request) {
    var response = {
        id: 'e021dfe2638542f8b37891a17692c9fc',
        seatbid: [],
        nbr: 1
    };

    return JSON.stringify(response);
}

function validateTargeting(targetingMap) {
    expect(targetingMap).toEqual(
        jasmine.objectContaining({
            ix_vzm_cpm: jasmine.arrayWithExactContents(['300x250_200']),
            ix_vzm_id: jasmine.arrayWithExactContents([jasmine.any(String)])
        })
    );
}

function validateBidRequestWithPrivacy(request) {
    expect(request.query.gdpr).toBe('1');
    expect(request.query.euconsent).toBe('TEST_GDPR_CONSENT_STRING');
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
