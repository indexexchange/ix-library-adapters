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
    var result = Inspector.validate(
        {
            type: 'object',
            properties: {
                timeout: {
                    type: 'number'
                },
                publisherId: {
                    type: 'string'
                },
                lat: {
                    type: 'string',
                    optional: true
                },
                lon: {
                    type: 'string',
                    optional: true
                },
                yob: {
                    type: 'string',
                    optional: true
                },
                gender: {
                    type: 'string',
                    optional: true
                },
                bidfloor: {
                    type: 'string',
                    optional: true
                },
                profile: {
                    type: 'number',
                    optional: true
                },
                version: {
                    type: 'number',
                    optional: true
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
                                sizes: {
                                    type: 'array',
                                    minLength: 1
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
        },
        configs
    );

    if (!result.valid) {
        return result.format();
    }

    return null;
}

module.exports = partnerValidator;
