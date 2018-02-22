'use strict';

const common = require('anguleris-common');
const exception = common.exceptions('RSP');
const logger = common.logger('RSP');
const stringUtil = common.strings;

const config = require('../config');

function responseWithCard(text, title, sessionAttr, shouldEndSession) {
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

        if (sessionAttr) {
            for (var p in sessionAttr) {
                output.attrs[p] = sessionAttr[p];
            }
        }

        return output;
    });
}

function responseListGroup(list, query, textProperty, title, startIndex, preText, postText) {
    return exception.try(() => {

        var text = '';

        //build session attributes
        var sessionAttr = {
            startIndex: startIndex,
            query: query
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