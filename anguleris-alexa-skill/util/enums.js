'use strict'; 

const common = require('anguleris-common'); 
const configUtil = common.config;

module.exports = {
    navigationCommand: configUtil.makeEnum([
        'next',
        'prev',
        'stop',
        'startOver'
    ]), 
    
    querySubject: configUtil.makeEnum([
        'categories',
        'manufacturers'
    ]), 
};