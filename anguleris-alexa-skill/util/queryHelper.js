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
const navigation = require('./navigation');
const query = require('./query');

// * * * 
// gets a list of all categories 
// 
// args
//  session: session attributes from request
// 
// returns: json object (Alexa response format) 
function getCategories(session) {
    return exception.try(() => {
        session.querySubject = enums.querySubject.categories;
        var categories = query.runQuery(session.querySubject)
    
        //TODO: hard-coded text 
        return responseBuilder.responseListGroup (
            categories, 
            { subject: session.querySubject },
            navigation.getGroupSize(session.querySubject),
            0, 
            {
                textProperty: 'name', 
                preText: categories.length >1 ? 'Found {count} categories. Results {start} to {end} of {count}. ' : 'Found 1 category. ', 
                postText: categories.length >1 ? 'Say next, or ask a different question. ' : '', 
                reprompt: categories.length >1 ? 'Say next, or ask a different question. ' : 'hopi',
                title: 'Results {start} to {end} of {count}'
            }
        ); 
    });
}

// * * * 
// gets a list of all manufacturers 
// 
// args
//  session: session attributes from request
// 
// returns: json object (Alexa response format) 
function getManufacturers(session) {
    return exception.try(() => {
        session.querySubject = enums.querySubject.manufacturers;
        var manufacturers = query.runQuery(session.querySubject);
    
        //TODO: hard-coded text 
        return responseBuilder.responseListGroup (
            manufacturers, 
            { subject: session.querySubject },
            navigation.getGroupSize(session.querySubject),
            0, 
            {
                textProperty: 'name', 
                preText: manufacturers.length >1 ? 'Found {count} manufacturers. Results {start} to {end} of {count}. ': 'Found 1 manufacturer. ', 
                postText: manufacturers.length >1 ? 'Say next to move to next result. Or ask a different question. ': '', 
                reprompt: manufacturers.length >1 ? 'Say next to move to next result. Or ask a different question. ': null,
                title: 'Results {start} to {end} of {count}'
            }
        ); 
    });
}

// * * * 
// gets a list of all manufacturers in the given category
// 
// args
//  session: session attributes from request
// 
// returns: json object (Alexa response format) 
function getManufacturersForCategory(session, categoryName) {
    return exception.try(() => {
        session.queryParams = { category: categoryName};
        session.querySubject = enums.querySubject.manufacturers;

        var manufacturers = query.runQuery(session.querySubject, session.queryParams); 
        
        //TODO: add reprompt
        return responseBuilder.listToText(
            common.arrays.select(manufacturers, 'name'), 
            config.ui.manufacturersForCategory.text.replaceTokens({name: categoryName}),
            null, 
            config.ui.manufacturersForCategory.card.replaceTokens({name: categoryName}), 
            session
        ); 
    });
}

// * * * 
// gets a list of all categories for which the given manufacturer has products
// 
// args
//  session: session attributes from request
// 
// returns: json object (Alexa response format) 
function getCategoriesForManufacturer(session, manufacturerName) {
    return exception.try(() => {
        session.queryParams = { manufacturer: manufacturerName};
        session.querySubject = enums.querySubject.categories;

        var categories = query.runQuery(session.querySubject, session.queryParams); 
        
        //TODO: add reprompt
        return responseBuilder.listToText(
            common.arrays.select(categories, 'name'), 
            config.ui.categoriesForManufacturer.text.replaceTokens({name: manufacturerName}),
            null, 
            config.ui.categoriesForManufacturer.card.replaceTokens({name: manufacturerName}), 
            session
        ); 
    });
}

// * * * 
// gets a response containing the details for a specific category or manufacturer
// 
// args
//  session: session attributes from request
// 
// returns: json object (Alexa response format) 
function getDetails(session, parameter) {
    return exception.try(() => {
        var details = null;

        //add param to queryParams
        if (parameter) {
            session.queryParams = {name: parameter};
        }

        //attempt to get entity
        var entity = query.runQuery(null, session.queryParams); 

        if (entity) {
            switch(entity.type) {
                case enums.entityType.category: 
                    details = formatCategoryDetails(entity);
                    break;
                case enums.entityType.manufacturer: 
                    details = formatManufacturerDetails(entity);
                    break;
                case enums.entityType.product: 
                    details = formatProductDetails(entity);
                    break;
            }
        }
        else{
            details = config.ui.entityNotFound.text.replaceTokens({name: parameter});
        }

        if (!details || !details.length) {
            details = 'no details found for ' + parameter;
        }

        //TODO: add reprompt
        //TODO: hard-coded text here 
        return responseBuilder.responseWithCard(details, 'Entity Details: ' + parameter, null, session);
    });
}

