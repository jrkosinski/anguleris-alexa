'use strict'

// ====================================================================================================== 
// testUtil - unit tests (run from test.js as entry point)
// 
// Anguleris Technologies
// John R. Kosinski
//
// 22 Feb 2018
// ------------------------------------------------------------------------------------------------------
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const alexa = require("alexia");
const guid = require('uuid/v4');

const common = require('anguleris-common');
const exception = common.exceptions('TEST'); 
const enums = common.enums;

const config = require('../config');
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

function createIntentRequest(intentName, attrs, slots) {
    if (!slots)
        slots = {};
    if (!attrs)
        attrs = {};

    return {
        type: 'IntentRequest',
        name: intentName,
        slots: slots,
        attrs: attrs,
        appId: 'amzn1.echo-sdk-123456',
        sessionId: 'SessionId.357a6s7',
        userId: 'amzn1.account.abc123',
        requestId: 'EdwRequestId.abc123456',
        timestamp: '2016-06-16T14:38:46Z',
        locale: 'en-US',
        new: false
    }; 
}

function createNavIntentRequest(intentName, querySubject, startIndex, entity, queryParams) {    
    return createIntentRequest(
        intentName, 
        { querySubject: querySubject, startIndex:startIndex, queryParams:queryParams },
        { entity:entity}
    );
}

function createManufacturersForCategoryRequest(parameter, startIndex) {
    return createIntentRequest(
        config.intents.getManufacturersForCategory.name, 
        { querySubject: enums.querySubject.manufacturers, startIndex:startIndex, queryParams:{category:parameter} },
        { category:parameter}
    );
}

function createCategoriesForManufacturerRequest(parameter, startIndex) {
    return createIntentRequest(
        config.intents.getCategoriesForManufacturer.name, 
        { querySubject: enums.querySubject.categories, startIndex:startIndex, queryParams:{category:parameter} },
        { manufacturer:parameter}
    );
}

function createNavigationRequest(querySubject, navigationCommand, startIndex, parameters) {
    var intentNames = {}; 
    intentNames[enums.navigationCommand.next] = config.intents.moveNext.name;
    intentNames[enums.navigationCommand.prev] = config.intents.movePrev.name;
    intentNames[enums.navigationCommand.moveFirst] = config.intents.moveFirst.name;
    intentNames[enums.navigationCommand.stop] = config.intents.stop.name;

    return createNavIntentRequest(
        intentNames[navigationCommand], 
        querySubject, startIndex, null, parameters
    );
}

function createDetailsRequest(querySubject, parameter, startIndex) {
    return createIntentRequest(
        config.intents.getDetails.name, 
        { querySubject: querySubject, startIndex:startIndex},
        { entity: parameter }
    );
}

