'use strict'

const async = require('asyncawait/async');
const await = require('asyncawait/await');
const alexa = require("alexia");
const guid = require('uuid/v4');

const config = require('../config');
const app = require('../util/alexaApp').app; 

function getTestContext() {
    return {
        succeed: function (response) {
            //globalResponse = response;
        },
        fail: function (response) {
            //globalResponse = response;
        }
    };
}

var sendTestRequest = async(function sendTestRequest(request, context, handler) {
    var response = await(handler.handler(request, context));
    return response;
});

function sendGetVersionRequest() {
    var testRequest = alexa.createRequest({
        type: 'IntentRequest',
        name: config.intents.getVersion.name,
        slots: {},
        attrs: {},
        appId: 'amzn1.echo-sdk-123456',
        sessionId: 'SessionId.357a6s7',
        userId: 'amzn1.account.abc123',
        requestId: 'EdwRequestId.abc123456',
        timestamp: '2016-06-16T14:38:46Z',
        locale: 'en-US',
        new: false
    });

    app.handle(testRequest, (response) => {
        console.log(response);
    });
}

function formVersionRequest(team, videoSupport) {
    var request = {
        "session": {
            "new": false,
            "sessionId": guid()
        },
        "context": {
            "System": {
                "device": {
                    "supportedInterfaces": {
                        "Display": videoSupport
                    }
                }
            }
        },
        "request": {
            "type": "IntentRequest",
            "requestId": guid(),
            "intent": {
                "name": config.intents.getVersion.name
            }
        }
    };

    return request;
}

function assert(expr) {
    if (!expr)
        throw false;
}


module.exports = {
    formVersionRequest: formVersionRequest,
    sendGetVersionRequest: sendGetVersionRequest,
    assert: assert,
    sendTestRequest: sendTestRequest,
    getTestContext: getTestContext
};