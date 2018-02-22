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
function responseWithCard(text, title, session, shouldEndSession) {
    return exception.try(() => {
        var output = {
            text: text,
            card: {
                title: title,
                content: text
            },
            shouldEndSession: shouldEndSession ? true : false
        };

        output.attrs = {
            text: text,
        };

        if (session) {
            for (var p in session) {
                output.attrs[p] = session[p];
            }
            output.text = text;
        }

        return output;
    });
}

// * * * 
// forms a standard speech response, with card, specific for a navigable list of results 
// 
// args
//  list: the full results list 
//  querySubject: subject of the query that got the original list
//  textProperty: the name of the property of each list object, that contains the text to speak (e.g. 'name')
//  startIndex: the list index to return in the response's session attributes
//  preText: text to speak as a preamble to the list contents
//  postText: text to speak after the list contents 
//
// returns: json object (Alexa response format) 
function responseListGroup(list, querySubject, textProperty, title, startIndex, preText, postText) {
    return exception.try(() => {

        var text = '';

        //build session attributes
        var sessionAttr = {
            startIndex: startIndex,
            querySubject: querySubject
        };

        if (!list || !list.length) {
            //if no results, output 'not found' 
            return responseWithCard(config.ui.text.noResultsFound, config.ui.cards.noResultsFound, sessionAttr);
        }
        else {
            //if start index is past the end, loop around 
            if (startIndex >= list.length) {
                startIndex = 0;
                sessionAttr.startIndex = startIndex;
            }

            //get end index
            var endIndex = (startIndex + (config.listOutputGroupSize - 1));
            if (endIndex > (list.length - 1))
                endIndex = list.length - 1;

            //build the text
            text += preText.replaceAll('{start}', startIndex).replaceAll('{end}', endIndex).replaceAll('{count}', list.length);
            var bodyItems = [];
            for (var n = startIndex; n <= endIndex; n++) {
                if (list[n][textProperty]) {
                    bodyItems.push(list[n][textProperty].trim());
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
            text += postText + ' ';

            //build the response body
            title = title.replaceAll('{start}', startIndex).replaceAll('{end}', endIndex).replaceAll('{count}', list.length);
            var output = responseWithCard(text, title, sessionAttr);

            return output;
        }
    });
}

//TODO: get text from config
function generalError() {
    return responseWithCard('error', 'error'); 
}

module.exports = {
    responseWithCard: responseWithCard,
    responseListGroup: responseListGroup,
    generalError: generalError
}