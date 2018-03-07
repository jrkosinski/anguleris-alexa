'use strict';

const configUtil = require('anguleris-common').config;

function getUISetting(key, defaults) {
    return {
        text: configUtil.getSetting('TEXT_' + key, (defaults.text ? defaults.text : '')),
        card: configUtil.getSetting('CARD_' + key, (defaults.card ? defaults.card : '')),
        reprompt: configUtil.getSetting('REPROMPT_' + key, (defaults.reprompt ? defaults.reprompt : '')),
    };
}

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
        getProductFeatureValues: {
            name: 'GetProductFeatureValuesIntent',
            utterances: [
                "what {feature:Feature} does {product:Product} come in"
            ]
        },
        getProductFinishes: {
            name: 'GetProductFinishesIntent',
            utterances: [
                "what finishes does {product:Product} come in"
            ]
        },
        getProductHeights: {
            name: 'GetProductHeightsIntent',
            utterances: [
                "what heights does {product:Product} come in"
            ]
        },
        getProductWidths: {
            name: 'GetProductWidthsIntent',
            utterances: [
                "what widths does {product:Product} come in"
            ]
        },
        getAllProductFeatures: { 
            name: 'GetAllProductFeaturesIntent',
            utterances: [
                "what features does {product:Product} support"
            ]
        },
        getManufacturerPhone: {
            name: 'GetManufacturerPhoneIntent',
            utterances: [
                "get phone number for {manufacturer:Manufacturer}"
            ]
        },
        getManufacturerAddress: {
            name: 'GetManufacturerAddressIntent',
            utterances: [
                "get address for {manufacturer:Manufacturer}"
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
        getFinishesForCategory: {
            name: 'GetFinishesForCategoryIntent', 
            utterances: [
                'what finishes are available for {category:Category}'
            ]
        },
        getHeightsForCategory: {
            name: 'GetHeightsForCategoryIntent', 
            utterances: [
                'what heights are available for {category:Category}'
            ]
        },
        getWidthsForCategory: {
            name: 'GetWidthsForCategoryIntent', 
            utterances: [
                'what widths are available for {category:Category}'
            ]
        },
        queryProductByFeature: { 
            name: 'QueryProductByFeatureIntent',
            utterances: [
                "what {category:Category} have a {feature:Feature} of {featureValue:FeatureValue}",
            ]
        },
        queryProductByMfgFeature: {  
            name: 'QueryProductByMfgFeatureIntent',
            utterances: [
                "what {category:Category} by {manufacturer:Manufacturer} have a {feature:Feature} of {featureValue:FeatureValue}"
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
        launchPrompt: getUISetting('LAUNCH_PROMPT', {
            text: 'Welcome to the Bimsmith Skill version {version}.',
            card: 'Try asking for a list of categories or manufacturers',
            reprompt: 'Launch'
        }),
        unknownIntent: getUISetting('UNKNOWN_INTENT', {
            text: 'Sorry, your request was not recognized.',
            reprompt: 'Sorry, your request was not recognized. Want to try again?',
            card: 'Unknown Intent'
        }),
        help: getUISetting('HELP', {
            //TODO: add more examples
            text: "You can ask for a list of categories, or a list of manufacturers. Navigation commands will help you to navigate through lists of results. Following is a list of example commands: " + 
                "List all categories. " + 
                "List all manufacturers. " + 
                "What products are in Optical Turnstiles? " + 
                "What products does Kenmore have? " + 
                "How many products does Kenmore have? " + 
                "How many products are there in Optical Turnstiles? " + 
                "What finishes does 24 inch Built-In Dishwasher by Kenmore come in? " + 
                "What features does Speed lane Slide by Boon Edam USA support? " + 
                "What dishwashers by Kenmore come in Stainless Steel finish? " + 
                "What manufacturers have products for Optical Turnstiles? " + 
                "What categories does Kenmore have products for? ",
            reprompt: "Try this command: list all categories. ",
            card: 'Help'
        }),
        getVersion: getUISetting('GET_VERSION', {
            text: 'Anguleris Alexa Skill version {version}, copyright Anguleris Technologies 2018',
            reprompt: null,
            card: 'Get Version'
        }),
        noResultsFound: getUISetting('NO_RESULTS', {
            text: 'Sorry, no results found for your query. Do you want to try that again?', 
            reprompt: 'Sorry, no results found for your query. Do you want to try that again?',
            card: 'No Results Found'
        }),
        generalError: getUISetting('GENERAL_ERROR', {
            text: 'Sorry, an error has occurred.',
            reprompt: 'Sorry, an error has occurred. Want to try again?',
            card: 'General Error'
        }),
        manufacturersForCategory: getUISetting('MFG_FOR_CATEGORY', {
            text: 'Manufacturers for {name}: ',
            reprompt: null,
            card: 'Manufacturers for Category'
        }),
        categoriesForManufacturer: getUISetting('CATEGORY_FOR_MFG', {
            text: 'Categories for {name}: ',
            reprompt: null,
            card: 'Categories for Manufacturer'
        }),
        pause: getUISetting('PAUSE', {
            text: 'Pause',
            reprompt: null,
            card: 'Pause',
        }),
        resume: getUISetting('RESUME',  {
            text: 'Resume',
            reprompt: null,
            card: 'Resume'
        }),
        notInList: getUISetting('NOT_IN_LIST',  {
            text: "Sorry, that's not a valid command, because we're not currently navigating a list result. Do you want to try that again?",
            reprompt: 'Do you want to try again?',
            card: 'Invalid Request'
        }),
        noDetailsForCategory: getUISetting('NO_DETAILS_FOR_CATEGORY',  {
            text: 'Sorry, no details are available for this category.',
            reprompt: null,
            card: 'No Details for Catgeory'
        }),
        noDetailsForManufacturer: getUISetting('NO_DETAILS_FOR_MFG',  {
            text: 'Sorry, no details are available for this manufacturer.',
            reprompt: '',
            card: 'No Details for Manufacturer'
        }),
        noDetailsForProduct: getUISetting('NO_DETAILS_FOR_PROD',  {
            text: 'Sorry, no details are available for this product.',
            reprompt: null,
            card: 'No Details for Product'
        }),
        manufacturerNotFound: getUISetting('MFG_NOT_FOUND',  {
            text: 'Sorry, no manufacturer by the name {name} was found.',
            reprompt: null,
            card: 'Manufacturer Not Found' 
        }),
        categoryNotFound: getUISetting('CATEGORY_NOT_FOUND',  {
            text: 'Sorry, no category by the name {name} was found.',
            reprompt: null,
            card: 'Category Not Found'
        }),
        productNotFound: getUISetting('PRODUCT_NOT_FOUND',  {
            text: 'Sorry, no product by the name {name} was found.',
            reprompt: null,
            card: 'Product Not Found'
        }),
        entityNotFound: getUISetting('MFG_PHONE_FOUND',  {
            text: 'Sorry, {name} could not be found.',
            reprompt: null,
            card: '{name} Not Found'
        }),
        manufacturerPhoneFound: getUISetting('MFG_PHONE_FOUND',  {
            text: 'The phone number for {name} is {value}.',
            reprompt: null,
            card: 'Phone Number for {name}'
        }),
        manufacturerPhoneNotFound: getUISetting('MFG_PHONE_NOT_FOUND',  {
            text: 'Sorry, no phone number is available for {name}.',
            reprompt: null,
            card: 'Phone Number Not Found'
        }),
        manufacturerAddressFound: getUISetting('MFG_ADDR_FOUND',  {
            text: 'The street address for {name} is {value}.',
            reprompt: null,
            card: 'Address for {name}'
        }),
        manufacturerAddressNotFound: getUISetting('MFG_ADDR_NOT_FOUND',  {
            text: 'Sorry, no street address is available for {name}.',
            reprompt: null,
            card: 'Address Not Found'
        }),
        productsForManufacturer: getUISetting('PRODUCTS_FOR_MFG',  {
            text: 'Found {count} products for {name}.',
            reprompt: null,
            card: 'Products for {name}'
        }),
        noProductsForManufacturer: getUISetting('NO_PRODUCTS_FOR_MFG',  {
            text: 'Sorry, no products were found for {name}.',
            reprompt: null,
            card: 'No Products Found'
        }),
        numProductsForManufacturer: getUISetting('NUM_PRODUCTS_FOR_MFG',   {
            text: '{count} products found for {name}.',
            reprompt: null,
            card: '{count} products found for {name}'
        }),
        noProductsForEntity: getUISetting('NO_PRODUCTS_FOR_ENTITY',  {
            text: 'Sorry, no products were found for {name}.',
            reprompt: null,
            card: 'No Products Found'
        }),
        productsForCategory: getUISetting('PRODUCTS_FOR_CAT',  {
            text: 'Found {count} products for {name}.',
            reprompt: null,
            card: 'Products for {name}'
        }),
        noProductsForCategory: getUISetting('NO_PRODUCTS_FOR_CAT',  {
            text: 'Sorry, no products were found for {name}.',
            reprompt: null,
            card: 'No Products Found'
        }),
        numProductsForCategory: getUISetting('NUM_PRODUCTS_FOR_CAT',  {
            text: '{count} products found for {name}.',
            reprompt: null,
            card: '{count} products found for {name}'
        }),
        productsForEntity: getUISetting('PRODUCTS_FOR_ENTITY',  {
            text: 'Found {count} products for {name}.',
            reprompt: null,
            card: 'Products for {name}'
        }),
        noProductsForEntity: getUISetting('NO_PRODUCTS_FOR_ENTITY',  {
            text: 'Sorry, no products were found for {name}.',
            reprompt: null,
            card: 'No Products Found'
        }),
        numProductsForEntity: getUISetting('NUM_PRODUCTS_FOR_ENTITY',  {
            text:'{count} products found for {name}.',
            reprompt: null,
            card: '{count} products found for {name}'
        }),
        featureNotSupported: getUISetting('FEATURE_NOT_SUPPORTED',  {
            text: 'Sorry, the feature {feature} is not supported for product {name}.',
            reprompt: null,            
            card: 'Feature Not Supported'
        }),
        featureSupported: getUISetting('FEATURE_SUPPORTED',  {
            text: 'Product {name} supports the following {feature}: {value}',
            reprompt: null,
            card: 'Feature Supported'
        }),
        noFeatures: getUISetting('NO_FEATURES',  {
            text: 'No features are listed for {name}',
            reprompt: null,
            card: 'No Features Listed'
        }),
        productAllFeatures: getUISetting('ALL_FEATURES',  {
            text: 'Product {name} supports the following features: {content}',
            reprompt: null,
            card: 'Features for {name}'
        }),
        productQueryNoResults: getUISetting('QUERY_PROD_NO_RESULTS',  {
            text: 'No products were found for your query.',
            reprompt: null,
            card: 'No Results for Product Query'
        }),
        categoriesByFeature: getUISetting('CATEGORIES_BY_FEATURE', {
            text: 'The following values exist for {name}. ',
            reprompt: null,
            card: 'Feature Values for {name}'
        }),
        featureNotSupportedByCategory: getUISetting('FEATURE_NOT_SUPPORTED_CAT', {
            text: 'That feature is not supported by the given category. ',
            reprompt: null,
            card: 'Feature not Supported'
        }),
    },
};

