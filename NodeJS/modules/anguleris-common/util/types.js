'use strict'; 

// ====================================================================================================== 
// types - equality comparisons and related utilities.
// 
// John R. Kosinski
// 13 Jan 2018
// ------------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------------
// returns true if the given value is not undefined
function isDefined(v) {
    return ( typeof v !== 'undefined');
}

// ------------------------------------------------------------------------------------------------------
// returns true if the given value is null
function isNull(v) {
    return v === null;
}

// ------------------------------------------------------------------------------------------------------
// returns true if the given value is a function
function isFunction(v) {
    var getType = {};
    return v && getType.toString.call(v) === '[object Function]';
}

// ------------------------------------------------------------------------------------------------------
// returns true if the given value is an array
function isArray(v) {
    return Array.isArray(v);
}

// ------------------------------------------------------------------------------------------------------
// returns true if the given value is an object type 
function isObject(v) {  
    if (v === null) { return false;}
    return ( (typeof v === 'function') || (typeof v === 'object') );
}

// ------------------------------------------------------------------------------------------------------
// attempts to convert the given value to an integer, returning 0 by default
//
// returns: integer 
function tryParseInt(v) {
     var output = 0;
     if(isDefined(v) && !isNull(v)) {
         v = v.toString();
         if(v.length > 0) {
             if (!isNaN(v)) {
                 output = parseInt(v);
             }
         }
     }
     return output;
}

// ------------------------------------------------------------------------------------------------------
// attempts to convert the given value to a float, returning 0 by default
//
// returns: float 
function tryParseFloat(v) {
     var output = 0;
     if(isDefined(v) && !isNull(v)) {
         if(v.length > 0) {
             if (!isNaN(v)) {
                 output = parseFloat(v);
             }
         }
     }
     return output;
}

// ------------------------------------------------------------------------------------------------------
// attempts to get a property value from the given json object. If any property in the string is 
// null or undefined, returns null. 
//
// args
//  obj: any json object 
//  property: string in the form 'property1.property2.property3' 
//
// returns: value or null 
function getDeepPropertyValue(obj, property) {
    var output = null; 

    var props = property.split('.'); 
    for (var n=0; n<props.length; n++) {
        var p = props[n];
        if (isDefined(obj[p]) && !isNull(obj[p])) {
            obj = obj[p]; 
            if (n === props.length-1)
                output = obj;
        }
        else
            break;
    }

    return output; 
}


module.exports = {
    isDefined: isDefined,
    isUndefined: (v) => { return !isDefined(v);},
    isNull: isNull, 
    isUndefinedOrNull: (v) => { return !isDefined(v) || isNull(v); },
    isFunction : isFunction,
    isArray: isArray,
    isObject: isObject,
	tryParseInt: tryParseInt,
	tryParseFloat: tryParseFloat,
    getDeepPropertyValue: getDeepPropertyValue
}