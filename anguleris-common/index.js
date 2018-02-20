'use strict';

// * * * * * 
// index - entry point
// 
// John R. Kosinski
// 4 Jan 2018

var config = require('./config');
var dateUtil = require('./util/dateUtil');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

//TODO: add exceptionUtil to common 

function wait(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => { resolve(true);}, ms);
    });
}

function wrapInPromise(func){
    var promise = new Promise((resolve, reject) => {
        resolve(func);
    });
    return promise;
}

function wrapInPromiseAsync(asyncFunc){
    var promise = new Promise(async((resolve, reject) => {
        resolve(await(asyncFunc()));
    }));
    return promise;
}

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
    logger: (prefix) => { return require('./util/logger')(prefix); },
    exceptions: (prefix) => { return require('./util/exceptionUtil')(prefix); },

    wait: wait, 
    waitSeconds: (s) => { return wait(s * 1000);},
    waitForCondition: waitForCondition, 

    wrapInPromise : wrapInPromise,
    wrapInPromiseAsync : wrapInPromiseAsync
};

