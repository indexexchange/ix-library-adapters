'use strict';

////////////////////////////////////////////////////////////////////////////////
// Dependencies ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var Inspector = require('../../../libs/external/schema-inspector.js');

////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function partnerValidator(configs) {
    var result = Inspector.validate({
        type: 'object',
        properties: {
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
                            sizes: {
                                type: 'array',
                                minLength: 1,
                                items: {
                                    type: 'array',
                                    exactLength: 2,
                                    items: {
                                        type: 'integer'
                                    }
                                }
                            },
                            keywords: {
                                type: 'object',
                                optional: true,
                                properties: {
                                    '*': {
                                        type: 'array',
                                        minLength: 1,
                                        items: {
                                            type: 'string'
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            mapping: {
                type: 'object'
            }
        }
    }, configs);

    if (!result.valid) {
        return result.format();
    }

    return null;
}

module.exports = partnerValidator;
