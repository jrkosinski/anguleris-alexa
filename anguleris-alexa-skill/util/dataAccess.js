'use strict';

const async = require('asyncawait/async');
const await = require('asyncawait/await');

const exception = require('anguleris-common').exceptions('DATA');
const logger = require('anguleris-common').logger('DATA');

const config = require('../config');

function getCategories(){
    return [
        { name: 'Access Security' },
        { name: 'Appliances' },
        { name: 'AV' },
        { name: 'Cable Tray' },
        { name: 'Countertops' },
        { name: 'Door Hardware' },
        { name: 'Doors' },
        { name: 'Furniture' },
        { name: 'Roofing' },
        { name: 'Windows' }
    ];
}

module.exports = {
    getCategories: getCategories
};