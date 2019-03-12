'use strict';

function getPartnerId() {
    return 'InskinMediaHtb';
}

function getStatsId() {
    return 'ISM';
}

function getBidRequestRegex() {
    return {
        method: 'POST',
        urlRegex: /mfad\.inskinad\.com\/api\/v2/
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
        networkId: '9874',
        siteId: '1059494',
        xSlots: {
            1: {},
            2: {}
        }
    };
}

function validateBidRequest(request) {
    var r = JSON.parse(request.body);
}

function getValidResponse(request, creative) {
    var r = JSON.parse(request.body);

    var response = {
        decisions: {
            1: {
                adm: creative,
                pricing: {
                    clearPrice: 1
                }
            },
            2: {
                adm: creative,
                pricing: {
                    clearPrice: 2
                }
            }
        }
    };

    return JSON.stringify(response);
}

function getPassResponse(request) {
    var response = {
        decisions: {
        }
    };

    return JSON.stringify(response);
}

function validateTargeting(targetingMap) {
}

function validatePixelRequests(pixelRequests) {
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
