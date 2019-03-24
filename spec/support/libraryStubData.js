var partnerStub = require('./partnerStub.js');
var openRtbStub = require('./openRtbStub.js');

/* Instantiate mock browser objects */
var MockBrowser = require('mock-browser').mocks.MockBrowser;
var mock = new MockBrowser();

var libraryStubData = {
    'browser.js': {
        getProtocol: function () {
            return 'http:';
        },
        getReferrer: function () {
            return 'localhost';
        },
        getUserAgent: function () {
            return 'Mozilla/5.0 (Windows; U; Windows NT 6.1; rv:2.2) Gecko/20110201';
        },
        getLanguage: function () {
            return 'en-US';
        },
        getScreenWidth: function () {
            return 1024;
        },
        getScreenHeight: function () {
            return 768;
        },
        getPageUrl: function () {
            return 'http://www.indexexchange.com';
        },
        topWindow: mock.getWindow()
    },
    'classify.js': {
        derive: function (baseClass, derivedClass) {
            return derivedClass;
        },
    },
    'constants.js': {
        LineItemTypes: {
            ID_AND_SIZE: 0,
            ID_AND_PRICE: 1
        },
    },
    'partner.js': partnerStub,
    'openrtb.js': openRtbStub,
    'size.js': {
        arrayToString: function (arr) {
            return arr[0] + 'x' + arr[1];
        },
    },
    'network.js': {
        isXhrSupported: function () {
            return true;
        },
        buildUrl: function (base, path, query) {
            if (base[base.length - 1] !== '/' && path) {
                base = base + '/';
            }

            path = path || [];

            if (Object.prototype.toString.call(query)) {
                query = this.objToQueryString(query);
            }
            query = query ? '?' + query : '';

            return base + path.join('/') + query;
        },
        objToQueryString: function (obj) {
            var queryString = '';

            for (var param in obj) {
                if (!obj.hasOwnProperty(param)) {
                    continue;
                }

                if (Object.prototype.toString.call(obj[param]) === '[object Object]') {
                    for (var prop in obj[param]) {
                        if (!obj[param].hasOwnProperty(prop)) {
                            continue;
                        }

                        queryString += param + '%5B' + prop + '%5D=' + encodeURIComponent(obj[param][prop]) + '&';
                    }
                } else if (Object.prototype.toString.call(obj[param]) === '[object Array]') {
                    for (var i = 0; i < obj[param].length; i++) {
                        queryString += param + '%5B%5D=' + encodeURIComponent(obj[param][i]) + '&';
                    }
                } else {
                    queryString += param + '=' + encodeURIComponent(obj[param]) + '&';
                }
            }

            return queryString.slice(0, -1);
        }
    },
    'space-camp.js': {
        NAMESPACE: 'headertag',
        services: {
            EventsService: {
                emit: function (eventName, data) {
                    return;
                }
            },
            RenderService: {
                registerAdByIdAndSize: function () {
                    return;
                },
                registerAdByIdAndPrice: function () {
                    return;
                },
                registerAd: function () {
                    return '_' + Math.random().toString(36).substr(2, 9);
                }
            }
        },
    },
    'system.js': {
        generateUniqueId: function () {
            return '_' + Math.random().toString(36).substr(2, 9);
        },
        documentWrite: function (doc, adm) {
            return adm;
        },
        now: function () {
            return (new Date()).getTime();
        }
    },
    'utilities.js': {},
    'whoopsie.js': function () {
        return null;
    },
    'config-validators.js': {
        partnerBaseConfig: function () {
            return null;
        },
    },
    'scribe.js': {
        info: function () {
            return;
        },
        error: function () {
            return;
        },
    },
    'app-nexus-htb-validator.js': function () {
        return null;
    }
};
module.exports = libraryStubData;