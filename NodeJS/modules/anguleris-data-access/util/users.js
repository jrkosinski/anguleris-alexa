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

const core = require('./dynamodb-core');
const things = require('./things');
const config = require('../config');

const _classSpecs = {
    user: {
        properties: [
            { name: 'id', type:'S'},
            { name: 'name', type:'S'},
            { name: 'iotThingName', type:'S'}
        ]
    }
};


// -----------------------------------------------------------------------------------------------
const getUser = async((alexaUserId) => {
    return core.formatObjectForJson(_classSpecs.user, 
        await (core.getItemById('bimsmith-users', alexaUserId))
    ); 
});

// -----------------------------------------------------------------------------------------------
const putUser = async((user) => {
    return exception.try(() => {

        //assign an iot thing if not yet assigned
        if (!user.iotThingName) {
            var iotThing = await(things.getNextThing()); 
            if (!iotThing) {
                //TODO: warning for out of things! 
            }
            else {
                user.iotThingName = iotThing.name;
                user = core.formatObjectForJson(_classSpecs.user, 
                    await(core.putItem('bimsmith-users', core.formatObjectForDB(_classSpecs.user, user)))
                );

                if (user && user.iotThingName === iotThing.name){
                    iotThing.userId = user.id;
                    await(things.putThing(iotThing)); 
                }
                else {
                    //warning: failed to save or something
                }
            }
        }

        return user;
    });
});


module.exports = {
    getUser,
    putUser
};