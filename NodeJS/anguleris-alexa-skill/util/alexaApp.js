'use strict';

// ====================================================================================================== 
// alexaApp - alexia specification for the app's intents & handlers
// 
// Anguleris Technologies
// John R. Kosinski
//
// 22 Feb 2018
// ------------------------------------------------------------------------------------------------------
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const alexa = require("alexia");
const app = alexa.createApp('anguleris-alexa-skill', { shouldEndSessionByDefault: false });

const dataAccess = require('anguleris-data-access');
const common = require('anguleris-common');
const exception = common.exceptions('APP');
const logger = common.logger('APP');
const enums = common.enums;
const stringUtil = common.strings;

const config = require('../config');
const navigation = require('./navigation');
const query = require('./query');
const queryHelper = require('./queryHelper');
const phone = require('./phone');
const responseBuilder = require('./responseBuilder');
const sessionContext = require('./sessionContext');
const pkg = require('../package.json');


// ------------------------------------------------------------------------------------------------------
var categoryNames = dataAccess.getAllCategoryNames();
var manufacturerNames = dataAccess.getAllManufacturerNames(); 
var productNames = dataAccess.getAllProductNames(); 

app.customSlot('Category', categoryNames);
app.customSlot('Manufacturer', manufacturerNames);
app.customSlot('Product', productNames); 
app.customSlot('Entity', common.arrays.merge(common.arrays.merge(categoryNames, manufacturerNames), productNames)); 
app.customSlot('Feature', enums.allProductFeatureNames()); 
app.customSlot('FeatureValue', ['stainless steel', 'metallic', 'black', 'white', 'gray']);

// ------------------------------------------------------------------------------------------------------
// utility for specifying an intent handler 
// 
// returns: nothing 
function addAppIntent(intent, func) {
    app.intent(intent.name,
        intent.utterances, (slots, attr, data) => {
            return exception.try(() => {
                logger.info('Intent invoked: ' + intent.name); 
                logger.info('Data: ' + JSON.stringify(data)); 
                logger.info('Slots: ' + JSON.stringify(slots)); 
                logger.info('Session: ' + JSON.stringify(attr)); 
                return func(slots, attr, data); 
            }, { 
                defaultValue:responseBuilder.generalError(sessionContext.create(attr))
            });
        }
    );
}

const addAppIntentAsync = async((intent, func) => {
    app.intent(intent.name,
        intent.utterances, (slots, attr, data) => {
            try {
                logger.info('Intent invoked: ' + intent.name); 
                logger.info('Data: ' + JSON.stringify(data)); 
                logger.info('Slots: ' + JSON.stringify(slots)); 
                logger.info('Session: ' + JSON.stringify(attr)); 
                return await(func(slots, attr, data)); 
            }
            catch(e) {
                exception.handleError(e); 
                return responseBuilder.generalError(sessionContext.create(attr)); 
            }
            /*
            return await(exception.tryAsync(async(() => {
                logger.info('Intent invoked: ' + intent.name); 
                logger.info('Data: ' + JSON.stringify(data)); 
                logger.info('Slots: ' + JSON.stringify(slots)); 
                logger.info('Session: ' + JSON.stringify(attr)); 
                return await(func(slots, attr, data)); 
            }, { 
                defaultValue:responseBuilder.generalError(sessionContext.create(attr))
            })));
            */
        }
    );
}); 

// Startup
// ------------------------------------
// runs on session startup 
//
// example text: 
//      open bimsmith
//
app.onStart(() => {
    return exception.try(() => {
        logger.info('App launched'); 
        return responseBuilder.responseWithCardShortcut('launchPrompt', {
            version: pkg.version
        });
    });
});

// GetVersion
// ------------------------------------
// gets current version info 
//
// example text: 
//      what's the current version number 
//
addAppIntent(config.intents.getVersion, (slots, session, data) => {
    return responseBuilder.responseWithCardShortcut('getVersion', {version: pkg.version}, sessionContext.create(session), true); 
});

