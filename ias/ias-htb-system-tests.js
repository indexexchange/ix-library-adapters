'use strict';

function getPartnerId() {
    return 'IASHtb';
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
                pubId: '99',
                sizes: [[100, 200]],
                adUnitPath: '/57514611/news.com'
            }
        }
    };
}

function getBidRequestRegex() {
    return {
        method: 'GET',
        urlRegex: /pixel\.adsafeprotected\.com\/services\/pub/
    };
}

function validateBidRequest(request) {
    expect(request.query.anId).toBeDefined();
    expect(request.query.slot).toBeDefined();
    expect(request.query.wr).toBeDefined();
    expect(request.query.sr).toBeDefined();
}

function getPassResponse(request) {
    return request.query.cb + '({})';
}

function getValidResponse(request, creative) {
    request.headers = {Referer: 'http://localhost:5837/public/tester/system-tester.html'};
    var r = JSON.parse(request.query.r);
    var response = {
        cur: 'USD',
        id: r.id,
        seatbid: [
            {
                bid: [
                    {
                        adid: '1487603',
                        adm: creative,
                        adomain: ['www.indexexchange.com'],
                        ext: {
                            advbrand: 'IX',
                            advbrandid: '25661',
                            pricelevel: '200'
                        },
                        id: 567841330,
                        impid: '1',
                        price: '200'
                    }
                ],
                seat: '2439'
            }
        ]
    };

    return 'headertag.IndexExchangeHtb.adResponseCallback(' + JSON.stringify(response) + ')';
}

module.exports = {
    getPartnerId: getPartnerId,
    getStatsId: getStatsId,
    getCallbackType: getCallbackType,
    getArchitecture: getArchitecture,
    getConfig: getConfig,
    getBidRequestRegex: getBidRequestRegex,
    validateBidRequest: validateBidRequest,
    getPassResponse: getPassResponse,
    getValidResponse: getValidResponse
};
