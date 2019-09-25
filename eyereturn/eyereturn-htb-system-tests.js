'use strict';

function getPartnerId() {
    return 'EyereturnHtb';
}

function getCallbackType() {
    return 'NONE';
}

function getArchitecture() {
    return 'MRA';
}

function getStatsId() {
    return 'EYE';
}

function getConfig() {
    var config = {
        // Partner level parameter
        id: 'FA2F43C00DD40E23',
        ua: 'Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; rv:11.0) like Gecko',
        ip: '199.166.10.82',
        xSlots: {
            1: {
                // Slot level parameter
                ppid: 12345,
                sizes: [[300, 250]]
            }
        }
    };

    return config;
}

function getBidRequestRegex() {
    return {
        method: 'POST',
        urlRegex: /.*prometheus-ix.eyereturn.com\/prometheus\/bid.*/
    };
}

function validateBidRequest() {
    // Optional, not implemented
}

function getValidResponse(request, creative) {
    var r = JSON.parse(request.body);
    var adm = creative || '<script type="text/javascript" src="http://p3.eyereturn.com/ed/3/?7249996&cid=314569&tid=7249996&oid=FA2F43C00DD40E23&vid=null&iid=cb70163c-49a6-11e9-a928-eff3f10311ad&p=2000000&bd2=y3AWPUmmEempKO_z8QMRrYqqv8nzDtjsZmEOOw&rnd=-743082806484230412&ex=ChAKC251bV9kZXZpY2VzEgEx"></script>';
    var response = {
        request_id: r.id,
        seat_bid: [
            {
                impression_id: 'cb70163d-49a6-11e9-a928-eff3f10311ad',
                bid_price: 2.00,
                width: 300,
                height: 250,
                adomain: ['www.thechesterfieldshop.com'],
                creative: adm
            }
        ],
        deal: ''
    };

    return JSON.stringify(response);
}

function validateTargeting(targetingMap) {
    expect(targetingMap).toEqual(
        jasmine.objectContaining({
            ix_eye_cpm: jasmine.arrayWithExactContents(['300x250_200']),
            ix_eye_id: jasmine.arrayWithExactContents([jasmine.any(String)])
        })
    );
}

function getPassResponse(request) {
    var r = JSON.parse(request.body);

    return JSON.stringify({
        seat_bid: [],
        request_id: r.request_id,
        deal: ''
    });
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
