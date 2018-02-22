'use strict';

const common = require('anguleris-common');
const exception = common.exceptions('RSP');
const logger = common.logger('RSP');

const config = require('../config');

function responseWithCard(text, title, sessionAttr, shouldEndSession) {
    var output = {
        text: text,
        card: {
            title: title,
            content: text
        },
        shouldEndSession: shouldEndSession ? true: false
    };
        
    output.attrs = {
        text: text
    };

    if (sessionAttr) {
        for(var n=0; n<sessionAttr.length; n++){
            output.attrs[sessionAttr[n].key] = sessionAttr[n].value;
        }
    }

    return output; 
}

module.exports = {
    responseWithCard: responseWithCard
}