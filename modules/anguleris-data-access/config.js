
const configUtil = require('anguleris-common').config; 

module.exports = {  

    loggingLevel : configUtil.getLoggingLevel('LOGGING_LEVEL', 'ALL'), 
};

