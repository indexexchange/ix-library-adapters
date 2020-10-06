'use strict';

function getPartnerId() {
    return 'AppNexusHtb';
}

function getStatsId() {
    return 'APNX';
}

function getCallbackType() {
    return 'NONE';
}

function getArchitecture() {
    return 'SRA';
}

function getBidRequestRegex() {
    return {
        method: 'POST',
        urlRegex: /.*ib\.adnxs\.com\/ut\/v3\/prebid*/
    };
}

function getConfig() {
    return {
        xSlots: {
            1: {
                placementId: '15894224',
                sizes: [[300, 250]],
                keywords: {
                    music: ['classical', 'piano']
                },
                usePaymentRule: false,
                allowSmallerSizes: false
            },
            2: {
                placementId: '15901268',
                sizes: [[300, 250], [300, 600]],
                keywords: {
                    music: ['classical', 'piano']
                },
                usePaymentRule: false,
                allowSmallerSizes: false
            }
        },
        mapping: {
            'Fake Unit 1 300x250': ['1'],
            'Fake Unit 2 300x250 or 300x600': ['2']
        }
    };
}

function validateBidRequest(request) {
    var data = JSON.parse(request.body);
    expect(data.tags).toBeDefined();
    expect(data.tags[0].ad_types).toBeDefined();
    expect(data.tags[0].id).toBeDefined();
    expect(data.tags[0].hb_source).toBeDefined();
    expect(data.tags[0].primary_size).toBeDefined();
    expect(data.tags[0].sizes).toBeDefined();
    expect(data.tags[0].uuid).toBeDefined();
    expect(data.tags[0].use_pmt_rule).toBeDefined();
    expect(data.tags[0].allow_smaller_sizes).toBeDefined();
    expect(data.tags[0].keywords).toBeDefined();
    expect(data.tags[0].keywords[0].key).toBeDefined();
    expect(data.tags[0].keywords[0].key).toEqual('music');
    expect(data.tags[0].keywords[0].value).toBeDefined();
    expect(data.tags[0].keywords[0].value).toEqual(['classical', 'piano']);
    expect(data.referrer_detection).toBeDefined();
    expect(data.referrer_detection.rd_ref).toBeDefined();
    expect(data.gdpr_consent).toBeDefined();
    expect(data.gdpr_consent.consent_required).toBeDefined();
    expect(data.gdpr_consent.consent_string).toBeDefined();
    expect(data.us_privacy).toBeDefined();
}

