'use strict';

// ======================================================================================================
// users - access to user database 
// 
// Anguleris Technologies
// John R. Kosinski
//
// 15 Mar 2018
// ------------------------------------------------------------------------------------------------------
const async = require('asyncawait/async');
const await = require('asyncawait/await');

const common = require('anguleris-common');
const enums = common.enums;
const exception = common.exceptions('USR');
const logger = common.logger('USR');

const config = require('./config');

const _allUsers = [
    {
        id: 'amzn1.account.abc123',
        name: 'alexia testuser',
        deviceIds: [
            'bimsmith-thing'
        ]
    },
    {
        id: '123abc',
        name: 'alexia testuser',
        deviceIds: [
            'bimsmith-thing'
        ]
    },
];

const getUser = async((alexaUserId) => {
    return exception.try(() => {
        return common.arrays.firstOrDefault(_allUsers, (a) => { a.id === alexaUserId }); 
    });
});

module.exports = {
    getUser
};