// * * * 
// gets the feature values supported by given product and feature
//
// args
//  session: session attributes from request
//  featureName: name of requested feature
//  productName: name of product 
// 
// returns: json object (Alexa response format) 
function getProductFeatureValues(session, featureName, productName) {
    return exception.try(() => {

        //get product 
        var product = getProductFromSession(session, productName); 
        var content = null;

        if (product) {
            //list through features
            if (product.features) {
                var feature = product.features[featureName]; 

                if (feature && feature.length) {
                    if (Array.isArray(feature)){
                        if (feature.length) {
                            content = common.arrays.toText(feature);
                        }
                    }
                    else{
                        feature = feature.toString(); 
                        if (feature.length) {
                            content = feature;
                        }
                    }
                }
            }

            //if no content, it's not supported 
            if (!content || !content.length){
                return responseBuilder.responseWithCardShortcut('featureNotSupported', {
                    name: product.name,
                    feature: featureName
                }, session); 
            }
            else{
                return responseBuilder.responseWithCardShortcut('featureSupported', {
                    name: product.name,
                    feature: featureName,
                    value: content
                }, session); 
            }
        }
        else {
            return responseBuilder.productNotFound(productName, session);
        }
    });
}

// * * * 
// gets a list of all features and their values, for a given product 
// 
// args
//  session: session attributes from request
//  productName: name of product 
// 
// returns: json object (Alexa response format) 
function getAllProductFeatures(session, productName) {
    return exception.try(() => {

        //get product 
        var product = getProductFromSession(session, productName); 
        var content = null;

        if (product) {
            //list through features
            if (product.features) {
                var contentArray = []; 

                for (var p in product.features) {
                    contentArray.push(p + ': ' + product.features[p] + '.'); 
                }

                content = common.arrays.toText(contentArray);
            }

            //if no content, no features supported
            if (!content || !content.length){
                return responseBuilder.responseWithCardShortcut('noFeatures', {name: product.name}, session); 
            }
            else {
                return responseBuilder.responseWithCardShortcut('productAllFeatures', {
                        name: product.name,
                        content: content
                    }, 
                    session
                ); 
            }
        }
        else {
            return responseBuilder.productNotFound(productName, session);
        }
    });
}

// * * * 
// gets a response containing the requested manufacturer's phone number
// 
// args
//  session: session attributes from request
//  manufacturerName: the manufacturer name 
// 
// returns: json object (Alexa response format) 
function getManufacturerPhone(session, manufacturerName) {
    return exception.try(() => {
        return getManufacturerProperty(session, manufacturerName, 'phone', 'manufacturerPhoneFound', 'manufacturerPhoneNotFound');
    });
}

// * * * 
// gets a response containing the requested manufacturer's address
// 
// args
//  session: session attributes from request
//  manufacturerName: the manufacturer name 
// 
// returns: json object (Alexa response format) 
function getManufacturerAddress(session, manufacturerName) {
    return exception.try(() => {
        return getManufacturerProperty(session, manufacturerName, 'address', 'manufacturerAddressFound', 'manufacturerAddressNotFound');
    });
}

// * * * 
// gets a response containing the requested manufacturer's [property] value
// 
// args
//  session: session attributes from request
//  manufacturerName: the manufacturer name 
//  propertyName: name of the property to retrieve 
//  foundText: config.ui node to be used when requested data is found
//  notFoundText: config.ui node to be used when requested data is not found
// 
// returns: json object (Alexa response format) 
function getManufacturerProperty(session, manufacturerName, propertyName, foundText, notFoundText) {
    return exception.try(() => {
        var text = null;
        var card = null;

        session.queryParams = {name:manufacturerName}; 

        //attempt to get manufacturer
        var mfg = query.runQuery(enums.querySubject.manufacturers, session.queryParams);
        if (mfg) {
            if (mfg[propertyName] && mfg[propertyName].trim().length) {
                return responseBuilder.responseWithCardShortcut(foundText, {
                        name: manufacturerName,
                        value: mfg[propertyName].trim()
                    }, 
                    session
                );
            }
            else {
                //no phone number available 
                return responseBuilder.responseWithCardShortcut(notFoundText, {name: manufacturerName}, session);
            }
        }
        
        return responseBuilder.manufacturerNotFound(manufacturerName, session);
    });
}

