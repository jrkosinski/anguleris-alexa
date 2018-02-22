'use strict';

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
        'categories',
        'name', 
        config.ui.cards.categoriesList, 
        0, 
        'Found {count} results. Results {start} to {end} of {count}. ',
        'Say next, previous, start over, or stop. '
    ); 
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
addAppIntent(config.intents.startOver, (slots, attrs, data) => {
    return navigation.startOver(attrs); 
});

// Stop
addAppIntent(config.intents.stop, (slots, attrs, data) => {
    return navigation.stop(attrs); 
});


module.exports = {
    app: app
};