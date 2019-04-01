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
                        "adm": "<div id=\"emximp\"><script>var adm='\\<script\\ src\\=\\\"https\\:\\/\\/nym1\\-ib\\.adnxs\\.com\\/ab\\?referrer\\=https\\%3A\\%2F\\%2Fwww\\.celebuzz\\.com\\%2Fg\\%2Ftaylor\\-swift\\-debuts\\-red\\-hair\\-in\\-sugarland\\-video\\%2F\\%3Fbiddr_debug\\%3Dtrue\\&e\\=wqT_3QLCCPBCQgQAAAMA1gAFAQiQpO_kBRDzpsi394KcsEIY6sv7pYXhjOJKKjYJzGJi83G9KkARzGJi83G9KkAZAAAAwPUoEkAhzA0SACkRJMgxAAAA4KNw7T8wp7GFBTjMCkDMCkgCUOj5gRRY1uxHYABoisUKeJ_dBIABAYoBA1VTRJIFBvBAmAHYBaABWqgBAbABALgBAsABBMgBAtABCdgBAOABAPABAIoCOnVmKCdhJywgMjg5MTAxLCAxNTUzNzE1NzI4KTsBHCxyJywgNDE5NzUwMTY2HgDwjZICkQIhMWp5MXZnaUJqcDhKRU9qNWdSUVlBQ0RXN0Vjd0FEZ0FRQVJJekFwUXA3R0ZCVmdBWVBJRWFBQndVbmpNQW9BQnFnT0lBWGlRQVFHWUFRR2dBUUdvQVFPd0FRQzVBVXBIcW45eHZTcEF3UUZLUjZwX2NiMHFRTWtCcklDbXdiLXcxRF9aQVFBQUEBAyRQQV80QUVBOVFFAQ58QWdBSUFpQUtwZ3RjRmtBSUJtQUlBb0FJQXFBSUF0UUkFJAB2DQh4d0FJQXlBSUE0QUlBNkFJQS1BSUFnQU1CbUFNQnFBTwXguHVnTUpUbGxOTWpvME1ETTE0QU9iQ2ZnRHZLcXNESkFFQUEuLpoCYSFzUV9XMEFpBTQxFFgxdXhISUFRb0FERTlDdGVqY0wwcVFEbzJQABRRSnNKU1EFlwBBAcwAVREMDEFBQVcdDPCf2AKsA\\-ACt9FG6gJcaHR0cHM6Ly93d3cuY2VsZWJ1enouY29tL2cvdGF5bG9yLXN3aWZ0LWRlYnV0cy1yZWQtaGFpci1pbi1zdWdhcmxhbmQtdmlkZW8vP2JpZGRyX2RlYnVnPXRydWXyAhMKD0NVU1RPTV9NT0RFTF9JRBIA8gIaChZDVVNUT01fTU9ERUxfTEVBRl9OQU1FEgDyAh4KGjIzAAxMQVNUAT7wmUlGSUVEEgCAAwCIAwGQAwCYAxSgAwGqAwDAA6wCyAMA2AOUIeADAOgDAPgDA4AEAJIECS9vcGVucnRiMpgEAKIEDzE0NC4xMjEuMjMzLjIzN6gEqGeyBAwIABAAGAAgADAAOAC4BADABADIBLGCggHSBA4xMzU2I05ZTTI6NDAzNdoEAggB4AQA8ATo\\-YEUiAUBmAUAoAX___8JA7gBqgUkMzhhY2JkNmEtMDEyYi00MzVmLWJkYWQtNzcwMGExODQ2Njc5wAUAyQUAAAECFPA_0gUJCQEKAQFw2AUB4AUB8AXW7gr6BQQIABAAkAYAmAYAuAYAwQYBISwAAPA_yAYA2gYWChAJEBkBLBAAGADgBgHyBgIIAA\\.\\.\\&s\\=6ffff50d073b1cbc4171ceae02ab315e5b65a55b\\&pp\\=\\$\\{EMX_MACRO\\}\\\"\\>\\<\\/script\\><script src=\"https://imp.emxdgt.com/imp/?cp=13.3700&ts=1553715727&w=728&h=90&pb=11.3645&sid=1219&tid=25698&pid=945&uid=58971553715726821670e1&wid=1&dom=www.celebuzz.com&tp=${EMX_MACRO}&rf=${RF_MACRO}&cfc=yes\"><\\/script>'; window.vc= 'https://imp.emxdgt.com/view/?cp=13.3700&ts=1553715727&w=728&h=90&pb=11.3645&sid=1219&tid=25698&pid=945&uid=58971553715726821670e1&wid=1&dom=www.celebuzz.com&tp=${EMX_MACRO}&rf=${RF_MACRO}&cfc=yes';  var ap=\"${AUCTION_PRICE}\";var rf=document.domain; window.cp=\"13.3700\"; if(ap == \"test=1\" || ap == \"AUDIT\" || rf == \"s3.amazonaws.com\"){var finaladm=adm.replace(/\\${EMX_MACRO}/g,\"AUDIT\"); window.audit = true;}else{var finaladm=finaladm=adm.replace(/\\${EMX_MACRO}/g,window.cp);}finaladm=finaladm.replace(/\\${RF_MACRO}/g,rf);try{document.write(decodeURI(finaladm));}catch(e){document.write(unescape(finaladm));};</script><script src=\"https://js.brealtime.com/openvv.js\"></script></div>",
                        "id": "104e73d56709256",
                        "ttl": 300,
                        "crid": "41975016",
                        "w": 300,
                        "price": 11.3645,
                        "adid": "41975016",
                        "h": 250
                    },
                    {
                        "adm": "<div id=\"emximp\"><script>var adm='\\<script\\ src\\=\\\"https\\:\\/\\/nym1\\-ib\\.adnxs\\.com\\/ab\\?referrer\\=https\\%3A\\%2F\\%2Fwww\\.celebuzz\\.com\\%2Fg\\%2Ftaylor\\-swift\\-debuts\\-red\\-hair\\-in\\-sugarland\\-video\\%2F\\%3Fbiddr_debug\\%3Dtrue\\&e\\=wqT_3QLCCPBCQgQAAAMA1gAFAQiQpO_kBRCl_5Tt4ZLd5nUY6sv7pYXhjOJKKjYJzGJi83G9KkARzGJi83G9KkAZAAAAQOF6E0AhzA0SACkRJMgxAAAAYI_C8T8wytaABzjMCkDMCkgCUOj5gRRY1uxHYABoisUKeMy8BIABAYoBA1VTRJIFBvBAmAHYBaABWqgBAbABALgBAsABBMgBAtABCdgBAOABAPABAIoCOnVmKCdhJywgMjg5MTAxLCAxNTUzNzE1NzI4KTsBHCxyJywgNDE5NzUwMTY2HgDwjZICkQIhRER4Z2R3aUJqcDhKRU9qNWdSUVlBQ0RXN0Vjd0FEZ0FRQVJJekFwUXl0YUFCMWdBWVBJRWFBQndVbmpNQW9BQnFnT0lBWGlRQVFHWUFRR2dBUUdvQVFPd0FRQzVBVXBIcW45eHZTcEF3UUZLUjZwX2NiMHFRTWtCaDNPVU1YLXkwal9aQVFBQUEBAyRQQV80QUVBOVFFAQ58QWdBSUFpQUtwZ3RjRmtBSUJtQUlBb0FJQXFBSUF0UUkFJAB2DQh4d0FJQXlBSUE0QUlBNkFJQS1BSUFnQU1CbUFNQnFBTwXguHVnTUpUbGxOTWpvek5qRTM0QU9iQ2ZnRHZLcXNESkFFQUEuLpoCYSF0Zzk0MFFpBTQxFFgxdXhISUFRb0FERTlDdGVqY0wwcVFEbzJQABRRSnNKU1EFlwBBAcwAVREMDEFBQVcdDPCf2AKsA\\-ACt9FG6gJcaHR0cHM6Ly93d3cuY2VsZWJ1enouY29tL2cvdGF5bG9yLXN3aWZ0LWRlYnV0cy1yZWQtaGFpci1pbi1zdWdhcmxhbmQtdmlkZW8vP2JpZGRyX2RlYnVnPXRydWXyAhMKD0NVU1RPTV9NT0RFTF9JRBIA8gIaChZDVVNUT01fTU9ERUxfTEVBRl9OQU1FEgDyAh4KGjIzAAxMQVNUAT7wmUlGSUVEEgCAAwCIAwGQAwCYAxSgAwGqAwDAA6wCyAMA2AOUIeADAOgDAPgDA4AEAJIECS9vcGVucnRiMpgEAKIEDzE0NC4xMjEuMjMzLjIzN6gEqGeyBAwIABAAGAAgADAAOAC4BADABADIBLGCggHSBA4xMzU2I05ZTTI6MzYxN9oEAggB4AQA8ATo\\-YEUiAUBmAUAoAX___8JA7gBqgUkMzhhY2JkNmEtMDEyYi00MzVmLWJkYWQtNzcwMGExODQ2Njc5wAUAyQUAAAECFPA_0gUJCQEKAQFw2AUB4AUB8AXW7gr6BQQIABAAkAYAmAYAuAYAwQYBISwAAPA_yAYA2gYWChAJEBkBLBAAGADgBgHyBgIIAA\\.\\.\\&s\\=310066d1082b1bb4791a5a633cec77d6c5c8017a\\&pp\\=\\$\\{EMX_MACRO\\}\\\"\\>\\<\\/script\\><script src=\"https://imp.emxdgt.com/imp/?cp=13.3700&ts=1553715727&w=728&h=90&pb=11.3645&sid=1219&tid=47756&pid=945&uid=47791553715726833978e1&wid=1&dom=www.celebuzz.com&tp=${EMX_MACRO}&rf=${RF_MACRO}&cfc=yes\"><\\/script>'; window.vc= 'https://imp.emxdgt.com/view/?cp=13.3700&ts=1553715727&w=728&h=90&pb=11.3645&sid=1219&tid=47756&pid=945&uid=47791553715726833978e1&wid=1&dom=www.celebuzz.com&tp=${EMX_MACRO}&rf=${RF_MACRO}&cfc=yes';  var ap=\"${AUCTION_PRICE}\";var rf=document.domain; window.cp=\"13.3700\"; if(ap == \"test=1\" || ap == \"AUDIT\" || rf == \"s3.amazonaws.com\"){var finaladm=adm.replace(/\\${EMX_MACRO}/g,\"AUDIT\"); window.audit = true;}else{var finaladm=finaladm=adm.replace(/\\${EMX_MACRO}/g,window.cp);}finaladm=finaladm.replace(/\\${RF_MACRO}/g,rf);try{document.write(decodeURI(finaladm));}catch(e){document.write(unescape(finaladm));};</script><script src=\"https://js.brealtime.com/openvv.js\"></script></div>",
                        "id": "11ee309e23efab5",
                        "ttl": 300,
                        "crid": "41975016",
                        "w": 320,
                        "price": 11.3645,
                        "adid": "41975016",
                        "h": 50
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
    getPassResponse: getPassResponse,
    validateBidRequest: validateBidRequest,
    getValidResponse: getValidResponse
};