// * * * 
// gets products list for category or manufacturer
//
// args
//  session: session attributes from request
//  entityName: the category or manufacturer name 
// 
// returns: json object (Alexa response format) 
function getProductsForEntity(session, entityName, countOnly) {
    return exception.try(() => {
        var text = null;
        var products = [];
        var notFoundText = null;        
    
        var entity = dataAccess.getEntityByName(entityName); 

        //choose category or manufacturer
        if (entity){
            if (entity.type === enums.entityType.category) {
                session.queryParams = { category: entityName };
            }
            else if (entity.type === enums.entityType.manufacturer) {
                session.queryParams = { manufacturer: entityName };
            }
            
            //query for products
            products = query.runQuery(enums.querySubject.products, session.queryParams);
            
            if (!common.arrays.nullOrEmpty(products)) {
                //count only
                if (countOnly) {
                    return responseBuilder.responseWithCardShortcut(
                        entity.type === enums.entityType.category ? 'numProductsForCategory' : 'numProductsForManufacturer', 
                        {
                            name: entityName,
                            count: products.length
                        },
                        session
                    ); 
                }
                else {
                    //return full list 
                    session.startIndex = 0;
                    return responseBuilder.responseListGroup(
                        products,
                        { subject: enums.querySubject.products, params:session.queryParams },
                        navigation.getGroupSize(enums.querySubject.products),
                        0,
                        {
                            textProperty: 'name',
                            preText: products.length >1 ? 'Found {count} products. Result {start} of {count}. ' : 'Found 1 product. ',
                            postText: products.length >1 ? 'Say next to move to next result. Or ask a different question. ' : '',
                            reprompt: products.length >1 ? 'Say next to move to next result. Or ask a different question. ' : null,
                            title: 'Result {start} of {count}'
                        }
                    );
                }
            }
            else {
                //no products found 
                return responseBuilder.responseWithCardShortcut('noProductsForEntity', { name: entityName}, session);
            }
        }   

        return responseBuilder.entityNotFound(entityName, session);         
    });
}

// * * * 
// gets total number of products for category or manufacturer
//
// args
//  session: session attributes from request
//  entityName: the category or manufacturer name 
// 
// returns: json object (Alexa response format) 
function getProductsCountForEntity(session, entityName) {
    return getProductsForEntity(session, entityName, true);
}

// * * * 
// gets all feature values available for the given feature, in the given category
//
// args
//  session: session attributes from request
//  categoryName: the category name 
//  featureName: the name of the feature 
// 
// returns: json object (Alexa response format) 
function getFeatureValuesForCategory(session, categoryName, featureName) {
    return exception.try(() => {

        //check first that category exists 
        if (!dataAccess.categoryExists(categoryName)) {
            return responseBuilder.categoryNotFound(categoryName, session); 
        }

        //get feature values 
        //TODO: implement this call 
        var featureValues = query.runQuery(enums.querySubject.features, { feature:featureName, category:categoryName }); 

        if (!common.arrays.nullOrEmpty(featureValues)) {
            return responseBuilder.listToText(
                featureValues, 
                config.ui.categoriesByFeature.text.replaceTokens({name: featureName}),
                null, 
                config.ui.categoriesByFeature.card.replaceTokens({name: featureName}), 
                session
            ); 
        }
        else{
            return responseBuilder.responseWithCardShortcut('featureNotSupportedByCategory', {
                    feature: featureName,
                    category: categoryName
                },
                session
            );
        }
    });
}

// * * * 
function getProductsByMfgAndCategory(session, categoryName, manufacturerName) {
    return queryProducts(session, categoryName, null, null, manufacturerName);
}
    
