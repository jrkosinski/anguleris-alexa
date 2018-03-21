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
const config = require('../config');

const _classSpecs = {
    iotThing: {
        properties: [
            { name: 'name', type:'S'},
            { name: 'userId', type:'S'}
        ]
    }
};

// -----------------------------------------------------------------------------------------------
const getNextThing = async((alexaUserId) => {
    return exception.try(() => {
        const things = await(core.scanTable('bimsmith-iot-things')); 

        //TODO: do i need to sort? 

        for (var n=0; n<things.length; n++){
            if (!things[n].userId || !things[n].userId.S){
                return core.formatObjectForJson(_classSpecs.iotThing, things[n]);
            }
        }
    });
});

// -----------------------------------------------------------------------------------------------
const putThing = async((thing) => {
    return core.formatObjectForJson(_classSpecs.iotThing, 
        await(core.putItem('bimsmith-iot-things', core.formatObjectForDB(_classSpecs.iotThing, thing)))
    );
});

module.exports = {
    getNextThing,
    putThing
};