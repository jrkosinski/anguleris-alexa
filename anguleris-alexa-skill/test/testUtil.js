'use strict'

const async = require('asyncawait/async');
const await = require('asyncawait/await');
const alexa = require("alexia");
const guid = require('uuid/v4');

const common = require('anguleris-common');
const exception = common.exceptions('TEST'); 

const config = require('../config');
const enums = require('../util/enums');
const app = require('../util/alexaApp').app; 

var _failedAssertions = 0;
var _succeededAssertions = 0;
var _failedTests = 0; 
var _succeededTests = 0; 
var _failedList = [];
var _failedTestsList = [];
var _failedAssertionsList = [];

function sendRequest(request) {
    return new Promise((resolve, reject) => {
        console.log(request);
        console.log(); 
        var testRequest = alexa.createRequest(request);

        app.handle(testRequest, (response) => {
            console.log(response);
            console.log(); 
            resolve(response); 
        });
    });
}

function createGetVersionRequest() {
    return {
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
    }; 
}

function createGetCategoriesRequest() {
    return {
        type: 'IntentRequest',
        name: config.intents.getCategories.name,
        slots: {},
        attrs: {},
        appId: 'amzn1.echo-sdk-123456',
        sessionId: 'SessionId.357a6s7',
        userId: 'amzn1.account.abc123',
        requestId: 'EdwRequestId.abc123456',
        timestamp: '2016-06-16T14:38:46Z',
        locale: 'en-US',
        new: false
    }; 
}

function createNavigationRequest(query, navigationCommand, startIndex) {
    
}

function assert(expr) {
    if (!expr)
        throw false;
}

const runTest = async((testName, request, assertions) => {
    exception.try(() => {
        console.log('running test ' + testName + '...');
        var response = await(sendRequest(request)); 

        var failedCount= 0;
        var successCount = 0;

        if (assertions) {            
            for (var n = 0; n < assertions.length; n++) {
                var a = assertions[n];
                exception.try(() => {
                    if (a.assert(response)) {
                        console.log('assertion ' + a.name + ' succeeded');
                        successCount++;
                    }
                    else {
                        console.log('assertion ' + a.name + ' failed');
                        _failedList.push(a.name);
                        failedCount++;
                    }
                });
            }

            console.log('test ' + testName + ':'); 
            console.log('succeeded: ' + successCount);
            console.log('failed: ' + failedCount);

            _succeededAssertions += successCount;
            _failedAssertions += failedCount;

            if (failedCount == 0)
                _succeededTests++; 
            else {
                _failedTests++;
                _failedTestsList.push(testName);
            }

            return response;
        }
    }); 
}); 

const runUnitTests = async((handler) => {
    _succeededAssertions = 0;
    _failedAssertions = 0; 
    _failedTests = 0; 
    _succeededTests = 0;
    _failedTestsList = [];
    _failedAssertionsList = [];

    //ASSERTIONS
    var assertions = {
        responseIsNotNull: {name: 'responseNotNull', assert: (r) => { 
            return r != null;
        }}, 
        hasSessionAttributes : {name: 'hasSessionAttributes', assert: (r) => { 
            return r.sessionAttributes && r.sessionAttributes.text; 
        }}, 
        hasStartIndexAttribute : {name: 'hasStartIndexAttribute', assert: (r) => { 
            return r.sessionAttributes && !common.types.isUndefinedOrNull(r.sessionAttributes.startIndex); 
        }}
    }; 

    //UNIT TESTS 
    const unitTests = [
        async(() => {
            await(runTest('get version', createGetVersionRequest(), [
                assertions.responseIsNotNull,
                assertions.hasSessionAttributes
            ])); 
        }),

        async(() => {
            await(runTest('get categories', createGetCategoriesRequest(), [
                assertions.responseIsNotNull,
                assertions.hasSessionAttributes,
                assertions.hasStartIndexAttribute
            ])); 
        })
    ];

    //RUN TESTS 
    for(var n=0; n<unitTests.length; n++) {
        await(unitTests[n]()); 
    }

    console.log();
    console.log('---------------------------------');
    console.log('total assertions succeeded: ' + _succeededAssertions);
    console.log('total assertions failed: ' + _failedAssertions);
    console.log();
    console.log('total tests succeeded: ' + _succeededTests);
    console.log('total tests failed: ' + _failedTests);

    if (_failedAssertions) {
        console.log();
        console.log('failed tests:') 
        for (var n=0; n<_failedTestsList.length; n++){
            console.log(_failedTestsList[n]);
        }
    }
    console.log('---------------------------------');
});

module.exports = {
    runUnitTests: runUnitTests
};