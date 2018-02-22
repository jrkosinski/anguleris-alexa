'use strict';

// * * * * * 
// query - middle query layer to the data access layer
// 
// Anguleris Technologies
// John R. Kosinski
//
// 22 Feb 2018
const async = require('asyncawait/async');
const await = require('asyncawait/await');

const common = require('anguleris-common');
const exception = common.exceptions('QUERY');
const logger = common.logger('QUERY');

const config = require('../config');
const enums = require('./enums');
const dataAccess = require('./dataAccess');

// * * * 
// runs the given query and returns the resulting object or objects
// 
// args
//  querySubject: the string query subject
//  parameter: optional parameter to modify the request
//
// returns: object or array of objects 
function runQuery(querySubject, parameter) {
    return exception.try(() => {
        switch(querySubject) {
            case enums.querySubject.categories: 
                return dataAccess.getCategories(parameter); 
            case enums.querySubject.manufacturers: 
                return dataAccess.getManufacturers(parameter); 
        }

        return [];
    });
}


module.exports = {
    runQuery: runQuery
};