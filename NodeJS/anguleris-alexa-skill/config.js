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
        getProductColors: {
            name: 'GetProductColorsIntent',
            utterances: [
                "what colors does {product:Product} come in"
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
        queryProducts: {
            name: 'QueryProductsIntent',
            utterances: [
                "get {category:Category} for {manufacturer:Manufacturer}"
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
        getColorsForCategory: {
            name: 'GetColorsForCategoryIntent', 
            utterances: [
                'what colors are available for {category:Category}'
            ]
        },
        queryProductByFeature: { 
            name: 'QueryProductByFeatureIntent',
            utterances: [
                "what {category:Category} have a {feature:Feature} of {featureValue:FeatureValue}",
            ]
        },
        queryProductByFinish: { 
            name: 'QueryProductByFinishIntent',
            utterances: [
                "what {category:Category} have a finish of {featureValue:FeatureValue}",
            ]
        },
        queryProductByHeight: { 
            name: 'QueryProductByHeightIntent',
            utterances: [
                "what {category:Category} have a height of {featureValue:FeatureValue}",
            ]
        },
        queryProductByWidth: { 
            name: 'QueryProductByWidthIntent',
            utterances: [
                "what {category:Category} have a width of {featureValue:FeatureValue}",
            ]
        },
        queryProductByColor: { 
            name: 'QueryProductByColorIntent',
            utterances: [
                "what {category:Category} have a color of {featureValue:FeatureValue}",
            ]
        },
        queryProductByMfgFeature: {  
            name: 'QueryProductByMfgFeatureIntent',
            utterances: [
                "what {category:Category} by {manufacturer:Manufacturer} have a {feature:Feature} of {featureValue:FeatureValue}"
            ]
        },
        queryProductByMfgFinish: {  
            name: 'QueryProductByMfgFinishIntent',
            utterances: [
                "what {category:Category} by {manufacturer:Manufacturer} have a finish of {featureValue:FeatureValue}"
            ]
        },
        queryProductByMfgColor: {  
            name: 'QueryProductByMfgColorIntent',
            utterances: [
                "what {category:Category} by {manufacturer:Manufacturer} have a color of {featureValue:FeatureValue}"
            ]
        },
        queryProductByMfgHeight: {  
            name: 'QueryProductByMfgHeightIntent',
            utterances: [
                "what {category:Category} by {manufacturer:Manufacturer} have a height of {featureValue:FeatureValue}"
            ]
        },
        queryProductByMfgWidth: {  
            name: 'QueryProductByMfgWidthIntent',
            utterances: [
                "what {category:Category} by {manufacturer:Manufacturer} have a width of {featureValue:FeatureValue}"
            ]
        },
        callManufacturer: {  
            name: 'CallManufacturerIntent',
            utterances: [
                "call {manufacturer:Manufacturer}"
            ]
        },
        callBimsmithSupport: {  
            name: 'CallBimsmithSupportIntent',
            utterances: [
                "call support",
                "call Bimsmith",
                "call Bimsmith support"
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
        goodbye: {
            name: "Goodbye",
            utterances: [
                "Goodbye"
            ]
        }
    },

    // UI elements
    ui: {
        launchPrompt: getUISetting('LAUNCH_PROMPT', {
            text: 'Welcome to the Bimsmith Skill version {version}. Say help to get a list of commands. ',
            card: 'Try asking for a list of categories or manufacturers',
            reprompt: null
        }),
        unknownIntent: getUISetting('UNKNOWN_INTENT', {
            text: 'Some things I just cant help with at this stage of development. For a list of commands, say help. Want to try again?',
            reprompt: null, 
            card: 'Unknown Intent'
        }),
        help: getUISetting('HELP', {
            //TODO: add more examples
            text: "You can ask many different types of questions. Some questions result in navigable lists of results. Navigation commands will help you to navigate through lists of results. Following is a general list of example commands: " +                     
                'what categories are available? ' + 
                'what manufacturers are available? ' + 
                'what products are available in Optical Turnstiles? ' + 
                'what products are available by Kenmore? ' + 
                'for which categories does Boon Edam USA have products? ' + 
                'how many products are available by Boon Edam USA? ' + 
                'what products does Boon Edam USA have in Optical Turnstiles? ' + 
                'what features are available for Speed Lane Slide by Boon Edam USA? ' + 
                'what finishes are available in dishwashers? ' + 
                'what dishwashers have a finish of stainless steel? ' + 
                'what dishwashers from Kenmore have a finish of metallic? ' + 
                'what widths does SpeedLane Slide by Boon Edam USA come in? ' + 
                'tell me about Kenmore. ' + 
                "what is Kenmore's address? " + 
                "what is Kenmore's phone number? " + 
                "For more help during the development phase, just contact john kosinski by email or slack!",                

            reprompt: null,
            card: 'Help'
        }),
        getVersion: getUISetting('GET_VERSION', {
            text: 'Bimsmith Alexa Skill version {version}, copyright Anguleris Technologies 2018',
            reprompt: null,
            card: 'Get Version'
        }),
        noResultsFound: getUISetting('NO_RESULTS', {
            text: 'Sorry, no results found for your query. Do you want to try that again?', 
            reprompt: null,
            card: 'No Results Found'
        }),
        generalError: getUISetting('GENERAL_ERROR', {
            text: 'Sorry, an error has occurred. Please try again. ',
            reprompt: null,
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
            text: 'Sorry, no details are available for this category. Want to try a different category? ',
            reprompt: null,
            card: 'No Details for Catgeory'
        }),
        noDetailsForManufacturer: getUISetting('NO_DETAILS_FOR_MFG',  {
            text: 'Sorry, no details are available for this manufacturer. Want to try a different manufacturer? ',
            reprompt: null,
            card: 'No Details for Manufacturer'
        }),
        noDetailsForProduct: getUISetting('NO_DETAILS_FOR_PROD',  {
            text: 'Sorry, no details are available for this product. Want to try another one? ',
            reprompt: null,
            card: 'No Details for Product'
        }),
        manufacturerNotFound: getUISetting('MFG_NOT_FOUND',  {
            text: 'Sorry, no manufacturer by the name {name} was found. Try again? ',
            reprompt: null,
            card: 'Manufacturer Not Found' 
        }),
        categoryNotFound: getUISetting('CATEGORY_NOT_FOUND',  {
            text: 'Sorry, no category by the name {name} was found. Try again? ',
            reprompt: null,
            card: 'Category Not Found'
        }),
        productNotFound: getUISetting('PRODUCT_NOT_FOUND',  {
            text: 'Sorry, no product by the name {name} was found. Would you like to try again? ',
            reprompt: null,
            card: 'Product Not Found'
        }),
        entityNotFound: getUISetting('MFG_PHONE_FOUND',  {
            text: 'Sorry, {name} could not be found. Try again?',
            reprompt: null,
            card: '{name} Not Found'
        }),
        manufacturerPhoneFound: getUISetting('MFG_PHONE_FOUND',  {
            text: 'The phone number for {name} is {value}. ',
            reprompt: null,
            card: 'Phone Number for {name}'
        }),
        manufacturerPhoneNotFound: getUISetting('MFG_PHONE_NOT_FOUND',  {
            text: 'Sorry, no phone number is available for {name}. Would you like to try that again? ',
            reprompt: null,
            card: 'Phone Number Not Found'
        }),
        manufacturerAddressFound: getUISetting('MFG_ADDR_FOUND',  {
            text: 'The street address for {name} is {value}.',
            reprompt: null,
            card: 'Address for {name}'
        }),
        manufacturerAddressNotFound: getUISetting('MFG_ADDR_NOT_FOUND',  {
            text: 'Sorry, no street address is available for {name}. Would you like to try that again? ',
            reprompt: null,
            card: 'Address Not Found'
        }),
        productsForManufacturer: getUISetting('PRODUCTS_FOR_MFG',  {
            text: 'Found {count} products for {name}.',
            reprompt: null,
            card: 'Products for {name}'
        }),
        noProductsForManufacturer: getUISetting('NO_PRODUCTS_FOR_MFG',  {
            text: 'Sorry, no products were found for {name}. Would you like to try that again? ',
            reprompt: null,
            card: 'No Products Found'
        }),
        numProductsForManufacturer: getUISetting('NUM_PRODUCTS_FOR_MFG',   {
            text: '{count} products found for {name}.',
            reprompt: null,
            card: '{count} products found for {name}'
        }),
        noProductsForEntity: getUISetting('NO_PRODUCTS_FOR_ENTITY',  {
            text: 'Sorry, no products were found for {name}. Would you like to try that again? ',
            reprompt: null,
            card: 'No Products Found'
        }),
        productsForCategory: getUISetting('PRODUCTS_FOR_CAT',  {
            text: 'Found {count} products for {name}.',
            reprompt: null,
            card: 'Products for {name}'
        }),
        noProductsForCategory: getUISetting('NO_PRODUCTS_FOR_CAT',  {
            text: 'Sorry, no products were found for {name}. Would you like to try that again? ',
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
        numProductsForEntity: getUISetting('NUM_PRODUCTS_FOR_ENTITY',  {
            text:'{count} products found for {name}.',
            reprompt: null,
            card: '{count} products found for {name}'
        }),
        featureNotSupported: getUISetting('FEATURE_NOT_SUPPORTED',  {
            text: 'Sorry, the feature {feature} is not supported for product {name}. Would you like to try a different feature? ',
            reprompt: null,            
            card: 'Feature Not Supported'
        }),
        featureSupported: getUISetting('FEATURE_SUPPORTED',  {
            text: 'Product {name} supports the following {feature}s: {value}',
            reprompt: null,
            card: 'Feature Supported'
        }),
        noFeatures: getUISetting('NO_FEATURES',  {
            text: 'No features are listed for {name}. Would you like to try that again? ',
            reprompt: null,
            card: 'No Features Listed'
        }),
        productAllFeatures: getUISetting('ALL_FEATURES',  {
            text: 'Product {name} supports the following features: {content}',
            reprompt: null,
            card: 'Features for {name}'
        }),
        productQueryNoResults: getUISetting('QUERY_PROD_NO_RESULTS',  {
            text: 'No products were found for your query. Would you like to try that again? ',
            reprompt: null,
            card: 'No Results for Product Query'
        }),
        categoriesByFeature: getUISetting('CATEGORIES_BY_FEATURE', {
            text: 'The following  {name} options are available. ',
            reprompt: null,
            card: 'Feature Values for {name}'
        }),
        featureNotSupportedByCategory: getUISetting('FEATURE_NOT_SUPPORTED_CAT', {
            text: 'That feature is not supported by the given category. Would you like to try a different feature or product? ',
            reprompt: null,
            card: 'Feature not Supported'
        }),
        callingPhone: getUISetting('CALLING_PHONE', {
            text: 'Calling {name} ',
            reprompt: null,
            card: 'Calling {name}'
        }),
        noRegisteredDevice: getUISetting('NO_REGISTERED_DEVICE', {
            text: 'No Registered Device found for user. ',
            reprompt: null,
            card: 'No Registered Device'
        }),
        userNotFound: getUISetting('USER_NOT_FOUND', {
            text: 'user not found in database. ',
            reprompt: null,
            card: 'User not Found'
        }),
        goodbye: getUISetting('GOODBYE', {
            text: 'Thank you very much. Goodbye! ',
            reprompt: null,
            card: 'Goodbye'
        }),

        reprompts: [
            'Ask me a question like, what categories are available?',
            'Ask me a question like, what manufacturers are available?',
            'You can ask for a list of products for a given category, like, what products are available in Optical Turnstiles?',
            'You can query products for a manufacturer, like, what products are available by Kenmore?',
            'You can ask, for which categories does Boon Edam USA have products? ',
            'Ask about product counts, for example: how many products are available by Boon Edam USA?',
            'You can query for products, like: what products does Boon Edam USA have in Optical Turnstiles? ',
            'You can query for features, such as: what features are available for Speed Lane Slide by Boon Edam USA?',
            'You can query for product features, such as: what finishes are available in dishwashers?',
            'You can query about product finishes, such as: what dishwashers have a finish of stainless steel? 	',
            'You can query about product features, like: what dishwashers from Kenmore have a finish of metallic? 		',
            'Ask about product features, such as: what widths does SpeedLane Slide by Boon Edam USA come in? ',
            'Ask about manufacturer info, for example: tell me about Kenmore',
            "Ask for manufacturer info, such as: what is Kenmore's address?",
            "Ask for manufacturer details, such as: what is Kenmore's phone number?"
        ]
    },

    aws: {
        accessKey: configUtil.getSetting("AWS_ACCESS_KEY", null),
        secretKey: configUtil.getSetting("AWS_SECRET_KEY", null),

        iot: {
            endpoint: configUtil.getSetting('IOT_ENDPOINT', 'a21jd7gud1swyd.iot.us-east-1.amazonaws.com')
        }
    },

    support: {
        email: configUtil.getSetting('SUPPORT_EMAIL', 'john.kosinski@toptal.com'),
        phone: configUtil.getSetting('SUPPORT_PHONE', '0619844525')
    }
};

