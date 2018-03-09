'use strict'; 

const types = require('./types'); 

// * * * * * 
// arrayUtil
// 
// Anguleris Technologies
// John R. Kosinski
//
// 22 Feb 2018
const configUtil = require('./configUtil'); 

// * * * 
// removes item at the specified index 
// NOTE: removes the original array 
// 
// args
//  n: the index at which to remove 
// 
// returns: pointer to array 
function removeAt(array, n) {
    if (array) {
        if (array.length > n)
            return array.splice(n, 1); 
    }
    return array;
}; 

// * * * 
// clears all items from array 
// NOTE: modifies original array 
//
// returns: pointer to array 
function clear (array) {
    if (array) {
        this.splice(0, array.length); 
    }
    return array;
};

// * * * 
// gets the first item in the array, or null. 
//
// returns: array item
function firstOrDefault(array) {
    return array && array[0] ? array[0] : null;
};

// * * * 
// gets all elements of the array that match the given query. 
// 
// args
//  query: a function in the form (item) => { return boolean }; returns true 
//      if the item is a match and should be returned
//
// returns: array 
function where(array, query) {
    var output = [];
    if (array) {
        for (var n=0; n<array.length; n++){
            if (query(array[n]))
                output.push(array[n]); 
        }
    }
    return output; 
};

// * * * 
// determines whether the at least one element matching the query exists in the 
// array. 
//
// args
//  query: a function in the form (item) => { return boolean }; returns true 
//      if the item is a match and should be returned
//
// returns: boolean 
function exists (array, query) {
    if (array) {
        var w = where(array, query); 
        return (w && w.length);
    }
    
    return false;
};

// * * * 
// selects a given property from each element of the array, and returns those properties in 
// a new array. 
// 
// args
//  propName: the property name 
//
// returns: array 
function select(array, propName) {
    var output = [];
    if (array) {
        for (var n=0; n<array.length; n++){
            var value = array[n][propName]; 
            if (!types.isUndefinedOrNull(value))
                output.push(value); 
        }
    }

    return output; 
}

// * * * 
// removes each element that satisfies the given query. Returns the resulting array.
// NOTE: modifies the array passed in.
//
// args
//  condition: a function in the form (item) => { return boolean }; returns true 
//      if the item is a match and should be returned
//
// returns: array 
function removeWhere(array, condition) {
    if (array) {
        for (var n=array.length-1; n>=0; n--){
            if (condition(array[n])){
                removeAt(array, n); 
            }
        }
    }
    return array; 
};

// * * * 
// removes all elements that are null or undefined. 
// NOTE: modifies original array
//
// returns: array
function removeWhereNullOrUndefined(array) {
    if (array) {
        return removeWhere(array, (i) => {
            return types.isUndefinedOrNull(i); 
        }); 
    }
    return null;
};

// * * * 
// merges both given arrays into one new array with no duplicates, and returns that new array. 
//
// args
//  equalityComparison: function in the form (element1, element2) => { return bool }
//      to check for equality of elements (ensure uniqueness in resulting array)
//
// returns: new array 
function merge(array1, array2, equalityComparison) {
    var output = [];

    if (!equalityComparison)
        equalityComparison = (a, b) => { return a === b}; 

    const addFromArray = (array) => {
        for (var n=0; n<array.length; n++) {
            if (!exists(output, (e) => { return equalityComparison(e, array[n]);}))
                output.push(array[n]); 
        }
    }
    
    if (array1)
        addFromArray(array1); 

    if (array2)
        addFromArray(array2); 

    return output; 
}

// * * * 
// performs the given operation on each element of the given array
// NOTE: modifies original array
// 
// args
//  array: the array on which to perform operation
//  op: the operation to perform (function in the form (element, index))
//
// returns: pointer to original array
function operate(array, func) {
    if (array) {
        for (var n=0; n<array.length; n++) {
            func(array[n], n);
        }
    }
    return array;
}

// * * * 
// returns a clone of the given array 
// 
// args
//  startIndex: optional; defaults to 0
//  length: optional; defaults to array.length
//
// returns: pointer to clone of array
function clone(array, startIndex, length) {    
    var clone = null; 

    if (array) {
        clone = []; 
        
        if (types.isUndefinedOrNull(startIndex))
            startIndex = 0; 
        if (types.isUndefinedOrNull(length))
            length = array.length - startIndex; 

        if (startIndex < 0)
            startIndex = 0; 

        if (startIndex >= array.length)
            startIndex = (array.length -1); 

        if (length + startIndex > array.length)
            length = array.length - startIndex;

        for(var n=startIndex; n<length; n++) {
            clone.push(array[n]); 
        }
    }

    return clone;
}

// * * * 
// returns true if the given object is null, not an array, or is an empty array. 
// 
// args
//  array: alleged array 
//
// returns: boolean
function nullOrEmpty(array) {
    return !(array && array.length && Array.isArray(array));
}

// * * * 
// converts an array to a comma-delimited english-sentence string 
// e.g. 'eggs, bacon, coffee, and orange juice'
//
// returns: string 
function toText(array) {
    var output = ''; 
    
    if (array) {
        if (array.length === 1)
            output = array[0].toString(); 
        if (array.length === 2)
            output = array[0].toString() + ' and ' + array[1].toString();
        else{
            for (var n=0; n<array.length; n++) {
                if (n > 1)
                    output += ', ';
                if (n === array.length-1)
                    output += 'and '; 
                output += array[n].toString(); 
            }
        }
    }

    return output; 
}


module.exports = {
    nullOrEmpty,
    select,
    where, 
    exists,
    removeWhere, 
    removeWhereNullOrUndefined,
    firstOrDefault,
    clear,
    removeAt,
    toText,
    merge,
    operate,
    clone
};