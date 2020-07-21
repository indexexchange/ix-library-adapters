'use strict';

function getPartnerId() {
    return 'BrightcomHtb';
}

function getStatsId() {
    return 'BRI';
}

function getBidRequestRegex() {
    return {
        method: 'POST',
        urlRegex: /.*brightcombid\.marphezis\.com\/hb.*/
    };
}

function getCallbackType() {
    return 'NONE';
}

function getArchitecture() {
    return 'SRA';
}

function getConfig() {
    return {
        publisherId: '2141020',
        xSlots: {
            1: {
                placementId: '283a9f4cd2415d',
                bidfloor: 1,
                sizes: [[728, 90], [468, 60]]
            },
            2: {
                placementId: '283a9f4cd2415d',
                bidfloor: 2,
                sizes: [[300, 250]]
            }
        }
    };
}

function validateBidRequest(request) {
    expect(request.query.cb).toBeDefined();

    var r = JSON.parse(request.body);

    expect(r.id).toBeDefined();
    expect(r.site.page).toBeDefined();
    expect(r.site.domain).toBeDefined();
    expect(r.site.publisher.id).toBeDefined();
}

function getValidResponse(request, creative) {
    var adm = creative || '<script type="text/javascript">var compassSmartTag={h:"2140340",t:"16577",d:"2",referral:",y_b:{y:"j",s:"300x250"},hb:{raid:"7ba5a917936b33",rimid:"283a9f4cd2415d",rbid:"376874781"}};</script><script src="//cdn.marphezis.com/cmps/cst.min.js"></script>'; // eslint-disable-line max-len
    var nurl = '//trk.diamondminebubble.com/h.html?e=hb_before_creative_renders&ho=2140340&ty=j&si=300x250&ta=16577&cd=cdn.marphezis.com&raid=7ba5a917936b33&rimid=283a9f4cd2415d&rbid=376874781&cb=123131313213'; // eslint-disable-line max-len
    var response = {
        bidid: '376864031',
        id: '7ba5a917936b33',
        seatbid: [
            {
                seat: 'brightcom',
                bid: [
                    {
                        id: '376874781',
                        adm: adm,
                        impid: '283a9f4cd2415d',
                        nurl: nurl,
                        price: 1.00,
                        w: 728,
                        h: 90
                    },
                    {
                        id: '376874782',
                        adm: adm,
                        impid: '283a9f4cd2415d',
                        nurl: nurl,
                        price: 2.00,
                        w: 468,
                        h: 60
                    }
                ]
            }
        ]
    };

    return JSON.stringify(response);
}

function getPassResponse(request, creative) {
    var adm = creative || '<script type="text/javascript">var compassSmartTag={h:"2140340",t:"16577",d:"2",referral:",y_b:{y:"j",s:"300x250"},hb:{raid:"7ba5a917936b33",rimid:"283a9f4cd2415d",rbid:"376874781"}};</script><script src="//cdn.marphezis.com/cmps/cst.min.js"></script>'; // eslint-disable-line max-len
    var nurl = '//trk.diamondminebubble.com/h.html?e=hb_before_creative_renders&ho=2140340&ty=j&si=300x250&ta=16577&cd=cdn.marphezis.com&raid=7ba5a917936b33&rimid=283a9f4cd2415d&rbid=376874781&cb=123131313213'; // eslint-disable-line max-len
    var response = {
        bidid: '376864031',
        id: '7ba5a917936b33',
        seatbid: [
            {
                seat: 'brightcom',
                bid: [
                    {
                        id: '376874781',
                        adm: adm,
                        impid: '283a9f4cd2415d',
                        nurl: nurl,
                        price: 0,
                        w: 728,
                        h: 90
                    },
                    {
                        id: '376874782',
                        adm: adm,
                        impid: '283a9f4cd2415e',
                        nurl: nurl,
                        price: 0,
                        w: 468,
                        h: 60
                    }
                ]
            }
        ]
    };

    return JSON.stringify(response);
}

function validateTargeting(targetingMap) {
    expect(targetingMap).toEqual(jasmine.objectContaining({
        ix_bri_cpm: jasmine.arrayContaining(['728x90_100', '468x60_200']),
        ix_bri_id: jasmine.arrayContaining([jasmine.any(String)])
    }));
}

function validatePixelRequests(pixelRequests) {
    expect(pixelRequests[0].toString()).toMatch(/.*trk\.diamondminebubble\.com\/h\.html.*/);
}

module.exports = {
    getPartnerId: getPartnerId,
    getStatsId: getStatsId,
    getBidRequestRegex: getBidRequestRegex,
    getCallbackType: getCallbackType,
    getArchitecture: getArchitecture,
    getConfig: getConfig,
    getPassResponse: getPassResponse,
    validateBidRequest: validateBidRequest,
    getValidResponse: getValidResponse,
    validateTargeting: validateTargeting,
    validatePixelRequests: validatePixelRequests
};
