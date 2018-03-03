'use strict';

// * * * * * 
// navigation - utilities related to navigation through responses lists 
// 
// Anguleris Technologies
// John R. Kosinski
//
// 22 Feb 2018
const async = require('asyncawait/async');
const await = require('asyncawait/await');

const common = require('anguleris-common');
const exception = common.exceptions('MOB');
const logger = common.logger('MOB');
const enums = common.enums;

const config = require('../config');
const query = require('./query');
const responseBuilder = require('./responseBuilder');