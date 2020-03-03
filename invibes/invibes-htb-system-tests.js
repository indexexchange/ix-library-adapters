'use strict';

function getPartnerId() {
    return 'InvibesHtb';
}

function getStatsId() {
    return 'INV';
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
                placementId: 'div-gpt-ad-1438287399331-0'
            }
        }
    };
}

function getBidRequestRegex() {
    return {
        method: 'GET',
        urlRegex: /bid\/videoadcontent/
    };
}

function validateBidRequest(request) {
    expect(request.query.bidParamsJson).toBeDefined();
}

function getValidResponse(request, creative) {
    var response
        = {
            videoAdContentResult: {
                Ads: [
                    {
                        BidPrice: 2,
                        HtmlString: creative || '<div>ad</div>'
                    }
                ],
                BidModel: {
                    BidVersion: 3,
                    Height: 999,
                    Width: 999
                }
            }
        };

    return JSON.stringify(response);
}

function validateTargeting(targetingMap) {
    expect(targetingMap).toEqual(
        jasmine.objectContaining({
            ix_ivbs_cpm: jasmine.arrayContaining([jasmine.any(String)]),
            ix_ivbs_dealid: jasmine.arrayContaining([jasmine.any(String)]),
            ix_ivbs_id: jasmine.arrayContaining([jasmine.any(String)])
        })
    );
}

function getPassResponse() {
    var response = {
        videoAdContentResult: {
            Ads: [],
            BidModel: {
                BidVersion: 3,
                Height: 999,
                Width: 999
            }
        }
    };

    return JSON.stringify(response);
}

module.exports = {
    getPartnerId: getPartnerId,
    getStatsId: getStatsId,
    getCallbackType: getCallbackType,
    getArchitecture: getArchitecture,
    getConfig: getConfig,
    getBidRequestRegex: getBidRequestRegex,
    validateBidRequest: validateBidRequest,
    getValidResponse: getValidResponse,
    validateTargeting: validateTargeting,
    getPassResponse: getPassResponse
};
