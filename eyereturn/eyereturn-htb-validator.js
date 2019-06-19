'use strict';

var Inspector = require('../../../libs/external/schema-inspector.js');

function partnerValidator(configs) {
    var result = Inspector.validate({
        type: 'object',
        properties: {
            xSlots: {
                type: 'object',
                properties: {
                    /* Commenting out based on index's advice
                    '*': {
                        type: 'object',
                        properties: {
                            placementId: {
                                type: 'string',
                                minLength: 1
                            }
                        }
                    }
                    */
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
