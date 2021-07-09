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
    var validRegions = {
        eu: 0,
        na: 1,
        asia: 2
    };

    var result = Inspector.validate({
        type: 'object',
        properties: {
            xSlots: {
                type: 'object',
                properties: {
                    '*': {
                        type: 'object',
                        exec: function (schema, post) {
                            if (!((post.hasOwnProperty('dcn') && post.hasOwnProperty('pos'))
                                // eslint-disable-next-line no-mixed-operators
                                || post.hasOwnProperty('networkId') && post.hasOwnProperty('placementId'))) {
                                this.report('xSlots must have either dcn and pos, or networkId and placementId');
                            }

                            return post;
                        },
                        properties: {
                            region: {
                                optional: true,
                                type: 'string',
                                exec: function (schema, post) {
                                    if (post && !validRegions.hasOwnProperty(post)) {
                                        this.report('region must be one of the predefined values: '
                                                + Object.keys(validRegions));
                                    }
                                }
                            },
                            networkId: {
                                optional: true,
                                type: 'string',
                                minLength: 1
                            },
                            placementId: {
                                optional: true,
                                type: ['string'],
                                minLength: 1
                            },
                            dcn: {
                                optional: true,
                                type: ['string'],
                                minLength: 1
                            },
                            pos: {
                                optional: true,
                                type: ['string'],
                                minLength: 1
                            },
                            sizeId: {
                                optional: true,
                                type: ['string'],
                                minLength: 1
                            },
                            pageId: {
                                optional: true,
                                type: ['string'],
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
