'use strict';

function getPartnerId() {
    return 'PubmaticHtb';
}

function getStatsId() {
    return 'PUBM';
}

function getCallbackType() {
    return 'NONE';
}

function getArchitecture() {
    return 'SRA';
}

function getConfig() {
    return {
        timeout: 1000,
        publisherId: '5890',
        lat: '40.712775',
        lon: '-74.005973',
        yob: '1982',
        gender: 'M',
        kadfloor: '1.75',
        xSlots: {
            1: {
                adUnitName: '/43743431/DMDemo',

                // Winning bid for [160x600]
                sizes: [[160, 600], [300, 250]]
            },
            2: {
                adUnitName: '/43743431/DMDemo1',

                // Winning bid for [300x250]
                sizes: [
                    [728, 90],
                    [800, 250],
                    [300, 250]
                ]
            }
        }
    };
}

function getBidRequestRegex() {
    return {
        method: 'POST',
        urlRegex: /hbopenbid\.pubmatic\.com\/translator\?source=index-client/
    };
}

function validateBidRequest(request) {
    expect(request.query.source).toEqual('index-client');
    expect(request.host).toEqual('hbopenbid.pubmatic.com');
    var config = getConfig();
    var sizes1 = config.xSlots[1].sizes;
    var sizes2 = config.xSlots[2].sizes;

    var body = request.body;
    if (body) {
        body = JSON.parse(body);
        expect(body.id).toBeDefined();
        expect(body.imp.length).toEqual(2);
        expect(body.imp[0].banner.format).toBeDefined();
        expect(body.imp[0].secure).toEqual(1);
        expect(body.imp[0].banner.format.length).toEqual(sizes1.length - 1);
        expect(body.imp[0].banner.w).toEqual(sizes1[0][0]);
        expect(body.imp[0].banner.h).toEqual(sizes1[0][1]);
        expect(body.imp[0].banner.format[0].w).toEqual(sizes1[1][0]);
        expect(body.imp[0].banner.format[0].h).toEqual(sizes1[1][1]);
        expect(body.imp[0].bidFloor).toEqual(parseFloat(config.kadfloor));
        expect(body.imp[0].tagId).toEqual(config.xSlots['1'].adUnitName);

        expect(body.imp[1].banner.format).toBeDefined();
        expect(body.imp[1].banner.format.length).toEqual(sizes2.length - 1);
        expect(body.imp[1].banner.w).toEqual(sizes2[0][0]);
        expect(body.imp[1].banner.h).toEqual(sizes2[0][1]);
        expect(body.imp[1].banner.format[0].w).toEqual(sizes2[1][0]);
        expect(body.imp[1].banner.format[0].h).toEqual(sizes2[1][1]);
        expect(body.imp[1].banner.format[1].w).toEqual(sizes2[2][0]);
        expect(body.imp[1].banner.format[1].h).toEqual(sizes2[2][1]);

        expect(body.imp[1].bidFloor).toEqual(parseFloat(config.kadfloor));
        expect(body.imp[1].tagId).toEqual(config.xSlots['2'].adUnitName);

        expect(body.at).toEqual(1);
        expect(body.cur[0]).toEqual('USD');
        expect(body.site.publisher).toBeDefined();
        expect(body.site.publisher.domain).toBeDefined();

        expect(body.site.publisher.id).toEqual(config.publisherId);
        expect(body.user).toBeDefined();
        expect(body.user.geo).toBeDefined();
        expect(body.user.geo.lat).toEqual(parseFloat(config.lat));
        expect(body.user.geo.lon).toEqual(parseFloat(config.lon));
        expect(body.user.gender).toEqual(config.gender);
        expect(body.user.yob).toEqual(parseInt(config.yob, 10));
        expect(body.device).toBeDefined();
        expect(body.device.ua).toBeDefined();
        expect(body.device.js).toBeDefined();
        expect(body.device.js).toEqual(1);
        expect(body.device.dnt).toBeDefined();
        expect(body.device.h).toBeDefined();
        expect(body.device.w).toBeDefined();
        expect(body.device.language).toBeDefined();
        expect(body.device.geo).toBeDefined();
        expect(body.device.geo.lat).toEqual(parseFloat(config.lat));
        expect(body.device.geo.lon).toEqual(parseFloat(config.lon));

        expect(body.ext).toBeDefined();
        expect(body.ext.wrapper).toBeDefined();
        expect(body.ext.wrapper.wp).toEqual('pbjs');
    }
}

function getValidResponse(request, creative) {
    var body = JSON.parse(request.body);
    var response = {
        cur: 'USD',
        id: '4E733404-CC2E-48A2-BC83-4DD5F38FE9BB',
        seatbid: [
            {
                seat: '12345',
                bid: [
                    {
                        id: '4E733404-CC2E-48A2-BC83-4DD5F38FE9BB',
                        impid: body.imp[0].id,
                        price: 2,
                        adm: creative,
                        adomain: ['mystartab.com'],
                        cid: '16981',
                        h: 600,
                        w: 160,
                        ext: {
                            dspid: 6
                        }
                    },
                    {
                        id: '4E733404-CC2E-48A2-BC83-4DD5F38FE9BC',
                        impid: body.imp[1].id,
                        price: 2,
                        adm: creative,
                        adomain: ['mystartab.com'],
                        cid: '16981',
                        h: 250,
                        w: 300,
                        ext: {
                            dspid: 6
                        }
                    }
                ]
            }
        ]
    };

    return JSON.stringify(response);
}

function validateTargeting(targetingMap) {
    var isObjEmpty = Object.keys(targetingMap).length === 0 && targetingMap.constructor === Object;
    if (!isObjEmpty) {
        expect(targetingMap).toEqual(jasmine.objectContaining({
            ix_pubm_om: jasmine.arrayContaining([jasmine.any(String), jasmine.any(String)]),
            ix_pubm_id: jasmine.arrayContaining([jasmine.any(String), jasmine.any(String)])
        }));
    }
}

function getPassResponse() {
    return JSON.stringify({ bids: [] });
}

function validateBidRequestWithPrivacy(request) {
    var r = JSON.parse(request.body);

    expect(r.regs).toEqual(jasmine.objectContaining({
        ext: {
            gdpr: 1
        }
    }));

    expect(r.user).toEqual(jasmine.objectContaining({
        ext: {
            consent: 'TEST_GDPR_CONSENT_STRING'
        }
    }));
}

function validateBidRequestWithAdSrvrOrg(request) {
    var body = JSON.parse(request.body);
    expect(body.user.eids.source).toEqual('adserver.org');
    expect(body.user.eids.uids).toEqual(jasmine.arrayContaining([
        {
            id: 'TEST_ADSRVR_ORG_STRING',
            ext: {
                rtiPartner: 'TDID'
            }
        }
    ]));
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
    getPassResponse: getPassResponse,
    validateBidRequestWithAdSrvrOrg: validateBidRequestWithAdSrvrOrg,
    validateBidRequestWithPrivacy: validateBidRequestWithPrivacy
};
