'use strict';

function getPartnerId() {
    return 'PlaygroundXyzHtb';
}

function getStatsId() {
    return 'PXYZ';
}

function getBidRequestRegex() {
    return {
        method: 'POST',
        urlRegex: /.*ads\.playground\.xyz\/host-config\/prebid.*/
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
                placementId: 123,
                sizes: [[300, 250]]
            },
            2: {
                placementId: 123,
                sizes: [[320, 50]]
            }
        }
    };
}

function validateBidRequest(request) {
    var r = JSON.parse(request.body);

    expect(r.id).toBeDefined();

    expect(r.site.page).toBeDefined();
    expect(r.site.name).toBeDefined();
    expect(r.site.domain).toBeDefined();

    expect(r.imp.length).toBe(2);

    expect(r.imp[0]).toEqual({
        id: 'htSlotDesktopAId',
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
        ext: {
            appnexus: {
                placement_id: 123
            }
        }
    });

    expect(r.imp[1]).toEqual({
        id: 'htSlotDesktopAId',
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
        ext: {
            appnexus: {
                placement_id: 123
            }
        }
    });
}

function getValidResponse(request, creative) {
    var r = JSON.parse(request.body);
    var adm = creative || '<script src="https://sin1-ib.adnxs.com/ab?e=wqT_3QL5B6D5AwAAAwDWAAUBCNvJld4FELnWtcOgrJ2pYRicj9LStMS3rSIqNgkAAAECCPA_EQEHEAAA8D8ZCQkIAAAhCQkI8D8pEQkAMQkJ8JAAADCarrYGOPo4QPo4SAJQ49bNM1i061ZgAGi0u114zPIEgAEBigEDVVNEkgEDQVVEmAHAAqABMqgBAbABALgBAsABBMgBAtABANgBAOABAPABAIoCWHVmKCdhJywgMTQwNjY4NiwgMTUzOTY2MzA2Nyk7dWYoJ3InLCAxMDgyMjc0MjcsIDE1Mzk2NjMwNjcpBR8oaScsIDY4Mjc2NywyOwDwn5IC_QEhOERsOHB3aVJtUElLRU9QV3pUTVlBQ0MwNjFZd0FEZ0FRQU5JLWpoUW1xNjJCbGdBWVBfX19fOFBhQUJ3QVhnQmdBRUJpQUVCa0FFQm1BRUJvQUVCcUFFRHNBRUF1UUVwaTRpREFBRHdQOEVCS1l1SWd3QUE4RF9KQWF5WW1QYVVZX0VfMlFFQUFBQUFBQUR3UC1BQmo5WXA5UUUFFChtQUlBb0FJQXRRSQUQAHYNCKh3QUlCeUFJQjBBSUIyQUlCNEFJQTZBSUEtQUlBZ0FNQmtBTUFtQU1CcUFPBdx0dWdNSlUwbE9NVG96TlRZejRBTjSaAkkhU0ExX2lBNgABLHRPdFdJQU1vQURFQQkBEER3UHpvMkAADFFIaEoJHPCaQUE4RDgu2AK8X-ACyLA56gJLaHR0cDovL2ZpbGVzLnBsYXlncm91bmQueHl6L3ByZWJpZC9zYW1wbGUvMS4xNS4wL2luZGV4Lmh0bWw_cGJqc19kZWJ1Zz10cnVl8gITCg9DVVNUT01fTU9ERUxfSUQSAPICGgoWQ1VTVE9NX01PREVMX0xFQUZfTkFNRRIA8gIeChpDVVNUT00RHQhBU1QBC_DJSUZJRUQSAIADAIgDAZADAJgDFKADAaoDAMADrALIAwDYAwDgAwDoAwD4AwOABACSBAkvb3BlbnJ0YjKYBACiBA0yMjAuMjQ0Ljk5LjIyqAQAsgQMCAAQABgAIAAwADgAuAQAwAQAyAQA0gQONzI5MCNTSU4xOjM1NjPaBAIIAeAEAPAE49bNM4gFAZgFAKAF____________AaoFJDQ2YjMwNDVkLTg1YjgtNDJiYi1iMjM3LTQzYjY2MTQyMTJmOcAFAMkFAAAAAGGPENIFCQkADQGU2AUB4AUB8AUB-gUECAAQAJAGAJgGALgGAMEGAAAAAAAA8D_IBgA.&s=da44a5d495b42ae5cf5b6fadf4226a9d2275856d&referrer=http%3A%2F%2Ffiles.playground.xyz%2Fprebid%2Fsample%2F1.15.0%2Findex.html%3Fpbjs_debug%3Dtrue&pp=1"></script>';
    var response = {
        cur: 'USD',
        id: r.id,
        seatbid: [
            {
                bid: [
                    {
                        adid: '1487603',
                        adm: adm,
                        adomain: ['www.playground.xyz'],
                        iurl: 'https://sin1-ib.adnxs.com/cr?id=108227427',
                        cid: '7290',
                        crid: '108227427',
                        h: 250,
                        w: 300,
                        ext: {
                            appnexus: {
                                brand_id: 1,
                                auction_id: 7012796633677917000,
                                bidder_id: 2,
                                bid_ad_type: 0
                            }
                        },
                        id: 567841330,
                        impid: 'htSlotDesktopAId',
                        price: '2'
                    },
                    {
                        adid: '1487603',
                        adm: adm,
                        adomain: ['www.playground.xyz'],
                        iurl: 'https://sin1-ib.adnxs.com/cr?id=108227427',
                        cid: '7290',
                        crid: '108227427',
                        h: 50,
                        w: 320,
                        ext: {
                            appnexus: {
                                brand_id: 1,
                                auction_id: 7012796633677917000,
                                bidder_id: 2,
                                bid_ad_type: 0
                            }
                        },
                        id: 567841330,
                        impid: 'htSlotDesktopAId',
                        price: '1'
                    }
                ],
                seat: '2439'
            }
        ]
    };

    return JSON.stringify(response);
}

