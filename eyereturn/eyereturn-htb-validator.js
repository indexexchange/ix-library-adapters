'use strict';

var Inspector = require('../../../libs/external/schema-inspector.js');

function partnerValidator(configs) {
    var result = Inspector.validate({
        type: 'object',
        properties: {
            // eslint-disable-next-line camelcase
            publisher_org_id: {
                type: 'string',
                minLength: 1
            },
            xSlots: {
                type: 'object',
                properties: {

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
