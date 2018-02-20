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

function responseWithCard(text, title, shouldEndSession) {
    return {
        text: text,
        card: {
            title: title,
            content: text
        },
        shouldEndSession: shouldEndSession ? true: false
    };
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

app.onStart(() => {
    return exception.try(() => {
        return responseWithCard(config.ui.text.launchPrompt, config.ui.cards.launchPrompt); 
    });
});

addAppIntent(config.intents.getVersion, () => {
    var versionText = config.ui.text.getVersion.replace('{version}', pkg.version);
    return responseWithCard(versionText, config.ui.cards.getVersion); 
});

addAppIntent(config.intents.getCategories, () => {
    var categories = dataAccess.getCategories();
    var text = ""; 
    for(var n=0; n<categories.length; n++){
        text += categories[n].name; 
        if (n < categories.length-1)
            text += ", ";
    }
    return responseWithCard(text, config.ui.cards.categoriesList); 
});

module.exports = {
    app: app
};