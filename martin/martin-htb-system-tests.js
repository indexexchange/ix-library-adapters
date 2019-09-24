'use strict';

function getPartnerId() {
    return 'MartinHtb';
}

function getStatsId() {
    return 'MAR';
}

function getCallbackType() {
    return 'NONE';
}

function getConfig() {
    return {
        xSlots: {
            // 1: { // All of this is optional, xSlots key is the only required one
            //     adSlotId: '44',
            //     sizes: [[300, 250], [300, 600]]
            // }
        }
    };
}

function getArchitecture() {
    return 'MRA';
}

function getBidRequestRegex() {
    return {
        method: 'POST',
        urlRegex: /.*martin\.ai\/bid\/ix.*/
    };
}

function validateBidRequest(request) {
    console.log("validateBidRequest");
}

function getPassResponse(request) {
    console.log("getPassResponse");
    return '{}';
}

function getValidResponse(request, creative) {
    var adm = creative;
    var response = {
        seatbid: [
            {
                bid: [
                    {
                        price: 200,
                        adm: adm,
                        auid: 44,
                        h: 250,
                        w: 300
                    }
                ],
                seat: '1'
            }
        ]
    };

    return JSON.stringify(response);
}

function validateTargeting(targetingMap) {
}

function getValidResponseWithDeal(request, creative) {
    var adm = creative;
    var response = {
        seatbid: [
            {
                bid: [
                    {
                        price: 200,
                        adm: adm,
                        auid: 44,
                        h: 250,
                        w: 300,
                        dealid: '123'
                    }
                ],
                seat: '1'
            }
        ]
    };

    return JSON.stringify(response);
}

function validateTargetingWithDeal(targetingMap) {
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
