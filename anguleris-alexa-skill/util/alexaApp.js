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
const pkg = require('../package.json');

function responseWithCard(text, title, sessionAttr, shouldEndSession) {
    var output = {
        text: text,
        card: {
            title: title,
            content: text
        },
        shouldEndSession: shouldEndSession ? true: false
    };
        
    output.attrs = {
        text: text
    };

    if (sessionAttr) {
        for(var n=0; n<sessionAttr.length; n++){
            output.attrs[sessionAttr[n].key] = sessionAttr[n].value;
        }
    }

    return output; 
}

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
        return responseWithCard(config.ui.text.launchPrompt, config.ui.cards.launchPrompt); 
    });
});

// GetVersion
addAppIntent(config.intents.getVersion, (slots, attrs) => {
    var versionText = config.ui.text.getVersion.replace('{version}', pkg.version);
    return responseWithCard(versionText, config.ui.cards.getVersion); 
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
    
    return responseWithCard(text, config.ui.cards.categoriesList); 
});

// Repeat
addAppIntent(config.intents.repeat, (slots, attrs) => {
    if (attrs.text) {
        return responseWithCard(text, 'Repeat'); 
    }
    else {
        return responseWithCard(config.ui.text.launchPrompt, config.ui.cards.launchPrompt); 
    }
});

module.exports = {
    app: app
};