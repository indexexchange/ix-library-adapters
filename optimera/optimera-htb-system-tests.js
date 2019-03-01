'use strict';

function getPartnerId() {
  return 'OptimeraHtb';
}

function getStatsId() {
  return 'OPTI';
}

function getBidRequestRegex() {
  return {
    method: 'GET',
    urlRegex: /.*\/optimera-client\/*/
  };
}

function getCallbackType() {
  return 'NONE';
}

function getArchitecture() {
  return 'FSRA';
}

function getConfig() {
  return {
    "clientID": 9999,
    "xSlots": {
      1: {
        "divID": "divIdA"
      },
      2: {
        "divID": "divIdA"
      }
    }
  };
}

function validateBidRequest(request) {
  // Check query string parameters.
  expect(request.pathname).toBe('/optimera-client/9999/localhost/public/tester/system-tester.html.js');
}

function getValidResponse(request, creative) {
  console.log('getValidResponse', request);
  var response = {
    "divIdA": ["RB_K", "D4"],
    "timestamp": ["RB_K", "1513607592"]
  };

  return JSON.stringify(response);
}

function getPassResponse(request) {
  var response = {};
  return JSON.stringify(response);
}

function validateTargeting(targetingMap) {
  expect(targetingMap).toEqual(jasmine.objectContaining({
    ix_opti_dealid: jasmine.arrayContaining(["RB_K", "D4"]),
    ix_opti_id: jasmine.arrayContaining([jasmine.any(String)])
  }));
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