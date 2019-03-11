'use strict';

function getPartnerId() {
    return 'InskinMediaHtb';
}

function getStatsId() {
    return 'ISM';
}

function getBidRequestRegex() {
    return {
        method: 'POST',
        urlRegex: /mfad\.inskinad\.com\/api\/v2/
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
        networkId: '9874',
        siteId: '1059494',
        xSlots: {
            1: {},
            2: {}
        }
    };
}

function validateBidRequest(request) {
    var r = JSON.parse(request.body);
}

function getValidResponse(request, creative) {
    var r = JSON.parse(request.body);

    var decision = {
        "adId": 8228551,
        "creativeId": 5307845,
        "flightId": 7887391,
        "campaignId": 673897,
        "clickUrl": "http://mfad.inskinad.com/r?e=eyJ2IjoiMS4xIiwiYXYiOjEzMzY2MSwiYXQiOjUsImJ0IjowLCJjbSI6NjczODk3LCJjaCI6MjM5NjIsImNrIjp7fSwiY3IiOjUzMDc4NDUsImRpIjoiMzlkYzBjMTc1ZTgzNGNjZTg3N2I3ZDA5ZWU5YTNjZjMiLCJkaiI6MCwiaWkiOiIwOGU4M2JjY2FkZGY0ZDNiOGNkNGM5MWYyOGE1ZjE3MyIsImRtIjozLCJmYyI6ODIyODU1MSwiZmwiOjc4ODczOTEsImlwIjoiNzkuMTE0LjQuMjM0IiwibnciOjk4NzQsInBjIjoyMCwiZWMiOjIwLCJwciI6ODkzODEsInJ0IjoyLCJyZiI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTgzNy9wdWJsaWMvZGVidWdnZXIvYWRhcHRlci1kZWJ1Z2dlci5odG1sIiwicnMiOjUwMCwic2EiOiIxNCIsInNiIjoiaS0wYTIyMWRhZTY2ZjlmZjQwOCIsInNwIjoyODU1NCwic3QiOjEwNTk0OTQsInVrIjoidWUxLWU4MzUzNmRlMDNhZTQxOTc5ZGM2NDFhNDI4MTUwYmY5IiwidHMiOjE1NTIyOTcxNjcxMjQsImJmIjp0cnVlLCJwbiI6ImFyTG13alpEIiwiZ2MiOmZhbHNlLCJnaSI6dHJ1ZSwiZ3MiOiJub25lIiwiZ3YiOjE1MCwiZ1IiOnRydWUsInVyIjoiaHR0cDovL3d3dy5pbnNraW5tZWRpYS5jb20ifQ&s=MuX5XuWwR5-Dc08ajpiVcxR206U",
        "impressionUrl": "http://mfad.inskinad.com/i.gif?e=eyJ2IjoiMS4xIiwiYXYiOjEzMzY2MSwiYXQiOjUsImJ0IjowLCJjbSI6NjczODk3LCJjaCI6MjM5NjIsImNrIjp7fSwiY3IiOjUzMDc4NDUsImRpIjoiMzlkYzBjMTc1ZTgzNGNjZTg3N2I3ZDA5ZWU5YTNjZjMiLCJkaiI6MCwiaWkiOiIwOGU4M2JjY2FkZGY0ZDNiOGNkNGM5MWYyOGE1ZjE3MyIsImRtIjozLCJmYyI6ODIyODU1MSwiZmwiOjc4ODczOTEsImlwIjoiNzkuMTE0LjQuMjM0IiwibnciOjk4NzQsInBjIjoyMCwiZWMiOjIwLCJwciI6ODkzODEsInJ0IjoyLCJyZiI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTgzNy9wdWJsaWMvZGVidWdnZXIvYWRhcHRlci1kZWJ1Z2dlci5odG1sIiwicnMiOjUwMCwic2EiOiIxNCIsInNiIjoiaS0wYTIyMWRhZTY2ZjlmZjQwOCIsInNwIjoyODU1NCwic3QiOjEwNTk0OTQsInVrIjoidWUxLWU4MzUzNmRlMDNhZTQxOTc5ZGM2NDFhNDI4MTUwYmY5IiwidHMiOjE1NTIyOTcxNjcxMzcsImJmIjp0cnVlLCJwbiI6ImFyTG13alpEIiwiZ2MiOmZhbHNlLCJnaSI6dHJ1ZSwiZ3MiOiJub25lIiwiZ3YiOjE1MCwiZ1IiOnRydWUsImJhIjoxLCJmcSI6MH0&s=rEWas7hXTNVv9zcAZCrkybVo0MY",
        "contents": [
            {
                "type": "raw",
                "data": {
                    "height": 250,
                    "width": 300,
                    "customData": {
                        "events": {
                            "EVENT_TAG_1": {
                                "reportName": "Main Click",
                                "compatible": false,
                                "url": "http://www.inskinmedia.com",
                                "overlay": true,
                                "chromeless": false,
                                "noBackdrop": false,
                                "width": "1080",
                                "height": "800",
                                "trackers": [],
                                "silent": false,
                                "custom": "1059494",
                                "localUrl": "http://www.inskinmedia.com/",
                                "isSynchronized": true,
                                "remoteUrl": "http://www.inskinmedia.com",
                                "name": "EVENT_TAG_1"
                            }
                        },
                        "settings": {
                            "cw": 920,
                            "ch": 1000,
                            "ft": 250,
                            "fr": 130,
                            "fb": 100,
                            "fl": 130,
                            "st": 0,
                            "sr": 0,
                            "sb": 0,
                            "sl": 0,
                            "socTL": true,
                            "socTR": true,
                            "socBR": false,
                            "socBL": false,
                            "clickURL": "",
                            "overlapFramesBy": 0,
                            "swScrollTween": true,
                            "swScroll": true,
                            "swCreativeScroll": true,
                            "swSendScrollData": true,
                            "swFixedSides": false,
                            "flAuto": true,
                            "flAutoMargin": 0,
                            "frAuto": true,
                            "frAutoMargin": 0,
                            "device": "Desktop",
                            "format": "Pageskin Plus",
                            "treatments": [],
                            "trackMouse": false
                        },
                        "FT": {
                            "unit": {
                                "url": "https://cdn.inskinad.com/CreativeStore/ps/2017-10/59de107ad2866345e19510cf_1/top.html",
                                "w": "100%",
                                "h": "100%",
                                "halign": "middle",
                                "valign": "middle",
                                "swCatchClicks": false,
                                "swClickToSite": false,
                                "swCompatible": true,
                                "swScroll": false,
                                "swScrollOverflow": false,
                                "iframe": true
                            },
                            "bg": {}
                        },
                        "FR": {
                            "unit": {
                                "url": "https://cdn.inskinad.com/CreativeStore/ps/2017-10/59de107ad2866345e19510cf_1/right.html",
                                "w": "100%",
                                "h": "100%",
                                "halign": "middle",
                                "valign": "middle",
                                "swCatchClicks": false,
                                "swClickToSite": false,
                                "swCompatible": true,
                                "swScroll": false,
                                "swScrollOverflow": false,
                                "iframe": true
                            },
                            "bg": {}
                        },
                        "FB": {
                            "unit": {
                                "url": "https://cdn.inskinad.com/CreativeStore/ps/2017-10/59de107ad2866345e19510cf_1/bottom.html",
                                "w": "100%",
                                "h": "100%",
                                "halign": "middle",
                                "valign": "middle",
                                "swCatchClicks": false,
                                "swClickToSite": false,
                                "swCompatible": true,
                                "swScroll": false,
                                "swScrollOverflow": false,
                                "iframe": true
                            },
                            "bg": {}
                        },
                        "FL": {
                            "unit": {
                                "url": "https://cdn.inskinad.com/CreativeStore/ps/2017-10/59de107ad2866345e19510cf_1/left.html",
                                "w": "100%",
                                "h": "100%",
                                "halign": "middle",
                                "valign": "middle",
                                "swCatchClicks": false,
                                "swClickToSite": false,
                                "swCompatible": true,
                                "swScroll": false,
                                "swScrollOverflow": false,
                                "iframe": true
                            },
                            "bg": {}
                        },
                        "output": {
                            "ft": 250,
                            "fb": 100,
                            "fl": 340,
                            "fr": 340
                        }
                    }
                },
                "body": "xxx",
                "customTemplate": "xxx"
            }
        ],
        "height": 250,
        "width": 300,
        "events": [
        ],
        "pricing": {
            "price": 20,
            "clearPrice": 20,
            "revenue": 0.02,
            "rateType": 2,
            "eCPM": 20
        }

    };

    var response = {
        "decisions": {
            "1": decision,
            "2": decision
        }
    };

    return JSON.stringify(response);
}

