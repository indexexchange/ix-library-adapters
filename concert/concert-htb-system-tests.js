'use strict';

function getPartnerId() {
    return 'ConcertHtb';
}

function getCallbackType() {
    return 'NONE';
}

function getArchitecture() {
    return 'FSRA';
}

function getStatsId() {
    return 'CON';
}

function getConfig() {
    return {
        partnerId: 'test_partner',
        xSlots: {
            1: {
                sizes: [300, 250],
                placementId: 1
            },
            2: {
                sizes: [[300, 600], [150, 300]],
                placementId: 2
            }
        }
    };
}

function getBidRequestRegex() {
    return {
        method: 'POST',
        urlRegex: /bids\..*\/bids\/ix/
    };
}

function validateBidRequest(request) {
    var body = JSON.parse(request.body);
    var meta = body.meta;
    var slots = body.slots;

    expect(request.hostname).toBe('bids.concert.io');
    expect(request.pathname).toBe('/bids/ix');

    expect(body.callbackId).toMatch(/.{8}/);
    expect(meta).toBeDefined();
    expect(slots).toBeDefined();

    expect(meta.adapterVersion).toBe('2.0.0');

    expect(meta.pageUrl).toBeDefined();
    expect(meta.screen).toMatch(/\d+x\d+/);

    // How can we mock this to return a specific value
    expect(meta.uid).toBeDefined();

    expect(slots.length).toBe(2);

    expect(slots[0]).toBeDefined();
    expect(slots[0].name).toBe('1');
    expect(slots[0].partnerId).toBe('test_partner');
    expect(slots[0].sizes).toEqual([300, 250]);

    expect(slots[1]).toBeDefined();
    expect(slots[1].name).toBe('2');
    expect(slots[1].partnerId).toBe('test_partner');
    expect(slots[1].sizes.length).toBe(2);
    expect(slots[1].sizes[0]).toEqual([300, 600]);
    expect(slots[1].sizes[1]).toEqual([150, 300]);
}

function getValidResponse(request, creative) {
    var body = JSON.parse(request.body);
    var slots = body.slots;

    var response = {
        bids: [
            {
                ad: creative,
                creativeId: Math.random().toString(36).substring(2, 15),
                bidId: slots[0].name,
                width: slots[0].sizes[0],
                height: slots[0].sizes[1],
                cpm: '200',
                currency: 'USD',
                netRevenue: false,
                ttl: 360
            },
            {
                ad: creative,
                creativeId: Math.random().toString(36).substring(2, 15),
                bidId: slots[1].name,
                width: slots[1].sizes[0],
                height: slots[1].sizes[1],
                cpm: '200',
                currency: 'USD',
                netRevenue: false,
                ttl: 360
            }
        ]
    };

    return JSON.stringify(response);
}

function validateTargeting(targetingMap) {
    expect(targetingMap).toEqual(jasmine.objectContaining({
        ix_con_cpm: jasmine.arrayContaining(['300x250_200']),
        ix_con_id: jasmine.arrayContaining([jasmine.any(String)])
    }));
}

function getPassResponse() {
    var response = {
        bids: []
    };

    return JSON.stringify(response);
}

module.exports = {
    getPartnerId: getPartnerId,
    getCallbackType: getCallbackType,
    getArchitecture: getArchitecture,
    getStatsId: getStatsId,
    getConfig: getConfig,
    getBidRequestRegex: getBidRequestRegex,
    validateBidRequest: validateBidRequest,
    getValidResponse: getValidResponse,
    validateTargeting: validateTargeting,
    getPassResponse: getPassResponse
};
