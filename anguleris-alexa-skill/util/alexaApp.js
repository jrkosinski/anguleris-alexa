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
const enums = require('./enums');
const responseBuilder = require('./responseBuilder');
const pkg = require('../package.json');


function addAppIntent(intent, func) {
    app.intent(intent.name,
        intent.utterances, () => {
            return exception.try(() => {
                return func(); 
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
addAppIntent(config.intents.getVersion, (slots, attrs) => {
    var versionText = config.ui.text.getVersion.replaceAll('{version}', pkg.version);
    return responseBuilder.responseWithCard(versionText, config.ui.cards.getVersion); 
});

// GetCategories
addAppIntent(config.intents.getCategories, (slots, attrs) => {
    var categories = query.runQuery(enums.queryType.categories)
    
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

// Repeat
addAppIntent(config.intents.repeat, (slots, attrs) => {
    if (attrs.text) {
        return responseBuilder.responseWithCard(text, 'Repeat'); 
    }
    else {
        return responseBuilder.responseWithCard(config.ui.text.launchPrompt, config.ui.cards.launchPrompt); 
    }
});

// Next
addAppIntent(config.intents.moveNext, (slots, attrs) => {
    return navigation.moveNext(attrs); 
});

// Prev
addAppIntent(config.intents.movePrev, (slots, attrs) => {
    return navigation.movePrev(attrs); 
});

// Start Over
addAppIntent(config.intents.startOver, (slots, attrs) => {
    return navigation.startOver(attrs); 
});

// Stop
addAppIntent(config.intents.stop, (slots, attrs) => {
    return navigation.stop(attrs); 
});


module.exports = {
    app: app
};