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

var VALID_REGIONS = ['eu', 'us', 'na', 'asia'];

function partnerValidator(configs) {
    var result = Inspector.validate({
        type: 'object',
        properties: {
            region: {
                type: 'string',
                exec: function (schema, region) {
                    if (VALID_REGIONS.indexOf(region) === -1) {
                    this.report('Region must be one of the predefined values: ' + VALID_REGIONS);
                }
              }
            },
            networkId: {
                type: 'string',
                minLength: 1
            },
            xSlots: {
                type: 'object',
                properties: {
                    '*': {
                        type: 'object',
                        properties: {
                            placementId: {
                                type: 'string',
                                minLength: 1
                            },
                            sizeId: {
                                optional: true,
                                type: 'string',
                                minLength: 1
                            },
                            pageId: {
                                optional: true,
                                type: 'string',
                                minLength: 1
                            }
                        }
                    }
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
