'use strict';

const async = require('asyncawait/async');
const await = require('asyncawait/await');

const exception = require('anguleris-common').exceptions('INDEX');
const logger = require('anguleris-common').logger('INDEX');

const app = require('./util/alexaApp').app; 
const config = require('./config');

exports.handler = (event, context, callback) => {
    app.handle(event, data => {
        callback(null, data);
    });
};
