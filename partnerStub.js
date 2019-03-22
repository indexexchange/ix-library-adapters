function Partner(profile, configs, requiredResources, fns) {

    /* =====================================
     * Constructors
     * ---------------------------------- */

    (function __constructor() {
        _configs = {
            timeout: 0,
            lineItemType: profile.lineItemType,
            targetingKeys: profile.targetingKeys,
            rateLimiting: profile.features.rateLimiting
        };
    })();

    function _emitStatsEvent(sessionId, statsEventName, slotCollectionObject) {
        return 1;
    }

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    return {
        _configs: _configs,
        _emitStatsEvent: _emitStatsEvent,
        _bidTransformers: {
            targeting: {
                apply: function (price) {
                    return price;
                }
            },
            price: {
                apply: function (price) {
                    return price;
                }
            }
        }
    };
}

////////////////////////////////////////////////////////////////////////////////
// Enumerations ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

Partner.Architectures = {
    MRA: 0,
    SRA: 1,
    FSRA: 2
};

Partner.CallbackTypes = {
    ID: 0,
    CALLBACK_NAME: 1,
    NONE: 2
};

Partner.RequestTypes = {
    ANY: 0,
    AJAX: 1,
    JSONP: 2
};

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = Partner;