// GetCategories
// ------------------------------------
// gets a navigable list of all categories
//
// example text: 
//      get a list of categories
//
addAppIntent(config.intents.getCategories, (slots, session, data) => {
    return queryHelper.getCategories(sessionContext.create(session)); 
});

// GetManufacturers
// ------------------------------------
// gets a navigable list of all manufacturers
//
// example text: 
//      get a list of manufacturers
//
addAppIntent(config.intents.getManufacturers, (slots, session, data) => {
    return queryHelper.getManufacturers(sessionContext.create(session)); 
});

// GetManufacturersForCategory
// ------------------------------------
// gets a simple spoken list of manufacturers in a given category
//
// slots: 
//      category:Category
// 
// example text: 
//      what manufacturers are in {category}? 
// 
addAppIntent(config.intents.getManufacturersForCategory, (slots, session, data) => {
    return queryHelper.getManufacturersForCategory(sessionContext.create(session), slots.category); 
});

// GetCategoriesForManufacturer
// ------------------------------------
// gets a simple spoken list of categories supported by a given manufacturer
//
// slots: 
//      manufacturer:Manufacturer
// 
// example text: 
//      what categories does {manufacturer} have products for?
//
addAppIntent(config.intents.getCategoriesForManufacturer, (slots, session, data) => {
    return queryHelper.getCategoriesForManufacturer(sessionContext.create(session), slots.manufacturer); 
});

// GetDetails
// ------------------------------------
// gets spoken details for the given category, manufacturer, or product 
// 
// slots:
//      entity:Entity
//
// example text: 
//      get details for {entity}
//      details
//
addAppIntent(config.intents.getDetails, (slots, session, data) => {
    return queryHelper.getDetails(sessionContext.create(session), slots.entity); 
});

// GetProductFeatures
// ------------------------------------
// gets the values for the given feature of a given product 
// 
// slots: 
//      feature:Feature
//      product:Product
// 
// example text: 
//      what {feature} does {product} come in? 
// 
addAppIntent(config.intents.getProductFeatureValues, (slots, session, data) => {
    return queryHelper.getProductFeatureValues(sessionContext.create(session), enums.productFeature.normalizeFeatureName(slots.feature), slots.product); 
});

addAppIntent(config.intents.getProductFinishes, (slots, session, data) => {
    return queryHelper.getProductFeatureValues(sessionContext.create(session), 'finish', slots.product); 
});

addAppIntent(config.intents.getProductColors, (slots, session, data) => {
    return queryHelper.getProductFeatureValues(sessionContext.create(session), 'color', slots.product); 
});

addAppIntent(config.intents.getProductHeights, (slots, session, data) => {
    return queryHelper.getProductFeatureValues(sessionContext.create(session), 'height', slots.product); 
});

addAppIntent(config.intents.getProductWidths, (slots, session, data) => {
    return queryHelper.getProductFeatureValues(sessionContext.create(session), 'width', slots.product); 
});

// GetAllProductFeatures
// ------------------------------------
// gets a simple spoken list of all features (and their values) supported by a given product.
// 
// slots: 
//      product:Product
//      category:Category (optional)
//
// example text: 
//      what features does {product} support? 
//      get features
//
addAppIntent(config.intents.getAllProductFeatures, (slots, session, data) => {
    return queryHelper.getAllProductFeatures(sessionContext.create(session), slots.product, slots.category); 
});

// GetManufacturerPhone
// ------------------------------------
// gets the phone number of given manufacturer
// 
// slots: 
//      manufacturer:Manufacturer
//
// example text: 
//      what is the phone number of {manufacturer}? 
//
addAppIntent(config.intents.getManufacturerPhone, (slots, session, data) => {
    return queryHelper.getManufacturerPhone(sessionContext.create(session), slots.manufacturer); 
});

