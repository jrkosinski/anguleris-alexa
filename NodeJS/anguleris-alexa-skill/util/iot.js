'use strict';

// ====================================================================================================== 
// iot - interface to AWS iot shadow
// 
// Anguleris Technologies
// John R. Kosinski
//
// 09 Mar 2018
// ------------------------------------------------------------------------------------------------------
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const AWS = require('aws-sdk');

const common = require('anguleris-common');
const exception = common.exceptions('IOT');
const logger = common.logger('IOT');
const enums = common.enums;

const config = require('../config');
const iotdata = new AWS.IotData({endpoint: config.iot.endpoint });  

// ------------------------------------------------------------------------------------------------------
const updateThingShadow = async((payload) => {
    return new Promise((resolve, reject) => {
        var params = {
            payload:  JSON.stringify(payload),
            thingName: 'bimsmith-thing'
        }; 

        iotdata.updateThingShadow(params, (err, data) => {
            try {
                if (err)
                    reject(err);
                else{
                    resolve(data); 
                }
            } catch(e) {
                reject(e);
            }
        });
    });
});

module.exports = {
    updateThingShadow
};