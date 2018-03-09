'use strict';

// ====================================================================================================== 
// index - entry point
// 
// Anguleris Technologies
// John R. Kosinski
//
// 22 Feb 2018
// ------------------------------------------------------------------------------------------------------
const async = require('asyncawait/async');
const await = require('asyncawait/await');

const common = require('anguleris-common');
const exception = common.exceptions('IDX');
const logger = common.logger('IDX');

const app = require('./util/alexaApp').app; 
const config = require('./config');

exports.handler = (event, context, callback) => {
    app.handle(event, data => {
        callback(null, data);
    });
};
