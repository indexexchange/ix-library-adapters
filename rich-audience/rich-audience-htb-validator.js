'use strict';

////////////////////////////////////////////////////////////////////////////////
// Dependencies ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var Inspector = require('../../../libs/external/schema-inspector.js');

////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/* =============================================================================
 * STEP 0 | Config Validation
 * -----------------------------------------------------------------------------
 * This file contains the necessary validation for the partner configuration.
 * This validation will be performed on the partner specific configuration object
 * that is passed into the wrapper. The wrapper uses an outside library called
 * schema-insepctor to perform the validation. Information about it can be found here:
 * https://atinux.fr/schema-inspector/.
 */
function partnerValidator(configs) {
    var result = Inspector.validate({
        type: 'object',
        properties: {
            currencyCode: {
                type: 'array',
                items: {
                    type: 'string',
                    minLength: 3
                }
            },
            xSlots: {
                type: 'object',
                properties: {
                    '*': {
                        type: 'object',
                        properties: {
                            adUnitName: {
                                type: 'string'
                            },
                            placementId: {
                                type: 'string',
                                minLength: 1
                            },
                            supplyType: {
                                type: 'string',
                                minLength: 3
                            },
                            sizes: {
                                type: 'array',
                                minLength: 1,
                                items: {
                                    type: 'array'
                                }
                            }
                        }
                    }
                }
            },
            mapping: {
                '*': {
                    type: 'array'
                }
            }
        }
    }, configs);

    if (!result.valid) {
        return result.format();
    }

    return null;
}

module.exports = partnerValidator;

/*
* {
"currencyCode": ["USD"],
        "xSlots": {
            "A": {
                "adUnitName": "AdUnitMPUDibujos",
                "placementId": "SIEUTMpbxj",
                "supplyType": "site",
                "sizes": [[300, 250]]
            },
            "B": {
                "adUnitName": "AdUnitLeaderBoardDibujos",
                "placementId": "0wILSPtTKI",
                "supplyType": "site",
                "sizes": [[728, 90]]
            }
        }
}
*
* */