function getPassResponse(request) {
    var r = JSON.parse(request.body);
    var adm = '<script src="https://sin1-ib.adnxs.com/ab?e=wqT_3QL5B6D5AwAAAwDWAAUBCNvJld4FELnWtcOgrJ2pYRicj9LStMS3rSIqNgkAAAECCPA_EQEHEAAA8D8ZCQkIAAAhCQkI8D8pEQkAMQkJ8JAAADCarrYGOPo4QPo4SAJQ49bNM1i061ZgAGi0u114zPIEgAEBigEDVVNEkgEDQVVEmAHAAqABMqgBAbABALgBAsABBMgBAtABANgBAOABAPABAIoCWHVmKCdhJywgMTQwNjY4NiwgMTUzOTY2MzA2Nyk7dWYoJ3InLCAxMDgyMjc0MjcsIDE1Mzk2NjMwNjcpBR8oaScsIDY4Mjc2NywyOwDwn5IC_QEhOERsOHB3aVJtUElLRU9QV3pUTVlBQ0MwNjFZd0FEZ0FRQU5JLWpoUW1xNjJCbGdBWVBfX19fOFBhQUJ3QVhnQmdBRUJpQUVCa0FFQm1BRUJvQUVCcUFFRHNBRUF1UUVwaTRpREFBRHdQOEVCS1l1SWd3QUE4RF9KQWF5WW1QYVVZX0VfMlFFQUFBQUFBQUR3UC1BQmo5WXA5UUUFFChtQUlBb0FJQXRRSQUQAHYNCKh3QUlCeUFJQjBBSUIyQUlCNEFJQTZBSUEtQUlBZ0FNQmtBTUFtQU1CcUFPBdx0dWdNSlUwbE9NVG96TlRZejRBTjSaAkkhU0ExX2lBNgABLHRPdFdJQU1vQURFQQkBEER3UHpvMkAADFFIaEoJHPCaQUE4RDgu2AK8X-ACyLA56gJLaHR0cDovL2ZpbGVzLnBsYXlncm91bmQueHl6L3ByZWJpZC9zYW1wbGUvMS4xNS4wL2luZGV4Lmh0bWw_cGJqc19kZWJ1Zz10cnVl8gITCg9DVVNUT01fTU9ERUxfSUQSAPICGgoWQ1VTVE9NX01PREVMX0xFQUZfTkFNRRIA8gIeChpDVVNUT00RHQhBU1QBC_DJSUZJRUQSAIADAIgDAZADAJgDFKADAaoDAMADrALIAwDYAwDgAwDoAwD4AwOABACSBAkvb3BlbnJ0YjKYBACiBA0yMjAuMjQ0Ljk5LjIyqAQAsgQMCAAQABgAIAAwADgAuAQAwAQAyAQA0gQONzI5MCNTSU4xOjM1NjPaBAIIAeAEAPAE49bNM4gFAZgFAKAF____________AaoFJDQ2YjMwNDVkLTg1YjgtNDJiYi1iMjM3LTQzYjY2MTQyMTJmOcAFAMkFAAAAAGGPENIFCQkADQGU2AUB4AUB8AUB-gUECAAQAJAGAJgGALgGAMEGAAAAAAAA8D_IBgA.&s=da44a5d495b42ae5cf5b6fadf4226a9d2275856d&referrer=http%3A%2F%2Ffiles.playground.xyz%2Fprebid%2Fsample%2F1.15.0%2Findex.html%3Fpbjs_debug%3Dtrue&pp=1"></script>';
    var response = {
        cur: 'USD',
        id: r.id,
        seatbid: [
            {
                bid: [
                    {
                        adid: '1487603',
                        adm: adm,
                        adomain: ['www.playground.xyz'],
                        iurl: 'https://sin1-ib.adnxs.com/cr?id=108227427',
                        cid: '7290',
                        crid: '108227427',
                        h: 250,
                        w: 300,
                        ext: {
                            appnexus: {
                                brand_id: 1,
                                auction_id: 7012796633677917000,
                                bidder_id: 2,
                                bid_ad_type: 0,
                                prebid_server_bid: false
                            }
                        },
                        id: 567841330,
                        impid: 'htSlotDesktopAId',
                        price: 0
                    }
                ],
                seat: '2439'
            }
        ]
    };

    return JSON.stringify(response);
}

function validateTargeting(targetingMap) {
    expect(targetingMap).toEqual(jasmine.objectContaining({
        ix_pxyz_cpm: jasmine.arrayContaining(['300x250_200', '320x50_100']),
        ix_pxyz_id: jasmine.arrayContaining([jasmine.any(String)])
    }));
}

function validatePixelRequests(pixelRequests) {
    expect(pixelRequests[0].toString()).toMatch(/.*ib\.adnxs\.com\/getuidnb.*/);
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
