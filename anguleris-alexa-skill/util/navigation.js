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
const enums = common.enums;

const config = require('../config');
const query = require('./query');
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
//TODO: is this still necessary? 
function getNavArgsForQuery(query) {
    var output = {
        preText: 'Results {start} to {end} of {count}. ',
        postText: 'Say next, previous, start over, or stop. ',
        reprompt: 'Say next, previous, start over, or stop. ',
        title: 'Results {start} to {end} of {count}',
        textProperty: 'name'
    };

    //TODO: hard-coded text 
    switch(query) {
        case enums.querySubject.categories: 
            output.preText = 'Categories {start} to {end} of {count}. ';
            output.title = 'Categories {start} to {end} of {count}';
            break;
        case enums.querySubject.manufacturers: 
            output.preText = 'Manufacturers {start} to {end} of {count}. ';
            output.title = 'Manufacturers {start} to {end} of {count}';
            break;
        case enums.querySubject.products: 
            output.preText = 'Product {start} of {count}. ';
            output.title = 'Product {start} of {count}';
            output.textProperty = 'simpleName';
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
    return exception.try(() => {
        logger.info('navigating ' + navigationCommand); 
        
        if (session) {
            if (session.querySubject && !common.types.isUndefinedOrNull(session.startIndex)) {
                var results = query.runQuery(session.querySubject, session.queryParams); 
                var index = common.types.tryParseInt(session.startIndex); 
                var navArgs = getNavArgsForQuery(session.querySubject);

                var groupSize = getGroupSize(session.querySubject); 

                if (navigationCommand === enums.navigationCommand.next)
                    index += groupSize; 

                else if (navigationCommand === enums.navigationCommand.prev) {
                    index -= groupSize; 
                    if (index < 0)
                        index = 0;

                    //TODO: handle already at beginning of list?
                }

                else if (navigationCommand === enums.navigationCommand.moveFirst) {
                    index = 0; 
                }

                if (results && results.length) {
                    //TODO: add reprompt
                    return responseBuilder.responseListGroup(
                        results, 
                        { subject: session.querySubject, params: session.queryParams }, 
                        groupSize, 
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
// gets the navigation list group size appropriate to the given query subject. 
//
// args
//  querySubject: what we're querying and getting a list of 
//
// returns: number 
function getGroupSize(querySubject) {
    var output = config.listOutputGroupSize;
    if (querySubject === enums.querySubject.products)
        output =1;

    return output; 
}


module.exports = {
    moveNext: moveNext,
    movePrev : movePrev,
    moveFirst : moveFirst,
    stop : stop,
    getGroupSize: getGroupSize
};