'use strict';

function getPartnerId() {
    return 'GumGumHtb';
}

function getStatsId() {
    return 'GUM';
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
                inScreen: 'ggumtest',
                sizes: [[300, 100]]
            }
        }
    };
}

function getBidRequestRegex() {
    return {
        method: 'GET',
        urlRegex: /.*g2\.gumgum\.com\/hbid\/imp\?.*/
    };
}

// Check query string parameters that's gathered from getConfig
function validateBidRequest(request) {
    expect(request.query.t).toBe('ggumtest');
    expect(request.query.pi).toBe('2');
}

function getValidResponse() {
    var s1 = '<img src="//c.gumgum.com/px.gif" onload="(function(a,b){b.src=\'';
    var s2 = 'js.gumgum.com/gumgum.js\'';
    var s3 = ',a.parentNode.replaceChild(b,a)})(this,document.createElement(\'';
    var s4 = 'script\'))"></img>';
    var g1 = '<gumgum-ad product="2" fromAS=\'';
    var g2 = 'AD_JSON\'';
    var g3 = '></gumgum-ad>';
    var i = s1 + s2 + s3 + s4;
    var response = {
        ad: {
            id: '123',
            adBuyId: 123,
            width: 300,
            height: 100,
            markup: '<div style="width:298px;height:248px;background:#fff;display:block;border:1px solid #000;background:#fff url(https://c.gumgum.com/images/logo/all300.png) no-repeat scroll center center"></div>',
            ii: false,
            price: 0
        },
        adhs: {
            id: 30,
            adp: {
                x: 'L',
                y: 'B'
            },
            ads: null,
            adf: {
                animated: false,
                assetwide: true
            },
            clc: '<img style="border:0;margin:0;padding:0;background-color:transparent;cursor:pointer;cursor:hand;width:20px;height:20px;" src="https://c.gumgum.com/ads/com/gumgum/icons/svg/close_light.svg" ">',
            clp: {
                right: 3,
                bottom: 65
            },
            atc: '<img style="border:0;margin:0;padding:0;background-color:transparent;cursor:pointer;cursor:hand;width:20px;height:20px;" src="https://c.gumgum.com/ads/com/gumgum/icons/svg/info_light.svg">',
            atp: {
                right: 27,
                bottom: 65
            },
            acp: null
        },
        cw: i + g1 + g2 + g3
    };

    return JSON.stringify(response);
}

function validateTargeting(targetingMap) {
    expect(targetingMap).toEqual(jasmine.objectContaining({
        ix_gum_cpm: jasmine.arrayContaining([jasmine.stringMatching(/300x100_\d+/)]),
        ix_gum_id: jasmine.arrayContaining([jasmine.any(String)])
    }));
}

function getPassResponse() {
    var response = { ad: {} };

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
