'use strict';

function getPartnerId() {
    return 'LockerDomeHtb';
}

function getStatsId() {
    return 'LKDM';
}

function getCallbackType() {
    return 'NONE';
}

function getArchitecture() {
    return 'FSRA';
}

function getConfig() {
    return {
        xSlots: {
            1: {
                adUnitId: '11154591702270566'
            },
            2: {
                adUnitId: '11154591702270566'
            }
        }
    };
}

function getBidRequestRegex() {
    return {
        method: 'POST',
        urlRegex: /lockerdome\.com\/ladbid\/indexexchange/
    };
}

function validateBidRequest(request) {
    expect(request.query.cachebuster).toBeDefined();
    expect(request.query.requestIds).toBeDefined();
}

function getValidResponse(request, creative) {
    var requestIds = request.query.requestIds.split(',');

    return JSON.stringify({
        bids: [
            {
                requestId: requestIds[0],
                cpm: 2,
                width: 300,
                height: 250,
                ad: creative
            },
            {
                requestId: requestIds[1],
                cpm: 2,
                width: 300,
                height: 250,
                ad: creative
            }
        ]
    });
}

function validateTargeting(targetingMap) {
    expect(targetingMap).toEqual(jasmine.objectContaining({
        ix_lkdm_cpm: jasmine.arrayContaining(['300x250_200', '300x250_200']),
        ix_lkdm_id: jasmine.arrayContaining([jasmine.any(String), jasmine.any(String)])
    }));
}

function getPassResponse() {
    return JSON.stringify({ bids: [] });
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
