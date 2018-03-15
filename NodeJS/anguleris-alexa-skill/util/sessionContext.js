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
const dataAccess = require('anguleris-data-access'); 
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
function SessionContext(slots, sessionAttributes, rawRequest) {
    const _this = this;

    if (!sessionAttributes)
        sessionAttributes = {}; 

    this.attributes = sessionAttributes;
    this.userId = common.types.getDeepPropertyValue(rawRequest, 'session.user.userId');
    this.user = null; 

    // ------------------------------------------------------------------------------------------------------
    // retrieves a user object for the current encapsulated userId, from the database. 
    //
    // returns: user object
    this.getUser = async(() => {
        return exception.try(() => {
            if (!_this.user) {
                if (_this.userId) {
                    _this.user = await(dataAccess.getUser(_this.userId)); 
                }
            }
            
            return _this.user;
        });
    });
}


module.exports = {
    create: (data, sessionAttributes, rawRequest) => { 
        return new SessionContext(data, sessionAttributes, rawRequest);
    }
};