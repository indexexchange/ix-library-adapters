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

var partnerValidator = function (configs) {
    var result = Inspector.validate({
        type: 'object',
        properties: {
            nativeAssets: {
                type: 'string',
                minLength: 1,
                optional: true
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
                            size: {
                                type: 'array',
                                exactLength: 2,
                                items: {
                                    type: 'integer',
                                }
                            },
                            adFormat: {
                                type: ['string'],
                                eq: ['native', 'fullwidth'],
                                optional: true
                            }
                        }
                    }
                }
            }
        },
        exec: function (schema, post) {
            if (post.nativeAssets) {
                return;
            }

            for (var xSlot in post.xSlots) {
                if (post.xSlots[xSlot].adFormat === 'native') {
                    this.report('nativeAssets is missing and not optional when there is at least one native xSlot');
                    return;
                }
            }
        }
    }, configs);

    if (!result.valid) {
        return result.format();
    }

    return null;
};

module.exports = partnerValidator;