// GetManufacturerAddress
// ------------------------------------
// gets the street address of given manufacturer
// 
// slots: 
//      manufacturer:Manufacturer
//
// example text: 
//      what is the address of {manufacturer}? 
//
addAppIntent(config.intents.getManufacturerAddress, (slots, session, data) => {
    return queryHelper.getManufacturerAddress(sessionContext.create(session), slots.manufacturer); 
});

// GetProducts
// ------------------------------------
// gets a navigable list of products supported by given category or manufacturer.
// 
// slots:
//      entity:Entity
//
// example text: 
//      what products does {entity} have?
//
addAppIntent(config.intents.getProducts, (slots, session, data) => {
    return queryHelper.getProductsForEntity(sessionContext.create(session), slots.entity); 
});

// QueryProducts
// ------------------------------------
// gets a navigable list of products supported by given category AND manufacturer.
// 
// slots:
//      category:Category
//      manufacturer:Manufacturer
//
// example text: 
//      what {category} does {manufacturer} have?
//
addAppIntent(config.intents.queryProducts, (slots, session, data) => {
    return queryHelper.getProductsByMfgAndCategory(sessionContext.create(session), slots.category, slots.manufacturer); 
});

// GetProductsCount
// ------------------------------------
// gets the number of products in a manufacturer or category
// 
// slots:
//      entity:Entity
//
// example text: 
//      how many products does {entity} have? 
//
addAppIntent(config.intents.getProductsCount, (slots, session, data) => {
    return queryHelper.getProductsCountForEntity(sessionContext.create(session), slots.entity); 
});

addAppIntent(config.intents.getFinishesForCategory, (slots, session, data) => {
    return queryHelper.getFeatureValuesForCategory(sessionContext.create(session), slots.category, 'finish'); 
});

addAppIntent(config.intents.getColorsForCategory, (slots, session, data) => {
    return queryHelper.getFeatureValuesForCategory(sessionContext.create(session), slots.category, 'color'); 
});

addAppIntent(config.intents.getHeightsForCategory, (slots, session, data) => {
    return queryHelper.getFeatureValuesForCategory(sessionContext.create(session), slots.category, 'height'); 
});

addAppIntent(config.intents.getWidthsForCategory, (slots, session, data) => {
    return queryHelper.getFeatureValuesForCategory(sessionContext.create(session), slots.category, 'width'); 
});


// QueryProductByFeature
// ------------------------------------
//
// example text: 
//      get 
//
addAppIntent(config.intents.queryProductByFeature, (slots, session, data) => {
    return queryHelper.queryProducts(sessionContext.create(session), slots.category, enums.productFeature.normalizeFeatureName(slots.feature), slots.featureValue); 
}); 

addAppIntent(config.intents.queryProductByFinish, (slots, session, data) => {
    return queryHelper.queryProducts(sessionContext.create(session), slots.category, 'finish', slots.featureValue); 
}); 

addAppIntent(config.intents.queryProductByColor, (slots, session, data) => {
    return queryHelper.queryProducts(sessionContext.create(session), slots.category, 'color', slots.featureValue); 
}); 

addAppIntent(config.intents.queryProductByHeight, (slots, session, data) => {
    return queryHelper.queryProducts(sessionContext.create(session), slots.category, 'height', slots.featureValue); 
}); 

addAppIntent(config.intents.queryProductByWidth, (slots, session, data) => {
    return queryHelper.queryProducts(sessionContext.create(session), slots.category, 'width', slots.featureValue); 
}); 

// QueryProductByMfgFeature
// ------------------------------------
//
// example text: 
//      get 
//
addAppIntent(config.intents.queryProductByMfgFeature, (slots, session, data) => {
    return queryHelper.queryProducts(sessionContext.create(session), slots.category, enums.productFeature.normalizeFeatureName(slots.feature), slots.featureValue, slots.manufacturer); 
}); 

