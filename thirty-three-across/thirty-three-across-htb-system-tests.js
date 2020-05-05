'use strict';

function getPartnerId() {
    return 'ThirtyThreeAcrossHtb';
}

function getStatsId() {
    return 'THI';
}

function getBidRequestRegex() {
    return {
        method: 'POST',
        urlRegex: /ssc\.33across\.com\/api\/v1\/hb/
    };
}

function getCallbackType() {
    return 'NONE';
}

function getArchitecture() {
    return 'MRA';
}

function getConfig() {
    return {
        siteId: 'acbdefgABCDEFG-1234567',
        test: 1,
        xSlots: {
            1: {
                sizes: [[300, 250], [160, 600]],
                productId: 'siab',
                bidfloor: 0.1
            }
        }
    };
}

function validateBidRequest(request) {
    var config = getConfig();
    var xSlot = config.xSlots[1];
    var sizes = xSlot.sizes;

    var queryObj = JSON.parse(request.body);

    expect(queryObj.id).toBeDefined();

    expect(queryObj.imp.length).toEqual(1);
    expect(queryObj.imp[0].id).toBeDefined();
    expect(queryObj.imp[0].banner.format[0]).toEqual({
        w: sizes[0][0],
        h: sizes[0][1],
        ext: { }
    });
    expect(queryObj.imp[0].banner.format[1]).toEqual({
        w: sizes[1][0],
        h: sizes[1][1],
        ext: { }
    });
    expect(queryObj.imp[0].banner.ext).toBeDefined();
    expect(queryObj.imp[0].banner.ext.ttx).toBeDefined();
    expect(queryObj.imp[0].banner.ext.ttx.viewability).toBeDefined();
    expect(queryObj.imp[0].banner.ext.ttx.viewability.amount).toBeDefined();
    expect(queryObj.imp[0].bidfloor).toEqual(xSlot.bidfloor);
    expect(queryObj.imp[0].ext.ttx.prod).toEqual(xSlot.productId);

    expect(queryObj.site).toBeDefined();
    expect(queryObj.site.id).toEqual(config.siteId);
    expect(queryObj.site.page).toBeDefined();
    expect(queryObj.site.ref).toBeDefined();

    expect(queryObj.user).toBeDefined();
    expect(queryObj.user.ext).toBeDefined();

    expect(queryObj.regs).toBeDefined();
    expect(queryObj.regs.ext).toBeDefined();

    expect(queryObj.ext).toBeDefined();
    expect(queryObj.ext.ttx).toBeDefined();
    expect(queryObj.ext.ttx.prebidStartedAt).toBeDefined();
    expect(queryObj.ext.ttx.caller.length).toEqual(1);
    expect(queryObj.ext.ttx.caller[0]).toEqual({
        name: 'index',
        version: '2.0.0'
    });

    expect(queryObj.test).toEqual(config.test);
}

function validateBidRequestWithPrivacy(request) {
    var queryObj = JSON.parse(request.body);

    expect(queryObj.regs).toEqual(jasmine.objectContaining({
        ext: {
            gdpr: 1
        }
    }));

    expect(queryObj.user).toEqual(jasmine.objectContaining({
        ext: {
            consent: 'TEST_GDPR_CONSENT_STRING'
        }
    }));
}

function getValidResponse(request, creative) {
    var config = getConfig();
    var xSlot = config.xSlots[1];
    var sizes = xSlot.sizes;
    var queryObj = JSON.parse(request.body);

    var adm = creative || '<a target="_blank" href="http://www.indexexchange.com"><div style="text-decoration: none; color: black; width: 300px; height:250px;background-color: #336eff;"; id="testDiv"><h1>&lt;header_tag&gt; certification testing: 1_1a1a1a1a, deal: 12346 (211474080)width: 300px; height:250px <iframe src="http://as.casalemedia.com/ifnotify?dfp_1_1a1a1a1a&referer=http://127.0.0.1:3000/p/DfpAuto/nonPrefetch/test?dev=desktop&displayMode=SRA&req=211474080" width="0" height="0" frameborder="0" scrolling="no" style="display:none;" marginheight="0" marginwidth="0"></iframe></h1></div><script>var thisDiv = document.getElementById("testDiv");thisDiv.style.fontFamily="verdana";</script></a>';
    var response = {
        cur: 'USD',
        id: queryObj.id,
        seatbid: [
            {
                bid: [
                    {
                        adm: adm,
                        adomain: ['www.someCreativeDomain.com'],
                        id: '123456789',
                        impid: queryObj.imp[0].id,
                        w: sizes[0][0],
                        h: sizes[0][1],

                        // NOTE: must set to $2.00, this is the expected price for the IX test case
                        price: 2
                    }
                ]
            }
        ]
    };

    return JSON.stringify(response);
}

function validateTargeting(targetingMap) {
    expect(targetingMap).toEqual(jasmine.objectContaining({
        ix_thi_cpm: jasmine.arrayContaining(['300x250_200']),
        ix_thi_id: jasmine.arrayContaining([jasmine.any(String)])
    }));
}

function getPassResponse(request) {
    var queryObj = JSON.parse(request.body);

    var response = {
        cur: 'USD',
        id: queryObj.id,
        seatbid: []
    };

    return JSON.stringify(response);
}

module.exports = {
    getPartnerId: getPartnerId,
    getStatsId: getStatsId,
    getBidRequestRegex: getBidRequestRegex,
    getCallbackType: getCallbackType,
    getArchitecture: getArchitecture,
    getConfig: getConfig,
    validateBidRequest: validateBidRequest,
    validateBidRequestWithPrivacy: validateBidRequestWithPrivacy,
    getValidResponse: getValidResponse,
    validateTargeting: validateTargeting,
    getPassResponse: getPassResponse
};
