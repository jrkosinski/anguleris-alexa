'use strict';

// * * * * * 
// alexaApp - alexia specification for the app's intents & handlers
// 
// Anguleris Technologies
// John R. Kosinski
//
// 22 Feb 2018
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
const responseBuilder = require('./responseBuilder');
const pkg = require('../package.json');

app.customSlot('Category', dataAccess.getAllCategoryNames());
app.customSlot('Manufacturer', dataAccess.getAllManufacturerNames());
app.customSlot('Entity', common.arrays.merge(dataAccess.getAllCategoryNames(), dataAccess.getAllManufacturerNames())); //['Access Security','Appliances','AV','Cable Tray','Ceilings','Countertops','Door Hardware','Doors','Drains','Flooring','Furniture','Mailboxes','Lighting','Paints & Coatings','Piping','Railings','Roofing','Security Cameras','Skylights','Alucobond','Behr','Boon Edam USA','Chalfant','Clark Dietrich','Delta Turnstiles','Dow Corning','Epilay','Fabral','Grabber','Kenmore','Moen','National Gypsum','Oatey','Ply Gem','Polyset','Proflex','Trex','W.R. Meadows','Waterworks']);
app.customSlot('Feature', enums.allProductFeatureNames()); 
app.customSlot('Product', dataAccess.getAllProductNames()); 

// * * * 
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
            });
        }
    );
}

// Startup
// ------------------------
// runs on session startup 
//
// example text: 
//      open bimsmith
//
app.onStart(() => {
    return exception.try(() => {
        logger.info('App launched'); 
        return responseBuilder.responseWithCard(
            config.ui.launchPrompt.text.replaceAll('{version}', pkg.version), 
            config.ui.launchPrompt.card.replaceAll('{version}', pkg.version), 
            null, null, true
        ); 
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
    var versionText = config.ui.getVersion.text.replaceAll('{version}', pkg.version);
    return responseBuilder.responseWithCard(versionText, config.ui.getVersion.card, null, null, true); 
});

// GetCategories
// ------------------------------------
// gets a navigable list of all categories
//
// example text: 
//      get a list of categories
//
addAppIntent(config.intents.getCategories, (slots, session, data) => {
    var categories = query.runQuery(enums.querySubject.categories)
    
    //TODO: hard-coded text 
    return responseBuilder.responseListGroup (
        categories, 
        { subject: enums.querySubject.categories },
        navigation.getGroupSize(enums.querySubject.categories),
        0, 
        {
            textProperty: 'name', 
            preText: 'Found {count} categories. Results {start} to {end} of {count}. ', 
            postText: 'Say next, get details for category, or get manufacturers for category. ', 
            reprompt: 'Say next, get details for category, or get manufacturers for category. ',
            title: 'Results {start} to {end} of {count}'
        }
    ); 
});

// GetManufacturers
// ------------------------------------
// gets a navigable list of all manufacturers
//
// example text: 
//      get a list of manufacturers
//
addAppIntent(config.intents.getManufacturers, (slots, session, data) => {
    var manufacturers = query.runQuery(enums.querySubject.manufacturers)
    
    //TODO: hard-coded text 
    return responseBuilder.responseListGroup (
        manufacturers, 
        { subject: enums.querySubject.manufacturers},
        navigation.getGroupSize(enums.querySubject.manufacturers),
        0, 
        {
            textProperty: 'name', 
            preText: 'Found {count} manufacturers. Results {start} to {end} of {count}. ', 
            postText: 'Say next to move to next results group. Or ask a different question. ', 
            reprompt: 'Say next to move to next results group. Or ask a different question. ',
            title: 'Results {start} to {end} of {count}'
        }
    ); 
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
    session.queryParams = { category: slots.category};
    var manufacturers = query.runQuery(enums.querySubject.manufacturers, session.queryParams); 
    
    //TODO: add reprompt
    return responseBuilder.listToText(
        manufacturers, 
        config.ui.manufacturersForCategory.text.replaceAll('{name}', session.queryParams.category), 
        null, 
        config.ui.manufacturersForCategory.card, 
        session
    ); 
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
    session.queryParams = { manufacturer: slots.manufacturer};
    var categories = query.runQuery(enums.querySubject.categories, session.queryParams); 
    
    //TODO: add reprompt
    if (categories) {
        categories = common.arrays.select(categories, 'name'); 
    }

    return responseBuilder.listToText(
        categories, 
        config.ui.categoriesForManufacturer.text.replaceAll('{name}', session.queryParams.manufacturer), 
        null, 
        config.ui.categoriesForManufacturer.card, 
        session
    ); 
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
//TODO: how can this get for product if the slot is entity?
addAppIntent(config.intents.getDetails, (slots, session, data) => {
    return queryHelper.getDetails(session, slots.entity); 
});

// GetProductFeatureValues
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
//TODO: change name of this intent
addAppIntent(config.intents.getProductFeatures, (slots, session, data) => {
    return queryHelper.getProductFeatures(session, slots.feature, slots.product); 
});

// GetAllProductFeatures
// ------------------------------------
// gets a simple spoken list of all features (and their values) supported by a given product.
// 
// slots: 
//      product:Product
//
// example text: 
//      what features does {product} support? 
//      get features
//
addAppIntent(config.intents.getAllProductFeatures, (slots, session, data) => {
    return queryHelper.getAllProductFeatures(session, slots.product); 
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
//TODO: change from entity to manufacturer 
addAppIntent(config.intents.getManufacturerPhone, (slots, session, data) => {
    return queryHelper.getManufacturerPhone(session, slots.entity); 
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
//TODO: change from entity to manufacturer 
addAppIntent(config.intents.getManufacturerAddress, (slots, session, data) => {
    return queryHelper.getManufacturerAddress(session, slots.entity); 
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
    return queryHelper.getProductsForEntity(session, slots.entity); 
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
    return queryHelper.getProductsCountForEntity(session, slots.entity); 
});

// QueryProductsByFeature
// ------------------------------------
//
// example text: 
//      get
//
addAppIntent(config.intents.queryProductByFeature, (slots, session, data) => {

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
        return responseBuilder.responseWithCard(session.text, 'Repeat', session.text, session); 
    }
    else {
        return responseBuilder.responseWithCardShortcut('launchPrompt'); 
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
    return navigation.moveNext(session); 
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
    return navigation.movePrev(session); 
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
    return navigation.moveFirst(session); 
});

// Stop
// ------------------------------------
// built-in stop intent support 
//
// example text: 
//      alexa, stop
//
addAppIntent(config.intents.stop, (slots, session, data) => {
    return navigation.stop(session); 
});

// Help 
// ------------------------------------
// built-in help intent support
//
// example text: 
//      help
//
addAppIntent(config.intents.help, (slots, session, data) => {
    return responseBuilder.buildHelpResponse(session); 
});

// FreeText
// ------------------------------------
//
// example text: 
//      get
//
addAppIntent(config.intents.freeText, (slots, session, data) => {
    return responseBuilder.responseWithCard("I think now that we've established a solid code foundation for retrieving and navigating result sets, and handling user input, it would be good to move on to more complex types of queries. For this I think it would be essential to get access to the actual data and querying mechanisms. We could also do a bit more brainstorming and analyzing to determine what's possible. Otherwise, I am open to suggestions. It might be worth our while to do a quick call this week to discuss.", 'FreeText', null, null, true);
});


module.exports = {
    app: app
};