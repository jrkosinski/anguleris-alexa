'use strict';

// * * * * * 
// responseBuilder - builds formatted Alexa response bodies for different purposes
// 
// Anguleris Technologies
// John R. Kosinski
//
// 22 Feb 2018
const common = require('anguleris-common');
const exception = common.exceptions('RSP');
const logger = common.logger('RSP');
const stringUtil = common.strings;

const config = require('../config');

// * * * 
// forms a standard speech response, with card 
// 
// args
//  text: the text to speak (and the content of the card) 
//  title: the card title 
//  session: session attributes from request
//  shouldEndSession: true to end session after response; false is the default 
//
// returns: json object (Alexa response format) 
function responseWithCard(text, title, reprompt, session, shouldEndSession) {
    return exception.try(() => {
        var output = {
            text: text,
            card: {
                title: title,
                content: text
            },
            reprompt: reprompt,
            shouldEndSession: shouldEndSession ? true : false
        };

        output.attrs = {
            text: text,
        };

        if (session) {
            for (var p in session) {
                output.attrs[p] = session[p];
            }
            output.attrs.text = text;
        }

        logger.info('response: ' + JSON.stringify(output)); 
        return output;
    });
}

// * * * 
// forms a standard speech response, with card 
//
// args
//  propertyName: example: 'help' - automatically gets the appropriate text, title, & reprompt from config
//  session: session attributes from request
//  shouldEndSession: true to end session after response; false is the default 
//
// returns: json object (Alexa response format) 
function responseWithCardShortcut(propertyName, session, shouldEndSession) {
    return exception.try(() => {
        return responseWithCard(config.ui[propertyName].text, config.ui[propertyName].card, config.ui[propertyName].reprompt, session, shouldEndSession);
    });
}

// * * * 
// forms a standard speech response, with card, specific for a navigable list of results 
// 
// args
//  list: the full results list 
//  querySubject: subject of the query that got the original list
//  startIndex: the list index to return in the response's session attributes
//  navArgs: 
//
// returns: json object (Alexa response format) 
function responseListGroup(list, query, groupSize, startIndex, navArgs) {
    return exception.try(() => {

        var text = '';

        //build session attributes
        var sessionAttr = {
            startIndex: startIndex,
            querySubject: query.subject,
            queryParams: query.params
        };

        if (!list || !list.length) {
            //if no results, output 'not found' 
            return noResultsResponse(sessionAttr);
        }
        else {
            //if start index is past the end, loop around 
            if (startIndex >= list.length) {
                startIndex = 0;
                sessionAttr.startIndex = startIndex;
            }

            //get end index
            var endIndex = (startIndex + (groupSize - 1));
            if (endIndex > (list.length - 1))
                endIndex = list.length - 1;
                
            var replaceText = (s) => {
                if (s)
                    return s.replaceAll('{start}', startIndex+1).replaceAll('{end}', endIndex+1).replaceAll('{count}', list.length);
            };

            //build the text
            text += replaceText(navArgs.preText); //.replaceAll('{start}', startIndex+1).replaceAll('{end}', endIndex+1).replaceAll('{count}', list.length);
            var bodyItems = [];
            for (var n = startIndex; n <= endIndex; n++) {
                if (list[n][navArgs.textProperty]) {
                    bodyItems.push(list[n][navArgs.textProperty].trim());
                }
            }

            //build the body
            var body = '';
            if (bodyItems.length) {
                for (var n = 0; n < bodyItems.length; n++) {
                    body += bodyItems[n];
                    if (n < bodyItems.length - 1)
                        body += ", ";
                    else
                        body += '. ';
                }
            }

            text += body;
            text += navArgs.postText + ' ';

            //build the response body
            var title = replaceText(navArgs.title); //.replaceAll('{start}', startIndex+1).replaceAll('{end}', endIndex+1).replaceAll('{count}', list.length);
            var reprompt = replaceText(navArgs.title); //.replaceAll('{start}', startIndex+1).replaceAll('{end}', endIndex+1).replaceAll('{count}', list.length);

            var output = responseWithCard(text, title, reprompt, sessionAttr);

            return output;
        }
    });
}

// * * * 
// forms a speech response for the case of general error 
// 
// args
//  session: session attributes to pass along despite the error 
//
// returns: json object (Alexa response format) 
function generalError(session) {
    return responseWithCardShortcut('generalError', session); 
}

// * * * 
// forms a standard response for when no results were found for a query
// 
// args
//  session: session attributes to return
//  shouldEndSession: true to end session after response; false is the default 
//
// returns: json object (Alexa response format) 
function noResultsResponse(session, shouldEndSession) {
    return responseWithCardShortcut('noResultsFound', session); 
}

// * * * 
// converts an array of strings to speech, and returns in a basic speech response
// 
// args
//  list: the list to format as text (array of strings) 
//  text: the config ui text node (config.ui...)
//  session: session attributes to return
//  shouldEndSession: true to end session after response; false is the default 
// 
// returns: json object (Alexa response format) 
function listToText(list, preText, postText, title, session, shouldEndSession) {
    return exception.try(() => {
        if (!list || !list.length){
            return noResultsResponse(session);
        }
        
        var speech = list[0]; 
        if (list.length > 1){
            for(var n=1; n<list.length; n++){
                speech += ', ' + list[n]; 
            }
        }

        if (preText && preText.length)
            speech = preText + ' ' + speech; 

        if (postText && postText.length)
            speech = speech + '. ' + postText;

        return responseWithCard(speech, title, null, session); 
    });
}

// * * * 
// builds the response for built-in Help request 
// 
// args
//  session: session attributes to return
//
// returns: json object (Alexa response format) 
function buildHelpResponse(session) {
    return responseWithCardShortcut('help', session); 
}


module.exports = {
    responseWithCard: responseWithCard,
    responseWithCardShortcut: responseWithCardShortcut,
    responseListGroup: responseListGroup,
    generalError: generalError, 
    listToText: listToText,
    buildHelpResponse: buildHelpResponse,
    noResultsResponse: noResultsResponse
}