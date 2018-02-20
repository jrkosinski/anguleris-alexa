'use strict';

const async = require('asyncawait/async');
const await = require('asyncawait/await');
const exception = require('anguleris-common').exceptions('INDEX');
const logger = require('anguleris-common').logger('INDEX');

const config = require('./config');
const pkg = require('./package.json');


// * * *
// from the request, gets the name of the requested intent, or "" if not present.
// returns: string
function getIntentName(event) {
    var output = "";
    if (event && event.request && event.request.intent && event.request.intent.name)
        output = event.request.intent.name;
    return output;
}

// * * *
// called when the session starts.
// returns: nothing
function onSessionStarted(requestContext) {
    return exception.try(() => {
        logger.info("onSessionStarted requestId=" + requestContext.event.request.requestId
            + ", sessionId=" + requestContext.event.session.sessionId);

        // add any session init logic here
    });
}

// * * *
// called when the user invokes the skill without specifying what they want.
// returns: Alexa response body (string/json)
function onLaunch(requestContext) {
    return exception.try(() => {
        logger.info("onLaunch requestId=" + requestContext.event.request.requestId
            + ", sessionId=" + requestContext.event.session.sessionId);

        return responseBuilder.buildSpeechPromptResponseBody(
            config.ui.text.launchPrompt,
            config.ui.cards.launchPrompt,
            config.ui.text.launchReprompt
        );
    });
}

// * * *
// called when the user invokes the help intent.
// returns: Alexa response body (string/json)
//TODO: how to serve Help (what info to include)
function onHelpIntent(requestContext) {
    return exception.try(() => {
        logger.info("onHelpIntent requestId=" + requestContext.event.request.requestId
            + ", sessionId=" + requestContext.event.session.sessionId);

        return responseBuilder.buildHelpResponse();
    });
}

// * * *
// called when the user invokes the pause intent.
// returns: Alexa response body (string/json)
function onPauseIntent(requestContext) {
    return exception.try(() => {
        logger.info("onPauseIntent requestId=" + requestContext.event.request.requestId
            + ", sessionId=" + requestContext.event.session.sessionId);

    });
}

// * * *
// called when the user invokes the stop intent.
// returns: Alexa response body (string/json)
function onStopIntent(requestContext) {
    return exception.try(() => {
        logger.info("onStopIntent requestId=" + requestContext.event.request.requestId
            + ", sessionId=" + requestContext.event.session.sessionId);

        return responseBuilder.buildAudioStopResponseBody(requestContext.event.context.AudioPlayer.token);
    });
}

// * * *
// called when the user ends the session.
// returns: nothing
function onSessionEnded(requestContext) {
    return exception.try(() => {
        logger.info("onSessionEnded requestId=" + requestContext.event.request.requestId
            + ", sessionId=" + requestContext.event.session.sessionId);
        // Add any cleanup logic here
    });
}

// * * *
// called when the user invokes the Get Version intent.
// returns: Alexa response body (string/json)
function onGetVersionIntent(requestContext) {
    return exception.try(() => {
        logger.info("onGetVersionIntent requestId=" + requestContext.event.request.requestId
            + ", sessionId=" + requestContext.event.session.sessionId);

        var versionText = config.ui.text.getVersion.replace('{version}', pkg.version);
        return responseBuilder.buildSimpleSpeechResponseBody(versionText, config.ui.cards.getVersion);
    });
}

// * * *
// called when the user specifies an intent for this skill.
// returns: Alexa response body (string/json)
var onIntent = async(function onIntent(requestContext) {
    logger.info("onIntent requestId=" + requestContext.event.request.requestId
        + ", sessionId=" + requestContext.event.session.sessionId);

    if (requestContext.intentName === config.intentNames.getVersion) {
        return onGetVersionIntent(requestContext);
    }

    return responseBuilder.buildSimpleSpeechResponseBody(config.ui.text.unknownIntent, config.ui.cards.unkonwnIntent);
});

// * * *
// from the request, determines whether the user's device supports playing video.
// returns: boolean
function deviceSupportsVideo(event) {
    var output = false;
    if (config.alwaysVideo)
        return true;

    if (event && event.context &&
        event.context.System &&
        event.context.System.device &&
        event.context.System.device.supportedInterfaces) {
        output = event.context.System.device.supportedInterfaces.Display;
    }
    return output;
}

// * * *
// entry point
// returns: nothing
exports.handler = async(function (event, context) {
    try {
        //restrict by app id 
        if (config.clientSkillId) {
            if (event.session.application.applicationId !== config.clientSkillId) {
                context.fail("Invalid Application ID");
            }
        }

        logger.info('request received: ' + JSON.stringify(event));
        logger.info('context: ' + JSON.stringify(context));

        //request content: this gets passed around to all subordinate calls 
        var requestContext = {
            id: event.request.requestId,
            videoSupported: deviceSupportsVideo(event),
            sessionAttributes: {},
            error: '',
            event: event,
            context: context,
            intentName: getIntentName(event)
        };

        if (event && event.session && event.session.attributes)
            requestContext.sessionAttributes = event.session.attributes;

        var responseBody = {};

        if (event && event.session && event.session.new) {
            logger.info('Session is new');
            onSessionStarted(requestContext);
        }

        //TODO: handle launch request
        if (event.request.type === "LaunchRequest") {
            logger.info('LaunchRequest received');
            responseBody = onLaunch(requestContext);
        }
        else if (event.request.type === "IntentRequest") {
            logger.info('IntentRequest received');
            responseBody = await(onIntent(requestContext));
        }
        else if (event.request.type === "SessionEndedRequest") {
            logger.info('SessionEndedRequest received');
            onSessionEnded(requestContext);
            context.succeed();
        }

        var output = null;
        if (requestContext.error) {
            responseBody = responseBuilder.buildSimpleSpeechResponseBody(config.ui.text.generalError, config.ui.cards.generalError);
        }

        output = responseBuilder.buildResponse(requestContext.sessionAttributes, responseBody);
        logger.info('Returning: ' + JSON.stringify(output));

        context.succeed(output);
    }
    catch (e) {
        logger.error(e);
        responseBody = responseBuilder.buildSimpleSpeechResponseBody(config.ui.text.generalError, config.ui.cards.generalError);
        output = responseBuilder.buildResponse(requestContext.sessionAttributes, responseBody);
        context.succeed(output);
    }
});