addAppIntent(config.intents.queryProductByMfgFinish, (slots, session, data) => {
    return queryHelper.queryProducts(sessionContext.create(session), slots.category, 'finish', slots.featureValue, slots.manufacturer); 
}); 

addAppIntent(config.intents.queryProductByMfgColor, (slots, session, data) => {
    return queryHelper.queryProducts(sessionContext.create(session), slots.category, 'color', slots.featureValue, slots.manufacturer); 
}); 

addAppIntent(config.intents.queryProductByMfgHeight, (slots, session, data) => {
    return queryHelper.queryProducts(sessionContext.create(session), slots.category, 'height', slots.featureValue, slots.manufacturer); 
}); 

addAppIntent(config.intents.queryProductByMfgWidth, (slots, session, data) => {
    return queryHelper.queryProducts(sessionContext.create(session), slots.category, 'width', slots.featureValue, slots.manufacturer); 
}); 

// Repeat
// ------------------------------------
// repeats the last thing said (from session) 
//
// example text: 
//      repeat
//
addAppIntent(config.intents.repeat, (slots, session, data) => {
    if (session.text) {
        //TODO: add reprompt?
        return responseBuilder.responseWithCard(session.text, 'Repeat', null, sessionContext.create(session)); 
    }
    else {
        return responseBuilder.responseWithCardShortcut('unknownIntent'); 
    }
});

// Next
// ------------------------------------
// moves to the next entry in a navigable list. 
// 
// session attributes: 
//      startIndex 
//      querySubject 
//      queryParams (optional) 
//
// example text: 
//      next 
//
addAppIntent(config.intents.moveNext, (slots, session, data) => {
    return navigation.moveNext(sessionContext.create(session)); 
});

// Prev
// ------------------------------------
// moves to the previous entry in a navigable list. 
// 
// session attributes: 
//      startIndex 
//      querySubject 
//      queryParams (optional) 
//
// example text: 
//      move back 
//
addAppIntent(config.intents.movePrev, (slots, session, data) => {
    return navigation.movePrev(sessionContext.create(session)); 
});

// Start Over
// ------------------------------------
// moves to the beginning of a navigable list. 
// 
// session attributes: 
//      startIndex 
//      querySubject 
//      queryParams (optional) 
// 
// example text: 
//      start over
//
addAppIntent(config.intents.moveFirst, (slots, session, data) => {
    return navigation.moveFirst(sessionContext.create(session)); 
});

// Stop
// ------------------------------------
// built-in stop intent support 
//
// example text: 
//      alexa, stop
//
addAppIntent(config.intents.stop, (slots, session, data) => {
    return navigation.stop(sessionContext.create(session)); 
});

// Help 
// ------------------------------------
// built-in help intent support
//
// example text: 
//      help
//
addAppIntent(config.intents.help, (slots, session, data) => {
    return responseBuilder.buildHelpResponse(sessionContext.create(session)); 
});

// CallManufacturer
// ------------------------------------
// calls manufacturer via user's connected mobile
//
// example text: 
//      call Kenmore
//
addAppIntentAsync(config.intents.callManufacturer, async((slots, session, data) => {
    return await(phone.callManufacturer(sessionContext.create(session), slots.manufacturer)); 
}));

// CallBimsmithSupport 
// ------------------------------------
// calls support via user's connected mobile
//
// example text: 
//      call support
//
addAppIntentAsync(config.intents.callBimsmithSupport, async((slots, session, data) => {
    return await(phone.callBimsmithSupport(sessionContext.create(session))); 
}));

// Goodbye 
// ------------------------------------
// goodbye intent 
//
// example text: 
//      goodbye
//
addAppIntent(config.intents.goodbye, (slots, session, data) => {
    return responseBuilder.responseWithCard(config.ui.goodbye.text, config.ui.goodbye.card, null, sessionContext.create(session), true); 
});

module.exports = {
    app: app
};