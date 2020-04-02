'use strict';

function getPartnerId() {
    return 'NoBidHtb';
}

function getStatsId() {
    return 'NOB';
}

function getCallbackType() {
    return 'NONE';
}

function getArchitecture() {
    return 'SRA';
}

function getConfig() {
    return {
        xSlots: {
            1: {
                siteId: 2,
                sizes: [[300, 250]]
            },
            2: {
                siteId: 2,
                sizes: [[300, 250], [320, 50]]
            }
        }
    };
}

function getBidRequestRegex() {
    return {
        method: 'GET',
        urlRegex: /.*\/adreq.*/
    };
}

function validateBidRequest(request) {
	console.log("==> validateBidRequest", request);
//    var q = request.query;
//    expect(q.id).toBeDefined();
//    expect(q.size).toBeDefined();
//    expect(q.psa).toBeDefined();
//    expect(q.callback).toBeDefined();
//    expect(q.callback_uid).toBeDefined();
//    expect(q.gdpr).toBeDefined();
//    expect(q.gdpr_consent).toBeDefined();
//    expect(q.referrer).toBeDefined();
//    expect(q.us_privacy).toBeDefined();
}

function getValidResponse(request, creative) {
	console.log("==> getValidResponse");
    var q = request.query;
    var adm = creative;

    var response = {
        result: {
            cpm: 20000,
            width: 300,
            height: 250,
            creative_id: 100232340,
            media_type_id: 1,
            media_subtype_id: 1,
            ad: adm,
            is_bin_price_applicable: false
        },
        callback_uid: q.callback_uid
    };
    var jsonResponse = JSON.stringify(response);

    return 'headertag.NoBidHtb.adResponseCallback(' + jsonResponse + ')';
}

function getPassResponse(request) {
	console.log("==> getPassResponse");
    var q = request.query;

    var response = {
        result: {
            cpm: 0.0,
            ad: ''
        },
        callback_uid: q.callback_uid
    };

    return 'headertag.NoBidHtb.adResponseCallback(' + JSON.stringify(response) + ');';
}

function validateTargeting(targetingMap) {
	console.log("==> validateTargeting");
//    expect(targetingMap).toEqual(jasmine.objectContaining({
//        ix_nob_om: jasmine.arrayContaining(['300x250_200']),
//        ix_nob_id: jasmine.arrayContaining([jasmine.any(String)])
//    }));
}

module.exports = {
    getPartnerId: getPartnerId,
    getStatsId: getStatsId,
    getBidRequestRegex: getBidRequestRegex,
    getCallbackType: getCallbackType,
    getArchitecture: getArchitecture,
    getConfig: getConfig,
//    validateBidRequest: validateBidRequest,
//    getValidResponse: getValidResponse,
//    getPassResponse: getPassResponse,
//    validateTargeting: validateTargeting
};
