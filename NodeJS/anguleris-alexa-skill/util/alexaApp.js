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
var categoryNames = []; //dataAccess.getAllCategoryNames();
var manufacturerNames = []; //dataAccess.getAllManufacturerNames(); 
var productNames = []; //dataAccess.getAllProductNames(); 

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
            var context = sessionContext.create(slots, attr, data); 
            return exception.try(() => {

                logger.info('Intent invoked: ' + intent.name); 
                logger.info('Data: ' + JSON.stringify(data)); 
                logger.info('Slots: ' + JSON.stringify(slots)); 
                logger.info('Session: ' + JSON.stringify(attr)); 
                return func(context, slots, attr, data); 
            }, { 
                defaultValue:responseBuilder.generalError(context, false, true)
            });
        }
    );
}

// ------------------------------------------------------------------------------------------------------
// utility for specifying an intent handler for async intent handlers
// 
// returns: nothing 
const addAppIntentAsync = (intent, func) => {
    app.intent(
        intent.name,
        intent.utterances, 
        async((slots, attr, data, done) => {
            var context = sessionContext.create(slots, attr, data); 
            var defaultOutput = responseBuilder.generalError(context, false, true); 
            var output = null; 

            try {
                logger.info('Intent invoked: ' + intent.name); 
                logger.info('Data: ' + JSON.stringify(data)); 
                logger.info('Slots: ' + JSON.stringify(slots)); 
                logger.info('Session: ' + JSON.stringify(attr)); 

                var output = await(func(context, slots, attr, data)); 
            }
            catch(e) {
                exception.handleError(e); 
                output = defaultOutput;
            }

            if (!output)
                output = defaultOutput; 

            done(output); 
        })
    );
}; 

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
addAppIntent(config.intents.getVersion, (context, slots, session, data) => {
    return responseBuilder.responseWithCardShortcut('getVersion', {version: pkg.version}, context, true); 
});

// GetCategories
// ------------------------------------
// gets a navigable list of all categories
//
// example text: 
//      get a list of categories
//
addAppIntentAsync(config.intents.getCategories, (context, slots, session, data) => {
    return await(queryHelper.getCategories(context)); 
});

