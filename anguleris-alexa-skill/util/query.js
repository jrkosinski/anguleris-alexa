'use strict';

const async = require('asyncawait/async');
const await = require('asyncawait/await');

const common = require('anguleris-common');
const exception = common.exceptions('QUERY');
const logger = common.logger('QUERY');

const config = require('../config');
const enums = require('./enums');
const dataAccess = require('./dataAccess');


function runQuery(query) {
    return exception.try(() => {
        switch(query) {
            case enums.queryType.categories: 
                return dataAccess.getCategories(); 
            case enums.queryType.manufacturers: 
                return dataAccess.getManufacturers(); 
        }

        return [];
    });
}


module.exports = {
    runQuery: runQuery
};