'use strict'; 

// ======================================================================================================
// configUtil - utilities for reading and writing application config settings.
// 
// John R. Kosinski
// 13 Jan 2018
// ------------------------------------------------------------------------------------------------------
var profile = (process.env.PROFILE || ''); 

// ------------------------------------------------------------------------------------------------------
// creates an enum with the given elements 
// 
// args
//  elementNames: an array of strings
//
// returns: a javascript object in the form { a: a, b: b }
function makeEnum(elementNames){
    var output = {};
    for(var n=0; n<elementNames.length; n++){
        output[elementNames[n]] = elementNames[n];
    }
    return output; 
}

// ------------------------------------------------------------------------------------------------------
// gets a given setting from process.env, or the given default 
// 
// returns: value
function getSetting(key, defaultValue){
    if (profile.length)
        key += '_' + profile;
    
    var value = process.env[key]; 
    if (value === null || value === undefined){
        value = defaultValue;
    }

    return value; 
}

// ------------------------------------------------------------------------------------------------------
// gets a given boolean setting from process.env, or the given default 
// 
// returns: boolean
function getBooleanSetting(key, defaultValue){
    var value = getSetting(key, defaultValue ? 'true' : 'false'); 
    return (value == 'true'); 
}

// ------------------------------------------------------------------------------------------------------
// gets a given setting from process.env, or the given default, where the value is an array
// 
// returns: array
function getArraySetting(key, defaultValue, delimiter){
    if (!delimiter)
        delimiter = ',';
    var value = getSetting(key, '');  
    
    if (value && value.length) {
        return value.split(delimiter); 
    }

    var array = defaultValue.split(delimiter);
    return array;
}

// ------------------------------------------------------------------------------------------------------
// gets the value of the loggingLevel setting 
// 
// returns: array
function getLoggingLevel(key, defaultValue) {
    var sValue = getSetting(key, defaultValue);
    var output = sValue.trim().toLowerCase();

    if (sValue != 'all' && sValue != 'none') {
        output = output.split(',');
        for(var i=0; i<output.length; i++)
            output[i] = output[i].trim();
    }

    return output; 
}

module.exports = {
    makeEnum: makeEnum,
    getSetting: getSetting,
    getBooleanSetting: getBooleanSetting,
    getArraySetting: getArraySetting,
    getLoggingLevel: getLoggingLevel
};