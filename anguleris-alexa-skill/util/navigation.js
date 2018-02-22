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
        case enums.queryType.categories: 
            output.preText = 'Categories {start} to {end} of {count}. ';
            output.title = 'Categories {start} to {end} of {count}';
            break;
        case enums.queryType.manufacturers: 
            break;
    }

    return output; 
}

function navigate(session, navigationCommand) {
    //TODO: proper error msgs & responses 
    return exception.try(() => {
        if (session) {
            if (session.query && !common.types.isUndefinedOrNull(session.startIndex)) {
                var results = query.runQuery(session.query); 
                var index = common.types.tryParseInt(session.startIndex); 
                var navParams = getNavParamsForQuery(session.query);

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
                    return responseBuilder.responseListGroup(results, session.query, navParams.textProperty, navParams.title, index, navParams.preText, navParams.postText); 
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


module.exports = {
    moveNext,
    movePrev,
    startOver,
    stop
};