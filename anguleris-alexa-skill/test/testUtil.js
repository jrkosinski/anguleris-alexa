'use strict'

const async = require('asyncawait/async');
const await = require('asyncawait/await');
const config = require('../config');
const guid = require('uuid/v4');

function getTestContext(){
    return {
        succeed : function(response){
            //globalResponse = response;
        },
        fail : function(response){
            //globalResponse = response;
        }
    };
}

var sendTestRequest = async(function sendTestRequest(request, context, handler){
    var response = await (handler.handler(request, context)); 
    return response;
});

function formVersionRequest(team, videoSupport){
    var request = {
        "session":{
            "new": false,
            "sessionId": guid()
        },
        "context": {
            "System": {
                "device":{
                    "supportedInterfaces":   {
                        "Display": videoSupport
                    }
                }
            }
        },
        "request":{
            "type": "IntentRequest",
            "requestId": guid(),
            "intent": {
                "name": config.intentNames.getVersion,
                "slots": {
                    "Team": {
                        "value": team
                    }
                }
            }
        }
    };

    return request;
}

function assert(expr){
    if (!expr)
        throw false;
}


module.exports = {
    formVersionRequest : formVersionRequest,
    assert : assert,
    sendTestRequest : sendTestRequest,
    getTestContext : getTestContext
};