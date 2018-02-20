
// * * * * * 
// stringUtil - string processing/handling.
// 
// John R. Kosinski
// 13 Jan 2018
String.prototype.replaceAll = function (search, replacement) {
	var target = this;
	return target.split(search).join(replacement);
};

String.prototype.contains = function (search) {
	var target = this;
	return target.indexOf(search) >= 0;
};

String.prototype.maxDecimalPlaces = function(max) {
	var target = this;
	var index = target.indexOf('.');
	if (index >= 0){
		var maxLen = index + 1 + max; 
		if (target.length > maxLen){
			target = target.substr(0, maxLen); 
		}
	}

	return target;
};

String.prototype.padRight = function(totalLen, paddingChar) {
	var target = this;
    if (!paddingChar)
        paddingChar = ' ';
    while(target.length < totalLen)
        target += paddingChar;
	return target;
};

String.prototype.padLeft = function(totalLen, paddingChar) {
	var target = this;
    if (!paddingChar)
        paddingChar = ' ';
    while(target.length < totalLen)
        target = paddingChar + target;
	return target;
};

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