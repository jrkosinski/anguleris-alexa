'use strict';

const configUtil = require('anguleris-common').config;

module.exports = {

    intents: {
        getVersion: {
            name: 'GetVersionIntent',
            utterances: [
                "what is the current version",
                "what's the current version",
                "what is the latest version",
                "what's the latest version",
                "get the version number",
                "get the current version",
                "get the latest version",
                "what is the current version",
                "what's the current version number",
                "what is the latest version number",
                "what's the latest version number",
                "get the version number number",
                "get the current version number",
                "get the latest version number",
                "get version info"
            ]
        },
        getCategories: {
            name: 'GetCategoriesIntent',
            utterances: [
                "get a list of categories"
            ]
        }
    },

    ui: {
        useCards: true,

        clientSkillId: configUtil.getSetting('CLIENT_SKILL_ID', 'amzn1.ask.skill.7d8d4528-2a07-4d49-8026-4fa4a81aee51'),

        text: {
            launchPrompt: configUtil.getSetting('TEXT_LAUNCH_PROMPT', "Welcome to the Anguleris Alexa Skill. This skill is to be a development base for what's to come. For now, try asking 'what is the current version?' or 'get a list of categories'."),
            launchReprompt: configUtil.getSetting('TEXT_LAUNCH_REPROMPT', "Try asking 'what is the current version?'"),
            errorReprompt: configUtil.getSetting('TEXT_ERROR_REPROMPT', 'Sorry, an error has occurred. Want to try again?'),
            unknownIntent: configUtil.getSetting('TEXT_UNKNOWN_INTENT', 'Sorry, your request was not recognized.'),
            helpText: configUtil.getSetting('TEXT_HELP', "Try asking 'Alexa, ask Anguleris what's the current version?"),
            generalError: configUtil.getSetting('TEXT_GENERAL_ERROR', 'Sorry, an error has occurred.'),
            getVersion: configUtil.getSetting('TEXT_GET_VERSION', 'Anguleris Alexa Skill version {version}, copyright Anguleris Technologies 2018'),
            pause: configUtil.getSetting('TEXT_PAUSE', 'Pause'),
            resume: configUtil.getSetting('TEXT_RESUME', 'Resume'),
        },

        cards : {
            launchPrompt: configUtil.getSetting('CARD_LAUNCH_PROMPT', 'Launch'),
            getVersion: configUtil.getSetting('CARD_GET_VERSION', 'Get Version'),
            unknownIntent: configUtil.getSetting('CARD_UNKNOWN_INTENT', 'Unknown Intent'),
            helpText: configUtil.getSetting('CARD_HELP', 'Help'),
            generalError: configUtil.getSetting('CARD_GENERAL_ERROR', 'General Error'),
            pause: configUtil.getSetting('CARD_PAUSE', 'Pause'),
            resume: configUtil.getSetting('CARD_RESUME', 'Resume'),
            mediaOutput: configUtil.getSetting('CARD_MEDIA_OUTPUT', 'Media Output'),
            categoriesList: configUtil.getSetting('CARD_CATEGORIES_LIST', 'Categories List')
        }
    },
};

