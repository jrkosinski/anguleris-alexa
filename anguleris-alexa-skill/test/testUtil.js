'use strict'

// * * * * * 
// testUtil - unit tests (run from test.js as entry point)
// 
// Anguleris Technologies
// John R. Kosinski
//
// 22 Feb 2018
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

function createGetManufacturersRequest() {
    return {
        type: 'IntentRequest',
        name: config.intents.getManufacturers.name,
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

function createManufacturersForCategoryRequest(querySubject, parameter, startIndex) {
    return {
        type: 'IntentRequest',
        name: config.intents.getManufacturersForCategory.name,
        slots: { entity: parameter },
        attrs: { querySubject: querySubject, startIndex:startIndex},
        appId: 'amzn1.echo-sdk-123456',
        sessionId: 'SessionId.357a6s7',
        userId: 'amzn1.account.abc123',
        requestId: 'EdwRequestId.abc123456',
        timestamp: '2016-06-16T14:38:46Z',
        locale: 'en-US',
        new: false
    }; 
}

function createCategoriesForManufacturerRequest(querySubject, parameter, startIndex) {
    return {
        type: 'IntentRequest',
        name: config.intents.getCategoriesForManufacturer.name,
        slots: { entity: parameter },
        attrs: { querySubject: querySubject, startIndex:startIndex},
        appId: 'amzn1.echo-sdk-123456',
        sessionId: 'SessionId.357a6s7',
        userId: 'amzn1.account.abc123',
        requestId: 'EdwRequestId.abc123456',
        timestamp: '2016-06-16T14:38:46Z',
        locale: 'en-US',
        new: false
    }; 
}

function createNavigationRequest(querySubject, navigationCommand, startIndex) {
    var intentNames = {}; 
    intentNames[enums.navigationCommand.next] = config.intents.moveNext.name;
    intentNames[enums.navigationCommand.prev] = config.intents.movePrev.name;
    intentNames[enums.navigationCommand.moveFirst] = config.intents.moveFirst.name;
    intentNames[enums.navigationCommand.stop] = config.intents.stop.name;

    return {
        type: 'IntentRequest',
        name: intentNames[navigationCommand],
        slots: {},
        attrs: { querySubject: querySubject, startIndex: startIndex},
        appId: 'amzn1.echo-sdk-123456',
        sessionId: 'SessionId.357a6s7',
        userId: 'amzn1.account.abc123',
        requestId: 'EdwRequestId.abc123456',
        timestamp: '2016-06-16T14:38:46Z',
        locale: 'en-US',
        new: false
    }; 
}

function createDetailsRequest(querySubject, parameter, startIndex) {
    return {
        type: 'IntentRequest',
        name: config.intents.getDetails.name,
        slots: { entity: parameter},
        attrs: { querySubject: querySubject, startIndex: startIndex},
        appId: 'amzn1.echo-sdk-123456',
        sessionId: 'SessionId.357a6s7',
        userId: 'amzn1.account.abc123',
        requestId: 'EdwRequestId.abc123456',
        timestamp: '2016-06-16T14:38:46Z',
        locale: 'en-US',
        new: false
    }; 
}

function createRepeatRequest(querySubject, parameter, startIndex, text) {
    return {
        type: 'IntentRequest',
        name: config.intents.repeat.name,
        slots: { entity: parameter},
        attrs: { querySubject: querySubject, startIndex: startIndex, text:text},
        appId: 'amzn1.echo-sdk-123456',
        sessionId: 'SessionId.357a6s7',
        userId: 'amzn1.account.abc123',
        requestId: 'EdwRequestId.abc123456',
        timestamp: '2016-06-16T14:38:46Z',
        locale: 'en-US',
        new: false
    }; 
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
        }},
        listIndexIsExpected: (value) => {
            return {
                name: 'listIndexIsExpected:' + value, assert: (r) => {
                    return r.sessionAttributes && 
                        !common.types.isUndefinedOrNull(r.sessionAttributes.startIndex && 
                        r.sessionAttributes.startIndex === value); 
                }
            }
        },
        textIsExpected: (value) => {
            return {
                name: 'textIsExpected:' + value, assert: (r) => {
                    return r.sessionAttributes && 
                        !common.types.isUndefinedOrNull(r.sessionAttributes.text && 
                        r.response.outputSpeech.text === value && 
                        r.sessionAttributes.text === value); 
                }
            }
        }
    }; 

    //UNIT TESTS 
    const unitTests = [
        //get version
        async(() => {
            await(runTest('get version', createGetVersionRequest(), [
                assertions.responseIsNotNull,
                assertions.hasSessionAttributes
            ])); 
        }),

        //get categories
        async(() => {
            await(runTest('get categories', createGetCategoriesRequest(), [
                assertions.responseIsNotNull,
                assertions.hasSessionAttributes,
                assertions.hasStartIndexAttribute
            ])); 
        }),

        //categories move next 1
        async(() => {
            var request = createNavigationRequest(enums.querySubject.categories, enums.navigationCommand.next, 0); 
            await(runTest('categories next 1', request, [
                assertions.responseIsNotNull,
                assertions.hasSessionAttributes,
                assertions.hasStartIndexAttribute,
                assertions.listIndexIsExpected(config.listOutputGroupSize)
            ])); 
        }),

        //categories move next 2
        async(() => {
            var request = createNavigationRequest(enums.querySubject.categories, enums.navigationCommand.next, config.listOutputGroupSize); 
            await(runTest('categories next 2', request, [
                assertions.responseIsNotNull,
                assertions.hasSessionAttributes,
                assertions.hasStartIndexAttribute,
                assertions.listIndexIsExpected(config.listOutputGroupSize * 2)
            ])); 
        }),

        //categories move next 3
        async(() => {
            var request = createNavigationRequest(enums.querySubject.categories, enums.navigationCommand.next, config.listOutputGroupSize * 2); 
            await(runTest('categories next 3', request, [
                assertions.responseIsNotNull,
                assertions.hasSessionAttributes,
                assertions.hasStartIndexAttribute,
                assertions.listIndexIsExpected(config.listOutputGroupSize * 3)
            ])); 
        }),

        //categories move next 4
        async(() => {
            var request = createNavigationRequest(enums.querySubject.categories, enums.navigationCommand.next, config.listOutputGroupSize * 3); 
            await(runTest('categories next 3', request, [
                assertions.responseIsNotNull,
                assertions.hasSessionAttributes,
                assertions.hasStartIndexAttribute,
                assertions.listIndexIsExpected(config.listOutputGroupSize * 4)
            ])); 
        }),

        //categories move next 5
        async(() => {
            var request = createNavigationRequest(enums.querySubject.categories, enums.navigationCommand.next, config.listOutputGroupSize * 4); 
            await(runTest('categories next 3', request, [
                assertions.responseIsNotNull,
                assertions.hasSessionAttributes,
                assertions.hasStartIndexAttribute,
                assertions.listIndexIsExpected(0)
            ])); 
        }),

        //categories move prev 1 
        async(() => {
            var request = createNavigationRequest(enums.querySubject.categories, enums.navigationCommand.prev, 0); 
            await(runTest('categories prev 1', request, [
                assertions.responseIsNotNull,
                assertions.hasSessionAttributes,
                assertions.hasStartIndexAttribute,
                assertions.listIndexIsExpected(config.listOutputGroupSize)
            ])); 
        }),

        //categories move next 6
        async(() => {
            var request = createNavigationRequest(enums.querySubject.categories, enums.navigationCommand.next, 0); 
            await(runTest('categories next 1', request, [
                assertions.responseIsNotNull,
                assertions.hasSessionAttributes,
                assertions.hasStartIndexAttribute,
                assertions.listIndexIsExpected(config.listOutputGroupSize)
            ])); 
        }),

        //categories move next 7
        async(() => {
            var request = createNavigationRequest(enums.querySubject.categories, enums.navigationCommand.next, config.listOutputGroupSize); 
            await(runTest('categories next 1', request, [
                assertions.responseIsNotNull,
                assertions.hasSessionAttributes,
                assertions.hasStartIndexAttribute,
                assertions.listIndexIsExpected(config.listOutputGroupSize * 2)
            ])); 
        }),

        //categories start over 1
        async(() => {
            var request = createNavigationRequest(enums.querySubject.categories, enums.navigationCommand.moveFirst, 0); 
            await(runTest('categories moveFirst 1', request, [
                assertions.responseIsNotNull,
                assertions.hasSessionAttributes,
                assertions.hasStartIndexAttribute,
                assertions.listIndexIsExpected(0)
            ])); 
        }),

        //categories start over 2
        async(() => {
            var request = createNavigationRequest(enums.querySubject.categories, enums.navigationCommand.moveFirst, 0); 
            await(runTest('categories moveFirst 2', request, [
                assertions.responseIsNotNull,
                assertions.hasSessionAttributes,
                assertions.hasStartIndexAttribute,
                assertions.listIndexIsExpected(0)
            ])); 
        }),
        

        //get manufacturers
        async(() => {
            await(runTest('get manufacturers', createGetManufacturersRequest(), [
                assertions.responseIsNotNull,
                assertions.hasSessionAttributes,
                assertions.hasStartIndexAttribute
            ])); 
        }),

        //manufacturers move next 1
        async(() => {
            var request = createNavigationRequest(enums.querySubject.manufacturers, enums.navigationCommand.next, 0); 
            await(runTest('manufacturers next 1', request, [
                assertions.responseIsNotNull,
                assertions.hasSessionAttributes,
                assertions.hasStartIndexAttribute,
                assertions.listIndexIsExpected(config.listOutputGroupSize)
            ])); 
        }),

        //manufacturers move next 2
        async(() => {
            var request = createNavigationRequest(enums.querySubject.manufacturers, enums.navigationCommand.next, config.listOutputGroupSize); 
            await(runTest('manufacturers next 2', request, [
                assertions.responseIsNotNull,
                assertions.hasSessionAttributes,
                assertions.hasStartIndexAttribute,
                assertions.listIndexIsExpected(config.listOutputGroupSize * 2)
            ])); 
        }),

        //manufacturers start over 1
        async(() => {
            var request = createNavigationRequest(enums.querySubject.manufacturers, enums.navigationCommand.moveFirst, 0); 
            await(runTest('manufacturers moveFirst 1', request, [
                assertions.responseIsNotNull,
                assertions.hasSessionAttributes,
                assertions.hasStartIndexAttribute,
                assertions.listIndexIsExpected(0)
            ])); 
        }),

        //category details 1
        async(() => {
            var request = createDetailsRequest(enums.querySubject.categories, 'Ceilings', 5); 
            await(runTest('category details 1', request, [
                assertions.responseIsNotNull,
                assertions.hasSessionAttributes,
                assertions.hasStartIndexAttribute,
                assertions.listIndexIsExpected(5)
            ])); 
        }),

        //repeat 1
        async(() => {
            var request = createRepeatRequest(enums.querySubject.categories, 'Ceilings', 5, "abc 123"); 
            await(runTest('repeat 1', request, [
                assertions.responseIsNotNull,
                assertions.hasSessionAttributes,
                assertions.hasStartIndexAttribute,
                assertions.listIndexIsExpected(5),
                assertions.textIsExpected("abc 123")
            ])); 
        }),

        //manufacturers for category 1
        async(() => {
            var request = createManufacturersForCategoryRequest(enums.querySubject.manufacturers, 'Ceilings', 5); 
            await(runTest('manufacturers for category 1', request, [
                assertions.responseIsNotNull,
                assertions.hasSessionAttributes,
                assertions.hasStartIndexAttribute,
                assertions.listIndexIsExpected(5)
            ])); 
        }), 

        //categories for manufacturer 1
        async(() => {
            var request = createCategoriesForManufacturerRequest(enums.querySubject.categories, 'Kenmore', 5); 
            await(runTest('categories for manufacturer 1', request, [
                assertions.responseIsNotNull,
                assertions.hasSessionAttributes,
                assertions.hasStartIndexAttribute,
                assertions.listIndexIsExpected(5)
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