function getValidResponse(request, creative) {
    var data = JSON.parse(request.body);

    var tag1 = data.tags.filter(function (tag) {
        return tag.tag_id === 15894224;
    });
    var tag2 = data.tags.filter(function (tag) {
        return tag.tag_id === 15901268;
    });

    var response = {
        tags: [
            {
                uuid: tag1.uuid,
                tag_id: 15894224,
                auction_id: '7043938005185243760',
                nobid: false,
                no_ad_url: 'http://nym1-ib.adnxs.com/it?an_audit=0&referrer=http%3A%2F%2Ftest.localhost%3A9999%2FintegrationExamples%2Fgpt%2Fhello_world.html%3Fpbjs_debug%3Dtrue&e=wqT_3QLwCaDwBAAAAwDWAAUBCOjYj-gFEPDUwte5icbgYRiu57rC2tSUnTEqNgkAAAkCABEJBwgAABkRCQAhEQkAKREJADERCfBpMNCNygc47UhA7UhIAFAAWPO2XWAAaNSRd3gAgAEBigEAkgEDVVNEmAGsAqAB-gGoAQGwAQC4AQHAAQDIAQLQAQDYAQDgAQDwAQCKAjx1ZignYScsIDI2MDU0NTMsIDE1NjA1MzgyMTYpOwEdMHInLCAxMDAyMzIzNDA2HwDwsJICmQIhbXpmcGxnaXdnXzhORUpUWjVTOFlBQ0R6dGwwd0FEZ0FRQVJJN1VoUTBJM0tCMWdBWU40RGFBQndESGo4TElBQktJZ0JfQ3lRQVFHWUFRR2dBUUdvQVFPd0FRQzVBU21MaUlNQUFBQkF3UUVwaTRpREFBQUFRTWtCOElkVHJ4OUc4VF9aQVFBQUFBQUFBUEFfNEFFQTlRRUFBQUFBLUFFQW1BSUFvQUlBdFFJQQElCHZRSQEHkEF3QUlBeUFJQTRBSUE2QUlBLUFJQWdBTUJrQU1BbUFNQnFBT3cB1Hh1Z01KVGxsTk1qbzBNREEyNEFQTURaQUVBSmdFQWNFCWkFAQhESkIFCAkBLJoChQEhbHc1STZ3aTIdASQ4N1pkSUFRb0FEGTwIUURvMmUAFFFNd05TUQlJAdUAVREMDEFBQVcdDABZHQwAYR0MAGMdDEzCAiZodHRwOi8vcHJlYmlkLm9yZw0LDQdEanMuaHRtbNgCAOACrZhI6gJTDTHYdGVzdC5sb2NhbGhvc3Q6OTk5OS9pbnRlZ3JhdGlvbkV4YW1wbGVzL2dwdC9oZWxsb193b3JsZAVO8Nc_cGJqc19kZWJ1Zz10cnVlgAMAiAMBkAMAmAMXoAMBqgMAwAOsAsgDANIDLggCEig0ZGZhYTkyMzg4Njk5YWM2NTM5ODg1YWVmMTcxOTI5Mzg3OTk4NWJmGADSAyYIBBIgNTc1NmFlOTAyMmIyZWExZTQ3ZDg0ZmVhZDc1MjIwYzgYANIDKggKEiQzODQwMDAwMC04Y2YwLTExYmQtYjIzZS0xMGI5NmU0MDAwMGQYANIDJggMEiA3NTBjNmJlMjQzZjFjNGI1Yzk5MTJiOTVhNTc0MmZjNRgFVhAOEiQzOI5WAFzYAwDgAwDoAwD4AwGABACSBA0vdXQvdjMtevBbmAQAogQLMTAuMS4xMi4xMjmoBMKrG7IEEAgAEAEYrAIg-gEoADAAOAK4BADABADIBADSBA45MzI1I05ZTTI6NDAwNtoEAggA4AQB8ASU2eUviAUBmAUAoAX___8JAxQBwAUAyQWJOxTwP9IFCQkJDHAAANgFAeAFAfAFAfoFBAgAEACQBgCYBgC4BgDBBgkjJPC_yAYA2gYWChAJEBkBRBAAGADgBgHyBgIIAIAHAYgHAA..&s=592d1724c288d97cd422800219899c61f8a5dce1',
                timeout_ms: 0,
                ad_profile_id: 1182765,
                ads: [
                    {
                        content_source: 'rtb',
                        ad_type: 'banner',
                        buyer_member_id: 9325,
                        advertiser_id: 2605453,
                        creative_id: 100232340,
                        media_type_id: 1,
                        media_subtype_id: 1,
                        cpm: 2,
                        cpm_publisher_currency: 2,
                        is_bin_price_applied: false,
                        publisher_currency_code: '$',
                        brand_category_id: 0,
                        client_initiated_ad_counting: true,
                        rtb: {
                            banner: {
                                content: creative,
                                width: 300,
                                height: 250
                            },
                            trackers: [
                                {
                                    impression_urls: [''],
                                    video_events: {}
                                }
                            ]
                        }
                    }
                ]
            },
            {
                uuid: tag2.uuid,
                tag_id: 15901268,
                auction_id: '7134657038348845696',
                nobid: false,
                no_ad_url: 'http://nym1-ib.adnxs.com/it?an_audit=0&referrer=http%3A%2F%2Ftest.localhost%3A9999%2FintegrationExamples%2Fgpt%2Fhello_world.html%3Fpbjs_debug%3Dtrue&e=wqT_3QLbCaDbBAAAAwDWAAUBCOjYj-gFEICFmOjnmNmBYxiu57rC2tSUnTEqNgkAAAkCABEJBwgAABkRCQAhEQkAKREJADERCfBpMNTEygc47UhA7UhIAFAAWPO2XWAAaNSRd3gAgAEBigEAkgEDVVNEmAGsAqAB-gGoAQGwAQC4AQHAAQDIAQLQAQDYAQDgAQDwAQCKAjx1ZignYScsIDI2MDU0NTMsIDE1NjA1MzgyMTYpOwEdMHInLCAxMDAyMzIzNDA2HwDwsJICmQIhNWpZNVRnamtrNEFPRUpUWjVTOFlBQ0R6dGwwd0FEZ0FRQVJJN1VoUTFNVEtCMWdBWU40RGFBQndESGo4TElBQktJZ0JfQ3lRQVFHWUFRR2dBUUdvQVFPd0FRQzVBU21MaUlNQUFBQkF3UUVwaTRpREFBQUFRTWtCVFMtazJpcy04RF9aQVFBQUFBQUFBUEFfNEFFQTlRRUFBQUFBLUFFQW1BSUFvQUlBdFFJQQElCHZRSQEHkEF3QUlBeUFJQTRBSUE2QUlBLUFJQWdBTUJrQU1BbUFNQnFBUGsB1Hh1Z01KVGxsTk1qbzBNREEyNEFQTURaQUVBSmdFQWNFCWkFAQhESkIFCAkBJJoChQEhWFE3bjE6HQEkODdaZElBUW9BRBk8CFFEbzJlABRRTXdOU1EJSQHVAFURDAxBQUFXHQwAWR0MAGEdDABjHQx4wgIRaHR0cDovL3ByZWJpZC5vcmfYAgDgAq2YSOoCUw0c9DQBdGVzdC5sb2NhbGhvc3Q6OTk5OS9pbnRlZ3JhdGlvbkV4YW1wbGVzL2dwdC9oZWxsb193b3JsZC5odG1sP3BianNfZGVidWc9dHJ1ZYADAIgDAZADAJgDF6ADAaoDAMADrALIAwDSAy4IAhIoNGRmYWE5MjM4ODY5OWFjNjUzOTg4NWFlZjE3MTkyOTM4Nzk5ODViZhgA0gMmCAQSIDU3NTZhZTkwMjJiMmVhMWU0N2Q4NGZlYWQ3NTIyMGM4GADSAyoIChIkMzg0MDAwMDAtOGNmMC0xMWJkLWIyM2UtMTBiOTZlNDAwMDBkGADSAyYIDBIgNzUwYzZiZTI0M2YxYzRiNWM5OTEyYjk1YTU3NDJmYzUYANIDKggOEiQzODQwMDAwMC04Y2YwLTExYmQtYjIzZS0xMlYAXNgDAOADAOgDAPgDAYAEAJIEDS91dC92My138FuYBACiBAsxMC4xLjEyLjEyOagEwqsbsgQQCAAQARisAiD6ASgAMAA4ArgEAMAEAMgEANIEDjkzMjUjTllNMjo0MDA22gQCCADgBAHwBJTZ5S-IBQGYBQCgBf___wkDFAHABQDJBYkmFPA_0gUJCQkMcAAA2AUB4AUB8AUB-gUECAAQAJAGAJgGALgGAMEGCSMk8L_IBgDaBhYKEAkQGQFEEAAYAOAGAfIGAggAgAcBiAcA&s=4d399a5878ea1bc611db4f482689f84d7c03145b',
                timeout_ms: 0,
                ad_profile_id: 1182765,
                ads: [
                    {
                        content_source: 'rtb',
                        ad_type: 'banner',
                        buyer_member_id: 9325,
                        advertiser_id: 2605453,
                        creative_id: 100232340,
                        media_type_id: 1,
                        media_subtype_id: 1,
                        cpm: 2,
                        cpm_publisher_currency: 2,
                        is_bin_price_applied: false,
                        publisher_currency_code: '$',
                        brand_category_id: 0,
                        client_initiated_ad_counting: true,
                        rtb: {
                            banner: {
                                content: creative,
                                width: 300,
                                height: 250
                            },
                            trackers: [
                                {
                                    impression_urls: [''],
                                    video_events: {}
                                }
                            ]
                        }
                    }
                ]
            }
        ]
    };
    var jsonResponse = JSON.stringify(response);

    return jsonResponse;
}

function validateTargeting(targetingMap) {
    expect(targetingMap).toEqual(jasmine.objectContaining({
        ix_apnx_om: jasmine.arrayContaining(['300x250_200', '300x250_200']),
        ix_apnx_id: jasmine.arrayContaining([jasmine.any(String), jasmine.any(String)])
    }));
}

function getPassResponse(request) {
    var data = JSON.parse(request.body);

    var tag1 = data.tags.filter(function (tag) {
        return tag.tag_id === 15894224;
    });

    var tag2 = data.tags.filter(function (tag) {
        return tag.tag_id === 15901268;
    });

    var response = {
        tags: [
            {
                nobid: true,
                tag_id: 15894223,
                uuid: tag1.uuid
            },
            {
                nobid: true,
                tag_id: 15901268,
                uuid: tag2.uuid
            }
        ]
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
    getPassResponse: getPassResponse,
    validateTargeting: validateTargeting
};
