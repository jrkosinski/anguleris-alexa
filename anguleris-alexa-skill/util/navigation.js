'use strict';

// * * * * * 
// navigation - utilities related to navigation through responses lists 
// 
// Anguleris Technologies
// John R. Kosinski
//
// 22 Feb 2018
const async = require('asyncawait/async');
const await = require('asyncawait/await');

const common = require('anguleris-common');
const exception = common.exceptions('NAV');
const logger = common.logger('NAV');

const config = require('../config');
const query = require('./query');
const enums = require('./enums');
const responseBuilder = require('./responseBuilder');

// * * * 
// given a query, returns params that help to form the Alexa response 
// 
// args
//  query: string
// 
// returns: json object in the form 
// {
//    preText: string,
//    postText: string,
//    title: string,
//    textProperty: string
// }
function getNavArgsForQuery(query) {
    var output = {
        preText: 'Results {start} to {end} of {count}. ',
        postText: 'Say next, previous, start over, or stop. ',
        reprompt: 'Say next, previous, start over, or stop. ',
        title: 'Results {start} to {end} of {count}',
        textProperty: 'name'
    };

    switch(query) {
        case enums.querySubject.categories: 
            output.preText = 'Categories {start} to {end} of {count}. ';
            output.title = 'Categories {start} to {end} of {count}';
            break;
        case enums.querySubject.manufacturers: 
            break;
    }

    return output; 
}

// * * * 
// returns a response that attempts to obey the given command on a list response
// 
// args
//  session: the list response and its state is defined here 
//  navigationCommand: the command to act upon the list 
// 
// returns: json object (Alexa response format) 
function navigate(session, navigationCommand) {
    //TODO: proper error msgs & responses 
    return exception.try(() => {
        logger.info('navigating ' + navigationCommand); 
        
        if (session) {
            if (session.querySubject && !common.types.isUndefinedOrNull(session.startIndex)) {
                var results = query.runQuery(session.querySubject); 
                var index = common.types.tryParseInt(session.startIndex); 
                var navArgs = getNavArgsForQuery(session.querySubject);

                if (navigationCommand === enums.navigationCommand.next)
                    index += config.listOutputGroupSize; 

                else if (navigationCommand === enums.navigationCommand.prev) {
                    index -= config.listOutputGroupSize; 
                    if (index < 0)
                        index = 0;

                    //TODO: handle already at beginning of list?
                }

                else if (navigationCommand === enums.navigationCommand.moveFirst) {
                    index = 0; 
                }

                if (results && results.length) {
                    return responseBuilder.responseListGroup(
                        //TODO: add reprompt
                        results, 
                        { subject: session.querySubject, params: session.queryParams }, 
                        index, 
                        navArgs
                    ); 
                }
                else{
                    return responseBuilder.noResultsResponse(session, false);
                }
            }
            else{
                logger.warn('query and/or startIndex missing from request'); 
                return responseBuilder.responseWithCardShortcut('notInList', session);
            }
        }
        else{
            logger.warn('session not provided!'); 
            return responseBuilder.responseWithCardShortcut('notInList', session);
        }
    });
}

// * * * 
// move to the next result in the list response 
// 
// args
//  session: the list response and its state is defined here 
// 
// returns: json object (Alexa response format) 
function moveNext(session) {
    return navigate(session, enums.navigationCommand.next); 
}

// * * * 
// move to the previous result in the list response 
// 
// args
//  session: the list response and its state is defined here 
// 
// returns: json object (Alexa response format) 
function movePrev(session) {
    return navigate(session, enums.navigationCommand.prev); 
}

// * * * 
// move to the first result in the list response 
// 
// args
//  session: the list response and its state is defined here 
// 
// returns: json object (Alexa response format) 
function moveFirst(session) {
    return navigate(session, enums.navigationCommand.moveFirst); 
}

// * * * 
// move to the next result in the list response 
// 
// args
//  session: the list response and its state is defined here 
// 
// returns: json object (Alexa response format) 
function stop(session) {
    return responseBuilder.responseWithCard('stopping', 'Stop', null, null, true);
}

