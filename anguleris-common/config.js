
const configUtil = require('./util/configUtil'); 

module.exports = {  

    loggingLevel : configUtil.getLoggingLevel('LOGGING_LEVEL', 'ALL'), 
};

