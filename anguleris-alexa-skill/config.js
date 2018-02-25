'use strict';

const configUtil = require('anguleris-common').config;

module.exports = {

    //Settings 
    listOutputGroupSize: configUtil.getSetting('LIST_OUTPUT_GROUP_SIZE', 5),
    clientSkillId: configUtil.getSetting('CLIENT_SKILL_ID', 'amzn1.ask.skill.7d8d4528-2a07-4d49-8026-4fa4a81aee51'),

    // Intents
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
        },
        getManufacturers: {
            name: 'GetManufacturersIntent',
            utterances: [
                "get a list of manufacturers"
            ]
        },
        getManufacturersForCategory: {
            name: 'GetManufacturersForCategoryIntent',
            utterances: [
                "get a list of manufacturers for {entity:Entity}"
            ]
        },
        getDetails: {
            name: 'GetDetailsIntent',
            utterances: [
                "get details for {entity:Entity}"
            ]
        },
        repeat: {
            name: 'RepeatIntent',
            utterances: [
                "repeat"
            ]
        }, 
        moveNext: {
            name: 'MoveNextIntent',
            utterances: [
                "next"
            ]
        },
        movePrev: {
            name: 'MovePrevIntent',
            utterances: [
                "previous"
            ]
        },
        moveFirst: {
            name: 'MoveFirstIntent',
            utterances: [
                "move first", 
                "start over"
            ]
        },
        stop: {
            name: 'StopNavIntent',
            utterances: [
                "stop"
            ]
        },
        help: {
            name: 'HelpIntent', 
            utterances: [
                "help"
            ]
        },
        freeText: {
            name: "FreeText",
            utterances: [
                "what do you think we should do next"
            ]
        }
    },

    // UI elements
    ui: {
        launchPrompt: {
            text: configUtil.getSetting('TEXT_LAUNCH_PROMPT', "Welcome to the Anguleris Alexa Skill. This skill is to be a development base for what's to come. For now, try asking 'what is the current version?', 'get a list of categories', or 'get a list of manufacturers'."),
            reprompt: configUtil.getSetting('REPROMPT_LAUNCH', "Try asking 'what is the current version?'"),
            card: configUtil.getSetting('CARD_LAUNCH_PROMPT', 'Launch')
        },
        unknownIntent: {
            text: configUtil.getSetting('TEXT_UNKNOWN_INTENT', 'Sorry, your request was not recognized.'),
            reprompt: configUtil.getSetting('REPROMPT_UNKNOWN', 'Sorry, your request was not recognized. Want to try again?'),
            card: configUtil.getSetting('CARD_UNKNOWN_INTENT', 'Unknown Intent')
        },
        help: {
            text: configUtil.getSetting('TEXT_HELP', "You can ask for a list of categories, or a list of manufacturers. Navigation commands will help you to navigate through lists of results. Furthermore, you can ask for details for a specific category, or manufacturers for a specific category. Example: get manufacturers for category Access Security."),
            reprompt: configUtil.getSetting('REPROMPT_HELP', "Try this command: list all categories."),
            card: configUtil.getSetting('CARD_HELP', 'Help')
        },
        getVersion: {
            text: configUtil.getSetting('TEXT_GET_VERSION', 'Anguleris Alexa Skill version {version}, copyright Anguleris Technologies 2018'),
            reprompt: null,
            card: configUtil.getSetting('CARD_GET_VERSION', 'Get Version')
        },
        noResultsFound: {
            text: configUtil.getSetting('TEXT_NO_RESULTS', 'Sorry, no results found for your query. Do you want to try that again?'), 
            reprompt: configUtil.getSetting('REPROMPT_NO_RESULTS', 'Sorry, no results found for your query. Do you want to try that again?'),
            card: configUtil.getSetting('CARD_NO_RESULTS', 'No Results Found')
        },
        generalError: {
            text: configUtil.getSetting('TEXT_GENERAL_ERROR', 'Sorry, an error has occurred.'),
            reprompt: configUtil.getSetting('REPROMPT_GENERAL_ERROR', 'Sorry, an error has occurred. Want to try again?'),
            card: configUtil.getSetting('CARD_GENERAL_ERROR', 'General Error')
        },
        manufacturersForCategory: {
            text: configUtil.getSetting('TEXT_MFG_FOR_CATEGORY', 'Manufacturers for Category.'),
            reprompt: null,
            card: configUtil.getSetting('CARD_MFG_FOR_CATEGORY', 'Manufacturers for Category')
        },
        pause: {
            text: configUtil.getSetting('TEXT_PAUSE', 'Pause'),
            reprompt: null,
            card: configUtil.getSetting('CARD_PAUSE', 'Pause'),
        },
        resume: {
            text: configUtil.getSetting('TEXT_RESUME', 'Resume'),
            reprompt: null,
            card: configUtil.getSetting('CARD_RESUME', 'Resume')
        },
        notInList: {
            text: configUtil.getSetting('TEXT_NOT_IN_LIST', "Sorry, that's not a valid command, because we're not currently navigating a list result. Do you want to try that again?"),
            reprompt: configUtil.getSetting('REPROMPT_NOT_IN_LIST', 'Do you want to try again?'),
            card: configUtil.getSetting('CARD_INVALID_REQUEST', 'Invalid Request')
        }
    },
};

