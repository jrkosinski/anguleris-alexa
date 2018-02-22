'use strict';

// * * * * * 
// logger - for logging.
// 
// John R. Kosinski
// 4 Oct 2017
var config = require('../config');


// values: 'ALL', 'NONE', or array of logType values. s
var loggingLevel = config.loggingLevel;


module.exports = function logger(prefix) {
    function Logger(prefix) {
        var _this = this; 

        this.logType = {
            info : 'info',
            debug : 'debug',
            warn : 'warn',
            error : 'error'
        };

        if (!prefix)
            prefix = '';
        this.prefix = prefix;

        // * * * 
        // internally does all the work of logging.
        const log = function(s, type=_this.logType.info) {
            var log = true;

            if (Array.isArray(loggingLevel)){
                log = false;
                var found = loggingLevel.filter( function(i) { return (i === type || i === 'all');} );
                if (found && found.length)
                    log = true;
            }
            else{
                if (loggingLevel.toUpperCase() == 'ALL')
                    log = true; 
                else if (loggingLevel.toUpperCase() == 'NONE') 
                    log = false;
            }

            if (log)
                console.log('[' + type + '] ' + _this.prefix + ': ' + s);
        };

        // * * * 
        // logs an informational message 
        // 
        // args
        //  s: the message to log 
        //
        // returns: nothing
        this.info = function(s) { log(s, this.logType.info);}

        // * * * 
        // logs a debug message 
        // 
        // args
        //  s: the message to log 
        //
        // returns: nothing
        this.debug = function(s) { log(s, this.logType.debug);}

        // * * * 
        // logs a warning message 
        // 
        // args
        //  s: the message to log 
        //
        // returns: nothing
        this.warn = function(s) { log(s, this.logType.warn);}

        // * * * 
        // logs an error message 
        // 
        // args
        //  s: the message to log 
        //
        // returns: nothing
        this.error = function(s) { log(s, this.logType.error);}
    }

    return new Logger(prefix);
};