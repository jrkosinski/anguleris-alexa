
// * * * * * 
// stringUtil - string processing/handling.
// 
// John R. Kosinski
// 13 Jan 2018

// * * * 
// replaces all occurrences of a value in the current string, with the given replacement 
// 
// returns: string 
String.prototype.replaceAll = function (search, replacement) {
	var target = this;
	return target.split(search).join(replacement);
};

// * * * 
// replaces all occurrences of a value in the current string, with the given set of token replacements 
// 
// returns: string 
String.prototype.replaceTokens = function (tokens) {
	var target = this;

	if (tokens) {
		for (var t in tokens) {
			target = target.replaceAll(t, tokens[t]);
		}
	}
	
	return target;
};

// * * * 
// returns true if the string contains at least one instance of the given substring
// 
// returns: boolean 
String.prototype.contains = function (search) {
	var target = this;
	return target.indexOf(search) >= 0;
};

// * * * 
// pads the string with the given character, until its length is equal to max length
// 
// returns: string of length totalLen 
String.prototype.padRight = function(totalLen, paddingChar) {
	var target = this;
    if (!paddingChar)
        paddingChar = ' ';
    while(target.length < totalLen)
        target += paddingChar;
	return target;
};

// * * * 
// pads the string with the given character, until its length is equal to max length
// 
// returns: string of length totalLen 
String.prototype.padLeft = function(totalLen, paddingChar) {
	var target = this;
    if (!paddingChar)
        paddingChar = ' ';
    while(target.length < totalLen)
        target = paddingChar + target;
	return target;
};

// * * * 
// returns true if the string ends with any punctuation mark (ignoring trailing whitespace)
// 
// returns: boolean
String.prototype.endsWithPunctuation = function () {
	var target = this;
	target = target.trim();
	if (target.length) {
		var c = target[target.length - 1];
		if (!c.match(/^[0-9a-zA-Z]+$/))
			return true;
	}
	return false;
};

// * * * 
// returns true if the given object represents a purely numeric value (it either is a number already, or 
// when converted to string, is purely numeric)
// 
// returns: boolean
function isNumeric(obj){
	if (variable === undefined || variable === null) 
		return false;
	
	var s = obj.toString(); 
	var pattern = /^\d+$/;
    return pattern.test(s);
}


module.exports = {
	isNumeric : isNumeric
};