'use strict';

// * * * * * 
// responseBuilder - for building standard Alexa response packets.
// 
// John R. Kosinski
// 3 Oct 2017

const config = require('../config');
const logger = require('anguleris-common').logger('RSP');
const guid = require('uuid/v4');

// * * *
// outputs only the body for a speech response with card and reprompt text.
// returns: string (json)
function buildSpeechResponseBody(text, shouldEndSession, cardTitle, repromptText){
    var output = {
        outputSpeech: {
            type: "PlainText",
            text: text
        },
        shouldEndSession: shouldEndSession
    };

    //card 
    if (cardTitle != null){
        output.card = {
            type: "Simple",
            title: cardTitle,
            content: text
        };
    }

    //reprompt 
    if (repromptText != null){
        output.reprompt = {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        };
    }

    return output; 
}

// * * *
// outputs only the body for a speech response that ends the session, with no reprompt.
// returns: string (json)
function buildSimpleSpeechResponseBody(text, cardTitle){
    return buildSpeechResponseBody(text, true, cardTitle);
}

// * * *
// outputs only the body for a speech response that keeps the session open, with reprompt.
// returns: string (json)
function buildSpeechPromptResponseBody(text, cardTitle, repromptText) {
    return buildSpeechResponseBody(text, false, cardTitle, repromptText);
}

// * * *
// outputs only the body for a response to the AMAZON.HelpIntent.
// returns: string (json)
function buildHelpResponse() {
    var text = config.ui.text.helpText;
    var repromptText = text;

    return {
        outputSpeech: {
            type: "PlainText",
            text: text
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        card: {
            type: "Simple",
            title: config.ui.cards.helpText,
            content: text
        },
        shouldEndSession: true
    };
}

// * * *
// outputs only the body for a response containing a directive to play audio.
// returns: string (json)
function buildAudioResponseBody(text, resourceUrl){
    return {
        outputSpeech: {
            type: "PlainText",
            text: text
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: text
            }
        },
        card: {
            type: "Simple",
            title: config.ui.cards.mediaOutput,
            content: text
        },
        directives: [
            {
                type: "AudioPlayer.Play",
                playBehavior: "REPLACE_ALL",
                audioItem: {
                    stream: {
                        token: guid(),
                        url: resourceUrl,
                        offsetInMilliseconds: 1,
                        expectedPreviousToken: null
                    }
                }
            }
        ],
        shouldEndSession: "true"
    };
}

// * * * 
// builds a response to stop currently-running audio 
// 
// args
//  messageId: 
//  dialogRequestId: 
// 
// returns: string (json)
function buildAudioStopResponseBody(messageId, dialogRequestId){
    var output = {
        card : {
            type: "Simple",
            title: config.ui.cards.pause,
            content: config.ui.cards.pause
        },
        directives: [{type:"AudioPlayer.Stop"}],
        shouldEndSession: "true"
    };

    logger.info('buildVideoStopResponseBody returning ' + JSON.stringify(output));
    return output;
}

// * * *
// outputs only the body for a response containing a directive to play video.
// returns: string (json)
function buildVideoResponseBody(text, resourceUrl, title = "", subtitle = "", articleDate) {
    var output = {
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: text
            }
        },
        outputSpeech: {
            type: "PlainText",
            text: text
        },
        card: {
            type: "Simple",
            title: config.ui.cards.mediaOutput,
            content: text + (articleDate ? ' ' + articleDate : '')
        },
        directives: [
            {
                type: "VideoApp.Launch",
                videoItem: {
                    source: resourceUrl,
                    metadata: {
                        title: title + (articleDate ? ' ' + articleDate : ''),
                        subtitle: subtitle
                    }
                }
            }
        ]
    };
    logger.info('buildVideoResponseBody returning ' + JSON.stringify(output));
    return output;
}

// * * * 
// builds a response to stop currently-running video 
// 
// returns: string (json)
function buildVideoStopResponseBody(){
    var output = {
        card : {
            type: "Simple",
            title: config.ui.cards.pause,
            content: text
        },
        directives: [
            {
                type: "VideoApp.Stop"
            }
        ],
        shouldEndSession: "true"
    };
    logger.info('buildVideoStopResponseBody returning ' + JSON.stringify(output));
    return output;
}

// * * *
// outputs the entire response packet, given a pre-formed response body.
// returns: string (json)
function buildResponse(sessionAttributes, responseBody) {

    if (!responseBody) {
        responseBody = buildSpeechResponseBody('An error has occurred', true, 'Error', '');
    }

    //remove card if config.useCards is false
    if (responseBody && responseBody.card){
        if (!config.ui.useCards)
            responseBody.card = null;
    }

    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: responseBody
    };
}




module.exports = {
    buildSpeechResponseBody: buildSpeechResponseBody,
    buildSimpleSpeechResponseBody : buildSimpleSpeechResponseBody,
    buildSpeechPromptResponseBody : buildSpeechPromptResponseBody,
    buildAudioResponseBody: buildAudioResponseBody,
    buildVideoResponseBody: buildVideoResponseBody,
    buildResponse: buildResponse,
    buildHelpResponse : buildHelpResponse,
    buildAudioStopResponseBody : buildAudioStopResponseBody,
    buildVideoStopResponseBody : buildVideoStopResponseBody
};