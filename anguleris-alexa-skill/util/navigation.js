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
function getNavParamsForQuery(query) {
    var output = {
        preText: 'Results {start} to {end} of {count}. ',
        postText: 'Say next, previous, start over, or stop. ',
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
                var navParams = getNavParamsForQuery(session.querySubject);

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
                        results, 
                        { subject: session.querySubject, params: session.queryParams }, 
                        navParams.textProperty, 
                        navParams.title, 
                        index, 
                        navParams.preText, 
                        navParams.postText
                    ); 
                }
                else{
                    return responseBuilder.noResultsResponse(session, false);
                }
            }
            else{
                logger.warn('query and/or startIndex missing from request'); 
                return responseBuilder.generalError();
            }
        }
        else{
            logger.warn('session not provided!'); 
            return responseBuilder.generalError();
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
    return navigate(session, enums.navigationCommand.stop); 
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

        switch (session.querySubject) {
            case enums.querySubject.categories: 
                var obj = query.runQuery(enums.querySubject.categories, {name:parameter}); 
                if (!obj)
                    logger.warning('category ' + parameter + ' not found.'); 
                else
                    details = obj.description;
                break; 
            case enums.querySubject.manufacturers: 
                var obj = query.runQuery(enums.querySubject.manufacturers, {name:parameter}); 
                if (!obj)
                    logger.warning('manufacturer ' + parameter + ' not found.'); 
                else
                    details = obj.description;
                break;
        }

        if (!details || !details.length) {
            details = 'no details found for ' + parameter;
        }
            
        return responseBuilder.responseWithCard(details, 'Category Details: ' + parameter, session); 
    });
}


module.exports = {
    moveNext: moveNext,
    movePrev : movePrev,
    moveFirst : moveFirst,
    stop : stop,
    getDetails: getDetails
};