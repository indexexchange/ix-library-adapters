'use strict';

function getPartnerId() {
    return 'NoBidHtb';
}

function getStatsId() {
    return 'NOB';
}

function getCallbackType() {
    return 'NONE';
}

function getArchitecture() {
    return 'SRA';
}

function getConfig() {
    return {
        siteId: {
            type: 2
        },
        xSlots: {
            1: {
                sizes: [[300, 250], [300, 600]]
            },
            2: {
                sizes: [[300, 600]]
            }
        }
    };
}

function validateBidRequest(request) {
    expect(request.protocol).toBe('http:');
    expect(request.pathname).toBe('/adreq');
}

function getValidResponse(request, creative) {
    var adm300x250 = creative;
    var adm300x600 = creative;

    var response = {
        country: 'US',
        ip: '73.222.216.161',
        device: 'COMPUTER',
        site: 3,
        bids: [
            {
                id: '2d5e907e4306206f17d3ce2a3346bf77ecf67267__3',
                bdrid: 307,
                divid: '1',
                size: {
                    w: 300,
                    h: 250
                },
                adm: adm300x250,
                adm2: adm300x250,
                price: '2.00'
            },
            {
                id: '2d5e907e4306206f17d3ce2a3346bf77ecf67267__4',
                bdrid: 307,
                divid: '2',
                size: {
                    w: 300,
                    h: 600
                },
                adm: adm300x600,
                adm2: adm300x600,
                price: '2.00'
            }
        ],
        syncs: [
            'https://ib.adnxs.com/getuid?https%3A%2F%2Fads.servenobid.com%2Fsync%3Fpid%3D312%26cbimg%3D10141%26uid%3D%24UID', // eslint-disable-line array-element-newline
            'https://ap.lijit.com/pixel?redir=https%3A%2F%2Fads.servenobid.com%2Fsync%3Fpid%3D310%26uid%3D%24UID'
        ]
    };

    return JSON.stringify(response);
}

function getBidRequestRegex() {
    return {
        method: 'POST',
        urlRegex: /.*\/adreq.*/
    };
}

function validateTargeting(targetingMap) {
    expect(targetingMap).toEqual(jasmine.objectContaining({
        ix_nob_om: jasmine.arrayContaining(['300x250_200', '300x600_200']),
        ix_nob_id: jasmine.arrayContaining([jasmine.any(String), jasmine.any(String)])
    }));
}

function getPassResponse() {
    var response = { bids: [] };

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
    getValidResponse: getValidResponse,
    validateTargeting: validateTargeting,
    getPassResponse: getPassResponse
};