function getPassResponse(request) {
    var r = JSON.parse(request.body);

    var decision = {
        "adId": 8228551,
        "creativeId": 5307845,
        "flightId": 7887391,
        "campaignId": 673897,
        "clickUrl": "http://mfad.inskinad.com/r?e=eyJ2IjoiMS4xIiwiYXYiOjEzMzY2MSwiYXQiOjUsImJ0IjowLCJjbSI6NjczODk3LCJjaCI6MjM5NjIsImNrIjp7fSwiY3IiOjUzMDc4NDUsImRpIjoiMzlkYzBjMTc1ZTgzNGNjZTg3N2I3ZDA5ZWU5YTNjZjMiLCJkaiI6MCwiaWkiOiIwOGU4M2JjY2FkZGY0ZDNiOGNkNGM5MWYyOGE1ZjE3MyIsImRtIjozLCJmYyI6ODIyODU1MSwiZmwiOjc4ODczOTEsImlwIjoiNzkuMTE0LjQuMjM0IiwibnciOjk4NzQsInBjIjoyMCwiZWMiOjIwLCJwciI6ODkzODEsInJ0IjoyLCJyZiI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTgzNy9wdWJsaWMvZGVidWdnZXIvYWRhcHRlci1kZWJ1Z2dlci5odG1sIiwicnMiOjUwMCwic2EiOiIxNCIsInNiIjoiaS0wYTIyMWRhZTY2ZjlmZjQwOCIsInNwIjoyODU1NCwic3QiOjEwNTk0OTQsInVrIjoidWUxLWU4MzUzNmRlMDNhZTQxOTc5ZGM2NDFhNDI4MTUwYmY5IiwidHMiOjE1NTIyOTcxNjcxMjQsImJmIjp0cnVlLCJwbiI6ImFyTG13alpEIiwiZ2MiOmZhbHNlLCJnaSI6dHJ1ZSwiZ3MiOiJub25lIiwiZ3YiOjE1MCwiZ1IiOnRydWUsInVyIjoiaHR0cDovL3d3dy5pbnNraW5tZWRpYS5jb20ifQ&s=MuX5XuWwR5-Dc08ajpiVcxR206U",
        "impressionUrl": "http://mfad.inskinad.com/i.gif?e=eyJ2IjoiMS4xIiwiYXYiOjEzMzY2MSwiYXQiOjUsImJ0IjowLCJjbSI6NjczODk3LCJjaCI6MjM5NjIsImNrIjp7fSwiY3IiOjUzMDc4NDUsImRpIjoiMzlkYzBjMTc1ZTgzNGNjZTg3N2I3ZDA5ZWU5YTNjZjMiLCJkaiI6MCwiaWkiOiIwOGU4M2JjY2FkZGY0ZDNiOGNkNGM5MWYyOGE1ZjE3MyIsImRtIjozLCJmYyI6ODIyODU1MSwiZmwiOjc4ODczOTEsImlwIjoiNzkuMTE0LjQuMjM0IiwibnciOjk4NzQsInBjIjoyMCwiZWMiOjIwLCJwciI6ODkzODEsInJ0IjoyLCJyZiI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTgzNy9wdWJsaWMvZGVidWdnZXIvYWRhcHRlci1kZWJ1Z2dlci5odG1sIiwicnMiOjUwMCwic2EiOiIxNCIsInNiIjoiaS0wYTIyMWRhZTY2ZjlmZjQwOCIsInNwIjoyODU1NCwic3QiOjEwNTk0OTQsInVrIjoidWUxLWU4MzUzNmRlMDNhZTQxOTc5ZGM2NDFhNDI4MTUwYmY5IiwidHMiOjE1NTIyOTcxNjcxMzcsImJmIjp0cnVlLCJwbiI6ImFyTG13alpEIiwiZ2MiOmZhbHNlLCJnaSI6dHJ1ZSwiZ3MiOiJub25lIiwiZ3YiOjE1MCwiZ1IiOnRydWUsImJhIjoxLCJmcSI6MH0&s=rEWas7hXTNVv9zcAZCrkybVo0MY",
        "contents": [
            {
                "type": "raw",
                "data": {
                    "height": 250,
                    "width": 300,
                    "customData": {
                        "events": {
                            "EVENT_TAG_1": {
                                "reportName": "Main Click",
                                "compatible": false,
                                "url": "http://www.inskinmedia.com",
                                "overlay": true,
                                "chromeless": false,
                                "noBackdrop": false,
                                "width": "1080",
                                "height": "800",
                                "trackers": [],
                                "silent": false,
                                "custom": "1059494",
                                "localUrl": "http://www.inskinmedia.com/",
                                "isSynchronized": true,
                                "remoteUrl": "http://www.inskinmedia.com",
                                "name": "EVENT_TAG_1"
                            }
                        },
                        "settings": {
                            "cw": 920,
                            "ch": 1000,
                            "ft": 250,
                            "fr": 130,
                            "fb": 100,
                            "fl": 130,
                            "st": 0,
                            "sr": 0,
                            "sb": 0,
                            "sl": 0,
                            "socTL": true,
                            "socTR": true,
                            "socBR": false,
                            "socBL": false,
                            "clickURL": "",
                            "overlapFramesBy": 0,
                            "swScrollTween": true,
                            "swScroll": true,
                            "swCreativeScroll": true,
                            "swSendScrollData": true,
                            "swFixedSides": false,
                            "flAuto": true,
                            "flAutoMargin": 0,
                            "frAuto": true,
                            "frAutoMargin": 0,
                            "device": "Desktop",
                            "format": "Pageskin Plus",
                            "treatments": [],
                            "trackMouse": false
                        },
                        "FT": {
                            "unit": {
                                "url": "https://cdn.inskinad.com/CreativeStore/ps/2017-10/59de107ad2866345e19510cf_1/top.html",
                                "w": "100%",
                                "h": "100%",
                                "halign": "middle",
                                "valign": "middle",
                                "swCatchClicks": false,
                                "swClickToSite": false,
                                "swCompatible": true,
                                "swScroll": false,
                                "swScrollOverflow": false,
                                "iframe": true
                            },
                            "bg": {}
                        },
                        "FR": {
                            "unit": {
                                "url": "https://cdn.inskinad.com/CreativeStore/ps/2017-10/59de107ad2866345e19510cf_1/right.html",
                                "w": "100%",
                                "h": "100%",
                                "halign": "middle",
                                "valign": "middle",
                                "swCatchClicks": false,
                                "swClickToSite": false,
                                "swCompatible": true,
                                "swScroll": false,
                                "swScrollOverflow": false,
                                "iframe": true
                            },
                            "bg": {}
                        },
                        "FB": {
                            "unit": {
                                "url": "https://cdn.inskinad.com/CreativeStore/ps/2017-10/59de107ad2866345e19510cf_1/bottom.html",
                                "w": "100%",
                                "h": "100%",
                                "halign": "middle",
                                "valign": "middle",
                                "swCatchClicks": false,
                                "swClickToSite": false,
                                "swCompatible": true,
                                "swScroll": false,
                                "swScrollOverflow": false,
                                "iframe": true
                            },
                            "bg": {}
                        },
                        "FL": {
                            "unit": {
                                "url": "https://cdn.inskinad.com/CreativeStore/ps/2017-10/59de107ad2866345e19510cf_1/left.html",
                                "w": "100%",
                                "h": "100%",
                                "halign": "middle",
                                "valign": "middle",
                                "swCatchClicks": false,
                                "swClickToSite": false,
                                "swCompatible": true,
                                "swScroll": false,
                                "swScrollOverflow": false,
                                "iframe": true
                            },
                            "bg": {}
                        },
                        "output": {
                            "ft": 250,
                            "fb": 100,
                            "fl": 340,
                            "fr": 340
                        }
                    }
                },
                "body": "xxx",
                "customTemplate": "xxx"
            }
        ],
        "height": 250,
        "width": 300,
        "events": [
        ],
        "pricing": {
            "price": 0,
            "clearPrice": 0,
            "revenue": 0.02,
            "rateType": 2,
            "eCPM": 20
        }

    };

    var response = {
        "decisions": {
            "1": decision,
            "2": decision
        }
    };

    return JSON.stringify(response);
}

function validateTargeting(targetingMap) {
    console.log('xxx:', targetingMap);
}

function validatePixelRequests(pixelRequests) {
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
