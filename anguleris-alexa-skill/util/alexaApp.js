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
const stringUtil = common.strings;

const config = require('../config');
const navigation = require('./navigation');
const query = require('./query');
const enums = require('./enums');
const responseBuilder = require('./responseBuilder');
const pkg = require('../package.json');

// * * * 
// utility for specifying an intent handler 
// 
// returns: nothing 
function addAppIntent(intent, func) {
    app.intent(intent.name,
        intent.utterances, (slots, attr, data) => {
            return exception.try(() => {
                return func(slots, attr, data); 
            });
        }
    );
}

// Startup
app.onStart(() => {
    return exception.try(() => {
        return responseBuilder.responseWithCard(config.ui.text.launchPrompt, config.ui.cards.launchPrompt); 
    });
});

// GetVersion
addAppIntent(config.intents.getVersion, (slots, attrs, data) => {
    var versionText = config.ui.text.getVersion.replaceAll('{version}', pkg.version);
    return responseBuilder.responseWithCard(versionText, config.ui.cards.getVersion); 
});

// GetCategories
addAppIntent(config.intents.getCategories, (slots, attrs, data) => {
    var categories = query.runQuery(enums.querySubject.categories)
    
    return responseBuilder.responseListGroup (
        categories, 
        { subject: enums.querySubject.categories },
        'name', 
        config.ui.cards.categoriesList, 
        0, 
        'Found {count} categories. Results {start} to {end} of {count}. ',
        'Say next, previous, start over, or stop. '
    ); 
});

// GetManufacturers
addAppIntent(config.intents.getManufacturers, (slots, attrs, data) => {
    var manufacturers = query.runQuery(enums.querySubject.manufacturers)
    
    return responseBuilder.responseListGroup (
        manufacturers, 
        { subject: enums.querySubject.manufacturers},
        'name', 
        config.ui.cards.manufacturersList, 
        0, 
        'Found {count} manufacturers. Results {start} to {end} of {count}. ',
        'Say next, previous, start over, or stop. '
    ); 
});

// GetManufacturersForCategory
addAppIntent(config.intents.getManufacturersForCategory, (slots, attrs, data) => {
    var queryParams = { category: slots.entity}; 
    var manufacturers = query.runQuery(enums.querySubject.manufacturers, queryParams); 
    
    return responseBuilder.listToText(manufacturers, config.ui.text.manufacturersForCategory, attrs); 
});

// GetDetails
addAppIntent(config.intents.getDetails, (slots, attrs, data) => {
    var categories = query.runQuery(enums.querySubject.categories)
    
    return navigation.getDetails(attrs, slots.entity); 
});

// Repeat
addAppIntent(config.intents.repeat, (slots, attrs, data) => {
    if (attrs.text) {
        return responseBuilder.responseWithCard(text, 'Repeat'); 
    }
    else {
        return responseBuilder.responseWithCard(config.ui.text.launchPrompt, config.ui.cards.launchPrompt); 
    }
});

// Next
addAppIntent(config.intents.moveNext, (slots, attrs, data) => {
    return navigation.moveNext(attrs); 
});

// Prev
addAppIntent(config.intents.movePrev, (slots, attrs, data) => {
    return navigation.movePrev(attrs); 
});

// Start Over
addAppIntent(config.intents.moveFirst, (slots, attrs, data) => {
    return navigation.moveFirst(attrs); 
});

// Stop
addAppIntent(config.intents.stop, (slots, attrs, data) => {
    return navigation.stop(attrs); 
});


module.exports = {
    app: app
};