'use strict';

// ======================================================================================================
// phone - interface for making phonecalls (thru user's mobile device)
// 
// Anguleris Technologies
// John R. Kosinski
//
// 09 Mar 2018
// ------------------------------------------------------------------------------------------------------
const async = require('asyncawait/async');
const await = require('asyncawait/await');

const common = require('anguleris-common');
const exception = common.exceptions('PHN');
const logger = common.logger('PHN');
const enums = common.enums;

const iot = require('./iot');
const query = require('./query');
const config = require('../config');
const responseBuilder = require('./responseBuilder');


// ------------------------------------------------------------------------------------------------------
// sends a signal to the user's phone to call bimsmith support number
// 
// returns: 
const callBimsmithSupport = async((session) => {
    return exception.try(() => {
        const number = config.support.phone; 

        return await(iot.updateThingShadow({
            phone: number
        }));
    });
});

// ------------------------------------------------------------------------------------------------------
// gets the phone number of the given manufacturer, and attempts to call it by sending 
// a signal to the user's mobile if not found, returns a speech message to that effect. 
//
// args
//  manufacturerName: the name of the manufacturer to call 
// 
// returns: json object (Alexa response format) 
const callManufacturer = async((session, manufacturerName) => {
    return exception.try(() => {
        var mfg = query.runQuery(enums.querySubject.manufacturer, {name: manufacturerName});

        //manufacturer not found
        if (!mfg) {
            return responseBuilder.manufacturerNotFound(manufacturerName, session);
        }

        // no phone number available 
        if (common.strings.isNullOrEmpty(mfg.phone)) {
            return responseBuilder.responseWithCardShortcut(
                'manufacturerPhoneNotFound', 
                {name:manufacturerName}, 
                session
            );
        }

        //else, call phone 
        return await(callPhone(mfg.phone)); 
    });
});

// ------------------------------------------------------------------------------------------------------
// sends the command to call a given number 
//
// args
//  phoneNumber: the number to call
//  name: name of the party being called
// 
// returns: json object (Alexa response format) 
const callNumber = async((phoneNumber, name) => {
    return exception.try(() => {

        //make the call
        iot.updateThingShadow({
            phone: number
        });

        //return a response 
        return responseBuilder.responseWithCardShortcut('callingPhone', {name:name}, session, true);
    });
});


module.exports = {
    callBimsmithSupport,
    callManufacturer
};