'use strict';

function getPartnerId() {
    return 'AdYouLikeHtb';
}

function getStatsId() {
    return 'ADY';
}

function getCallbackType() {
    return 'NONE';
}

function getArchitecture() {
    return 'FSRA';
}

function getBidRequestRegex() {
    return {
        method: 'GET',
        urlRegex: /hb-api\.omnitagjs\.com\/hb-api\/ix\/v1.*/
    };
}

function getConfig() {
    return {
        siteId: '123456',
        xSlots: {
            1: {
                size: [300, 250],
                siteId: '372138'
            },
            2: {
                size: [300, 250],
                siteId: '372138'
            }
        }
    };
}
/*
function validateBidRequest(request) {
    expect(request.query.v).toBe('7.2');
}

function validateBidRequestWithPrivacy(request) {
    var r = JSON.parse(request.query.r);
  
    expect(r.regs).toEqual(jasmine.objectContaining({
        ext: {
            gdpr: 1
        }
    }));
 
}

function validateBidRequestWithAdSrvrOrg(request) {
    var r = JSON.parse(request.query.r);

    expect(r.user.eids).toEqual(jasmine.arrayContaining([{
        source: 'adserver.org',
        uids: jasmine.arrayContaining([{
            id: 'TEST_ADSRVR_ORG_STRING',
            ext: {
                rtiPartner: 'TDID'
            }
        }])
    }]));
}

function getValidResponse(request, creative) {
    var r = JSON.parse(request.query.r);
    var adm = creative || '<a target="_blank" href="http://www.indexexchange.com"><div style="text-decoration: none; color: black; width: 300px; height:250px;background-color: #336eff;"; id="testDiv"><h1>&lt;header_tag&gt; certification testing: 1_1a1a1a1a, deal: 12346 (211474080)width: 300px; height:250px <iframe src="http://as.casalemedia.com/ifnotify?dfp_1_1a1a1a1a&referer=http://127.0.0.1:3000/p/DfpAuto/nonPrefetch/test?dev=desktop&displayMode=SRA&req=211474080" width="0" height="0" frameborder="0" scrolling="no" style="display:none;" marginheight="0" marginwidth="0"></iframe></h1></div><script>var thisDiv = document.getElementById("testDiv");thisDiv.style.fontFamily="verdana";</script></a>';
    var response = {
        cur: 'USD',
        id: r.id,
        seatbid: [
            {
                bid: [
                    {
                        adid: '1487603',
                        adm: adm,
                        adomain: ['www.indexexchange.com'],
                        ext: {
                            advbrand: 'IX',
                            advbrandid: '25661',
                            pricelevel: '200'
                        },
                        id: 567841330,
                        impid: '1',
                        price: '200'
                    },
                    {
                        adid: '1487603',
                        adm: adm,
                        adomain: ['www.indexexchange.com'],
                        ext: {
                            advbrand: 'IX',
                            advbrandid: '25661',
                            pricelevel: '100'
                        },
                        id: 567841330,
                        impid: '2',
                        price: '100'
                    }
                ],
                seat: '2439'
            }
        ]
    };

    return 'headertag.IndexExchangeHtb.adResponseCallback(' + JSON.stringify(response) + ')';
}

function validateTargeting(targetingMap) {
    expect(targetingMap).toEqual(jasmine.objectContaining({
        IOM: jasmine.arrayContaining(['300x250_200', '300x250_100']),
        ix_id: jasmine.arrayContaining([jasmine.any(String)])
    }));
}

function getValidResponseWithDeal(request, creative) {
    var r = JSON.parse(request.query.r);
    var adm = creative || '<a target="_blank" href="http://www.indexexchange.com"><div style="text-decoration: none; color: black; width: 300px; height:250px;background-color: #336eff;"; id="testDiv"><h1>&lt;header_tag&gt; certification testing: 1_1a1a1a1a, deal: 12346 (211474080)width: 300px; height:250px <iframe src="http://as.casalemedia.com/ifnotify?dfp_1_1a1a1a1a&referer=http://127.0.0.1:3000/p/DfpAuto/nonPrefetch/test?dev=desktop&displayMode=SRA&req=211474080" width="0" height="0" frameborder="0" scrolling="no" style="display:none;" marginheight="0" marginwidth="0"></iframe></h1></div><script>var thisDiv = document.getElementById("testDiv");thisDiv.style.fontFamily="verdana";</script></a>';
    var response = {
        cur: 'USD',
        id: r.id,
        seatbid: [
            {
                bid: [
                    {
                        adid: '1487603',
                        adm: adm,
                        adomain: ['www.indexexchange.com'],
                        ext: {
                            advbrand: 'IX',
                            advbrandid: '25661',
                            pricelevel: '200',
                            dealid: '12346'
                        },
                        id: 567841330,
                        impid: '1',
                        price: '200'
                    },
                    {
                        adid: '1487603',
                        adm: adm,
                        adomain: ['www.indexexchange.com'],
                        ext: {
                            advbrand: 'IX',
                            advbrandid: '25661',
                            pricelevel: '100',
                            dealid: '12346'
                        },
                        id: 567841330,
                        impid: '2',
                        price: '100'
                    }
                ],
                seat: '2439'
            }
        ]
    };

    return 'headertag.IndexExchangeHtb.adResponseCallback(' + JSON.stringify(response) + ')';
}

function validateTargetingWithDeal(targetingMap) {
    expect(targetingMap).toEqual(jasmine.objectContaining({
        IPM: jasmine.arrayContaining(['300x250_200', '300x250_100']),
        IPMID: jasmine.arrayContaining(['300x250_12346', '300x250_12346']),
        ix_id: jasmine.arrayContaining([jasmine.any(String)])
    }));
}

function getPassResponse(request) {
    return 'headertag.IndexExchangeHtb.adResponseCallback({"id": "'
        + JSON.parse(request.query.r).id + '"});';
}*/

module.exports = {
    getPartnerId: getPartnerId,
    getStatsId: getStatsId,
    getCallbackType: getCallbackType,
    getArchitecture: getArchitecture,
    getBidRequestRegex: getBidRequestRegex,
    getConfig: getConfig,
    /*validateBidRequest: validateBidRequest,
    validateBidRequestWithPrivacy: validateBidRequestWithPrivacy,
    validateBidRequestWithAdSrvrOrg: validateBidRequestWithAdSrvrOrg,
    getValidResponse: getValidResponse,
    validateTargeting: validateTargeting,
    getValidResponseWithDeal: getValidResponseWithDeal,
    validateTargetingWithDeal: validateTargetingWithDeal,
    getPassResponse: getPassResponse */
}
