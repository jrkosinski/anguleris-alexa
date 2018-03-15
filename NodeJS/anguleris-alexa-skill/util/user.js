'use strict';


//TODO: remove this if not being used

// ======================================================================================================
// user - information about current session's known or anonymous user
// 
// Anguleris Technologies
// John R. Kosinski
//
// 09 Mar 2018
// ------------------------------------------------------------------------------------------------------
const async = require('asyncawait/async');
const await = require('asyncawait/await');

const common = require('anguleris-common');
const exception = common.exceptions('USR');
const logger = common.logger('USR');
const enums = common.enums;

const config = require('../config');


// ======================================================================================================
// User
// 
// Anguleris Technologies
// John R. Kosinski
//
// 09 Mar 2018
// ------------------------------------------------------------------------------------------------------
function User(context) {
    const _this = this;

    this.id = null;

    // ------------------------------------------------------------------------------------------------------
    // true if current user is anonymous
    //
    // returns: boolean
    this.isAnonymous = () => {
        return false;
    }; 

    // ------------------------------------------------------------------------------------------------------
    // true if current user is anonymous
    //
    // returns: boolean
    this.hasRegisteredMobile = () => {
        return true;
    };

    // ------------------------------------------------------------------------------------------------------
    // true if current user has phonecalls enabled
    //
    // returns: boolean
    this.canCallPhone = () => {
        return _this.hasRegisteredMobile();
    };

    // ------------------------------------------------------------------------------------------------------
    // initializes the instance from database. 
    //
    // returns: nothing
    this.init = async(() => {

    });
}


module.exports = {
    getUser: async((context) => { 
        var user = new User(context);
        await(user.init()); 
        return user;
    })
};