'use strict';

const async = require('asyncawait/async');
const await = require('asyncawait/await');

const common = require('anguleris-common');
const exception = common.exceptions('DATA');
const logger = common.logger('DATA');

const config = require('../config');

function getCategories() {
    //return common.wrapInPromise(() => { 
        return [
            { name: 'Access Security' },
            { name: 'Appliances' },
            { name: 'AV' },
            { name: 'Cable Tray' },
            { name: 'Ceilings   ' },
            { name: 'Countertops' },
            { name: 'Door Hardware' },
            { name: 'Doors' },
            { name: 'Drains' },
            { name: 'Flooring' },
            { name: 'Furniture' },
            { name: 'Mailboxes' },
            { name: 'Lighting' },
            { name: 'Paints & Coatings' },
            { name: 'Piping' },
            { name: 'Railings' },
            { name: 'Roofing' },
            { name: 'Security Cameras' },
            { name: 'Skylights' },
            { name: 'Walls' },
            { name: 'Washroom Accessories' },
            { name: 'Windows' }
        ];
    //}); 
}

function getManufacturers() {
    //return common.wrapInPromise(() => { 
        return [
            { name: 'Alucobond' },
            { name: 'Behr' },
            { name: 'Boon Edam USA' },
            { name: 'Chalfant' },
            { name: 'Clark Dietrich' },
            { name: 'Delta Turnstiles' },
            { name: 'Dow Corning' },
            { name: 'Epilay' },
            { name: 'Fabral' },
            { name: 'Grabber' },
            { name: 'Kenmore' },
            { name: 'Moen' },
            { name: 'National Gypsum' },
            { name: 'Oatey' },
            { name: 'Ply Gem' },
            { name: 'Polyset' },
            { name: 'Proflex' },
            { name: 'Trex' },
            { name: 'W.R. Meadows' },
            { name: 'Waterworks' }
        ];
    //}); 
}

module.exports = {
    getCategories: getCategories
};