'use strict';

function getPartnerId() {
    return 'MartinHtb';
}

function getStatsId() {
    return 'MAR';
}

function getCallbackType() {
    return 'ID';
}

function getArchitecture() {
    return 'MRA';
}

function getBidRequestRegex() {
    return {
        method: 'POST',
        urlRegex: /.*martin\.ai\/bid\/ix\?.*/
    };
}

module.exports = {
    getPartnerId: getPartnerId,
    getStatsId: getStatsId,
    getBidRequestRegex: getBidRequestRegex,
    getCallbackType: getCallbackType,

    // getConfig: getConfig,
    // validateBidRequest: validateBidRequest,
    // getValidResponse: getValidResponse,
    // validateTargeting: validateTargeting,
    getArchitecture: getArchitecture,

    // getPassResponse: getPassResponse,
    // getValidResponseWithDeal: getValidResponseWithDeal,
    // validateTargetingWithDeal: validateTargetingWithDeal
};
