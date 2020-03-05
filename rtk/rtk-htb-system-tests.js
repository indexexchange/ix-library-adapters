'use strict';

function getPartnerId() {
    return 'RtkHtb';
}

function getStatsId() {
    return 'RTK';
}

function getCallbackType() {
    return 'NONE';
}

function getArchitecture() {
    return 'SRA';
}

function getConfig() {
    return {
        host: 'bidder.rtk.io',
        xSlots: {
            1: {
                ai: '0000',
                sc: '1234',
                categories: ['cat1', 'cat2']
            },
            2: {
                ai: '0000',
                sc: '1235',
                categories: ['cat3', 'cat4']
            }
        }
    };
}

function getBidRequestRegex() {
    return {
        method: 'GET',
        urlRegex: /.*bidder\.rtk\.io\/0000\/1234_1235\/aardvark.*/
    };
}

function validateBidRequest(request) {
    expect(request.query.categories.split(',').length).toBe(4);
    expect(request.query.jsonp).toBe('false');
    expect(request.query['1234']).toBe('1234');
    expect(request.query['1235']).toBe('1235');
    expect(request.query.w).toBeDefined();
    expect(request.query.h).toBeDefined();
    expect(request.query.rtkreferer).toBeDefined();
}

function getValidResponse(request, creative) {
    var adm = creative || '<a target="_blank" href="http://www.indexexchange.com"><div style="text-decoration: none; color: black; width: 300px; height:250px;background-color: #336eff;"; id="testDiv"><h1>&lt;header_tag&gt; certification testing: 1_1a1a1a1a, deal: 12346 (211474080)width: 300px; height:250px <iframe src="http://as.casalemedia.com/ifnotify?dfp_1_1a1a1a1a&referer=http://127.0.0.1:3000/p/DfpAuto/nonPrefetch/test?dev=desktop&displayMode=SRA&req=211474080" width="0" height="0" frameborder="0" scrolling="no" style="display:none;" marginheight="0" marginwidth="0"></iframe></h1></div><script>var thisDiv = document.getElementById("testDiv");thisDiv.style.fontFamily="verdana";</script></a>';
    var response = [
        {
            id: '1234',
            cpm: 2.0,
            adm: adm,
            width: '300',
            height: '250',
            ex: 'demo_exchange',
            cid: '1234',
            media: 'banner'
        },
        {
            id: '1235',
            cpm: 2.0,
            adm: adm,
            width: '300',
            height: '250',
            ex: 'demo_exchange',
            cid: '1235',
            media: 'banner'
        }
    ];

    return JSON.stringify(response);
}

function getPassResponse() {
    var response = [
        {
            id: '1234',
            cpm: 0,
            adm: '',
            ex: 'demo_exchange',
            cid: '1234',
            media: 'banner',
            nurl: '',
            error: 'No bids received for 1234'
        },
        {
            id: '1235',
            cpm: 0,
            adm: '',
            ex: 'demo_exchange',
            cid: '1235',
            media: 'banner',
            nurl: '',
            error: 'No bids received for 1235'
        }
    ];

    return JSON.stringify(response);
}

function validateTargeting(targetingMap) {
    expect(targetingMap).toEqual(jasmine.objectContaining({
        ix_rtk_cpm: jasmine.arrayContaining(['300x250_200']),
        ix_rtk_id: jasmine.arrayContaining([jasmine.any(String)])
    }));
}

function validateBidRequestWithPrivacy(request) {
    expect(request.query.gdpr).toEqual('true');
    expect(request.query.consent).toEqual('TEST_GDPR_CONSENT_STRING');
}

module.exports = {
    getPartnerId: getPartnerId,
    getStatsId: getStatsId,
    getCallbackType: getCallbackType,
    getArchitecture: getArchitecture,
    getConfig: getConfig,
    validateBidRequest: validateBidRequest,
    getBidRequestRegex: getBidRequestRegex,
    validateTargeting: validateTargeting,
    getValidResponse: getValidResponse,
    getPassResponse: getPassResponse,
    validateBidRequestWithPrivacy: validateBidRequestWithPrivacy
};
