'use strict';

const async = require('asyncawait/async');
const await = require('asyncawait/await');
const alexa = require("alexia");
const app = alexa.createApp('anguleris-alexa-skill', { shouldEndSessionByDefault: false });

const exception = require('anguleris-common').exceptions('APP');
const logger = require('anguleris-common').logger('APP');

const config = require('../config');
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

addAppIntent(config.intents.getVersioname, () => {
    var versionText = config.ui.text.getVersion.replace('{version}', pkg.version);
    return responseWithCard(versionText, config.ui.cards.getVersion); 
});

addAppIntent(config.intents.getCategories, () => {
    var versionText = config.ui.text.getVersion.replace('{version}', pkg.version);
    return responseWithCard(versionText, config.ui.cards.getVersion); 
});

module.exports = {
    app: app
};