"use strict";
function getPartnerId() {
  return "ShareThroughHtb";
}

function getStatsId() {
  return "SHTH";
}

function getBidRequestRegex() {
  return {
    method: "GET",
    urlRegex: /.*btlr\.sharethrough\.com\/header-bid\/.*/
  };
}

function getCallbackType() {
  return "NONE";
}

function getArchitecture() {
  return "MRA";
}

function getConfig() {
  return {
    timeout: 1000,
    xSlots: {
      1: {
        placementKey: "abc123",
        sizes: [[1, 1]]
      }
    },
    mapping: {
      htSlot1: ["1"]
    }
  };
}

function validateBidRequest(request) {
  var queryObj = request.query;

  expect(queryObj.bidId).toBeDefined();
  expect(queryObj.placement_key).toEqual("abc123");
  expect(queryObj.instant_play_capable).toBeDefined();
  expect(queryObj.hbSource).toEqual("indexExchange");
  expect(queryObj.hbVersion).toEqual("2.1.2");
  expect(queryObj.cbust).toBeDefined();
  expect(queryObj.consent_required).toEqual("false");
}

function validateBidRequestWithPrivacy(request) {
  var queryObj = request.query;

  expect(queryObj.consent_required).toEqual("true");
  expect(queryObj.consent_string).toEqual("TEST_GDPR_CONSENT_STRING");
}

function validateBidRequestWithAdSrvrOrg(request) {
  var queryObj = request.query;

  expect(queryObj.ttduid).toEqual("TEST_ADSRVR_ORG_STRING");
}

function getValidResponse(request, creative) {
  return JSON.stringify({
    ixTestResponse: true,
    bidId: request.query.bidId,
    creatives: [
      {
        adm: creative,
        cpm: 2,
      }
    ]
  });
}

function validateTargeting(targetingMap) {
  expect(targetingMap).toEqual(
    jasmine.objectContaining({
      ix_shth_id: jasmine.arrayContaining([jasmine.any(String)]),
      ix_shth_cpm: jasmine.arrayContaining([
        jasmine.arrayContaining(["1x1_200"])
      ])
    })
  );
}

function getPassResponse(request) {
  var response = { creatives: [] };
  return JSON.stringify(response);
}

module.exports = {
  getPartnerId: getPartnerId,
  getStatsId: getStatsId,
  getBidRequestRegex: getBidRequestRegex,
  getCallbackType: getCallbackType,
  getArchitecture: getArchitecture,
  getConfig: getConfig,
  validateBidRequest: validateBidRequest,
  validateBidRequestWithPrivacy: validateBidRequestWithPrivacy,
  validateBidRequestWithAdSrvrOrg: validateBidRequestWithAdSrvrOrg,
  getValidResponse: getValidResponse,
  validateTargeting: validateTargeting,
  getPassResponse: getPassResponse
};
