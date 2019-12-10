function getPartnerId() {
    return 'JustPremiumHtb';
}

function getStatsId() {
    return 'JUSTP';
}

function getCallbackType() {
    return 'NONE';
}

function getArchitecture() {
    return 'MRA';
}

function getConfig() {
    return {
        xSlots: {
            1: {
                zoneId: 34364
            }
        }
    };
}

function getBidRequestRegex() {
    return {
        method: 'POST',
        urlRegex: /pre\.ads\.justpremium\.com\/v\/2\.1\/t\/ie/
    };
}

function validateBidRequest(request) {
    expect(request.query.cb)
        .toBeDefined();
}

function getValidResponse(request, creative) {
    var adm = creative || '<div>test</div>';
    var body = JSON.parse(request.body);
    var response = {
        34364: [
            {
                'slot': '1',
                'rid': body.json[0].rid,
                'id': 408018,
                'height': 250,
                'width': 970,
                'price': 2,
                'format': 'pd',
                'adm': adm
            }
        ]
    };

    return JSON.stringify(response);
}

function validateTargeting(targetingMap) {
    expect(targetingMap)
        .toEqual(
            jasmine.objectContaining({
                ix_justp_cpm: jasmine.arrayWithExactContents(['970x250_200']),
                ix_justp_id: jasmine.arrayWithExactContents([jasmine.any(String)])
            })
        );
}

function getPassResponse() {
    return JSON.stringify({});
}

function getValidResponseWithDeal(request, creative) {
    var adm = creative || '<div>test</div>';
    var body = JSON.parse(request.body);
    var response = {
        34364: [
            {
                'slot': '1',
                'rid': body.json[0].rid,
                'id': 408018,
                'height': 250,
                'width': 970,
                'price': 2,
                'format': 'pd',
                'adm': adm,
                'dealid': '123'
            }
        ]
    };

    return JSON.stringify(response);
}

function validateTargetingWithDeal(targetingMap) {
    expect(targetingMap)
        .toEqual(jasmine.objectContaining({
            ix_justp_cpm: jasmine.arrayContaining(['970x250_200']),
            ix_justp_dealid: jasmine.arrayContaining(['970x250_123']),
            ix_justp_id: jasmine.arrayContaining([jasmine.any(String)])
        }));
}

module.exports = {
    getPartnerId: getPartnerId,
    getStatsId: getStatsId,
    getBidRequestRegex: getBidRequestRegex,
    getCallbackType: getCallbackType,
    getConfig: getConfig,
    validateBidRequest: validateBidRequest,
    getValidResponse: getValidResponse,
    validateTargeting: validateTargeting,
    getArchitecture: getArchitecture,
    getPassResponse: getPassResponse,
    getValidResponseWithDeal: getValidResponseWithDeal,
    validateTargetingWithDeal: validateTargetingWithDeal
};
