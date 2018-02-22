'use strict';

const async = require('asyncawait/async');
const await = require('asyncawait/await');

const common = require('anguleris-common');
const exception = common.exceptions('QUERY');
const logger = common.logger('QUERY');

const config = require('../config');
const enums = require('./enums');
const dataAccess = require('./dataAccess');


function runQuery(query, parameter) {
    return exception.try(() => {
        switch(query) {
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