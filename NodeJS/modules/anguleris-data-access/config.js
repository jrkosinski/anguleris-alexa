
const configUtil = require('anguleris-common').config; 

module.exports = {  

    loggingLevel : configUtil.getLoggingLevel('LOGGING_LEVEL', 'ALL'), 
    environmentSuffix: () => { return configUtil.getSetting('ENVIRONMENT_SUFFIX', '');},

    aws: {
        dynamodb: {
            region: () => { return configUtil.getSetting('AWS_DYNDB_REGION', 'us-east-1');},
            apiKey: () => { return configUtil.getSetting('AWS_DYNDB_ACCESS_KEY', '');},
            apiSecret: () => { return configUtil.getSetting('AWS_DYNDB_SECRET_KEY', '');}
        }
    }
};

