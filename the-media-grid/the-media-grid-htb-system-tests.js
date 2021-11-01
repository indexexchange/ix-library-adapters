'use strict';

function getPartnerId() {
    return 'TheMediaGridHtb';
}

function getStatsId() {
    return 'GRID';
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
        urlRegex: /grid\.bidswitch\.net\/hbjson/
    };
}

function getConfig() {
    return {
        xSlots: {
            1: {
                uid: '1',
                sizes: [[300, 250]],
                keywords: {
                    site: {
                        pub1: [
                            {
                                name: 'Pub name 1',
                                section1: ['pub1_sec1_key1', 'pub1_sec1_key2'],
                                section2: ['pub1_sec2_key1']
                            }
                        ],
                        pub2: [
                            {
                                name: 'Pub name 2',
                                section_1: [
                                    'pub2_key1',
                                    'pub2_key2',
                                    'pub2_key3'
                                ]
                            }
                        ]
                    }
                }
            },
            2: {
                uid: '2',
                sizes: [[300, 250], [300, 600]],
                bidFloor: 0.01
            }
        }
    };
}

function validateBidRequest(request) {
    expect(request.host).toEqual('grid.bidswitch.net');

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
        expect(imp.banner.w).toEqual(slot.sizes[0][0]);
        expect(imp.banner.h).toEqual(slot.sizes[0][1]);
        expect(imp.tagid).toEqual(slot.uid);
    });

    expect(body.imp[0].ext).toBeDefined();
    expect(body.imp[0].ext.bidder).toBeDefined();
    expect(body.imp[0].ext.bidder.keywords).toBeDefined();

    var keywords = body.imp[0].ext.bidder.keywords;
    expect(keywords.site).toBeDefined();
    expect(keywords.site.pub1).toBeDefined();
    expect(keywords.site.pub1[0]).toBeDefined();
    expect(keywords.site.pub1[0].name).toEqual('Pub name 1');
    expect(keywords.site.pub1[0].section1).toBeDefined();
    expect(keywords.site.pub1[0].section1.toString()).toEqual('pub1_sec1_key1,pub1_sec1_key2');
    expect(keywords.site.pub1[0].section2).toBeDefined();
    expect(keywords.site.pub1[0].section2.toString()).toEqual('pub1_sec2_key1');
    expect(keywords.site.pub2).toBeDefined();
    expect(keywords.site.pub2[0].name).toEqual('Pub name 2');
    expect(keywords.site.pub2[0].section_1).toBeDefined();
    expect(keywords.site.pub2[0].section_1.toString()).toEqual('pub2_key1,pub2_key2,pub2_key3');

    expect(body.imp[1].bidfloor).toEqual(0.01);

    expect(body.ext.keywords.site.pub1).toBeDefined();
    expect(body.ext.keywords.site.pub1[0].name).toEqual('Pub name 1');
    expect(body.ext.keywords.site.pub1[0].segments).toBeDefined();
    expect(body.ext.keywords.site.pub1[0].segments[0]).toBeDefined();
    expect(body.ext.keywords.site.pub1[0].segments[0].name).toEqual('section1');
    expect(body.ext.keywords.site.pub1[0].segments[0].value).toEqual('pub1_sec1_key1');
    expect(body.ext.keywords.site.pub1[0].segments[1]).toBeDefined();
    expect(body.ext.keywords.site.pub1[0].segments[1].name).toEqual('section1');
    expect(body.ext.keywords.site.pub1[0].segments[1].value).toEqual('pub1_sec1_key2');
    expect(body.ext.keywords.site.pub1[0].segments[2]).toBeDefined();
    expect(body.ext.keywords.site.pub1[0].segments[2].name).toEqual('section2');
    expect(body.ext.keywords.site.pub1[0].segments[2].value).toEqual('pub1_sec2_key1');
    expect(body.ext.keywords.site.pub2).toBeDefined();
    expect(body.ext.keywords.site.pub2[0].name).toEqual('Pub name 2');
    expect(body.ext.keywords.site.pub2[0].segments).toBeDefined();
    expect(body.ext.keywords.site.pub2[0].segments[0]).toBeDefined();
    expect(body.ext.keywords.site.pub2[0].segments[0].name).toEqual('section_1');
    expect(body.ext.keywords.site.pub2[0].segments[0].value).toEqual('pub2_key1');
    expect(body.ext.keywords.site.pub2[0].segments[1]).toBeDefined();
    expect(body.ext.keywords.site.pub2[0].segments[1].name).toEqual('section_1');
    expect(body.ext.keywords.site.pub2[0].segments[1].value).toEqual('pub2_key2');
    expect(body.ext.keywords.site.pub2[0].segments[2]).toBeDefined();
    expect(body.ext.keywords.site.pub2[0].segments[2].name).toEqual('section_1');
    expect(body.ext.keywords.site.pub2[0].segments[2].value).toEqual('pub2_key3');

    expect(body.site.page).toEqual(jasmine.any(String));
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
                        adid: '2101274',
                        impid: body.imp[0].id,
                        price: 2,
                        w: 300,
                        h: 250,
                        adomain: ['https://na13.salesforce.com'],
                        id: 'htSlot1_0'
                    },
                    {
                        adm: creative,
                        crid: '2166499',
                        adid: '2166499',
                        impid: body.imp[1].id,
                        price: 2,
                        w: 120,
                        h: 600,
                        adomain: ['https://na13.salesforce.com'],
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
        ix_grid_cpm: jasmine.arrayContaining([jasmine.stringMatching(/300x250_\d+/), jasmine.stringMatching(/120x600_\d+/)]),
        ix_grid_id: jasmine.arrayContaining([jasmine.any(String)])
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