// GetManufacturers
// ------------------------------------
// gets a navigable list of all manufacturers
//
// example text: 
//      get a list of manufacturers
//
addAppIntentAsync(config.intents.getManufacturers, (context, slots, session, data) => {
    return await(queryHelper.getManufacturers(context)); 
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
addAppIntentAsync(config.intents.getManufacturersForCategory, (context, slots, session, data) => {
    return await(queryHelper.getManufacturersForCategory(context, slots.category)); 
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
addAppIntentAsync(config.intents.getCategoriesForManufacturer, (context, slots, session, data) => {
    return await(queryHelper.getCategoriesForManufacturer(context, slots.manufacturer)); 
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
addAppIntentAsync(config.intents.getDetails, (context, slots, session, data) => {
    return await(queryHelper.getDetails(context, slots.entity)); 
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
addAppIntentAsync(config.intents.getProductFeatureValues, (context, slots, session, data) => {
    return await(queryHelper.getProductFeatureValues(context, enums.productFeature.normalizeFeatureName(slots.feature), slots.product)); 
});

addAppIntentAsync(config.intents.getProductFinishes, (context, slots, session, data) => {
    return await(queryHelper.getProductFeatureValues(context, 'finish', slots.product)); 
});

addAppIntentAsync(config.intents.getProductColors, (context, slots, session, data) => {
    return await(queryHelper.getProductFeatureValues(context, 'color', slots.product)); 
});

addAppIntentAsync(config.intents.getProductHeights, (context, slots, session, data) => {
    return await(queryHelper.getProductFeatureValues(context, 'height', slots.product)); 
});

addAppIntentAsync(config.intents.getProductWidths, (context, slots, session, data) => {
    return await(queryHelper.getProductFeatureValues(context, 'width', slots.product)); 
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
addAppIntentAsync(config.intents.getAllProductFeatures, (context, slots, session, data) => {
    return await(queryHelper.getAllProductFeatures(context, slots.product, slots.category)); 
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
addAppIntentAsync(config.intents.getManufacturerPhone, (context, slots, session, data) => {
    return await(queryHelper.getManufacturerPhone(context, slots.manufacturer)); 
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
addAppIntentAsync(config.intents.getManufacturerAddress, (context, slots, session, data) => {
    return await(queryHelper.getManufacturerAddress(context, slots.manufacturer)); 
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
addAppIntentAsync(config.intents.getProducts, (context, slots, session, data) => {
    return await(queryHelper.getProductsForEntity(context, slots.entity)); 
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
addAppIntentAsync(config.intents.queryProducts, (context, slots, session, data) => {
    return await(queryHelper.getProductsByMfgAndCategory(context, slots.category, slots.manufacturer)); 
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
addAppIntentAsync(config.intents.getProductsCount, (context, slots, session, data) => {
    return await(queryHelper.getProductsCountForEntity(context, slots.entity)); 
});

addAppIntentAsync(config.intents.getFinishesForCategory, (context, slots, session, data) => {
    return await(queryHelper.getFeatureValuesForCategory(context, slots.category, 'finish')); 
});

addAppIntentAsync(config.intents.getColorsForCategory, (context, slots, session, data) => {
    return await(queryHelper.getFeatureValuesForCategory(context, slots.category, 'color')); 
});

addAppIntentAsync(config.intents.getHeightsForCategory, (context, slots, session, data) => {
    return await(queryHelper.getFeatureValuesForCategory(context, slots.category, 'height')); 
});

addAppIntentAsync(config.intents.getWidthsForCategory, (context, slots, session, data) => {
    return await(queryHelper.getFeatureValuesForCategory(context, slots.category, 'width')); 
});


// QueryProductByFeature
// ------------------------------------
//
// example text: 
//      get 
//
addAppIntentAsync(config.intents.queryProductByFeature, (context, slots, session, data) => {
    return await(queryHelper.queryProducts(context, slots.category, enums.productFeature.normalizeFeatureName(slots.feature), slots.featureValue)); 
}); 

addAppIntentAsync(config.intents.queryProductByFinish, (context, slots, session, data) => {
    return await(queryHelper.queryProducts(context, slots.category, 'finish', slots.featureValue)); 
}); 

addAppIntentAsync(config.intents.queryProductByColor, (context, slots, session, data) => {
    return await(queryHelper.queryProducts(context, slots.category, 'color', slots.featureValue)); 
}); 

addAppIntentAsync(config.intents.queryProductByHeight, (context, slots, session, data) => {
    return await(queryHelper.queryProducts(context, slots.category, 'height', slots.featureValue)); 
}); 

addAppIntentAsync(config.intents.queryProductByWidth, (context, slots, session, data) => {
    return await(queryHelper.queryProducts(context, slots.category, 'width', slots.featureValue)); 
}); 

// QueryProductByMfgFeature
// ------------------------------------
//
// example text: 
//      get 
//
addAppIntentAsync(config.intents.queryProductByMfgFeature, (context, slots, session, data) => {
    return await(queryHelper.queryProducts(context, slots.category, enums.productFeature.normalizeFeatureName(slots.feature), slots.featureValue, slots.manufacturer)); 
}); 

addAppIntentAsync(config.intents.queryProductByMfgFinish, (context, slots, session, data) => {
    return await(queryHelper.queryProducts(context, slots.category, 'finish', slots.featureValue, slots.manufacturer)); 
}); 

addAppIntentAsync(config.intents.queryProductByMfgColor, (context, slots, session, data) => {
    return await(queryHelper.queryProducts(context, slots.category, 'color', slots.featureValue, slots.manufacturer)); 
}); 

addAppIntentAsync(config.intents.queryProductByMfgHeight, (context, slots, session, data) => {
    return await(queryHelper.queryProducts(context, slots.category, 'height', slots.featureValue, slots.manufacturer)); 
}); 

addAppIntentAsync(config.intents.queryProductByMfgWidth, (context, slots, session, data) => {
    return await(queryHelper.queryProducts(context, slots.category, 'width', slots.featureValue, slots.manufacturer)); 
}); 

// Repeat
// ------------------------------------
// repeats the last thing said (from session) 
//
// example text: 
//      repeat
//
addAppIntent(config.intents.repeat, (context, slots, session, data) => {
    if (session.text) {
        //TODO: add reprompt?
        return responseBuilder.responseWithCard(session.text, 'Repeat', null, context); 
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
addAppIntentAsync(config.intents.moveNext, (context, slots, session, data) => {
    return await(navigation.moveNext(context)); 
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
addAppIntentAsync(config.intents.movePrev, (context, slots, session, data) => {
    return await(navigation.movePrev(context)); 
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
addAppIntentAsync(config.intents.moveFirst, (context, slots, session, data) => {
    return await(navigation.moveFirst(context)); 
});

// Stop
// ------------------------------------
// built-in stop intent support 
//
// example text: 
//      alexa, stop
//
addAppIntent(config.intents.stop, (context, slots, session, data) => {
    return navigation.stop(context); 
});

// Help 
// ------------------------------------
// built-in help intent support
//
// example text: 
//      help
//
addAppIntent(config.intents.help, (context, slots, session, data) => {
    return responseBuilder.buildHelpResponse(context); 
});

// CallManufacturer
// ------------------------------------
// calls manufacturer via user's connected mobile
//
// example text: 
//      call Kenmore
//
addAppIntentAsync(config.intents.callManufacturer, (context, slots, session, data) => {
    return await(phone.callManufacturer(context, slots.manufacturer)); 
});

// CallBimsmithSupport 
// ------------------------------------
// calls support via user's connected mobile
//
// example text: 
//      call support
//
addAppIntentAsync(config.intents.callBimsmithSupport, (context, slots, session, data) => {
    return await(phone.callBimsmithSupport(context)); 
});

// Goodbye 
// ------------------------------------
// goodbye intent 
//
// example text: 
//      goodbye
//
addAppIntent(config.intents.goodbye, (context, slots, session, data) => {
    return responseBuilder.responseWithCard(config.ui.goodbye.text, config.ui.goodbye.card, null, context, true); 
});

module.exports = {
    app: app
};