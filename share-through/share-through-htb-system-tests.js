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
  var queryObj = request.query;
  // var adm =
  //   creative ||
  //   '<a target="_blank" href="http://www.indexexchange.com"><div style="text-decoration: none; color: black; width: 300px; height:250px;background-color: #336eff;"; id="testDiv"><h1>&lt;header_tag&gt; certification testing: 1_1a1a1a1a, deal: 12346 (211474080)width: 300px; height:250px <iframe src="http://as.casalemedia.com/ifnotify?dfp_1_1a1a1a1a&referer=http://127.0.0.1:3000/p/DfpAuto/nonPrefetch/test?dev=desktop&displayMode=SRA&req=211474080" width="0" height="0" frameborder="0" scrolling="no" style="display:none;" marginheight="0" marginwidth="0"></iframe></h1></div><script>var thisDiv = document.getElementById("testDiv");thisDiv.style.fontFamily="verdana";</script></a>';

  var response = {
    adserverRequestId: "some-adserver-request-id",
    creatives: [
      {
        auctionWinId: "some-auction-win-id",
        cpm: "2",
        creative: {
          advertiser: "Advertiser",
          title: "Title for ad",
          description: "Description for ad"
        }
      }
    ]
  };

  return JSON.stringify(response);
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
  var response = {
    adserverRequestId: "some-adserver-request-id",
    creatives: []
  };
  return JSON.stringify(response);
}

function __b64EncodeUnicode(str) {
  try {
    return btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function toSolidBytes(
        match,
        p1
      ) {
        return String.fromCharCode("0x" + p1);
      })
    );
  } catch (e) {
    return str;
  }
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
