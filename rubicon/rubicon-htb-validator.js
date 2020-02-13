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
            accountId: {
                type: 'string',
                minLength: 1
            },
            xSlots: {
                type: 'object',
                properties: {
                    '*': {
                        type: 'object',
                        properties: {
                            siteId: {
                                type: 'string',
                                minLength: 1
                            },
                            zoneId: {
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
                            slotFpd: {
                                optional: true,
                                type: 'object',
                                strict: true,
                                properties: {
                                    inventory: {
                                        optional: true,
                                        type: 'object',
                                        strict: true,
                                        properties: {
                                            vars: {
                                                optional: true,
                                                type: 'object',
                                                properties: {
                                                    '*': {
                                                        type: 'array',
                                                        items: {
                                                            type: 'string',
                                                            minLength: 1
                                                        }
                                                    }
                                                }
                                            },
                                            strs: {
                                                optional: true,
                                                type: 'object',
                                                properties: {
                                                    '*': {
                                                        type: 'array',
                                                        items: {
                                                            type: 'string',
                                                            minLength: 1
                                                        }
                                                    }
                                                }
                                            },
                                            fns: {
                                                optional: true,
                                                type: 'object',
                                                properties: {
                                                    '*': {
                                                        type: 'object',
                                                        strict: true,
                                                        properties: {
                                                            fn: {
                                                                type: 'string',
                                                                minLength: 1
                                                            },
                                                            args: {
                                                                type: 'array',
                                                                items: {
                                                                    type: 'string',
                                                                    minLength: 1
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    visitor: {
                                        optional: true,
                                        type: 'object',
                                        strict: true,
                                        properties: {
                                            vars: {
                                                optional: true,
                                                type: 'object',
                                                properties: {
                                                    '*': {
                                                        type: 'array',
                                                        items: {
                                                            type: 'string',
                                                            minLength: 1
                                                        }
                                                    }
                                                }
                                            },
                                            strs: {
                                                optional: true,
                                                type: 'object',
                                                properties: {
                                                    '*': {
                                                        type: 'array',
                                                        items: {
                                                            type: 'string',
                                                            minLength: 1
                                                        }
                                                    }
                                                }
                                            },
                                            fns: {
                                                optional: true,
                                                type: 'object',
                                                properties: {
                                                    '*': {
                                                        type: 'object',
                                                        strict: true,
                                                        properties: {
                                                            fn: {
                                                                type: 'string',
                                                                minLength: 1
                                                            },
                                                            args: {
                                                                type: 'array',
                                                                items: {
                                                                    type: 'string',
                                                                    minLength: 1
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    position: {
                                        optional: true,
                                        type: 'string',
                                        eq: ['atf', 'btf']
                                    },
                                    keywords: {
                                        optional: true,
                                        type: 'array',
                                        items: {
                                            type: 'string',
                                            minLength: 1
                                        }
                                    }
                                }
                            },
                            schain: {
                                optional: true,
                                type: 'object',
                                properties: {
                                    nodes: {
                                        type: 'array'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            partnerFpd: {
                optional: true,
                strict: true,
                type: 'object',
                properties: {
                    inventory: {
                        optional: true,
                        type: 'object',
                        strict: true,
                        properties: {
                            vars: {
                                optional: true,
                                type: 'object',
                                properties: {
                                    '*': {
                                        type: 'array',
                                        items: {
                                            type: 'string',
                                            minLength: 1
                                        }
                                    }
                                }
                            },
                            strs: {
                                optional: true,
                                type: 'object',
                                properties: {
                                    '*': {
                                        type: 'array',
                                        items: {
                                            type: 'string',
                                            minLength: 1
                                        }
                                    }
                                }
                            },
                            fns: {
                                optional: true,
                                type: 'object',
                                properties: {
                                    '*': {
                                        type: 'object',
                                        strict: true,
                                        properties: {
                                            fn: {
                                                type: 'string',
                                                minLength: 1
                                            },
                                            args: {
                                                type: 'array',
                                                items: {
                                                    type: 'string',
                                                    minLength: 1
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    keywords: {
                        optional: true,
                        type: 'array',
                        items: {
                            type: 'string',
                            minLength: 1
                        }
                    },
                    visitor: {
                        optional: true,
                        type: 'object',
                        strict: true,
                        properties: {
                            vars: {
                                optional: true,
                                type: 'object',
                                properties: {
                                    '*': {
                                        type: 'array',
                                        items: {
                                            type: 'string',
                                            minLength: 1
                                        }
                                    }
                                }
                            },
                            strs: {
                                optional: true,
                                type: 'object',
                                properties: {
                                    '*': {
                                        type: 'array',
                                        items: {
                                            type: 'string',
                                            minLength: 1
                                        }
                                    }
                                }
                            },
                            fns: {
                                optional: true,
                                type: 'object',
                                properties: {
                                    '*': {
                                        type: 'object',
                                        strict: true,
                                        properties: {
                                            fn: {
                                                type: 'string',
                                                minLength: 1
                                            },
                                            args: {
                                                type: 'array',
                                                items: {
                                                    type: 'string',
                                                    minLength: 1
                                                }
                                            }
                                        }
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
