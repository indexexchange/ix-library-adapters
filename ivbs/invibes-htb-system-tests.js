'use strict';

function getPartnerId() {
    return 'InvibesHtb';
}

function getStatsId() {
    return 'IVBS';
}

function getCallbackType() {
    return 'NONE';
}

function getArchitecture() {
    return 'FSRA';
}

function getConfig() {
    return {
        siteId: '123456',
        xSlots: {
            1: {
                size: [300, 250],
                siteId: '372138'
            },
            2: {
                size: [300, 250],
                siteId: '372138'
            }
        }
    };
}

function getBidRequestRegex() {
    return {
        method: 'POST',
        urlRegex: /display\.public\.com\/prebid_display/
    };
}

function validateBidRequest(request) {
    expect(request.query.v).toBe('7.2');
    expect(request.query.s).toBe('12345');
    expect(request.query.fn).toBe('headertag.InvibesHtb.adResponseCallback');
    var r = JSON.parse(request.query.r);
    expect(r.id).toBeDefined();
    expect(r.site.page).toBeDefined();
    expect(r.imp.length).toBe(2);
    expect(r.imp[0]).toEqual({
        id: '1',
        banner: {
            w: 300,
            h: 250,
            topframe: jasmine.anything()
        },
        ext: {
            sid: '1',
            siteID: '372138'
        }
    });

    expect(r.imp[1]).toEqual({
        id: '2',
        banner: {
            w: 300,
            h: 250,
            topframe: jasmine.anything()
        },
        ext: {
            sid: '2',
            siteID: '372138'
        }
    });

    expect(r.ext.source).toBe('ixwrapper');
}

function getValidResponse(request, creative) {
    var response = [
        {
            slot: '1',
            w: 728,
            h: 90,
            price: 2.00,
            crid: 'crid_1',
            adm: creative || '<div id="1"></div>'
        },
        {
            slot: '2',
            w: 300,
            h: 250,
            price: 2.00,
            crid: 'crid_2',
            adm: creative || '<div id="2"></div>'
        }
    ];

    return JSON.stringify(response);
}

function validateTargeting(targetingMap) {
    expect(targetingMap).toEqual(
        jasmine.objectContaining({
            IOM: jasmine.arrayContaining([]),
            ix_id: jasmine.arrayContaining([jasmine.any(String)])
        })
    );
}

function getPassResponse(request) {
    return 'headertag.InvibesHtb.adResponseCallback({"id": "'
    + JSON.parse(request.query.r).id + '"});';
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
