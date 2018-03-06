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

const dataAccess = require('anguleris-data-access');
const common = require('anguleris-common');
const exception = common.exceptions('QUERY');
const logger = common.logger('QUERY');
const enums = common.enums;

const config = require('../config');
const responseBuilder = require('./responseBuilder');

// * * * 
// runs the given query and returns the resulting object or objects
// 
// args
//  querySubject: the string query subject
//  parameter: optional parameter to modify the request
//
// returns: object or array of objects 
function runQuery(querySubject, queryParams) {
    return exception.try(() => {
        var name = null; 
        if (queryParams && queryParams.name){
            name = queryParams.name;
        }

        //anonymous querySubject
        if (!querySubject) {
            if (name) {
                var entity = dataAccess.getEntityByName(name); 
                return entity;
            }
        }
        else {
            switch(querySubject) {
                case enums.querySubject.categories: {    
                    if (queryParams && queryParams.manufacturer) {
                        var categories = dataAccess.getCategoriesForManufacturer(queryParams.manufacturer); 
                        return categories;
                    }
                    else {
                        return dataAccess.getCategories(name); 
                    }
                }
                case enums.querySubject.manufacturers: {            
                    if (queryParams && queryParams.category) {
                        var category = dataAccess.getCategories(queryParams.category); 
                        if (category)
                            return category.manufacturers; 
                    }
                    else{
                        return dataAccess.getManufacturers(name); 
                    }
                }
                case enums.querySubject.products: {
                    if (queryParams) {
                        if (queryParams.category) {
                            return dataAccess.getProductsForCategory(queryParams.category); 
                        }
                        if (queryParams.manufacturer) {
                            return dataAccess.getProductsForManufacturer(queryParams.manufacturer); 
                        }
                    }
                }
            }
        }

        return null;
    });
}


module.exports = {
    runQuery: runQuery
};