// * * * 
// gets a response containing the details for a specific category or manufacturer
// 
// args
//  session: session attributes from request
// 
// returns: json object (Alexa response format) 
function getDetails(session, parameter) {
    return exception.try(() => {
        var details =null;

        if (!session)
            session = {};
        if (!session.querySubject)
            session.querySubject = enums.querySubject.categories;

        switch (session.querySubject) {
            case enums.querySubject.categories: 
                var obj = query.runQuery(enums.querySubject.categories, {name:parameter}); 
                if (!obj) {
                    logger.warn('category ' + parameter + ' not found.'); 
                    details = config.ui.categoryNotFound.text.replaceAll('{name}', parameter);
                }
                else
                    details = formatCategoryDetails(obj);
                break; 
            case enums.querySubject.manufacturers: 
                var obj = query.runQuery(enums.querySubject.manufacturers, {name:parameter}); 
                if (!obj) {
                    logger.warn('manufacturer ' + parameter + ' not found.'); 
                    details = config.ui.manufacturerNotFound.text.replaceAll('{name}', parameter);
                }
                else
                    details = formatManufacturerDetails(obj);
                break;
        }

        if (!details || !details.length) {
            details = 'no details found for ' + parameter;
        }
            
        //TODO: add reprompt
        return responseBuilder.responseWithCard(details, 'Category Details: ' + parameter, null, session); 
    });
}

// * * * 
function getManufacturerPhone(session, manufacturerName) {
    return exception.try(() => {
        return getManufacturerProperty(session, manufacturerName, 'address', config.ui.manufacturerAddressFound, config.ui.manufacturerAddressNotFound); 
    });
}

// * * * 
function getManufacturerAddress(session, manufacturerName) {
    return exception.try(() => {
        return getManufacturerProperty(session, manufacturerName, 'phone', config.ui.manufacturerPhoneNumberFound, config.ui.manufacturerPhoneNumberNotFound); 
    });
}

function getProductsForManufacturer() {
    return exception.try(() => {
        var text =null;
        
        var mfg = query.runQuery(enums.querySubject.manufacturers, {name:manufacturerName}); 

        if (mfg) {
            if (mfg.properties)
        }
        else{
            //manufacturer not found 
            text = config.ui.manufacturerNotFound.text.replaceAll('{name', manufacturerName); 
        }
    }); 
}

// * * * 
function getManufacturerProperty(session, manufacturerName, propertyName, foundText, notFoundText) {
    return exception.try(() => {
        var text =null;
        
        var mfg = query.runQuery(enums.querySubject.manufacturers, {name:manufacturerName}); 
        if (mfg) {
            if (mfg[propertyName] && mfg[propertyName].trim().length){
                text = notFoundText.replaceAll('{name}', manufacturerName).replaceAll('{value}', mfg[propertyName].trim()); 
                //text = manufacturerName + "'s phone number is " + mfg[propertyName].trim() + '.'; 
            }
            else{
                //no phone number available 
                text = notFoundText.replaceAll('{name}', manufacturerName); 
                //text = 'Sorry, no phone number is available for ' + manufacturerName; 
            }
        }
        else{
            //manufacturer not found 
            text = config.ui.manufacturerNotFound.text.replaceAll('{name', manufacturerName); 
            //text = 'Sorry, a manufacturer by the name of ' + manufacturerName + ' was not found.'; 
        }

        //TODO: add reprompt
        return responseBuilder.responseWithCard(text, 'Manufacturer Phone: ' + manufacturerName, null, session); 
    });
}

// * * * 
// creates a speech string for category details
// 
// args
//  category: category object
//
// returns: string 
function formatCategoryDetails(category) {
    return exception.try(() => {
        var output = '';

        if (category.description && category.description.trim().length) {
            output = category.description;
        }
        else {
            output = config.ui.noDetailsForCategory.text; 
        }

        return output; 
    });
}

// * * * 
// creates a speech string for manufacturer details
// 
// args
//  category: manufacturer object
//
// returns: string 
function formatManufacturerDetails(manufacturer) {
    return exception.try(() => {
        var output = ''; 
        output = manufacturer.name.trim() + '. '; 

        if (manufacturer.phone && manufacturer.phone.trim().length) {
            output += 'phone number: ' + manufacturer.phone.trim() + '. '; 
        }
        if (manufacturer.address && manufacturer.address.trim().length) {
            output += 'address: ' + manufacturer.address.trim() + '. '; 
        }
        if (manufacturer.description && manufacturer.description.trim().length){
            output += manufacturer.description;
        }

        return output; 
    });
}


module.exports = {
    moveNext: moveNext,
    movePrev : movePrev,
    moveFirst : moveFirst,
    stop : stop,
    getDetails: getDetails,
    getManufacturerProperty: getManufacturerProperty
};