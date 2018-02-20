
const configUtil = require('./util/configUtil'); 

module.exports = {  

    loggingLevel : () => { return configUtil.getLoggingLevel('LOGGING_LEVEL', 'ALL'); }, 
};

