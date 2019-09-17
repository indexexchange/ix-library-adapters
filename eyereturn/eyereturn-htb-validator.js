'use strict';

var Inspector = require('../../../libs/external/schema-inspector.js');

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
                            ppid: {
                                type: 'string',
                                minLength: 1
                            },
                            width: {
                                type: 'number'
                            },
                            height: {
                                type: 'number'
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
