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
        getCategoriesForManufacturer: {
            name: 'GetCategoriesForManufacturerIntent',
            utterances: [
                "get a list of categories for {entity:Entity}"
            ]
        },
        getDetails: {
            name: 'GetDetailsIntent',
            utterances: [
                "get details for {entity:Entity}"
            ]
        },
        getManufacturerPhone: {
            name: 'GetManufacturerPhoneIntent',
            utterances: [
                "get phone number for {entity:Entity}"
            ]
        },
        getManufacturerAddress: {
            name: 'GetManufacturerAddressIntent',
            utterances: [
                "get address for {entity:Entity}"
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
        categoriesForManufacturer: {
            text: configUtil.getSetting('TEXT_CATEGORY_FOR_MFG', 'Categories for Manufacturer.'),
            reprompt: null,
            card: configUtil.getSetting('CARD_CATEGORY_FOR_MFG', 'Categories for Manufacturer')
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
        },
        noDetailsForCategory: {
            text: configUtil.getSetting('TEXT_NO_DETAILS_FOR_CATEGORY', 'Sorry, no details are available for this category.')
        },
        noDetailsForManufacturer: {
            text: configUtil.getSetting('TEXT_NO_DETAILS_FOR_MFG', 'Sorry, no details are available for this manufacturer.')
        },
        manufacturerNotFound: {
            text: configUtil.getSetting('TEXT_MFG_NOT_FOUND', 'Sorry, no manufacturer by the name {name} was found.'),
            card: configUtil.getSetting('CARD_MFG_NOT_FOUND', 'Manufacturer Not Found') 
        }, 
        categoryNotFound: {
            text: configUtil.getSetting('TEXT_CATEGORY_NOT_FOUND', 'Sorry, no category by the name {name} was found.'),
            card: configUtil.getSetting('CARD_CATEGORY_NOT_FOUND', 'Category Not Found')
        },
        manufacturerPhoneNumberFound: {
            text: configUtil.getSetting('TEXT_MFG_PHONE_FOUND', 'The phone number for {name} is {value}.'),
            card: configUtil.getSetting('CARD_MFG_PHONE_FOUND', 'Phone Number for {name}')
        },
        manufacturerPhoneNumberNotFound: {
            text: configUtil.getSetting('TEXT_MFG_PHONE_NOT_FOUND', 'Sorry, no phone number is available for {name}.'),
            card: configUtil.getSetting('CARD_MFG_PHONE_NOT_FOUND', 'Phone Number Not Found')
        },
        manufacturerAddressFound: {
            text: configUtil.getSetting('TEXT_MFG_ADDR_FOUND', 'The street address for {name} is {value}.'),
            card: configUtil.getSetting('CARD_MFG_ADDDR_FOUND', 'Address for {name}')
        },
        manufacturerAddressNotFound: {
            text: configUtil.getSetting('TEXT_MFG_ADDR_NOT_FOUND', 'Sorry, no street address is available for {name}.'),
            card: configUtil.getSetting('CARD_MFG_ADDR_NOT_FOUND', 'Address Not Found')
        },
        productsForManufacturer: {
            text: configUtil.getSetting('TEXT_PRODUCTS_FOR_MFG', 'Found {count} products for {name}.'),
            card: configUtil.getSetting('CARD_PRODUCTS_FOR_MFG', 'Products for {name}')
        },
        noProductsForManufacturer: {
            text: configUtil.getSetting('TEXT_NO_PRODUCTS_FOR_MFG', 'Sorry, no products were found for {name}.'),
            card: configUtil.getSetting('CARD_NO_PRODUCTS_FOR_MFG', 'No Products Found')
        }
    },
};

