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
                "get a list of manufacturers for {category:Category}"
            ]
        },
        getCategoriesForManufacturer: {
            name: 'GetCategoriesForManufacturerIntent',
            utterances: [
                "get a list of categories for {manufacturer:Manufacturer}"
            ]
        },
        getDetails: {
            name: 'GetDetailsIntent',
            utterances: [
                "get details for {entity:Entity}",
                "get details"
            ]
        },
        getProductFeatures: {
            name: 'GetProductFeaturesIntent',
            utterances: [
                "what {feature:Feature} does it come in",
                "what {feature:Feature} does {product:Product} come in"
            ]
        },
        getAllProductFeatures: { //TODO: add to interaction model in skill 
            name: 'GetAllProductFeaturesIntent',
            utterances: [
                "what features does {product:Product} support"
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
        getProducts: {
            name: 'GetProductsIntent',
            utterances: [
                "get products for {entity:Entity}"
            ]
        },
        getProductsCount: {
            name: 'GetProductsCountIntent',
            utterances: [
                "how many products for {entity:Entity}"
            ]
        },
        queryProductByFeature: {//TODO: add to interaction model in skill 
            name: 'QueryProductByFeatureIntent',
            utterances: [
                "what {category:Category} by {manufacturer:Manufacturer} have a {feature:Feature} of {featureValue:AMAZON.LITERAL}"
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
            text: configUtil.getSetting('TEXT_LAUNCH_PROMPT', "Welcome to the Bimsmith Skill version {version}. Ask for 'help' to get a list of commands."),
            reprompt: configUtil.getSetting('REPROMPT_LAUNCH', "Try asking for a list of categories or manufacturers"),
            card: configUtil.getSetting('CARD_LAUNCH_PROMPT', 'Launch')
        },
        unknownIntent: {
            text: configUtil.getSetting('TEXT_UNKNOWN_INTENT', 'Sorry, your request was not recognized.'),
            reprompt: configUtil.getSetting('REPROMPT_UNKNOWN', 'Sorry, your request was not recognized. Want to try again?'),
            card: configUtil.getSetting('CARD_UNKNOWN_INTENT', 'Unknown Intent')
        },
        help: {
            //TODO: add more examples
            text: configUtil.getSetting('TEXT_HELP', "You can ask for a list of categories, or a list of manufacturers. Navigation commands will help you to navigate through lists of results. Following is a list of example commands: " + 
                "List all categories. " + 
                "List all manufacturers. " + 
                "What products are in Optical Turnstiles? " + 
                "What products does Kenmore have? " + 
                "How many products does Kenmore have? " + 
                "How many products are there in Optical Turnstiles? " + 
                "What finishes does 24 inch Built-In Dishwasher by Kenmore come in? ",
                "What features does Speed lane Slide by Boon Edam USA support? ",
                "What dishwashers by Kenmore come in Stainless Steel finish? ",
                "What manufacturers have products for Optical Turnstiles? ", 
                "What categories does Kenmore have products for? "),
            reprompt: configUtil.getSetting('REPROMPT_HELP', "Try this command: list all categories. "),
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
            text: configUtil.getSetting('TEXT_MFG_FOR_CATEGORY', 'Manufacturers for {name}: '),
            reprompt: null,
            card: configUtil.getSetting('CARD_MFG_FOR_CATEGORY', 'Manufacturers for Category')
        },
        categoriesForManufacturer: {
            text: configUtil.getSetting('TEXT_CATEGORY_FOR_MFG', 'Categories for {name}: '),
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
            text: configUtil.getSetting('TEXT_NO_DETAILS_FOR_CATEGORY', 'Sorry, no details are available for this category.'),
            reprompt: configUtil.getSetting('REPROMPT_NO_DETAILS_FOR_CATEGORY', '')
        },
        noDetailsForManufacturer: {
            text: configUtil.getSetting('TEXT_NO_DETAILS_FOR_MFG', 'Sorry, no details are available for this manufacturer.'),
            reprompt: configUtil.getSetting('REPROMPT_NO_DETAILS_FOR_MFG', '')
        },
        noDetailsForProduct: {
            text: configUtil.getSetting('TEXT_NO_DETAILS_FOR_PROD', 'Sorry, no details are available for this product.'),
            reprompt: configUtil.getSetting('REPROMPT_NO_DETAILS_FOR_MFG', '')
        },
        manufacturerNotFound: {
            text: configUtil.getSetting('TEXT_MFG_NOT_FOUND', 'Sorry, no manufacturer by the name {name} was found.'),
            reprompt: configUtil.getSetting('REPROMPT_MFG_NOT_FOUND', ''),
            card: configUtil.getSetting('CARD_MFG_NOT_FOUND', 'Manufacturer Not Found') 
        }, 
        categoryNotFound: {
            text: configUtil.getSetting('TEXT_CATEGORY_NOT_FOUND', 'Sorry, no category by the name {name} was found.'),
            reprompt: configUtil.getSetting('REPROMPT_CATEGORY_NOT_FOUND', ''),
            card: configUtil.getSetting('CARD_CATEGORY_NOT_FOUND', 'Category Not Found')
        },
        productNotFound: {
            text: configUtil.getSetting('TEXT_PRODUCT_NOT_FOUND', 'Sorry, no product by the name {name} was found.'),
            reprompt: configUtil.getSetting('REPROMPT_PRODUCT_NOT_FOUND', ''),
            card: configUtil.getSetting('CARD_PRODUCT_NOT_FOUND', 'Product Not Found')
        },
        entityNotFound: {
            text: configUtil.getSetting('TEXT_ENTITY_NOT_FOUND', 'Sorry, {name} could not be found.'),
            reprompt: configUtil.getSetting('REPROMPT_ENTITY_NOT_FOUND', ''),
            card: configUtil.getSetting('CARD_ENTITY_NOT_FOUND', '{name} Not Found')
        },
        manufacturerPhoneFound: {
            text: configUtil.getSetting('TEXT_MFG_PHONE_FOUND', 'The phone number for {name} is {value}.'),
            reprompt: configUtil.getSetting('REPROMPT_MFG_PHONE_FOUND', ''),
            card: configUtil.getSetting('CARD_MFG_PHONE_FOUND', 'Phone Number for {name}')
        },
        manufacturerPhoneNotFound: {
            text: configUtil.getSetting('TEXT_MFG_PHONE_NOT_FOUND', 'Sorry, no phone number is available for {name}.'),
            reprompt: configUtil.getSetting('REPROMPT_MFG_PHONE_NOT_FOUND', ''),
            card: configUtil.getSetting('CARD_MFG_PHONE_NOT_FOUND', 'Phone Number Not Found')
        },
        manufacturerAddressFound: {
            text: configUtil.getSetting('TEXT_MFG_ADDR_FOUND', 'The street address for {name} is {value}.'),
            reprompt: configUtil.getSetting('REPROMPT_MFG_ADDR_FOUND', ''),
            card: configUtil.getSetting('CARD_MFG_ADDDR_FOUND', 'Address for {name}')
        },
        manufacturerAddressNotFound: {
            text: configUtil.getSetting('TEXT_MFG_ADDR_NOT_FOUND', 'Sorry, no street address is available for {name}.'),
            reprompt: configUtil.getSetting('REPROMPT_MFG_ADDR_NOT_FOUND', ''),
            card: configUtil.getSetting('CARD_MFG_ADDR_NOT_FOUND', 'Address Not Found')
        },
        productsForManufacturer: {
            text: configUtil.getSetting('TEXT_PRODUCTS_FOR_MFG', 'Found {count} products for {name}.'),
            reprompt: configUtil.getSetting('REPROMPT_PRODUCTS_FOR_MFG', ''),
            card: configUtil.getSetting('CARD_PRODUCTS_FOR_MFG', 'Products for {name}')
        },
        noProductsForManufacturer: {
            text: configUtil.getSetting('TEXT_NO_PRODUCTS_FOR_MFG', 'Sorry, no products were found for {name}.'),
            reprompt: configUtil.getSetting('REPROMPT_NO_PRODUCTS_FOR_MFG', ''),
            card: configUtil.getSetting('CARD_NO_PRODUCTS_FOR_MFG', 'No Products Found')
        },
        numProductsForManufacturer: {
            text: configUtil.getSetting('TEXT_NUM_PRODUCTS_FOR_MFG', '{count} products found for {name}.'),
            reprompt: configUtil.getSetting('REPROMPT_NUM_PRODUCTS_FOR_MFG', ''),
            card: configUtil.getSetting('CARD_NUM_PRODUCTS_FOR_MFG', '{count} products found for {name}')
        },
        productsForCategory: {
            text: configUtil.getSetting('TEXT_PRODUCTS_FOR_CAT', 'Found {count} products for {name}.'),
            reprompt: configUtil.getSetting('REPROMPT_PRODUCTS_FOR_CAT', ''),
            card: configUtil.getSetting('CARD_PRODUCTS_FOR_CAT', 'Products for {name}')
        },
        noProductsForCategory: {
            text: configUtil.getSetting('TEXT_NO_PRODUCTS_FOR_CAT', 'Sorry, no products were found for {name}.'),
            reprompt: configUtil.getSetting('REPROMPT_NO_PRODUCTS_FOR_CAT', ''),
            card: configUtil.getSetting('CARD_NO_PRODUCTS_FOR_CAT', 'No Products Found')
        },
        numProductsForCategory: {
            text: configUtil.getSetting('TEXT_NUM_PRODUCTS_FOR_CAT', '{count} products found for {name}.'),
            reprompt: configUtil.getSetting('REPROMPT_NUM_PRODUCTS_FOR_CAT', ''),
            card: configUtil.getSetting('CARD_NUM_PRODUCTS_FOR_CAT', '{count} products found for {name}')
        },
        productsForEntity: {
            text: configUtil.getSetting('TEXT_PRODUCTS_FOR_ENTITY', 'Found {count} products for {name}.'),
            reprompt: configUtil.getSetting('REPROMPT_PRODUCTS_FOR_ENTITY', ''),
            card: configUtil.getSetting('CARD_PRODUCTS_FOR_ENTITY', 'Products for {name}')
        },
        noProductsForEntity: {
            text: configUtil.getSetting('TEXT_NO_PRODUCTS_FOR_ENTITY', 'Sorry, no products were found for {name}.'),
            reprompt: configUtil.getSetting('REPROMPT_NO_PRODUCTS_FOR_ENTITY', ''),
            card: configUtil.getSetting('CARD_NO_PRODUCTS_FOR_ENTITY', 'No Products Found')
        },
        numProductsForEntity: {
            text: configUtil.getSetting('TEXT_NUM_PRODUCTS_FOR_ENTITY', '{count} products found for {name}.'),
            reprompt: configUtil.getSetting('REPROMPT_NUM_PRODUCTS_FOR_ENTITY', ''),
            card: configUtil.getSetting('CARD_NUM_PRODUCTS_FOR_ENTITY', '{count} products found for {name}')
        },
        featureNotSupported: {
            text: configUtil.getSetting('TEXT_FEATURE_NOT_SUPPORTED', 'Sorry, the feature {feature} is not supported for product {name}.'),
            reprompt: configUtil.getSetting('REPROMPT_FEATURE_NOT_SUPPORTED', ''),
            card: configUtil.getSetting('CARD_FEATURE_NOT_SUPPORTED', 'Feature Not Supported')
        },
        featureSupported: {
            text: configUtil.getSetting('TEXT_FEATURE_SUPPORTED', 'Product {name} supports the following {feature}: {value}'),
            reprompt: configUtil.getSetting('REPROMPT_FEATURE_SUPPORTED', ''),
            card: configUtil.getSetting('CARD_FEATURE_SUPPORTED', 'Feature Supported')
        },
        noFeatures: {
            text: configUtil.getSetting('TEXT_NO_FEATURES', 'No features are listed for {name}'),
            reprompt: configUtil.getSetting('REPROMPT_NO_FEATURES', ''),
            card: configUtil.getSetting('CARD_NO_FEATURES', 'No Features Listed')
        },
        productAllFeatures: {
            text: configUtil.getSetting('TEXT_ALL_FEATURES', 'Product {name} supports the following features: {content}'),
            reprompt: configUtil.getSetting('REPROMPT_ALL_FEATURES', ''),
            card: configUtil.getSetting('CARD_ALL_FEATURES', 'Features for {name}')
        }
    },
};

