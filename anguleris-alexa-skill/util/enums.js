'use strict'; 

// * * * * * 
// enums - enums
// 
// Anguleris Technologies
// John R. Kosinski
//
// 22 Feb 2018
const common = require('anguleris-common'); 
const configUtil = common.config;

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