/**
 * @author:    Partner
 * @license:   UNLICENSED
 *
 * @copyright: Copyright (c) 2017 by Index Exchange. All rights reserved.
 *
 * The information contained within this document is confidential, copyrighted
 * and or a trade secret. No part of this document may be reproduced or
 * distributed in any form or by any means, in whole or in part, without the
 * prior written permission of Index Exchange.
 */

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
            schain: {
                optional: true,
                type: 'object',
                properties: {
                    ver: {
                        type: 'string'
                    },
                    complete: {
                        type: 'integer'
                    },
                    nodes: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                asi: {
                                    type: 'string'
                                },
                                sid: {
                                    type: 'string'
                                },
                                rid: {
                                    type: 'string',
                                    optional: true
                                },
                                hp: {
                                    type: 'integer'
                                },
                                name: {
                                    type: 'string',
                                    optional: true
                                },
                                domain: {
                                    type: 'string',
                                    optional: true
                                }
                            }
                        }
                    }
                }
            },
            publisherId: {
                type: 'string',
                items: { pattern: /^[\d]+$/ }
            },
            xSlots: {
                type: 'object',
                properties: {
                    '*': {
                        type: 'object',
                        placementId: {
                            type: 'string',
                            minLength: 1,
                            optional: true
                        },
                        sizes: {
                            type: 'array',
                            minLength: 1,
                            items: {
                                type: 'array',
                                minLength: 2,
                                items: {
                                    type: 'integer'
                                }
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
