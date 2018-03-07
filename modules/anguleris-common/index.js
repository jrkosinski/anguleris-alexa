'use strict';

// * * * * * 
// anguleris-common
// 
// common & generic utilities for the suite of node-based Anguleris software. 
// 
// Anguleris Technologies
// John R. Kosinski
// 
// 24 Jan 2018
var config = require('./config');
var dateUtil = require('./util/dateUtil');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

// * * * 
// waits a given number of milliseconds
//
// args
//  ms: number of milliseconds to wait 
// 
// returns: Promise
function wait(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => { resolve(true);}, ms);
    });
}

// * * * 
// wraps the given function inside of a promise & returns a promise that resolves to the 
// return value of the given function. 
//
// args
//  func: the lambda to wrap 
// 
// returns: Promise
function wrapInPromise(func){
    var promise = new Promise((resolve, reject) => {
        resolve(func);
    });
    return promise;
}

// * * * 
// wraps the given async function inside of a promise & returns a promise that resolves to the 
// return value of the awaited given function. 
//
// args
//  func: the async lambda to wrap 
// 
// returns: Promise
function wrapInPromiseAsync(asyncFunc){
    var promise = new Promise(async((resolve, reject) => {
        resolve(await(asyncFunc()));
    }));
    return promise;
}

// * * * 
// patiently waits for a given condition to be true, checking the condition every given interval. 
// Optionally can timeout after a given number of seconds.
//
// args
//  conditionFunction: lambda that returns a value when true, the promise resolves 
//  intervalSeconds: number of seconds between checking the condition function
//  timeoutSeconds: optional number of seconds before waiting times out 
// 
// returns: Promise that resolves to true when the condition becomes true, false on timeout
function waitForCondition(conditionFunction, intervalSeconds, timeoutSeconds) {
    return new Promise((resolve, reject) => {
        var timestamp = dateUtil.getUnixTimestamp();

        var id = setInterval(async(() => {
            if (await(conditionFunction())) {
                clearInterval(id);
                resolve(true);
            }
            var now = dateUtil.getUnixTimestamp();
            var diff = (now - timestamp);
            if (timeoutSeconds){
                if (diff >= timeoutSeconds){
                    clearInterval(id);
                    resolve(false);
                }                
            }
        }), intervalSeconds * 1000);
    });
}

module.exports = {
    strings: require('./util/stringUtil'),
    dates: require('./util/dateUtil'),
    config: require('./util/configUtil'),
    types: require('./util/types'), 
    enums: require('./util/enums'), 
    arrays: require('./util/arrayUtil'), 
    logger: (prefix) => { return require('./util/logger')(prefix); },
    exceptions: (prefix) => { return require('./util/exceptionUtil')(prefix); },

    wait: wait, 
    waitSeconds: (s) => { return wait(s * 1000);},
    waitForCondition: waitForCondition, 

    wrapInPromise : wrapInPromise,
    wrapInPromiseAsync : wrapInPromiseAsync
};

