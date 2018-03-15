'use strict';

// ====================================================================================================== 
// responseBuilder - builds formatted Alexa response bodies for different purposes
// 
// Anguleris Technologies
// John R. Kosinski
//
// 22 Feb 2018
// ------------------------------------------------------------------------------------------------------
const common = require('anguleris-common');
const exception = common.exceptions('RSP');
const logger = common.logger('RSP');
const stringUtil = common.strings;

const config = require('../config');

// ------------------------------------------------------------------------------------------------------
// forms a standard speech response, with card 
// 
// args
//  text: the text to speak (and the content of the card) 
//  title: the card title 
//  sessionContext: session context
//  shouldEndSession: true to end session after response; false is the default 
//
// returns: json object (Alexa response format) 
function responseWithCard(text, title, reprompt, sessionContext, shouldEndSession) {
    return exception.try(() => {
        if (!text)
            text = ''; 
        if (!reprompt)
            reprompt = getRandomReprompt(); 
        else {
            //if (!shouldEndSession)
            //    text += reprompt;
        } 
        if (!title)
            title = text; 

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

        if (sessionContext && sessionContext.attributes) {
            for (var p in sessionContext.attributes) {
                output.attrs[p] = sessionContext.attributes[p];
            }
            output.attrs.text = text;
        }

        if(shouldEndSession)
            output.attrs = null; 
            
        logger.info('response: ' + JSON.stringify(output)); 
        return output;
    });
}

// ------------------------------------------------------------------------------------------------------
// forms a standard speech response, with card 
//
// args
//  propertyName: example: 'help' - automatically gets the appropriate text, title, & reprompt from config
//  sessionContext: session context 
//  shouldEndSession: true to end session after response; false is the default 
//
// returns: json object (Alexa response format) 
function responseWithCardShortcut(propertyName, replacements, sessionContext, shouldEndSession) {
    return exception.try(() => {
        var text = config.ui[propertyName] && config.ui[propertyName].text ? config.ui[propertyName].text.replaceTokens(replacements) : null; 
        var card = config.ui[propertyName] && config.ui[propertyName].card ? config.ui[propertyName].card.replaceTokens(replacements) : null; 
        var reprompt = config.ui[propertyName] && config.ui[propertyName].reprompt ? config.ui[propertyName].reprompt.replaceTokens(replacements) : null; 
        
        return responseWithCard(text, card, reprompt, sessionContext, shouldEndSession);
    });
}

// ------------------------------------------------------------------------------------------------------
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
                    return s.replaceTokens({
                        start: (startIndex+1), 
                        end: (endIndex+1),
                        count: list.length
                    }); 
            };

            //build the text
            text += replaceText(navArgs.preText); 
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
            var title = replaceText(navArgs.title);         
            var reprompt = replaceText(navArgs.reprompt);

            var output = responseWithCard(text, title, reprompt, sessionAttr);

            return output;
        }
    });
}

// ------------------------------------------------------------------------------------------------------
// forms a speech response for the case of general error 
// 
// args
//  session: session attributes to pass along despite the error 
//
// returns: json object (Alexa response format) 
function generalError(sessionContext) {
    return responseWithCardShortcut('generalError', {}, sessionContext); 
}

// ------------------------------------------------------------------------------------------------------
// forms a standard response for when no results were found for a query
// 
// args
//  sessionContext: session attributes to return
//  shouldEndSession: true to end session after response; false is the default 
//
// returns: json object (Alexa response format) 
function noResultsResponse(sessionContext, shouldEndSession) {
    return responseWithCardShortcut('noResultsFound', {}, sessionContext); 
}

// ------------------------------------------------------------------------------------------------------
// converts an array of strings to speech, and returns in a basic speech response
// 
// args
//  list: the list to format as text (array of strings) 
//  text: the config ui text node (config.ui...)
//  sessionContext: session attributes to return
//  shouldEndSession: true to end session after response; false is the default 
// 
// returns: json object (Alexa response format) 
function listToText(list, preText, postText, title, sessionContext, shouldEndSession) {
    return exception.try(() => {
        if (!list || !list.length){
            return noResultsResponse(sessionContext);
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

        return responseWithCard(speech, title, null, sessionContext); 
    });
}

// ------------------------------------------------------------------------------------------------------
// builds the response for built-in Help request 
// 
// args
//  sessionContext: session attributes to return
//
// returns: json object (Alexa response format) 
function buildHelpResponse(sessionContext) {
    return responseWithCardShortcut('help', {}, sessionContext); 
}

// ------------------------------------------------------------------------------------------------------
// returns an error response appropriate to a requested category not being found
// 
// args
//  name: the name of requested category 
// 
// returns: json object (Alexa response format) 
function categoryNotFound(name, sessionContext) {
    return responseWithCardShortcut('categoryNotFound', {name:name}, sessionContext); 
}

// ------------------------------------------------------------------------------------------------------
// returns an error response appropriate to a requested manufacturer not being found
// 
// args
//  name: the name of requested manufacturer 
// 
// returns: json object (Alexa response format) 
function manufacturerNotFound(name, sessionContext) {
    return responseWithCardShortcut('manufacturerNotFound', {name:name}, sessionContext); 
}

// ------------------------------------------------------------------------------------------------------
// returns an error response appropriate to a requested product not being found
// 
// args
//  name: the name of requested product 
// 
// returns: json object (Alexa response format) 
function productNotFound(name, sessionContext) {
    return responseWithCardShortcut('productNotFound', {name:name}, sessionContext); 
}

// ------------------------------------------------------------------------------------------------------
// returns an error response appropriate to a requested entity not being found
// 
// args
//  name: the name of requested entity 
// 
// returns: json object (Alexa response format) 
function entityNotFound(name, sessionContext) {
    return responseWithCardShortcut('entityNotFound', {name:name}, sessionContext); 
}

// ------------------------------------------------------------------------------------------------------
// gets a random reprompt text from the list of random reprompts 
// 
// returns: string 
function getRandomReprompt() {
    return exception.try(() => {

        var list = config.ui.reprompts; 
        var index = Math.floor((Math.random() * list.length));

        return config.ui.reprompts[index]; 
    });
}


module.exports = {
    responseWithCard,
    responseWithCardShortcut,
    responseListGroup,
    generalError, 
    listToText,
    buildHelpResponse,
    noResultsResponse, 
    categoryNotFound,
    manufacturerNotFound,
    productNotFound,
    entityNotFound
}