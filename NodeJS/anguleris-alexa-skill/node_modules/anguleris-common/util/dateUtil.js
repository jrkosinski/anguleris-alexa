
// * * * * * 
// dateUtil - utilities for handling dates and unix timestamps.
// 
// John R. Kosinski
// 13 Jan 2018

// * * * 
// converts the date to a unix timestamp (number of seconds since that magical date)
// 
// returns: number (timestamp)
Date.prototype.toUnixTimestamp = () => {
    return Math.floor(this.getTime()/1000);
}

// * * * 
// converts the given timestamp to a date string (converts to Date, then returns its toString())
// 
// returns: string
function toDateString(timestamp) {
    return fromUnixTimestamp(timestamp).toString();
}

// * * * 
// converts the given timestamp to a Date object
// 
// returns: Date
function fromUnixTimestamp(timestamp){
    return new Date(timestamp*1000); 
}

// * * * 
// converts the given Date to a unix timestamp
// 
// returns: number (timestamp)
function toUnixTimestamp(d) {
    if (!d.getTime)
        d = new Date(d);
    return Math.floor(d.getTime()/1000);
}

// * * * 
// returns the unix timestamp representing now
// 
// returns: number (timestamp)
function getUnixTimestamp(){
    return toUnixTimestamp(new Date()); 
}

// * * * 
// adds the given number of years to the given timestamp (or now if omitted)
//
// args
//  years: number of years to add
//  timestamp: the timestamp; if omitted, defaults to now
// 
// returns: number (timestamp)
function addYearsTimestamp(years, timestamp) {
    return addHoursTimestamp(365 * years, timestamp);
}

// * * * 
// adds the given number of days to the given timestamp (or now if omitted)
//
// args
//  days: number of days to add
//  timestamp: the timestamp; if omitted, defaults to now
// 
// returns: number (timestamp)
function addDaysTimestamp(days, timestamp) {
    return addHoursTimestamp(60 * days, timestamp);
}

// * * * 
// adds the given number of hours to the given timestamp (or now if omitted)
//
// args
//  hours: number of hours to add
//  timestamp: the timestamp; if omitted, defaults to now
// 
// returns: number (timestamp)
function addHoursTimestamp(hours, timestamp) {
    return addMinutesTimestamp(60 * hours, timestamp);
}

// * * * 
// adds the given number of minutes to the given timestamp (or now if omitted)
//
// args
//  minutes: number of minutes to add
//  timestamp: the timestamp; if omitted, defaults to now
// 
// returns: number (timestamp)
function addMinutesTimestamp(minutes, timestamp) {
    if (!timestamp)
        timestamp = getUnixTimestamp(); 

    timestamp += (minutes * 60);
    return timestamp;
}

// * * * 
// adds the given number of years to the given Date (or now if omitted)
//
// args
//  years: number of years to add
//  date: the date; if omitted, defaults to now
// 
// returns: Date
function addYearsDate(years, date) {
    if (!date)
        date = new Date(); 

    return fromUnixTimestamp(addYearsTimestamp(years, toUnixTimestamp(date))); 
}

// * * * 
// adds the given number of days to the given Date (or now if omitted)
//
// args
//  days: number of days to add
//  date: the date; if omitted, defaults to now
// 
// returns: Date
function addDaysDate(days, date) {
    if (!date)
        date = new Date(); 

    return fromUnixTimestamp(addDaysTimestamp(days, toUnixTimestamp(date))); 
}

// * * * 
// adds the given number of hours to the given Date (or now if omitted)
//
// args
//  hours: number of hours to add
//  date: the date; if omitted, defaults to now
// 
// returns: Date
function addHoursDate(hours, date) {
    if (!date)
        date = new Date(); 

    return fromUnixTimestamp(addHoursTimestamp(hours, toUnixTimestamp(date))); 
}

// * * * 
// adds the given number of minutes to the given Date (or now if omitted)
//
// args
//  minutes: number of minutes to add
//  date: the date; if omitted, defaults to now
// 
// returns: Date
function addMinutesDate(minutes, date) {
    if (!date)
        date = new Date(); 

    return fromUnixTimestamp(addMinutesTimestamp(minutes, toUnixTimestamp(date))); 
}

// * * * 
// returns the number of seconds between the two dates (date2 - date1)
// 
// args
//  date1: first date to compare
//  date2: can be omitted; if so, defaults to now 
// 
// returns: number (seconds)
function dateDiffSeconds(date1, date2){
    return timestampDiffSeconds(toUnixTimestamp(date1), date2 ? toUnixTimestamp(date2) : null); 
}

// * * * 
// returns the number of seconds between the two timestamps (timestamp1 - timestamp2)
// 
// args
//  timestamp1: first timestamp to compare
//  timestamp2: can be omitted; if so, defaults to now 
// 
// returns: number (seconds)
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