function createRepeatRequest(querySubject, parameter, startIndex, text) {
    return createIntentRequest(
        config.intents.repeat.name, 
        { querySubject: querySubject, startIndex:startIndex, text:text},
        { entity: parameter }
    );
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
                    var r = a.assert(response);
                    if (r) {
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
            await(runTest('get version', createIntentRequest(config.intents.getVersion.name), [
                assertions.responseIsNotNull
            ])); 
        }),

        //get categories
        async(() => {
            await(runTest('get categories', createIntentRequest(config.intents.getCategories.name), [
                assertions.responseIsNotNull,
                assertions.hasSessionAttributes,
                assertions.hasStartIndexAttribute
            ])); 
        }),

        /*
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
            await(runTest('get manufacturers', createIntentRequest(config.intents.getManufacturers.name), [
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

        //category details (Ceilings)
        async(() => {
            var request = createDetailsRequest(enums.querySubject.categories, 'Ceilings', 5); 
            await(runTest('category details (Ceilings)', request, [
                assertions.responseIsNotNull,
                assertions.hasSessionAttributes,
                assertions.hasStartIndexAttribute,
                assertions.listIndexIsExpected(5)
            ])); 
        }),

        //repeat 
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

        //manufacturers for category (Ceilings)
        async(() => {
            var request = createManufacturersForCategoryRequest('Ceilings', 5); 
            await(runTest('manufacturers for category (Ceilings)', request, [
                assertions.responseIsNotNull,
                assertions.hasSessionAttributes,
                assertions.hasStartIndexAttribute,
                assertions.listIndexIsExpected(5)
            ])); 
        }), 

        //categories for manufacturer (Kenmore)
        async(() => {
            var request = createCategoriesForManufacturerRequest('Kenmore', 5); 
            await(runTest('categories for manufacturer (Kenmore)', request, [
                assertions.responseIsNotNull,
                assertions.hasSessionAttributes,
                assertions.hasStartIndexAttribute,
                assertions.listIndexIsExpected(5)
            ])); 
        }), 

        //manufacturer phone (Kenmore)
        async(() => {
            var request = createIntentRequest(config.intents.getManufacturerPhone.name, 
                {querySubject:'manufacturers', startIndex:5}, 
                {manufacturer:'Kenmore'}
            );

            await(runTest('manufacturer phone (Kenmore)', request, [
                assertions.responseIsNotNull,
                assertions.hasSessionAttributes,
                assertions.hasStartIndexAttribute,
                assertions.listIndexIsExpected(5)
            ])); 
        }), 

        //manufacturer address (Kenmore)
        async(() => {
            var request = createIntentRequest(config.intents.getManufacturerAddress.name, 
                {querySubject:'manufacturers', startIndex:5}, 
                {manufacturer:'Kenmore'}
            );
            await(runTest('manufacturer address (Kenmore)', request, [
                assertions.responseIsNotNull,
                assertions.hasSessionAttributes,
                assertions.hasStartIndexAttribute,
                assertions.listIndexIsExpected(5)
            ])); 
        }), 

        //manufacturer details (Kenmore)
        async(() => {
            var request = createDetailsRequest(enums.querySubject.manufacturers, 'Kenmore', 5); 
            await(runTest('manufacturer details (Kenmore)', request, [
                assertions.responseIsNotNull,
                assertions.hasSessionAttributes,
                assertions.hasStartIndexAttribute,
                assertions.listIndexIsExpected(5)
            ])); 
        }), 

        //products for category (Optical Turnstiles)
        async(() => {
            var request = createNavIntentRequest(config.intents.getProducts.name, enums.querySubject.categories, 5, 'Optical Turnstiles'); 
            await(runTest('products for category (Optical Turnstiles)', request, [
                assertions.responseIsNotNull,
                assertions.hasSessionAttributes,
                assertions.hasStartIndexAttribute,
                assertions.listIndexIsExpected(0)
            ])); 
        }), 

        //products move next 1
        async(() => {
            var request = createNavigationRequest(enums.querySubject.products, enums.navigationCommand.next, 0, {category:'Optical Turnstiles'}); 
            await(runTest('products next 1', request, [
                assertions.responseIsNotNull,
                assertions.hasSessionAttributes,
                assertions.hasStartIndexAttribute,
                assertions.listIndexIsExpected(1)
            ])); 
        }),

        //products for manufacturer
        async(() => {
            var request = createNavIntentRequest(config.intents.getProducts.name, enums.querySubject.manufacturers, 5, 'Boon Edam USA'); 
            await(runTest('products for manufacturer (Boon Edam USA)', request, [
                assertions.responseIsNotNull,
                assertions.hasSessionAttributes,
                assertions.hasStartIndexAttribute,
                assertions.listIndexIsExpected(0)
            ])); 
        }), 

        //products for manufacturer none
        async(() => {
            var request = createNavIntentRequest(config.intents.getProducts.name, enums.querySubject.manufacturers, 1, 'Behr'); 
            await(runTest('products for manufacturer (Behr)', request, [
                assertions.responseIsNotNull,
                assertions.hasSessionAttributes,
                assertions.hasStartIndexAttribute,
                assertions.listIndexIsExpected(1)
            ])); 
        }), 

        //product details 
        async(() => {
            var request = createNavIntentRequest(config.intents.getProducts.name, enums.querySubject.manufacturers, 1, 'Boon Edam USA');
            await(runTest('product details', request, [
                assertions.responseIsNotNull,
                assertions.hasSessionAttributes,
                assertions.hasStartIndexAttribute,
                assertions.listIndexIsExpected(1)
            ])); 
        }), 

        //mfg product count (Boon Edam USA)
        async(() => {
            var request = createNavIntentRequest(config.intents.getProductsCount.name, enums.querySubject.manufacturers, 1, 'Boon Edam USA');
            await(runTest('mfg product count (Boon Edam USA)', request, [
                assertions.responseIsNotNull,
                assertions.hasSessionAttributes
            ])); 
        }), 

        //mfg product count (Behr)
        async(() => {
            var request = createNavIntentRequest(config.intents.getProductsCount.name, enums.querySubject.manufacturers, 1, 'Behr');
            await(runTest('mfg product count (Behr)', request, [
                assertions.responseIsNotNull,
                assertions.hasSessionAttributes
            ])); 
        }), 

        //list all product features (speedlane slide)
        async(() => {
            var request = createIntentRequest(config.intents.getAllProductFeatures.name, 
            {startIndex:0, querySubject:enums.querySubject.products, queryParams: {manufacturer:'Boon Edam USA'}},
            {product:'speed lane slide by Boon Edam USA'});
            await(runTest('list all product features (speedlane slide)', request, [
                assertions.responseIsNotNull,
                assertions.hasSessionAttributes
            ])); 
        }), 

        //mfg product features (color) by mfg
        async(() => {
            var request = createIntentRequest(config.intents.getProductFeatureValues.name, 
            {startIndex:0, querySubject:enums.querySubject.products, queryParams: {manufacturer:'Boon Edam USA'}},
            {entity:'Boon Edam USA', feature:'colors'});
            await(runTest('mfg product features (color) by mfg', request, [
                assertions.responseIsNotNull,
                assertions.hasSessionAttributes
            ])); 
        }), 

        //mfg product features (color) by name
        async(() => {
            var request = createIntentRequest(config.intents.getProductFeatureValues.name, 
            {startIndex:0, querySubject:enums.querySubject.products},
            {product:'Speed lane Slide', feature:'color'});
            await(runTest('mfg product features (color) by name', request, [
                assertions.responseIsNotNull,
                assertions.hasSessionAttributes
            ])); 
        }) ,

        //product query by feature value
        async(() => {
            var request = createIntentRequest(config.intents.queryProductByFeature.name, 
            {startIndex:0, querySubject:enums.querySubject.products},
            {category:'Dishwashers', feature:'finish', featureValue:'metallic'});
            await(runTest('product query by feature value', request, [
                assertions.responseIsNotNull,
                assertions.hasSessionAttributes
            ])); 
        }),

        //feature values by category (dishwashers)
        async(() => {
            var request = createIntentRequest(config.intents.getColorsForCategory.name, 
            {startIndex:0, querySubject:enums.querySubject.products},
            {category:'Dishwashers' });
            await(runTest('feature values by category (dishwashers)', request, [
                assertions.responseIsNotNull,
                assertions.hasSessionAttributes
            ])); 
        }),

        //feature values by category (optical turnstiles)
        async(() => {
            var request = createIntentRequest(config.intents.getHeightsForCategory.name, 
            {startIndex:0, querySubject:enums.querySubject.products},
            {category:'Optical Turnstiles' });
            await(runTest('feature values by category (optical turnstiles)', request, [
                assertions.responseIsNotNull,
                assertions.hasSessionAttributes
            ])); 
        }),
        */

        //call support
        async(() => {
            var request = createIntentRequest(config.intents.callBimsmithSupport.name, 
            {},
            {});
            await(runTest('call support', request, [
                assertions.responseIsNotNull
            ])); 
        }),

        //call manufacturer
        async(() => {
            var request = createIntentRequest(config.intents.callManufacturer.name, 
            {},
            { manufacturer: 'kenmore' });
            await(runTest('call manufacturer', request, [
                assertions.responseIsNotNull
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