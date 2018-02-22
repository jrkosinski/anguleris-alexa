'use strict';

const async = require('asyncawait/async');
const await = require('asyncawait/await');

const common = require('anguleris-common');
const exception = common.exceptions('NAV');
const logger = common.logger('NAV');

const config = require('../config');
const query = require('./query');
const enums = require('./enums');
const responseBuilder = require('./responseBuilder');

function getNavParamsForQuery(query) {
    var output = {
        preText: 'Results {start} to {end} of {count}. ',
        postText: 'Say next, previous, start over, or stop. ',
        title: 'Results {start} to {end} of {count}',
        textProperty: 'name'
    }

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

function navigate(session, navigationCommand) {
    //TODO: proper error msgs & responses 
    return exception.try(() => {
        if (session) {
            if (session.querySubject && !common.types.isUndefinedOrNull(session.startIndex)) {
                var results = query.runQuery(session.querySubject); 
                var index = common.types.tryParseInt(session.startIndex); 
                var navParams = getNavParamsForQuery(session.querySubject);

                if (navigationCommand === enums.navigationCommand.next)
                    index += config.listOutputGroupSize; 

                else if (navigationCommand === enums.navigationCommand.prev) {
                    index += config.listOutputGroupSize; 
                    if (index < 0)
                        index = 0;

                    //TODO: handle already at beginning of list?
                }

                else if (navigationCommand === enums.navigationCommand.startOver) {
                    index = 0; 
                }

                if (results && results.length) {
                    return responseBuilder.responseListGroup(results, session.querySubject, navParams.textProperty, navParams.title, index, navParams.preText, navParams.postText); 
                }
                else{
                    //TODO: output no results found 
                    return responseBuilder.generalError();
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

function moveNext(session) {
    return navigate(session, enums.navigationCommand.next); 
}

function movePrev(session) {
    return navigate(session, enums.navigationCommand.prev); 
}

function startOver(session) {
    return navigate(session, enums.navigationCommand.startOver); 
}

function stop(session) {
    return navigate(session, enums.navigationCommand.stop); 
}

function getDetails(session, parameter) {
    return exception.try(() => {
        var details =null;

        switch (session.querySubject) {
            case enums.querySubject.categories: 
                details = query.runQuery(enums.querySubject.categories, parameter); 
                break; 
            case enums.querySubject.manufacturers: 
                details = query.runQuery(enums.querySubject.categories, parameter); 
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
    startOver : startOver,
    stop : stop,
    getDetails: getDetails
};