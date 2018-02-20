
// * * * * * 
// dateUtil - utilities for handling dates and unix timestamps.
// 
// John R. Kosinski
// 13 Jan 2018
Date.prototype.toUnixTimestamp = () => {
    return Math.floor(this.getTime()/1000);
}

function toDateString(timestamp) {
    return fromUnixTimestamp(timestamp).toString();
}

function fromUnixTimestamp(timestamp){
    return new Date(timestamp*1000); 
}

function toUnixTimestamp(d) {
    if (!d.getTime)
        d = new Date(d);
    return Math.floor(d.getTime()/1000);
}

function getUnixTimestamp(){
    return toUnixTimestamp(new Date()); 
}

function addYearsTimestamp(years, timestamp) {
    return addHoursTimestamp(365 * years, timestamp);
}

function addDaysTimestamp(days, timestamp) {
    return addHoursTimestamp(60 * days, timestamp);
}

function addHoursTimestamp(days, timestamp) {
    return addMinutesTimestamp(60 * hours, timestamp);
}

function addMinutesTimestamp(minutes, timestamp) {
    if (!timestamp)
        timestamp = getUnixTimestamp(); 

    timestamp += (minutes * 60);
    return timestamp;
}

function addYearsDate(years, date) {
    if (!date)
        date = new Date(); 

    return fromUnixTimestamp(addYearsTimestamp(toUnixTimestamp(date))); 
}

function addDaysDate(days, date) {
    if (!date)
        date = new Date(); 

    return fromUnixTimestamp(addDaysTimestamp(toUnixTimestamp(date))); 
}

function addHoursDate(days, date) {
    if (!date)
        date = new Date(); 

    return fromUnixTimestamp(addHoursTimestamp(toUnixTimestamp(date))); 
}

function addMinutesDate(minutes, date) {
    if (!date)
        date = new Date(); 

    return fromUnixTimestamp(addMinutesTimestamp(toUnixTimestamp(date))); 
}

function dateDiffSeconds(date1, date2){
    return timestampDiffSeconds(toUnixTimestamp(date1), date2 ? toUnixTimestamp(date2) : null); 
}

function timestampDiffSeconds(timestamp1, timestamp2) {
    if (!timestamp2)
        timestamp2 = getUnixTimestamp();
    return timestamp2 - timestamp1;
}

module.exports = {
    toDateString : toDateString,
    fromUnixTimestamp : fromUnixTimestamp,
    toUnixTimestamp : toUnixTimestamp,
    getUnixTimestamp : getUnixTimestamp,
    addYearsTimestamp: addYearsTimestamp,
    addDaysTimestamp: addDaysTimestamp,
    addHoursTimestamp: addHoursTimestamp,
    addMinutesTimestamp: addMinutesTimestamp,
    addYearsDate: addYearsDate,
    addDaysDate: addDaysDate,
    addHoursDate: addHoursDate,
    addMinutesDate: addMinutesDate,
    dateDiffSeconds : dateDiffSeconds,
    timestampDiffSeconds : timestampDiffSeconds
};