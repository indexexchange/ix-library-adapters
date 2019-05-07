'use strict';

function getPartnerId() {
    return 'PiximediaHtb';
}

function getStatsId() {
    return 'PIX';
}

function getBidRequestRegex() {
    return {
        method: 'POST',
        urlRegex: /.*ad\.piximedia\.com\/hbie.*/
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
				siteId: "PIXIMEDIA",
                placementId: "INDEX_EXCHANGE",
				positionId: "mpu",
                sizes: [[300, 250], [300,600]]
            },
            2: {
				siteId: "PIXIMEDIA",
                placementId: "INDEX_EXCHANGE",
				positionId: "top",
                sizes: [[728, 90]]
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

    expect(r.imp.length).toBe(3);

    expect(r.imp[0]).toEqual({
        id: 'htSlotDesktopAId',
        banner: {
            w: 300,
            h: 250,
        },
        ext: {
            piximedia: {
				siteId: 'PIXIMEDIA',
				placementId: 'INDEX_EXCHANGE',
				positionId: 'mpu',
            }
        }
    });

    expect(r.imp[1]).toEqual({
        id: 'htSlotDesktopAId',
        banner: {
            w: 300,
            h: 600,
        },
        ext: {
            piximedia: {
				siteId: 'PIXIMEDIA',
				placementId: 'INDEX_EXCHANGE',
				positionId: 'mpu',
            }
        }
    });

    expect(r.imp[2]).toEqual({
        id: 'htSlotDesktopAId',
        banner: {
            w: 728,
            h: 90,
        },
        ext: {
            piximedia: {
				siteId: 'PIXIMEDIA',
				placementId: 'INDEX_EXCHANGE',
				positionId: 'top',
            }
        }
    });
}

function getValidResponse(request, creative) {
    var r = JSON.parse(request.body);
	var adm = creative || "<script src=\"//ad.piximedia.com/position/PIXIMEDIA/INDEX_EXCHANGE/mpu/prebid=rdr/lazyload/prebid=1.0/pbwidth=300/pbheight=600/prebid_bid=0.002/ad_id=223672/ad_token= 0b1377183db486805674efe7bac32957/pmData.standard.width=300/pmData.standard.height=600\"></script>";
    var response = {
        cur: 'EUR',
        id: r.id,
        seatbid: [
            {
                bid: [
                    {
						impid: "htSlotDesktopAId",
						price: 200,
						width: "300",
						height: "250",
						crid: "371134",
						adm: adm
					}, {
						impid: "htSlotDesktopAId",
						price: 200,
						width: "300",
						height: "600",
						crid: "371134",
						adm: adm
					}
				]
			}
		]
    };

    return JSON.stringify(response);
}

function getPassResponse(request) {
    var r = JSON.parse(request.body);
    var response = {
        cur: 'EUR',
        id: r.id,
        seatbid: [
            {
                bid: [
				]
			}
		]
    };

    return JSON.stringify(response);
}

function validateTargeting(targetingMap) {
    expect(targetingMap).toEqual(jasmine.objectContaining({
        //ix_pix_cpm: jasmine.arrayContaining(['300x250_200', '300x600_200']),
        ix_pix_cpm: jasmine.arrayContaining([jasmine.any(String)]),
        ix_pix_id: jasmine.arrayContaining([jasmine.any(String)])
    }));
}

function validatePixelRequests(pixelRequests) {
    //expect(pixelRequests[0].toString()).toMatch(/.*ib\.adnxs\.com\/getuidnb.*/);
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
