'use strict';

const handler = require('./index');
const config = require('./config');
const testUtil = require('./test/testUtil');
const logger = require('anguleris-common').logger('TEST');

//testUtil.sendTestRequest(testUtil.formVersionRequest(), testUtil.getTestContext(), handler);
testUtil.sendGetVersionRequest();
