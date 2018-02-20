
// * * * * * 
// types - equality comparisons and related utilities.
// 
// John R. Kosinski
// 13 Jan 2018
function isDefined(v) {
    return ( typeof v !== 'undefined');
}

function isNull(v) {
    return v === null;
}

function isFunction(v) {
    var getType = {};
    return v && getType.toString.call(v) === '[object Function]';
}

function isArray(v) {
    return Array.isArray(v);
}

function isObject(v) {  
    if (v === null) { return false;}
    return ( (typeof v === 'function') || (typeof v === 'object') );
}

function tryParseInt(v) {
     var output = 0;
     if(v !== null) {
         if(v.length > 0) {
             if (!isNaN(v)) {
                 output = parseInt(v);
             }
         }
     }
     return output;
}

function tryParseFloat(v) {
     var output = 0;
     if(v !== null) {
         if(v.length > 0) {
             if (!isNaN(v)) {
                 output = parseFloat(v);
             }
         }
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
	tryParseFloat: tryParseFloat
}