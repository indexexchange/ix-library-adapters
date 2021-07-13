'use strict';

function getPartnerId() {
    return 'KargoHtb';
}

function getStatsId() {
    return 'KARG';
}

function getCallbackType() {
    return 'NONE';
}

function getArchitecture() {
    return 'SRA';
}

function getBidRequestRegex() {
    return {
        method: 'GET',
        urlRegex: /.*krk\.kargo\.com\/api\/v1\/bid.*/
    };
}

function getConfig() {
    return {
        xSlots: {
            1: {
                adSlotId: 'e0e5bfd8-514d-4e73-9c09-a559fe5d89df'
            },
            2: {
                adSlotId: '1e976be9-c60f-413a-8e1a-047fc5b87296'
            }
        }
    };
}

function validateBidRequest(request) {
    var r = JSON.parse(request.query.json);
    expect(r.sessionId).toBeDefined();
    expect(r.timeout).toBeDefined();
    expect(r.timestamp).toBeDefined();
    expect(r.rawCRB).toBeDefined();
    expect(r.rawCRBLocalStorage).toBeDefined();
    expect(r.pageURL).toBeDefined();
    expect(r.krux).toBeDefined();
    expect(r.krux.segments).toBeDefined();
    expect(r.krux.userID).toBeDefined();
    expect(r.adSlotIDs).toBeDefined();
    expect(r.adSlotIDs[0]).toEqual('e0e5bfd8-514d-4e73-9c09-a559fe5d89df');
    expect(r.adSlotIDs[1]).toEqual('1e976be9-c60f-413a-8e1a-047fc5b87296');
    expect(r.userIDs).toBeDefined();
    expect(r.userIDs.clientID).toBeDefined();
    expect(r.userIDs.kargoID).toBeDefined();
    expect(r.userIDs.optOut).toBeDefined();
    expect(r.userIDs.tdID).toBeDefined();
    expect(r.userIDs.idlEnv).toBeDefined();
    expect(r.userIDs.crbIDs).toBeDefined();
    expect(r.userIDs.usp).toBeDefined();
    expect(r.userIDs.gdpr).toBeDefined();
}

function getValidResponse(request, creative) {
    var r = JSON.parse(request.query.json);
    var adm = creative || '<div>FAKE CREATIVE</div>';
    var bidIDs = ['775324bd-5eb7-46e0-afc1-45e08f8ff78d', '9fbf1a48-7969-431d-b0b9-e566c26b3620'];
    var responses = {};
    for (var i = 0; i < r.adSlotIDs.length; i++) {
        var adSlotID = r.adSlotIDs[i];
        var bidID = bidIDs[i];
        responses[adSlotID] = {
            cpm: 2.00,
            adm: adm,
            width: 300,
            height: 250,
            bidID: bidID,
            id: adSlotID,
            receivedTracker: '//krk.kargo.com/api/v1/event/received?ctx=',
            targetingPrefix: '300x250',
            targetingCustom: '',
            pricing: {
                floor: 0,
                buckets: [
                    {
                        max: 2000,
                        step: 5
                    },
                    {
                        max: 5000,
                        step: 100
                    }
                ]
            }
        };
    }

    return JSON.stringify(responses);
}

function getPassResponse() {
    return '{}';
}

function validateTargeting(targetingMap) {
    expect(targetingMap).toEqual(jasmine.objectContaining({
        ix_karg_om: jasmine.arrayContaining(['300x250_200', '300x250_200']),
        ix_karg_id: jasmine.arrayContaining([jasmine.any(String)])
    }));
}

function getValidResponseWithDeal(request, creative) {
    var r = JSON.parse(request.query.json);
    var adm = creative || '<div>FAKE CREATIVE</div>';
    var bidIDs = ['775324bd-5eb7-46e0-afc1-45e08f8ff78d', '9fbf1a48-7969-431d-b0b9-e566c26b3620'];
    var responses = {};
    for (var i = 0; i < r.adSlotIDs.length; i++) {
        var adSlotID = r.adSlotIDs[i];
        var bidID = bidIDs[i];
        responses[adSlotID] = {
            cpm: 2.00,
            adm: adm,
            width: 300,
            height: 250,
            bidID: bidID,
            id: adSlotID,
            receivedTracker: '//krk.kargo.com/api/v1/event/received?ctx=',
            targetingPrefix: '300x250',
            targetingCustom: '200',
            pricing: {
                floor: 0,
                buckets: [
                    {
                        max: 2000,
                        step: 5
                    },
                    {
                        max: 5000,
                        step: 100
                    }
                ]
            }
        };
    }

    return JSON.stringify(responses);
}

function validateTargetingWithDeal(targetingMap) {
    expect(targetingMap).toEqual(jasmine.objectContaining({
        ix_karg_pmid: jasmine.arrayContaining(['300x250_200', '300x250_200']),
        ix_karg_pm: jasmine.arrayContaining(['300x250_200', '300x250_200']),
        ix_karg_id: jasmine.arrayContaining([jasmine.any(String)])
    }));
}

module.exports = {
    getPartnerId: getPartnerId,
    getStatsId: getStatsId,
    getBidRequestRegex: getBidRequestRegex,
    getCallbackType: getCallbackType,
    getArchitecture: getArchitecture,
    getConfig: getConfig,
    validateBidRequest: validateBidRequest,
    getValidResponse: getValidResponse,
    getPassResponse: getPassResponse,
    validateTargeting: validateTargeting,
    getValidResponseWithDeal: getValidResponseWithDeal,
    validateTargetingWithDeal: validateTargetingWithDeal
};
