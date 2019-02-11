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
    var validRegions = {
        eu: 0,
        na: 1,
        asia: 2
    };

    var result = Inspector.validate({
        type: 'object',
        properties: {
            region: {
                type: 'string',
                exec: function (schema, post) {
                    if (!validRegions.hasOwnProperty(post)) {
                        this.report('region must be one of the predefined values: ' + Object.keys(validRegions));
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
                        placementId: {
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
    }, configs);

    if (!result.valid) {
        return result.format();
    }

    return null;
};

module.exports = partnerValidator;
