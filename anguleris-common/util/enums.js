'use strict'; 

// * * * * * 
// enums - enums
// 
// Anguleris Technologies
// John R. Kosinski
//
// 22 Feb 2018
const configUtil = require('./configUtil'); 

module.exports = {

    // navigation commands for navigating response lists
    navigationCommand: configUtil.makeEnum([
        'next',
        'prev',
        'stop',
        'moveFirst'
    ]), 
    
    // subject of a query 
    querySubject: configUtil.makeEnum([
        'categories',
        'manufacturers'
    ]), 
};