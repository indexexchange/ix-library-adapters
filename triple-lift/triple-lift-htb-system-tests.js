'use strict';

function getPartnerId() {
    return 'TripleLiftHtb';
}

function getStatsId() {
    return 'TPL';
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
                inventoryCode: 'test',
                sizes: [[300, 250]]
            }
        }
    };
}

function getBidRequestRegex() {
    return {
        method: 'GET',
        urlRegex: /https:\/\/tlx\.3lift\.com\/header\/auction/
    };
}

function validateBidRequest(request) {
    var r = request.query;
    expect(r.v).toBe('2.1');
    expect(r.lib).toBe('ix');
    expect(r.inv_code).toBe('test');
    expect(r.size).toBe('300x250');
    expect(r.fe).toBe('0');
    expect(r.cmp_cs).toBe('');
    expect(r.gdpr).toBe('false');
    expect(r.referrer).toBe(document.URL);
    expect(r.tmax).toBe('0');
}

function validateBidRequestWithPrivacy(request) {
    var r = request.query;
    expect(r.v).toBe('2.1');
    expect(r.lib).toBe('ix');
    expect(r.inv_code).toBe('test');
    expect(r.size).toBe('300x250');
    expect(r.fe).toBe('0');
    expect(r.gdpr).toBe('true');
    expect(r.cmp_cs).toBe('TEST_GDPR_CONSENT_STRING');
    expect(r.referrer).toBe(document.URL);
    expect(r.tmax).toBe('0');
}

function getValidResponse(request, creative) {
    return JSON.stringify({
        ad: creative,
        cpm: 2.00,
        crid: '3898_17463_747551',
        width: 300,
        height: 250,
        imp_id: '1',
        tl_source: 'hdx'
    });
}

function validateTargeting(targetingMap) {
    expect(targetingMap).toEqual(jasmine.objectContaining({
        ix_tpl_cpm: jasmine.arrayContaining(['300x250_200']),
        ix_tpl_id: jasmine.arrayContaining([jasmine.any(String)])
    }));
}

function getPassResponse() {
    return JSON.stringify({
        status: 'no_bid'
    });
}

function getValidResponseWithDeal(request, creative) {
    return JSON.stringify({
        ad: creative,
        cpm: 2.00,
        crid: '3898_17463_747551',
        width: 300,
        height: 250,
        imp_id: '1',
        deal_id: 'TEST_DEAL_ID',
        tl_source: 'hdx'
    });
}

function validateTargetingWithDeal(targetingMap) {
    expect(targetingMap).toEqual(jasmine.objectContaining({
        ix_tpl_cpm: jasmine.arrayContaining(['300x250_200']),
        ix_tpl_dealid: jasmine.arrayContaining(['TEST_DEAL_ID']),
        ix_tpl_id: jasmine.arrayContaining([jasmine.any(String)])
    }));
}

module.exports = {
    getPartnerId: getPartnerId,
    getStatsId: getStatsId,
    getCallbackType: getCallbackType,
    getArchitecture: getArchitecture,
    getConfig: getConfig,
    getBidRequestRegex: getBidRequestRegex,
    validateBidRequest: validateBidRequest,
    validateBidRequestWithPrivacy: validateBidRequestWithPrivacy,
    getValidResponse: getValidResponse,
    validateTargeting: validateTargeting,
    getPassResponse: getPassResponse,
    getValidResponseWithDeal: getValidResponseWithDeal,
    validateTargetingWithDeal: validateTargetingWithDeal
};
