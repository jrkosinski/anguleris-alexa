'use strict';

// ======================================================================================================
// exceptionUtil - standard handling for exceptions. 
// 
// John R. Kosinski
// 3 Oct 2017
// ------------------------------------------------------------------------------------------------------
var async = require("asyncawait/async");
var await = require("asyncawait/await");
var config = require('../config');


module.exports = function excepUtil(logPrefix) {
    var logger = require('./logger')(logPrefix); 

    function ExcepUtil() {
        var _this = this; 

        // ------------------------------------------------------------------------------------------------------
        // wraps the given expression in a try/catch, and provides standard handling for any errors.
        //
        // args: 
        //  options:  {
        //      defaultValue: null,
        //      onError: () => {},
        //      functionName: ''
        //  }
        //
        // returns: return value of given expression
        this.try = (expr, options) => {
            try{
                return expr();
            }
            catch(err){
                _this.handleError(err);
                if (options && options.onError)
                    options.onError(err);
                return options ? options.defaultValue : null;
            }
        };

        // ------------------------------------------------------------------------------------------------------
        // wraps the given expression in a try/catch, and provides standard handling for any errors.
        //
        // args: 
        //  options:  {
        //      defaultValue: null,
        //      onError: () => {},
        //      functionName: ''
        //  }
        //
        // returns: return value of given expression
        this.tryAsync = async((expr, options) => {
            try{
                return await(expr()); 
            }
            catch(err){
                _this.handleError(err);
                if (options && options.onError)
                    options.onError(err);
                return options ? options.defaultVal : null;
            }
        });

        // ------------------------------------------------------------------------------------------------------
        // provides standard handling for any errors.
        //
        // returns: nothing
        this.handleError = (err, functionName) => {
            var prefix = (functionName && functionName.length ? ' <' + functionName + '> ' : '');
            logger.error(prefix + JSON.stringify(err) + ' ' + err);
            if (err.stack)
                console.log(err.stack);
        }
    }

    return new ExcepUtil();
};