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
// gets a response containing the details for a specific category or manufacturer
// 
// args
//  session: session attributes from request
// 
// returns: json object (Alexa response format) 
function getDetails(session, parameter) {
    return exception.try(() => {
        var details = null;

        if (!session)
            session = {};
        if (!session.querySubject)
            session.querySubject = enums.querySubject.categories;

        switch (session.querySubject) {
            case enums.querySubject.categories:
                var cat = query.runQuery(enums.querySubject.categories, { name: parameter });
                if (!cat) {
                    logger.warn('category ' + parameter + ' not found.');
                    details = config.ui.categoryNotFound.text.replaceAll('{name}', parameter);
                }
                else
                    details = formatCategoryDetails(cat);
                break;
            case enums.querySubject.manufacturers:
                var mfg = query.runQuery(enums.querySubject.manufacturers, { name: parameter });
                if (!mfg) {
                    logger.warn('manufacturer ' + parameter + ' not found.');
                    details = config.ui.manufacturerNotFound.text.replaceAll('{name}', parameter);
                }
                else
                    details = formatManufacturerDetails(mfg);
                break;
            case enums.querySubject.products: 
                var product = getProductFromSession(session);

                if (!product) {
                    logger.warn('product not found'); 
                    details = config.ui.productNotFound.text;
                }
                else
                    details = formatProductDetails(product); 
                break;
        }

        if (!details || !details.length) {
            details = 'no details found for ' + parameter;
        }

        //TODO: add reprompt
        return responseBuilder.responseWithCard(details, 'Category Details: ' + parameter, null, session);
    });
}

function getProductFeatures(session, featureName, productName) {
    return exception.try(() => {
        var product = getProductFromSession(session, productName); 
        var content = null;

        if (product) {
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
                return responseBuilder.responseWithCard(
                    config.ui.featureNotSupported.text.replaceAll('{name}', product.name).replaceAll('{feature}', featureName), 
                    config.ui.featureNotSupported.card, 
                    config.ui.featureNotSupported.reprompt,
                    session
                ); 
            }
            else{
                return responseBuilder.responseWithCard(
                    config.ui.featureSupported.text.replaceAll('{name}', product.name).replaceAll('{feature}', featureName).replaceAll('{value}', content), 
                    config.ui.featureSupported.card.replaceAll('{name}', product.name).replaceAll('{feature}', featureName).replaceAll('{value}', content),
                    config.ui.featureSupported.reprompt,
                    session 
                );
            }
        }
        else {
            return responseBuilder.responseWithCard(config.ui.productNotFound.text, config.ui.productNotFound.card, config.ui.productNotFound.reprompt, session);
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
        return getManufacturerProperty(session, manufacturerName, 'phone', config.ui.manufacturerPhoneFound, config.ui.manufacturerPhoneNotFound);
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
        return getManufacturerProperty(session, manufacturerName, 'address', config.ui.manufacturerAddressFound, config.ui.manufacturerAddressNotFound);
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

        var mfg = query.runQuery(enums.querySubject.manufacturers, { name: manufacturerName });
        if (mfg) {
            if (mfg[propertyName] && mfg[propertyName].trim().length) {
                card = foundText.card.replaceAll('{name}', manufacturerName).replaceAll('{value}', mfg[propertyName].trim());
                text = foundText.text.replaceAll('{name}', manufacturerName).replaceAll('{value}', mfg[propertyName].trim());
                //text = manufacturerName + "'s phone number is " + mfg[propertyName].trim() + '.'; 
            }
            else {
                //no phone number available 
                card = notFoundText.card.replaceAll('{name}', manufacturerName);
                text = notFoundText.text.replaceAll('{name}', manufacturerName);
                //text = 'Sorry, no phone number is available for ' + manufacturerName; 
            }
        }
        else {
            //manufacturer not found 
            card = config.ui.manufacturerNotFound.card.replaceAll('{name', manufacturerName);
            text = config.ui.manufacturerNotFound.text.replaceAll('{name', manufacturerName);
            //text = 'Sorry, a manufacturer by the name of ' + manufacturerName + ' was not found.'; 
        }

        //TODO: add reprompt
        return responseBuilder.responseWithCard(text, card, null, session);
    });
}

// * * * 
// 
function getProductsForEntity(session, entityName) {
    return exception.try(() => {
        var text = null;
        var products = [];
        var foundText = null;
        var notFoundText = null;

        //TODO: handle entity not found 

        //products for category
        if (session.querySubject === enums.querySubject.categories) {
            products = query.runQuery(enums.querySubject.products, { category: entityName });
            foundText = config.ui.productsForCategory;
            notFoundText = config.ui.noProductsForCategory;
        }

        //products for manufacturer
        else if (session.querySubject === enums.querySubject.manufacturers) {
            products = query.runQuery(enums.querySubject.products, { manufacturer: entityName });
            foundText = config.ui.productsForManufacturer;
            notFoundText = config.ui.noProductsForManufacturer;
        }

        if (!common.arrays.nullOrEmpty(products)) {
            session.startIndex = 0;
            return responseBuilder.responseListGroup(
                products,
                { subject: enums.querySubject.products },
                navigation.getGroupSize(enums.querySubject.products),
                0,
                {
                    textProperty: 'name',
                    preText: 'Found {count} products. Result {start} of {count}. ',
                    postText: 'Say next to move to next result. Or ask a different question. ',
                    reprompt: 'Say next to move to next result. Or ask a different question. ',
                    title: 'Result {start} of {count}'
                }
            );
        }
        else {
            return responseBuilder.responseWithCard(
                notFoundText.text.replaceAll('{name}', entityName),
                notFoundText.card.replaceAll('{name}', entityName),
                null,
                session
            );
        }
    });
}

// * * * 
// 
function getProductsCountForEntity(session, entityName) {
    return exception.try(() => {
        var products = null;
        var foundText = null;
        var notFoundText = null;

        //products for category
        if (session.querySubject === enums.querySubject.categories) {
            products = query.runQuery(enums.querySubject.products, { category: entityName });
            foundText = config.ui.numProductsForCategory;
            notFoundText = config.ui.noProductsForCategory;
        }

        //products for manufacturer
        else if (session.querySubject === enums.querySubject.manufacturers) {
            products = query.runQuery(enums.querySubject.products, { manufacturer: entityName });
            foundText = config.ui.numProductsForManufacturer;
            notFoundText = config.ui.noProductsForManufacturer;
        }

        var text = (common.arrays.nullOrEmpty(products)) ? notFoundText : foundText;

        return responseBuilder.responseWithCard(
            text.text.replaceAll('{name}', entityName).replaceAll('{count}', products.length),
            text.card.replaceAll('{name}', entityName).replaceAll('{count}', products.length),
            null,
            session
        );
    });
}

// * * * 
// 
function getProductFromSession(session, productName){
    return exception.try(() => {
        var output = null; 

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
    getDetails: getDetails,
    getManufacturerPhone: getManufacturerPhone,
    getManufacturerAddress: getManufacturerAddress,
    getProductsForEntity: getProductsForEntity,
    getProductsCountForEntity: getProductsCountForEntity,
    getProductFeatures: getProductFeatures
};