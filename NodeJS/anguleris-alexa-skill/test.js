'use strict';

require('dotenv').config();

const handler = require('./index');
const config = require('./config');
const testUtil = require('./test/testUtil');
const logger = require('anguleris-common').logger('TEST');

testUtil.runUnitTests();
