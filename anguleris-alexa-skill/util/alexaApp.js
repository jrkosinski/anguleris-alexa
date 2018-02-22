'use strict';

const async = require('asyncawait/async');
const await = require('asyncawait/await');
const alexa = require("alexia");
const app = alexa.createApp('anguleris-alexa-skill', { shouldEndSessionByDefault: false });

const common = require('anguleris-common');
const exception = common.exceptions('APP');
const logger = common.logger('APP');

const config = require('../config');
const dataAccess = require('./dataAccess');
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
    var versionText = config.ui.text.getVersion.replace('{version}', pkg.version);
    return responseBuilder.responseWithCard(versionText, config.ui.cards.getVersion); 
});

// GetCategories
addAppIntent(config.intents.getCategories, (slots, attrs) => {
    var categories = dataAccess.getCategories();
    var text = ""; 
    for(var n=0; n<categories.length; n++){
        text += categories[n].name; 
        if (n < categories.length-1)
            text += ", ";
    }

    text+= "Say a category name to enter that category."; 
    
    return responseBuilder.responseWithCard(text, config.ui.cards.categoriesList); 
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


module.exports = {
    app: app
};