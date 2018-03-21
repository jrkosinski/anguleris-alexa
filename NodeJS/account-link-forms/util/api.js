'use strict';

// ===============================================================================================
// 
// John R. Kosinski
// 20 Nov 2017
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var AWS = require("aws-sdk"); 

var config = require('../config');
const common = require('anguleris-common');
const dataAccess = require('anguleris-data-access');
const exception = common.exceptions('API');
const logger = common.logger('API');

var postUser = async((querystring, body, authToken) => {
	logger.info('post user');

	//authenticate
	var userId = body['userId'];

	return await(dataAccess.putUser({id: userId, name:'test'}))
});


module.exports = {
    postUser
}