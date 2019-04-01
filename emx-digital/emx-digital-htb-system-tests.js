'use strict';

function getPartnerId() {
    return 'EmxDigitalHtb';
}

function getStatsId() {
    return 'EMX';
}

function getBidRequestRegex() {
    return {
        method: 'POST',
        urlRegex: /.*hb\.emxdgt\.com\/.?t=\d*&ts=\d*/
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
        xSlots: {
            1: {
                tagid: 123,
                bidfloor: 0.01,
                sizes: [[300, 250]]
            },
            2: {
                tagid: 123,
                bidfloor: 0.01,
                sizes: [[320, 50]]
            }
        }
    };
}

function validateBidRequest(request) {
    var r = JSON.parse(request.body);

    expect(r.id).toBeDefined();

    expect(r.site.page).toBeDefined();
    expect(r.site.domain).toBeDefined();

    expect(r.imp.length).toBe(2);

    expect(r.imp[0]).toEqual({
        id: r.requestId,
        banner: {
            w: 300,
            h: 250,
            format: [
                {
                    w: 300,
                    h: 250
                }
            ]
        },
        secure: 0,
        tagid: 123
    });

    expect(r.imp[1]).toEqual({
        id: r.requestId,
        banner: {
            w: 320,
            h: 50,
            format: [
                {
                    w: 320,
                    h: 50
                }
            ]
        },
        secure: 0,
        tagid: 123
    });
}

function getValidResponse(request) {
    var r = JSON.parse(request.body);
    var response = {
        id: r.id,
        seatbid: [
            {
                bid: [
                    {
                        adm: 'this is a bid from emx!',
                        id: '104e73d56709256',
                        ttl: 300,
                        crid: '41975016',
                        w: 300,
                        price: 11.3645,
                        adid: '41975016',
                        h: 250
                    },
                    {
                        adm: 'this is a bid from emx!',
                        id: '11ee309e23efab5',
                        ttl: 300,
                        crid: '41975016',
                        w: 320,
                        price: 11.3645,
                        adid: '41975016',
                        h: 50
                    }
                ],
                seat: '2439'
            }
        ]
    };

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
    getValidResponse: getValidResponse
};
