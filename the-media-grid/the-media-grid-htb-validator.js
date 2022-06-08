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
    var keywordItem = {
        type: 'object',
        optional: true,
        properties: {
            '*': {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        '*': {
                            type: 'array',
                            items: {
                                type: 'string'
                            }
                        },
                        name: {
                            type: 'string'
                        },
                        segments: {
                            type: 'array',
                            optional: true,
                            items: {
                                type: 'object',
                                properties: {
                                    name: {
                                        type: 'string'
                                    },
                                    value: {
                                        type: 'string'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    var result = Inspector.validate({
        type: 'object',
        properties: {
            xSlots: {
                type: 'object',
                properties: {
                    '*': {
                        type: 'object',
                        properties: {
                            uid: {
                                type: 'string',
                                minLength: 1
                            },
                            bidFloor: {
                                type: 'number',
                                optional: true
                            },
                            sizes: {
                                type: 'array',
                                optional: true,
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
                                    site: keywordItem,
                                    user: keywordItem
                                }
                            },
                            video: {
                                type: 'object',
                                optional: true,
                                properties: {
                                    mimes: {
                                        type: 'array',
                                        minLength: 1,
                                        items: {
                                            type: 'string'
                                        }
                                    },
                                    minduration: {
                                        type: 'number',
                                    },
                                    maxduration: {
                                        type: 'number',
                                    },
                                    protocols: {
                                        type: 'array',
                                        minLength: 1,
                                        items: {
                                            type: 'number'
                                        }
                                    },
                                    w: {
                                        type: 'number'
                                    },
                                    h: {
                                        type: 'number'
                                    }
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
