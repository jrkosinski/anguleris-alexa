'use strict';

// ====================================================================================================== 
// query - middle query layer to the data access layer
// 
// Anguleris Technologies
// John R. Kosinski
//
// 22 Feb 2018
// ------------------------------------------------------------------------------------------------------
const async = require('asyncawait/async');
const await = require('asyncawait/await');

const dataAccess = require('anguleris-data-access');
const common = require('anguleris-common');
const exception = common.exceptions('QUERY');
const logger = common.logger('QUERY');
const enums = common.enums;

const config = require('../config');
const responseBuilder = require('./responseBuilder');

// ------------------------------------------------------------------------------------------------------
// runs the given query and returns the resulting object or objects
// 
// args
//  querySubject: the string query subject
//  parameter: optional parameter to modify the request
//
// returns: object or array of objects 
const runQuery = async((querySubject, queryParams) => {
    return exception.try(() => {
        var name = null;
        if (queryParams && queryParams.name) {
            name = queryParams.name;
        }

        //anonymous querySubject
        if (!querySubject) {
            if (name) {
                var entity = await(dataAccess.getEntityByName(name));
                return entity;
            }
        }
        else {
            switch (querySubject) {
                case enums.querySubject.categories: {
                    return await(queryCategories(queryParams));
                }
                case enums.querySubject.manufacturers: {
                    return await(queryManufacturers(queryParams));
                }
                case enums.querySubject.products: {
                    return await(queryProducts(queryParams));
                }
                case enums.querySubject.features: {
                    return await(queryFeatureValues(queryParams));
                }
            }
        }

        return null;
    });
}); 

// ------------------------------------------------------------------------------------------------------
// queries for categories by the given params
//
// supported params: 
//  queryParams.manufacturer - category manufacturer
//  queryParams.name - category name
//
// returns: array of categories 
const queryCategories  = async((queryParams) => {
    return exception.try(() => {
        if (queryParams && queryParams.manufacturer) {
            return await(dataAccess.getCategoriesForManufacturer(queryParams.manufacturer));
        }
        else {
            return await(dataAccess.getCategories(queryParams ? queryParams.name : null));
        }
    });
});

// ------------------------------------------------------------------------------------------------------
// queries for manufacturers by the given params
//
// supported params: 
//  queryParams.category - manufacturer category
//  queryParams.name - manufacturer name
//
// returns: array of categories 
const queryManufacturers = async((queryParams) => {
    return exception.try(() => {
        if (queryParams && queryParams.category) {
            var category = await(dataAccess.getCategories(queryParams.category));
            if (category && category.manufacturers){
                var output = []; 
                for (var n=0; n<category.manufacturers.length; n++){
                    var mfg = await(dataAccess.getManufacturers(category.manufacturers[n])); 
                    if (mfg){
                        output.push(mfg);
                    }
                }
                return output; 
            }
        }
        else {
            return await(dataAccess.getManufacturers(queryParams ? queryParams.name : null));
        }

        return null;
    });
});

// ------------------------------------------------------------------------------------------------------
// queries for products by the given params
//
// supported params: 
//  queryParams.category - product category
//  queryParams.manufacturer - product manufacturer
//  queryParams.feature - a feature name 
//  queryParams.featureValue - a feature value 
//
// returns: array of categories 
const queryProducts = async((queryParams) => {
    return exception.try(() => {
        if (queryParams) {
            var products = null;

            if (queryParams.category) {
                products = await(dataAccess.getProductsForCategory(queryParams.category));
            }
            if (queryParams.manufacturer) {
                if (products)
                    products = filterProductsByManufacturer(products, queryParams.manufacturer);
                else
                    products = await(dataAccess.getProductsForManufacturer(queryParams.manufacturer));
            }
            if (queryParams.feature && queryParams.featureValue) {
                if (!products)
                    products = await(dataAccess.getProducts());
                products = filterProductsByFeature(products, queryParams.feature, queryParams.featureValue);
            }

            return products;
        }
    });
});

// ------------------------------------------------------------------------------------------------------
// queries for all feature values for a feature, which are supported by products.
// For example: all values for feature "Finish" that are currently supported by products 
// in "Dishwashers". 
//
// supported params: 
//  queryParams.category - product category
//  queryParams.feature - a feature name 
//
// returns: array of categories 
const queryFeatureValues = async((queryParams) => {
    return exception.try(() => {
        var features = null;
        if (queryParams.category && queryParams.feature) {
            var products = await(dataAccess.getProductsForCategory(queryParams.category)); 

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
});

// ------------------------------------------------------------------------------------------------------
// filter a list of products, by manufacturer. 
// 
// args
//  products: original list of products
//  manufacturer: the mfg name to filter by 
// 
// returns: subset of the original list of products
const filterProductsByManufacturer = (products, manufacturer) => {
    return exception.try(() => {
        manufacturer = manufacturer.trim().toLowerCase();

        return common.arrays.where(products, (p) => {
            return (p.manufacturer && p.manufacturer.trim().toLowerCase() === manufacturer);
        });
    });
};

// ------------------------------------------------------------------------------------------------------
// filter a list of products, by feature & feature value. 
// 
// args
//  products: original list of products
//  feature: the feature name to filter by 
//  featureValue: the feature value to filter by 
// 
// returns: subset of the original list of products
const filterProductsByFeature = (products, feature, featureValue) => {
    return exception.try(() => {
        if (featureValue)
            featureValue = featureValue.trim().toLowerCase();

        return common.arrays.where(products, (p) => {
            if (p.features && p.features[feature]) {
                if (common.types.isUndefinedOrNull(featureValue))
                    return true;

                if (p.features[feature]){
                    var f = p.features[feature]; 
                    if (!Array.isArray(f))
                        f = [f];

                    if (common.arrays.exists(f, (fi) => {
                        return (fi && fi.trim().toLowerCase() === featureValue);
                    })) {
                        return true;
                    }                    
                }

                return false;
            }
        });
    });
};


module.exports = {
    runQuery: runQuery
};