// * * * 
// gets all products that match the given criteria
//
// args
//  session: session attributes from request
//  categoryName: the category name 
//  featureName: the name of the feature 
//  featureValue: the feature value 
//  manufacturerName: the name of the manufacturer
// 
// returns: json object (Alexa response format) 
//TODO: make this the one master query for all products (e.g. products by category) 
function queryProducts(session, categoryName, featureName, featureValue, manufacturerName) {
    return exception.try(() => {

        //check first that category exists 
        if (!dataAccess.categoryExists(categoryName)) {
            return responseBuilder.categoryNotFound(categoryName, session); 
        }

        //check that manufacturer exists 
        if (manufacturerName) {
            if (!dataAccess.manufacturerExists(manufacturerName))
                return responseBuilder.manufacturerNotFound(manufacturerName, session); 
        }

        //try to get products that match 
        session.querySubject = enums.querySubject.products; 
        session.queryParams = { 
            category: categoryName, 
            manufacturer: manufacturerName
        }; 

        //add feature params if passed 
        if (featureName)
            session.queryParams.feature = featureName;
        if (featureValue)
            session.queryParams.featureValue = featureValue;

        //run query 
        var products = query.runQuery(session.querySubject, session.queryParams); 

        if (!common.arrays.nullOrEmpty(products)) {
            return responseBuilder.responseListGroup(
                products,
                { subject: enums.querySubject.products, params:session.queryParams },
                navigation.getGroupSize(enums.querySubject.products),
                0,
                {
                    textProperty: 'name',
                    preText: products.length >1 ? 'Found {count} products. Result {start} of {count}. ': 'Found 1 product. ',
                    postText: products.length >1 ? 'Say next to move to next result. Or ask a different question. ': '',
                    reprompt: products.length >1 ? 'Say next to move to next result. Or ask a different question. ': null,
                    title: 'Result {start} of {count}'
                }
            );
        }
        else{
            return responseBuilder.responseWithCardShortcut(
                'productQueryNoResults',
                {},
                session
            );
        }
    }); 
}

// * * * 
// attempts to get the product name from either the given parameter, or from session. 
//
// returns: string 
function getProductFromSession(session, productName){
    return exception.try(() => {
        var output = null; 

        if (productName === 'it')
            productName = null; 
        else if (productName === 'that one')
            productName = null; 
        else if (productName === 'that')
            productName = null; 

        if (productName) {
            //attempt to get by product name 
            output = dataAccess.getProductByName(productName);
        }
        else {
            var output = query.runQuery(enums.querySubject.products, session.queryParams); 
            if (Array.isArray(output)){
                if (!common.types.isUndefinedOrNull(session.startIndex))
                    output = output[session.startIndex]; 
                else
                    output == output[0]; 
            }
        }
        
        return output; 
    }); 
}

// * * * 
// creates a speech string for category details
// 
// args
//  category: category object
//
// returns: string 
function formatCategoryDetails(category) {
    return exception.try(() => {
        var output = '';

        if (category.description && category.description.trim().length) {
            output = category.description;
        }
        else {
            output = config.ui.noDetailsForCategory.text;
        }

        return output;
    });
}

// * * * 
// creates a speech string for manufacturer details
// 
// args
//  category: manufacturer object
//
// returns: string 
function formatManufacturerDetails(manufacturer) {
    return exception.try(() => {
        var output = '';
        output = manufacturer.name.trim() + '. ';

        if (manufacturer.phone && manufacturer.phone.trim().length) {
            output += 'phone number: ' + manufacturer.phone.trim() + '. ';
        }
        if (manufacturer.address && manufacturer.address.trim().length) {
            output += 'address: ' + manufacturer.address.trim() + '. ';
        }
        if (manufacturer.description && manufacturer.description.trim().length) {
            output += manufacturer.description;
        }

        return output;
    });
}

// * * * 
// creates a speech string for product details
// 
// args
//  category: product object
//
// returns: string 
function formatProductDetails(product) {
    return exception.try(() => {
        var output = '';

        if (product.description && product.description.trim().length) {
            output = product.description;
        }
        else {
            output = config.ui.noDetailsForProduct.text;
        }

        return output;
    });
}


module.exports = {
    getDetails,
    getManufacturerPhone,
    getManufacturerAddress,
    getProductsForEntity,
    getProductsCountForEntity,
    getProductFeatureValues,
    getAllProductFeatures,
    queryProducts,
    getCategories,
    getManufacturers,
    getManufacturersForCategory,
    getCategoriesForManufacturer,
    getFeatureValuesForCategory ,
    getProductsByMfgAndCategory
};