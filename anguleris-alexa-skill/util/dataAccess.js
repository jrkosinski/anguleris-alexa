'use strict';

const async = require('asyncawait/async');
const await = require('asyncawait/await');

const common = require('anguleris-common');
const exception = common.exceptions('DATA');
const logger = common.logger('DATA');

const config = require('../config');

const _categories = new Categories(); 
const _manufacturers = new Manufacturers();


function DataTable(data) {
    const _this = this;
    const _all = data;

    this.findByName = (name) => {
        return exception.try(() => {
            var output = null; 
            name = name.trim().toLowerCase(); 

            for(var n=0; n<_all.length; n++) {
                var item = _all[n]; 
                if (item && item.name) {
                    var tmp = item.name.trim().toLowerCase(); 
                    if (name === tmp){
                        output = item;
                        break;
                    }
                }
            }

            return output; 
        });
    };

    this.all = () => {
        return _all; 
    }
}

function Categories() {
    const _all = [
        {
            name: 'Access Security',
            subcategories: [],
            description: 'Browse through BIMsmith’s library of Revit Access Security families for free download. Compare the products you like best, then download the Revit files you need or save them in the cloud for free by clicking Add to MyBIMsmith.'
        },
        {
            name: 'Appliances',
            subcategories: [],
            description: 'Browse through BIMsmith’s comprehensive library of parametric BIM objects for different appliances. From refrigerators to washers and dryers, you can find it here. Download the Revit files you need, then save your favorite families to the cloud to use later with your MyBIMsmith account – all 100% for free.'
        },
        {
            name: 'AV',
            subcategories: [],
            description: ''
        },
        {
            name: 'Cable Tray',
            subcategories: [],
            description: ''
        },
        {
            name: 'Ceilings',
            subcategories: [],
            description: 'Browse through BIMsmith’s library of free ceiling families to use with Revit. Compare the products you like best, then download the Revit files you need or save them in the cloud for free by clicking Add to MyBIMsmith.'
        },
        {
            name: 'Countertops',
            subcategories: [],
            description: "Browse through BIMsmith’s comprehensive library of parametric Revit families for when you're modeling countertops in Revit. Sort and compare each countertop by key stats such as certifications, standard dimensions, and type of finish. Download the Revit files you need, then save your favorite families to the cloud to use later with your MyBIMsmith account – all 100% for free."
        },
        {
            name: 'Door Hardware',
            subcategories: [],
            description: "Browse through BIMsmith’s curated library of parametric Revit door hardware content. Whether its deadbolts or exit devices you're looking for, you can find it here. Download all the Revit files you need, then save your favorite families to the cloud to use later with your MyBIMsmith account – all 100% for free."
        },
        {
            name: 'Doors',
            subcategories: [],
            description: "Download door Revit families with BIMsmith Market. Browse through BIMsmith’s curated BIM library to research and select which doors to use in your project. Whether you're looking for something classic, something modern, or something in between, you can find it here. Download all the Revit files you need, then save your favorite families to the cloud to use later with your MyBIMsmith account – all for free."
        },
        {
            name: 'Drains',
            subcategories: [],
            description: "Browse through BIMsmith’s curated library of parametric Revit plumbing drain files. Use the Compare tool to see key stats such as type of drain, material, and measurements side-by-side on one page. Download the BIM objects you need, then save your favorite families to the cloud to use later with your MyBIMsmith account – all 100% for free."
        },
        {
            name: 'Flooring',
            subcategories: [],
            description: "Browse through BIMsmith’s library of parametric Revit flooring families for free download. Compare the products you like best, then download the Revit files you need or save them in the cloud for free by clicking Add to MyBIMsmith."
        },
        {
            name: 'Furniture',
            subcategories: [],
            description: "Browse through BIMsmith’s library of furniture families for free download and use with Revit. Compare the products you like best, then download the Revit files you need or save them in the cloud for free by clicking Add to MyBIMsmith."
        },
        {
            name: 'Mailboxes',
            subcategories: [],
            description: "Browse through BIMsmith’s curated collection of parametric Revit content for mailboxes. Select from different mailbox types with key stats such as mail capacity, lock types, finishes, and measurements. Download the Revit families you need, then save your favorite families to the cloud to use later with your MyBIMsmith account – all 100% for free."
        },
        {
            name: 'Lighting',
            subcategories: [],
            description: "Download lighting for Revit with BIMsmith Market. Browse through BIM lighting fixtures from leading manufacturers like LSI Industries and Prudential Lighting. Whether its indoor, outdoor, LED, fluorescent, or any other lighting style you're looking for, you can find the industry's top lighting BIM objects on BIMsmith. Compare key stats and features, and view or download all cut sheets, 3-part specs, product literature, material information, and more for each product quickly and easily. Building with the best lights in the industry starts with the best lighting Revit models in the industry. Download now with BIMsmith."
        },
        {
            name: 'Paints & Coatings',
            subcategories: [],
            description: "Browse through BIMsmith’s comprehensive library of parametric Revit families for paints and coatings. From leading brands like Sherwin Williams to Behr to PPG Paints, we have it here. Download the Revit files you need, then save your favorite families to the cloud to use later with your MyBIMsmith account – all for free."
        },
        {
            name: 'Piping',
            subcategories: [],
            description: "Browse through BIMsmith’s curated library of parametric piping families for Revit. From outlet boxes to flush valves, we have it here. Compare side by side with key stats such as measurements, outlet connections and sizes, inlet connections and sizes, and application types. Download the BIM objects you need, then save your favorite families to the cloud to use later with your MyBIMsmith account – all 100% for free."
        },
        {
            name: 'Railings',
            subcategories: [],
            description: "Browse through BIMsmith’s comprehensive collection of parametric BIM objects for railings. Choose between models using with key stats such as measurements, finish, and baluster details. Download the BIM content you need, then save your favorite families to the cloud to use later with your MyBIMsmith account."
        },
        {
            name: 'Roofing',
            subcategories: [],
            description: "Browse through BIMsmith’s library of roofing Revit families for free download. Compare the products you like best, then download the Revit files you need or save them in the cloud for free by clicking Add to MyBIMsmith."
        },
        {
            name: 'Security Cameras',
            subcategories: [],
            description: "Browse through BIMsmith’s comprehensive collection of parametric BIM content for security cameras. Compare products with key stats such as camera type, resolution, and field of view. Download the Revit content you need, then save your favorite families to the cloud to use later with your MyBIMsmith account – all 100% for free."
        },
        {
            name: 'Skylights',
            subcategories: [],
            description: "Download skylights for Revit with BIMsmith Market. Browse through BIM skylights from leading manufacturers like Wasco Skylights. Whether its strucutral or nonstructural, simple or complex, dome or pyramid, you can find the industry's top skylight BIM objects here. Compare key stats and features, and view or download all cut sheets, 3-part specs, product literature, material information, and more for each product quickly and easily. Building with the best skylights in the industry starts with the best skylight Revit models in the industry. Download now with BIMsmith."
        }
    ];

    return new DataTable(_all);
}

function Manufacturers() {
    const _all = [
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

    return new DataTable(_all);
}


function getCategories(parameter) {
    return exception.try(() => {
        if (parameter)
            return _categories.findByName(parameter); 
        else
            return _categories.all();
    });
}

function getManufacturers(parameter) {
    return exception.try(() => {
        if (parameter)
            return _manufacturers.findByName(parameter); 
        else
            return _manufacturers.all();
    });
}


module.exports = {
    getCategories: getCategories,
    getManufacturers: getManufacturers
};