'use strict';

function getPartnerId() {
    return 'ConversantHtb';
}

function getStatsId() {
    return 'CONV';
}

function getCallbackType() {
    return 'NONE';
}

function getArchitecture() {
    return 'SRA';
}

function getBidRequestRegex() {
    return {
        method: 'POST',
        urlRegex: /web\.hb\.ad\.cpe\.dotomi\.com\/s2s\/header\/24/
    };
}

function getConfig() {
    return {
        siteId: '108060',
        xSlots: {
            1: {
                placementId: '54321',
                sizes: [[300, 250], [180, 150]]
            },
            2: {
                placementId: '12345',
                sizes: [[120, 600]],
                position: 1,
                bidfloor: 0.01
            }
        }
    };
}

function validateBidRequest(request) {
    expect(request.host).toEqual('web.hb.ad.cpe.dotomi.com');

    var config = getConfig();
    var slotKeys = Object.keys(config.xSlots);
    expect(request.body).toBeDefined();

    var body = JSON.parse(request.body);
    expect(body.id).toBeDefined();

    slotKeys.forEach(function (value, idx) {
        var slot = config.xSlots[value];
        var imp = body.imp[idx];
        slot.sizes.forEach(function (arr, arrIdx) {
            expect(imp.banner.format[arrIdx].w).toEqual(arr[0]);
            expect(imp.banner.format[arrIdx].h).toEqual(arr[1]);
        });
        expect(imp.displaymanager).toEqual('40834-index-client');
        expect(imp.tagid).toEqual(slot.placementId);
    });

    expect(body.imp[1].banner.pos).toEqual(1);
    expect(body.imp[1].bidfloor).toEqual(0.01);

    expect(body.site.id).toEqual('108060');
    expect(body.site.page).toEqual(jasmine.any(String));
    expect(body.at).toEqual(1);

    expect(body.device).toBeDefined();
    expect(body.device.ua).toEqual(jasmine.any(String));
    expect(body.regs.ext.gdpr).toEqual(jasmine.any(Number));
    expect(body.user.ext.consent).toEqual(jasmine.any(String));
}

function getValidResponse(request, creative) {
    var body = JSON.parse(request.body);
    var response = {
        seatbid: [
            {
                bid: [
                    {
                        adm: creative,
                        crid: '2101274',
                        impid: body.imp[0].id,
                        price: 2,
                        w: 300,
                        h: 250,
                        adomain: ['https://na13.salesforce.com'],
                        iurl: 'http://media.fastclick.net/win.bid',
                        id: 'htSlot1_0'
                    },
                    {
                        adm: creative,
                        crid: '2166499',
                        impid: body.imp[1].id,
                        price: 2,
                        w: 120,
                        h: 600,
                        adomain: ['https://na13.salesforce.com'],
                        iurl: 'http://media.fastclick.net/win.bid',
                        id: 'htSlot1_1'
                    }
                ]
            }
        ],
        id: '_jjzp7ar12'
    };

    return JSON.stringify(response);
}

function validateTargeting(targetingMap) {
    expect(targetingMap).toEqual(jasmine.objectContaining({
        ix_conv_cpm: jasmine.arrayContaining([jasmine.stringMatching(/300x250_\d+/), jasmine.stringMatching(/120x600_\d+/)]),
        ix_conv_id: jasmine.arrayContaining([jasmine.any(String)])
    }));
}

function getPassResponse(request) {
    var body = JSON.parse(request.body);
    var response = {
        seatbid: [
            {
                bid: [
                    {
                        impid: body.imp[0].id,
                        price: 0.0000,
                        id: 'htSlot1_0'
                    },
                    {
                        impid: body.imp[1].id,
                        price: 0.0000,
                        id: 'htSlot1_1'
                    }
                ]
            }
        ],
        id: '_jjzp7ar12'
    };

    return JSON.stringify(response);
}

function validateBidRequestWithPrivacy(request) {
    var body = JSON.parse(request.body);

    expect(body.regs.ext.gdpr).toEqual(1);
    expect(body.user.ext.consent).toEqual('TEST_GDPR_CONSENT_STRING');
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
    getPassResponse: getPassResponse,
    validateTargeting: validateTargeting,
    validateBidRequestWithPrivacy: validateBidRequestWithPrivacy
};
