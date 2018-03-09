'use strict';

// ======================================================================================================
// sessionContext - encapsulates context data for a single session request
// 
// Anguleris Technologies
// John R. Kosinski
//
// 09 Mar 2018
// ------------------------------------------------------------------------------------------------------
const async = require('asyncawait/async');
const await = require('asyncawait/await');

const common = require('anguleris-common');
const exception = common.exceptions('CTX');
const logger = common.logger('CTX');
const enums = common.enums;

const config = require('../config');


// ======================================================================================================
// SessionContext
// 
// Anguleris Technologies
// John R. Kosinski
//
// 09 Mar 2018
// ------------------------------------------------------------------------------------------------------
function SessionContext(sessionAttributes) {
    const _this = this;

    if (!sessionAttributes)
        sessionAttributes = {}; 

    this.attributes = sessionAttributes;
    this.user = null; 
}


module.exports = {
    create: (sessionAttributes) => { 
        return new SessionContext(sessionAttributes);
    }
};