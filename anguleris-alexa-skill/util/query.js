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
        if (queryParams && queryParams.name) {
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
            switch (querySubject) {
                case enums.querySubject.categories: {
                    return queryCategories(queryParams);
                }
                case enums.querySubject.manufacturers: {
                    return queryManufacturers(queryParams);
                }
                case enums.querySubject.products: {
                    return queryProducts(queryParams);
                }
                case enums.querySubject.features: {
                    return queryFeatureValues(queryParams);
                }
            }
        }

        return null;
    });
}

function queryCategories(queryParams) {
    return exception.try(() => {
        if (queryParams && queryParams.manufacturer) {
            return dataAccess.getCategoriesForManufacturer(queryParams.manufacturer);
        }
        else {
            return dataAccess.getCategories(queryParams ? queryParams.name : null);
        }
    });
}

function queryManufacturers(queryParams) {
    return exception.try(() => {
        if (queryParams && queryParams.category) {
            var category = dataAccess.getCategories(queryParams.category);
            if (category)
                return category.manufacturers;
        }
        else {
            return dataAccess.getManufacturers(queryParams ? queryParams.name : null);
        }

        return null;
    });
}

function queryProducts(queryParams) {
    return exception.try(() => {
        if (queryParams) {
            var products = null;

            if (queryParams.category) {
                products = dataAccess.getProductsForCategory(queryParams.category);
            }
            if (queryParams.manufacturer) {
                if (products)
                    products = filterProductsByManufacturer(products, queryParams.manufacturer);
                else
                    products = dataAccess.getProductsForManufacturer(queryParams.manufacturer);
            }
            if (queryParams.feature && queryParams.featureValue) {
                if (!products)
                    products = dataAccess.getProducts();
                products = filterProductsByFeature(products, queryParams.feature, queryParams.featureValue);
            }

            return products;
        }
    });
}

function queryFeatureValues(queryParams) {
    return exception.try(() => {
        var features = null;
        if (queryParams.category && queryParams.feature) {
            var products = dataAccess.getProductsForCategory(queryParams.category); 

            if (products) {
                var output = [];
                
                for (var n=0; n<products.length; n++) {
                    var prod = products[n]; 
                    if (prod.features && prod.features[queryParams.feature]) {
                        var feature = prod.features[queryParams.feature]; 

                        if (feature) {
                            if (!Array.isArray(feature))
                                feature = [feature];

                            output = common.arrays.merge(output, feature); 
                        }
                    }
                }
                
                return output; 
            }
        }  

        return[];
    });
}

function filterProductsByManufacturer(products, manufacturer) {
    return exception.try(() => {
        manufacturer = manufacturer.trim().toLowerCase();

        return common.arrays.where(products, (p) => {
            return (p.manufacturer && p.manufacturer.trim().toLowerCase() === manufacturer);
        });
    });
}

function filterProductsByFeature(products, feature, featureValue) {
    return exception.try(() => {
        if (featureValue)
            featureValue = featureValue.trim().toLowerCase();

        return common.arrays.where(products, (p) => {
            if (p.features && p.features[feature]) {
                if (!featureValue)
                    return true;

                return (p.features[feature].trim().toLowerCase() === featureValue);
            }
        });
    });
}


module.exports = {
    runQuery: runQuery
};