'use strict';

function getPartnerId() {
    return 'IASHtb';
}

function getStatsId() {
    return 'IAS';
}

function getCallbackType() {
    return 'NONE';
}

function getArchitecture() {
    return 'FSRA';
}

function getConfig() {
    return {
        pubId: '99',
        xSlots: {
            1: {
                sizes: [[100, 200]],
                adUnitPath: '/57514611/news.com'
            }
        }
    };
}

function getBidRequestRegex() {
    return {
        method: 'GET',
        urlRegex: /.*pixel\.adsafeprotected\.com\/services\/pub.*/
    };
}

function validateBidRequest(request) {
    expect(request.query.anId).toBeDefined();
    expect(request.query.slot).toBeDefined();
    expect(request.query.wr).toBeDefined();
    expect(request.query.sr).toBeDefined();
}


function getValidResponse(request, creative) {
    var response = {
        request: request,
        creative: creative
    };
    return JSON.stringify(response);
}

function getPassResponse(request) {
    var response = { request: request };
    return JSON.stringify(response);
}

function validateTargeting(targetingMap) {
    expect(targetingMap).toEqual(jasmine.objectContaining({}));
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
    getPassResponse: getPassResponse
};
