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


app.customSlot('Entity', ['Access Security','Appliances','AV','Cable Tray','Ceilings','Countertops','Door Hardware','Doors','Drains','Flooring','Furniture','Mailboxes','Lighting','Paints & Coatings','Piping','Railings','Roofing','Security Cameras','Skylights','Alucobond','Behr','Boon Edam USA','Chalfant','Clark Dietrich','Delta Turnstiles','Dow Corning','Epilay','Fabral','Grabber','Kenmore','Moen','National Gypsum','Oatey','Ply Gem','Polyset','Proflex','Trex','W.R. Meadows','Waterworks']);

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
app.onStart(() => {
    return exception.try(() => {
        logger.info('App launched'); 
        return responseBuilder.responseWithCardShortcut('launchPrompt'); 
    });
});

// GetVersion
addAppIntent(config.intents.getVersion, (slots, session, data) => {
    var versionText = config.ui.getVersion.text.replaceAll('{version}', pkg.version);
    return responseBuilder.responseWithCard(versionText, config.ui.getVersion.card, null, null, true); 
});

// GetCategories
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
addAppIntent(config.intents.getManufacturersForCategory, (slots, session, data) => {
    var queryParams = { category: slots.entity}; 
    var manufacturers = query.runQuery(enums.querySubject.manufacturers, queryParams); 
    
    //TODO: add reprompt
    return responseBuilder.listToText(
        manufacturers, 
        config.ui.manufacturersForCategory.text.replaceAll('{name}', queryParams.category), 
        null, 
        config.ui.manufacturersForCategory.card, 
        session
    ); 
});

// GetCategoriesForManufacturer
addAppIntent(config.intents.getCategoriesForManufacturer, (slots, session, data) => {
    var queryParams = { manufacturer: slots.entity}; 
    var categories = query.runQuery(enums.querySubject.categories, queryParams); 
    
    //TODO: add reprompt
    if (categories) {
        categories = common.arrays.select(categories, 'name'); 
    }

    return responseBuilder.listToText(
        categories, 
        config.ui.categoriesForManufacturer.text.replaceAll('{name}', queryParams.manufacturer), 
        null, 
        config.ui.categoriesForManufacturer.card, 
        session
    ); 
});

// GetDetails
addAppIntent(config.intents.getDetails, (slots, session, data) => {
    return queryHelper.getDetails(session, slots.entity); 
});

// GetManufacturerPhone
addAppIntent(config.intents.getManufacturerPhone, (slots, session, data) => {
    return queryHelper.getManufacturerPhone(session, slots.entity); 
});

// GetManufacturerAddress
addAppIntent(config.intents.getManufacturerAddress, (slots, session, data) => {
    return queryHelper.getManufacturerAddress(session, slots.entity); 
});

// GetProducts
addAppIntent(config.intents.getProducts, (slots, session, data) => {
    return queryHelper.getProductsForEntity(session, slots.entity); 
});

// Repeat
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
addAppIntent(config.intents.moveNext, (slots, session, data) => {
    return navigation.moveNext(session); 
});

// Prev
addAppIntent(config.intents.movePrev, (slots, session, data) => {
    return navigation.movePrev(session); 
});

// Start Over
addAppIntent(config.intents.moveFirst, (slots, session, data) => {
    return navigation.moveFirst(session); 
});

// Stop
addAppIntent(config.intents.stop, (slots, session, data) => {
    return navigation.stop(session); 
});

// Help 
addAppIntent(config.intents.help, (slots, session, data) => {
    return responseBuilder.buildHelpResponse(session); 
});

// FreeText
addAppIntent(config.intents.freeText, (slots, session, data) => {
    return responseBuilder.responseWithCard("I think now that we've established a solid code foundation for retrieving and navigating result sets, and handling user input, it would be good to move on to more complex types of queries. For this I think it would be essential to get access to the actual data and querying mechanisms. We could also do a bit more brainstorming and analyzing to determine what's possible. Otherwise, I am open to suggestions. It might be worth our while to do a quick call this week to discuss.", 'FreeText', null, null, true);
});


module.exports = {
    app: app
};