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
const callBimsmithSupport = async((sessionContext) => {
    return exception.try(() => {
        return await(callNumber(sessionContext, config.support.phone, "Bimsmith Support")); 
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
const callManufacturer = async((sessionContext, manufacturerName) => {
    return exception.try(() => {
        var mfg = await(query.runQuery(enums.querySubject.manufacturer, {name: manufacturerName}));

        //manufacturer not found
        if (!mfg) {
            return responseBuilder.manufacturerNotFound(manufacturerName, sessionContext);
        }

        // no phone number available 
        if (common.strings.isNullOrEmpty(mfg.phone)) {
            return responseBuilder.responseWithCardShortcut(
                'manufacturerPhoneNotFound', 
                {name:manufacturerName}, 
                sessionContext
            );
        }

        //else, call phone 
        return await(callNumber(sessionContext, mfg.phone, mfg.name)); 
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
const callNumber = async((sessionContext, phoneNumber, name) => {
    return exception.try(() => {

        //make the call
        if (await(iot.updateThingShadow({
            desired: {
                number: phoneNumber
            },
            reported: {
                number: phoneNumber
            }
        }))); 

        //return a response 
        return responseBuilder.responseWithCardShortcut('callingPhone', {name:name}, sessionContext, true);
    });
});


module.exports = {
    callBimsmithSupport,
    callManufacturer
};