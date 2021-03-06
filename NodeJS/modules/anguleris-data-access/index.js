'use strict';

// ======================================================================================================
// dataAccess - access to application data sources
// 
// Anguleris Technologies
// John R. Kosinski
//
// 22 Feb 2018
// ------------------------------------------------------------------------------------------------------
const async = require('asyncawait/async');
const await = require('asyncawait/await');

const common = require('anguleris-common');
const enums = common.enums;
const exception = common.exceptions('DATA');
const logger = common.logger('DATA');

const users = require('./users');
const config = require('./config');

const _categories = new Categories(); 
const _manufacturers = new Manufacturers();
const _products = new Products();


// ======================================================================================================
// DataTable - superclass for data container entities
// 
// Anguleris Technologies
// John R. Kosinski
//
// 22 Feb 2018
// ------------------------------------------------------------------------------------------------------
function DataTable(data) {
    const _this = this;
    const _all = data;

    /*for (var n=0; n<data.length; n++){
        console.log("'" + data[n].name + "',");
    }*/

    // ------------------------------------------------------------------------------------------------------
    // finds a specific entity, given its name 
    //
    // args
    //  name: the name of the object to find 
    // 
    // returns: a single object, or null
    this.findByName = async((name) => {
        return exception.try(() => {
            var output = null; 
            if (!name) 
                name = ''; 
                
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
    });

    // ------------------------------------------------------------------------------------------------------
    // finds a specific entity, given its id 
    //
    // args
    //  name: the name of the object to find 
    // 
    // returns: a single object, or null
    this.findById = async((id) => {
        return exception.try(() => {
            var output = null; 

            for(var n=0; n<_all.length; n++) {
                var item = _all[n]; 
                if (item && item.id) {
                    if (id === item.id){
                        output = item;
                        break;
                    }
                }
            }

            return output; 
        });
    });

    // ------------------------------------------------------------------------------------------------------
    // returns all contained objects
    this.all = async(() => {
        return _all; 
    })
}

// ======================================================================================================
// Categories - data container for categories
// 
// Anguleris Technologies
// John R. Kosinski
//
// 22 Feb 2018
// ------------------------------------------------------------------------------------------------------
function Categories() {
    const _all = [
        {
            name: 'Access Security',
            type: enums.entityType.category,
            subcategories: [],
            manufacturers: ['Boon Edam USA', 'Delta Turnstiles'],
            description: 'Browse through Bimsmith’s library of Revit Access Security families for free download. Compare the products you like best, then download the Revit files you need or save them in the cloud for free by clicking Add to MyBIMsmith.'
        },
        {
            name: 'Optical Turnstiles',
            type: enums.entityType.category,
            subcategories: [],
            manufacturers: ['Boon Edam USA', 'Delta Turnstiles'],
            description: 'Browse through Bimsmith’s library of Revit Access Security families for free download. Compare the products you like best, then download the Revit files you need or save them in the cloud for free by clicking Add to MyBIMsmith.'
        },
        {
            name: 'Appliances',
            type: enums.entityType.category,
            subcategories: [],
            manufacturers: ['Kenmore'],
            description: 'Browse through Bimsmith’s comprehensive library of parametric BIM objects for different appliances. From refrigerators to washers and dryers, you can find it here. Download the Revit files you need, then save your favorite families to the cloud to use later with your MyBIMsmith account – all 100% for free.'
        },
        {
            name: 'Dishwashers',
            type: enums.entityType.category,
            subcategories: [],
            manufacturers: ['Kenmore'],
            description: ''
        },
        {
            name: 'AV',
            type: enums.entityType.category,
            subcategories: [],
            manufacturers: [],
            description: ''
        },
        {
            name: 'Cable Tray',
            type: enums.entityType.category,
            subcategories: [],
            manufacturers: ['Chalfant', 'Kenmore'],
            description: ''
        },
        {
            name: 'Ceilings',
            type: enums.entityType.category,
            subcategories: [],
            manufacturers: ['Homasote'],
            description: 'Browse through Bimsmith’s library of free ceiling families to use with Revit. Compare the products you like best, then download the Revit files you need or save them in the cloud for free by clicking Add to MyBIMsmith.'
        },
        {
            name: 'Countertops',
            type: enums.entityType.category,
            subcategories: [],
            manufacturers: [],
            description: "Browse through Bimsmith’s comprehensive library of parametric Revit families for when you're modeling countertops in Revit. Sort and compare each countertop by key stats such as certifications, standard dimensions, and type of finish. Download the Revit files you need, then save your favorite families to the cloud to use later with your MyBIMsmith account – all 100% for free."
        },
        {
            name: 'Door Hardware',
            type: enums.entityType.category,
            subcategories: [],
            manufacturers: [],
            description: "Browse through Bimsmith’s curated library of parametric Revit door hardware content. Whether its deadbolts or exit devices you're looking for, you can find it here. Download all the Revit files you need, then save your favorite families to the cloud to use later with your MyBIMsmith account – all 100% for free."
        },
        {
            name: 'Doors',
            type: enums.entityType.category,
            subcategories: [],
            manufacturers: [],
            description: "Download door Revit families with BIMsmith Market. Browse through BIMsmith’s curated BIM library to research and select which doors to use in your project. Whether you're looking for something classic, something modern, or something in between, you can find it here. Download all the Revit files you need, then save your favorite families to the cloud to use later with your MyBIMsmith account – all for free."
        },
        {
            name: 'Drains',
            type: enums.entityType.category,
            subcategories: [],
            description: "Browse through Bimsmith’s curated library of parametric Revit plumbing drain files. Use the Compare tool to see key stats such as type of drain, material, and measurements side-by-side on one page. Download the BIM objects you need, then save your favorite families to the cloud to use later with your MyBIMsmith account – all 100% for free."
        },
        {
            name: 'Flooring',
            type: enums.entityType.category,
            subcategories: [],
            manufacturers: [],
            description: "Browse through Bimsmith’s library of parametric Revit flooring families for free download. Compare the products you like best, then download the Revit files you need or save them in the cloud for free by clicking Add to MyBIMsmith."
        },
        {
            name: 'Furniture',
            type: enums.entityType.category,
            subcategories: [],
            manufacturers: [],
            description: "Browse through Bimsmith’s library of furniture families for free download and use with Revit. Compare the products you like best, then download the Revit files you need or save them in the cloud for free by clicking Add to MyBIMsmith."
        },
        {
            name: 'Mailboxes',
            type: enums.entityType.category,
            subcategories: [],
            manufacturers: [],
            description: "Browse through Bimsmith’s curated collection of parametric Revit content for mailboxes. Select from different mailbox types with key stats such as mail capacity, lock types, finishes, and measurements. Download the Revit families you need, then save your favorite families to the cloud to use later with your MyBIMsmith account – all 100% for free."
        },
        {
            name: 'Lighting',
            type: enums.entityType.category,
            subcategories: [],
            manufacturers: [],
            description: "Download lighting for Revit with BIMsmith Market. Browse through BIM lighting fixtures from leading manufacturers like LSI Industries and Prudential Lighting. Whether its indoor, outdoor, LED, fluorescent, or any other lighting style you're looking for, you can find the industry's top lighting BIM objects on BIMsmith. Compare key stats and features, and view or download all cut sheets, 3-part specs, product literature, material information, and more for each product quickly and easily. Building with the best lights in the industry starts with the best lighting Revit models in the industry. Download now with BIMsmith."
        },
        {
            name: 'Paints & Coatings',
            type: enums.entityType.category,
            subcategories: [],
            manufacturers: ['National Gypsum'],
            description: "Browse through Bimsmith’s comprehensive library of parametric Revit families for paints and coatings. From leading brands like Sherwin Williams to Behr to PPG Paints, we have it here. Download the Revit files you need, then save your favorite families to the cloud to use later with your MyBIMsmith account – all for free."
        },
        {
            name: 'Piping',
            type: enums.entityType.category,
            subcategories: [],
            manufacturers: [],
            description: "Browse through Bimsmith’s curated library of parametric piping families for Revit. From outlet boxes to flush valves, we have it here. Compare side by side with key stats such as measurements, outlet connections and sizes, inlet connections and sizes, and application types. Download the BIM objects you need, then save your favorite families to the cloud to use later with your MyBIMsmith account – all 100% for free."
        },
        {
            name: 'Railings',
            type: enums.entityType.category,
            subcategories: [],
            manufacturers: [],
            description: "Browse through Bimsmith’s comprehensive collection of parametric BIM objects for railings. Choose between models using with key stats such as measurements, finish, and baluster details. Download the BIM content you need, then save your favorite families to the cloud to use later with your MyBIMsmith account."
        },
        {
            name: 'Roofing',
            type: enums.entityType.category,
            subcategories: [],
            manufacturers: [],
            description: "Browse through Bimsmith’s library of roofing Revit families for free download. Compare the products you like best, then download the Revit files you need or save them in the cloud for free by clicking Add to MyBIMsmith."
        },
        {
            name: 'Security Cameras',
            type: enums.entityType.category,
            subcategories: [],
            manufacturers: [],
            description: "Browse through Bimsmith’s comprehensive collection of parametric BIM content for security cameras. Compare products with key stats such as camera type, resolution, and field of view. Download the Revit content you need, then save your favorite families to the cloud to use later with your MyBIMsmith account – all 100% for free."
        },
        {
            name: 'Skylights',
            type: enums.entityType.category,
            subcategories: [],
            manufacturers: [],
            description: "Download skylights for Revit with Bimsmith’s Market. Browse through BIM skylights from leading manufacturers like Wasco Skylights. Whether its strucutral or nonstructural, simple or complex, dome or pyramid, you can find the industry's top skylight BIM objects here. Compare key stats and features, and view or download all cut sheets, 3-part specs, product literature, material information, and more for each product quickly and easily. Building with the best skylights in the industry starts with the best skylight Revit models in the industry. Download now with BIMsmith."
        },
        {
            name: 'Revolving Doors',
            type: enums.entityType.category,
            subcategories: [],
            manufacturers: ['Boon Edam USA'],
            description: ""
        },
        {
            name: 'Access Gates',
            type: enums.entityType.category,
            subcategories: [],
            manufacturers: ['Boon Edam USA'],
            description: ""
        }
    ];

    return new DataTable(_all);
}

// ======================================================================================================
// Manufacturers - data container for manufacturers
// 
// Anguleris Technologies
// John R. Kosinski
//
// 22 Feb 2018
// ------------------------------------------------------------------------------------------------------
function Manufacturers() {
    const _all = [
        { name: 'Armstrong Flooring',
            type: enums.entityType.manufacturer,
            address:'2500 Columbia Ave (Bldg 402), Lancaster, PA 17603, United States', 
            phone: '+1-888-276-7876', 
            description:'Armstrong is a leader in the design and manufacture of commercial flooring. Our innovative and award-winning commercial flooring designs and our comprehensive solutions enable our customers to deliver exceptional interior spaces that surpass their clients’ expectations. We proudly serve: Interior Designers, Building Owners, Architects, Facility Managers, Contractors, Main Street Locations, Sustainability Commitment - Armstrong Flooring is committed to systematically reducing our environmental footprint, while providing innovative products and services that enable our customers to create sustainable indoor environments.  Learn about our sustainability initiatives'
        },
        { name: 'Behr' ,
            type: enums.entityType.manufacturer,
            address:'3400 W. Segerstrom Avenue, Santa Ana, CA 92704, United States', 
            phone: '+1-714-545-7101', 
            description: 'BEHR carries a full line of Architectural and Professional Grade Paints, Primers, and specialty products designed to meet the demands of all types of construction and project conditions. Over 40 of our BEHR and KILZ products have achieved the UL Environmental GREENGUARD and the prestigious GREENGUARD Gold Product Certification.  Our GREENGUARD Gold Certified products are approved by  Collaborative for High Performance Schools (CHPS) for K-12 schools.  Many BEHR products qualify for the USGBC’s LEED v.9 and LEED v.4, for Healthcare, the NAHB Green Building Guidelines and Green Globe; they also meet the requirements of many other building codes, standards and specifications.'
        },
        { name: 'Boon Edam USA',
            type: enums.entityType.manufacturer,
            address:'402 McKinney Parkway, Lillington, NC 27546, United States', 
            phone: '+1-910-814-3800', 
            description:'Royal Boon Edam is a global market leader in entry solutions. Headquartered in the Netherlands, with 140 years of experience in engineering quality, we have gained extensive expertise in managing the movement of people through office buildings, airports, healthcare facilities, hotels and many other types of buildings. We are focused on providing an optimal experience for our clients and their clients. By working together with you, our client, we help determine the exact requirements for the mobility hotspot in and around your building and develop a solution that is customized for you in three key areas: Sustainability, Security and Service.'
        },
        { name: 'Clark Dietrich',
            type: enums.entityType.manufacturer,
            address:'', 
            phone: '', 
            description:''
        },
        { name: 'Delta Turnstiles',
            type: enums.entityType.manufacturer,
            address:'', 
            phone: '', 
            description:''
        },
        { name: 'Dow Corning',
            type: enums.entityType.manufacturer,
            address:'2200 W. Salzburg Rd., PO Box 994 Auburn, MI 48611, United States', 
            phone: '+1-989-496-4400', 
            description:'Dow Performance Silicones is a global leader in the development of silicon-based materials for façade construction. As the boundaries of architectural opportunity extend, Dow‘s innovative solutions make a significant contribution toward optimizing the performance of modern architecture. Our silicone solutions for high performance façades are expansive to meet different needs and local performance requirements.'
        },
        { name: 'Epilay',
            type: enums.entityType.manufacturer,
            address:'', 
            phone: '', 
            description:''
        },
        { name: 'Fabral',
            type: enums.entityType.manufacturer,
            address:'', 
            phone: '', 
            description:''
        },
        { name: 'Homasote',
            type: enums.entityType.manufacturer,
            address:'', 
            phone: '', 
            description:''
        },
        { name: 'Grabber',
            type: enums.entityType.manufacturer,
            address:'', 
            phone: '', 
            description:''
        },
        { name: 'Kenmore',
            type: enums.entityType.manufacturer,
            address:'3333 Beverly Road, Hoffman Estates, IL 60179, United States', 
            phone: '+1-888-536-6673', 
            description:"The Kenmore brand truly is 100 years of trusted performance. We’re backed by exclusive features and innovations that no other brand can bring. We deliver products that perform at a high level across the home, to get the job done right the first time. And we're always evolving to help you cook, clean and live better."
        },
        { name: 'Moen',
            type: enums.entityType.manufacturer,
            address:'', 
            phone: '', 
            description:''
        },
        { name: 'National Gypsum',
            type: enums.entityType.manufacturer,
            address:'2001 Rexford Road, Charlotte, NC 28211, United States', 
            phone: '+1-704-365-7300', 
            description:'National Gypsum is one of the largest gypsum board producers in the world. Headquartered in Charlotte, NC, the company is a full-line supplier, recognized in the industry for customer service and product quality. Gypsum board is the company\'s primary product, and National Gypsum is the second largest producer in the United States. The company has 17 operating gypsum board plant locations strategically located near metropolitan areas. National Gypsum\'s gypsum board is marketed under the Gold Bond® BRAND. National Gypsum has six plants producing interior finishing products under the ProForm® BRAND. The primary product is joint compound which you may hear called "ready mix" or "drywall mud". Cement board, marketed under the PermaBase® BRAND, is the company\'s third business line. Cement board is produced in four plants, and is used primarily as an underlayment for tile walls, floors and countertops.'
        },
        { name: 'Oatey',
            type: enums.entityType.manufacturer,
            address:'', 
            phone: '', 
            description:''
        },
        { name: 'Ply Gem',
            type: enums.entityType.manufacturer,
            address:'', 
            phone: '', 
            description:''
        },
        { name: 'Polyset',
            type: enums.entityType.manufacturer,
            address:'', 
            phone: '', 
            description:''
        },
        { name: 'Proflex',
            type: enums.entityType.manufacturer,
            address:'', 
            phone: '', 
            description:''
        },
        { name: 'Trex',
            type: enums.entityType.manufacturer,
            address:'', 
            phone: '', 
            description:''
        },
        { name: 'W.R. Meadows',
            type: enums.entityType.manufacturer,
            address:'', 
            phone: '', 
            description:''
        },
        { name: 'Waterworks',
            type: enums.entityType.manufacturer,
            address:'', 
            phone: '', 
            description:''
        }
    ];

    return new DataTable(_all);
}

// ======================================================================================================
// Products - data container for manufacturers
// 
// Anguleris Technologies
// John R. Kosinski
//
// 22 Feb 2018
// ------------------------------------------------------------------------------------------------------
function Products() {
    const _all = [
        { 
            id: 1,
            type: enums.entityType.product,
            simpleName: 'Speed lane Slide',
            name: 'Speed lane Slide by Boon Edam USA',
            manufacturer: 'Boon Edam USA',
            category: 'Optical Turnstiles',
            features: {
                height: '40 3/4 inches',
                width: ['12 1/4 inches', '20 1/8 inches'],
                length: '4 feet by 8 11/16 inches',
                color: ['black', 'white', 'gray']
            },
            description:'The Intuitive Speed Gate. As pedestrian mobility increases so does the need for a sophisticated, intuitive, refined and yet secure entry management experience for those entering and moving around buildings. The Speed lane Slide interacts with those who approach it, managing and guiding authorized users through to the secured areas of buildings.',
        },
        { 
            id: 2,
            type: enums.entityType.product,
            simpleName: 'Speed lane Open',
            name: 'Speed lane Open by Boon Edam USA',
            manufacturer: 'Boon Edam USA',
            category: 'Optical Turnstiles',
            features: {
                width: '6 1/4 inches',
                length: '30 inches',
                color: ['black', 'white', 'gray']
            },
            description:'The Barrier Free Optical Turnstile. The Speed lane Open assists with channelling the flow of people entering and moving around buildings. Commonly operating in multiples, it acts as a boundary between public and private worlds, guiding users to their destination under the watchful eyes of a security guard. It interacts with both worlds to ensure the right people are channelled to the right place, alerting security guards if there is a breach of access.'
        },
        {
            id: 3,
            type: enums.entityType.product,
            simpleName: '24 inch Built-In Dishwasher',
            name: '24 inch Built-In Dishwasher by Kenmore', 
            altNames: [
                '24" built-in dishwasher'
            ],
            manufacturer: 'Kenmore',
            category: 'Dishwashers',
            subcategory: null,
            features: {
                finish: 'Stainless Steel',
                height: '33 1/2 inches to 34 1/2 inches',
                depth: '24 7 / 8 "',
                width: '24"'
            },
            description: "The 24 inch Kenmore built-in dishwasher features 360 degree PowerWash Technology, which provides a spray arm that delivers a far-reaching spiral pattern throughout the dishwasher giving it the ability to clean even hard to reach areas. This unit also includes the UltraWash® wash system, which uses a filter that only requires monthly cleaning, to deliver energy-efficient results and works to eliminate even the tiniest food particles. And don’t sweat the small stuff with the Top Rack Only option that allows you to wash items only within the top portion of your dishwasher. Lastly, for days when you do not have a lot of time, this dishwasher provides a press Wash cycle that quickly washes a completely full load of dirty dishes without sacrificing cleaning."
        },
        {
            id: 4,
            type: enums.entityType.product,
            simpleName: '30 inch Electric Self-Clean Single Wall Oven',
            name: '30 inch Electric Self-Clean Single Wall Oven by Kenmore',
            altNames: [
                '30" Electric Self-Clean Single Wall Oven'
            ],
            manufacturer: 'Kenmore',
            category: 'Ranges',
            subcategory: null,
            features: {
                finish: 'Stainless Steel',
                height: '29',
                depth: '24 1/2',
                width: '30',
                capacity: 5.1
            },
            description: ""
        },
        {
            id: 5,
            type: enums.entityType.product,
            simpleName: 'SPEEDHIDE Interior Flat Latex',
            name: 'SPEEDHIDE Interior Flat Latex by National Gypsum',
            manufacturer: 'National Gypsum',
            category: 'Paints & Coatings',
            subcategory: null,
            features: {
                paintType: 'Latex',
                height: '29',
                depth: '24 1/2',
                width: '30',
                capacity: 5.1
            },
            description: "Our best professional interior latex is formulated to meet the performance requirements of professional applicators. SPEEDHIDE Interior Enamel Latex is designed as a high hiding product when applied by brush, roller or spray. This low-VOC, low-odor paint enables a space to be painted while occupied while delivering the durable product performance required."
        },
        {
            id: 6,
            type: enums.entityType.product,
            simpleName: 'Delta 7000-B', 
            name: 'Delta 7000-B by Delta Turnstiles',
            altNames: [
                'Delta 7000 B'
            ],
            manufacturer: 'Delta Turnstiles',
            category: 'Optical Turnstiles',
            subcategory: null, 
            features: {
                height: '38 inches',
                width: '7 inches', 
                length: [42, 48]                
            },
            description: "The Delta 7000-B pairs the security of Delta's optical technology with the additional deterrence of swinging arms. Available with square or round ends and many other customization options. The Delta 7000-B has all the functional and architectural features of the Delta 7000, plus physical barriers, which can be employed or deployed by security staff or your access control system on demand. These barrier arms act as an additional visible deterrent to unauthorized access attempts. The Delta 7000-B's barrier arms are silent and sleek, yet very effective at controlling lobby access. The product's design utilizes LEDs, a digital sound card, and a direct-drive barrier system which makes for a low-maintenance but very effective lobby security solution. The Delta 7000-B optical turnstile pedestals come in a variety of lengths to suit space limitations and design concerns; both rounded ends and squared ends are available. The Delta 7000-B is a low maintenance, secure, and beautiful addition to your lobby or reception area."
        },
        {
            id: 7,
            type: enums.entityType.product,
            simpleName: 'Delta 5000-SG',
            name: 'Delta 5000-SG by Delta Turnstiles',
            altNames: [
                'Delta 5000 SG'
            ],
            category: 'Optical Turnstiles',
            manufacturer: 'Delta Turnstiles',
            subcategory: null, 
            features: {
                height: '38 inches',
                width: '6 1/4 inches',
                length: [48, 56]
            }, 
            description: "Swinging Glass Optical Turnstile with Glass Sided Panels. Delta Turnstiles, LLC, is an American manufacturer of quality optical turnstiles, based in Concord, CA. The Delta 5000-SG is a bi-directional optical turnstile with swinging glass barrier panels. With its side glass panels, it adds a more minimalistic design. It can be used as a purely optical turnstile or as a barrier-type optical turnstile. When in “barrier mode” the glass panels act as an additional visual deterrent to unauthorized access attempts. The Delta 5000-SG’s breakaway barrier type is acceptable by all safety code regulations. Method of Operation: An access card or other credential is presented to the customer supplied access control reader mounted inside the casework. If entry is authorized, the Traffic Flow Indicator (TFI) will light as a green arrow pointing in the direction authorized, the barriers will open, and a chime will sound indicating to the user that they may pass. Unauthorized access attempts and tailgaters are singled out by local visual/audible alarms and access control system event condition."
        },
        {
            id: 8,
            type: enums.entityType.product,
            simpleName: 'Speed lane Swing',
            name: 'Speed lane Swing by Boon Edam USA',
            category: 'Optical Turnstiles',
            manufacturer: 'Boon Edam USA',
            subcategory: null, 
            features: {
                height: '40 3/4 inches',
                width: '4 1/8 inches',
                length: '69 7/8 inches',
                color: ['black', 'white', 'gray']
            }, 
            description: "The Sophisticated Optical Turnstile. The Speed lane Swing manages and channels the flow of people entering and moving around buildings. Commonly operating in multiples, thus fluently guiding the flow of high visitor levels; the Speed lane acts as a boundary between public and private worlds. Interacting with both worlds it ensures that the right people are channeled to the right place, placing the control of the entry in its hands. Part of the Lifeline series, the Speed lane Swing has been designed to the highest standards, ahead of industry trends"
        },
        {
            id: 9,
            type: enums.entityType.product,
            simpleName: 'Tournex',
            name: 'Tournex by Boon Edam USA',
            altNames: [
                'Tornex',
                'Tour necks',
                'Tour next'
            ],
            category: 'Revolving Doors',
            manufacturer: 'Boon Edam USA',
            subcategory: null, 
            features: {
                color: ['black']
            }, 
            description: ""
        },
        {
            id: 10,
            type: enums.entityType.product,
            simpleName: 'Winglock Swing',
            name: 'Winglock Swing by Boon Edam USA',
            category: 'Access Gates',
            manufacturer: 'Boon Edam USA',
            subcategory: null, 
            features: {
                color: ['black', 'white']
            }, 
            description: "We are proud to announce the introduction of our slimmest, single wing access gate in our range. The Winglock Swing had been designed to coordinate with our Speed lane Lifeline series, but can also stand alone as a single installation."
        },
        {
            id: 11,
            type: enums.entityType.product,
            simpleName: '28 inch Dishwasher',
            name: '28 inch Dishwasher by Kenmore', 
            altNames: [
                '28" dishwasher'
            ],
            manufacturer: 'Kenmore',
            category: 'Dishwashers',
            subcategory: null,
            features: {
                finish: 'Metallic',
                height: '33 1/2 inches to 34 1/2 inches',
                depth: '28 7 / 8 inches',
                width: '28 inches'
            },
            description: "The 24 inch Kenmore built-in dishwasher features 360 degree PowerWash Technology, which provides a spray arm that delivers a far-reaching spiral pattern throughout the dishwasher giving it the ability to clean even hard to reach areas. This unit also includes the UltraWash® wash system, which uses a filter that only requires monthly cleaning, to deliver energy-efficient results and works to eliminate even the tiniest food particles. And don’t sweat the small stuff with the Top Rack Only option that allows you to wash items only within the top portion of your dishwasher. Lastly, for days when you do not have a lot of time, this dishwasher provides a press Wash cycle that quickly washes a completely full load of dirty dishes without sacrificing cleaning."
        },
    ];

    var dataTable = new DataTable(_all);
    
    dataTable.findByName = async((name) => {
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

            //if not yet found, try to query by simpleName
            if (!output){
                for(var n=0; n<_all.length; n++) {
                    var item = _all[n]; 
                    if (item && item.simpleName) {
                        var tmp = item.simpleName.trim().toLowerCase(); 
                        if (name === tmp){
                            output = item;
                            break;
                        }
                    }

                    //check altnames 
                    if (item && item.altNames) {
                        for (var i=0; i<item.altNames.length; i++){
                            var tmp = item.altNames[i].trim().toLowerCase(); 
                            if (tmp === name) {
                                output = item; 
                                break; 
                            }

                            //add mfg name to end
                            tmp += ' by ' + item.manufacturer.trim().toLowerCase(); 
                            if (tmp === name) {
                                output = item; 
                                break; 
                            }
                        }

                        if (output)
                            break;
                    }
                }
            }

            return output; 
        });
    });

    return dataTable; 
}


// ------------------------------------------------------------------------------------------------------
// gets all categories, or a specific one by name
//
// args
//  name: the name of the desired category; if omitted, all categories are returned in array
//
// returns: single object or array of categories
const getCategories = async((name) => {
    return exception.try(() => {
        if (name)
            return await(_categories.findByName(name)); 
        else
            return await(_categories.all());
    });
});

// ------------------------------------------------------------------------------------------------------
// gets all manufacturers, or a specific one by name
//
// args
//  name: the name of the desired manufacturer; if omitted, all manufacturers are returned in array
//
// returns: single object or array of manufacturers
const getManufacturers = async((name) => {
    return exception.try(() => {
        if (name)
            return await(_manufacturers.findByName(name)); 
        else
            return await(_manufacturers.all());
    });
});

// ------------------------------------------------------------------------------------------------------
// gets all products, or a specific one by id
//
// args
//  name: the id of the desired product; if omitted, all products are returned in array
//
// returns: single object or array of products
const getProducts = async((id) => {
    return exception.try(() => {
        if (id)
            return await(_products.findById(id)); 
        else
            return await(_products.all());
    });
});

// ------------------------------------------------------------------------------------------------------
// gets a list of categories that have the given manufacturer as a manufacturer
//
// args
//  manufacturerName: the name of the manufacturer in question 
// 
// returns: array of categories 
const getCategoriesForManufacturer = async((manufacturerName) => {
    return exception.try(() => {
        manufacturerName = manufacturerName.trim().toLowerCase(); 
        var output = [];

        var categories = await(_categories.all()); 
        for(var i=0; i<categories.length; i++) {
            var category = categories[i]; 

            if (category.manufacturers) {
                for (var n=0; n<category.manufacturers.length; n++){
                    var mfg = category.manufacturers[n]; 
                    if (mfg.toLowerCase().trim() === manufacturerName){
                        output.push(category); 
                        break;
                    }
                }
            }
        }

        return output; 
    });
});

// ------------------------------------------------------------------------------------------------------
// gets a list of products in the given category 
//
// args
//  categoryName: name of the category for which to get products
//
// returns: array of products
const getProductsForCategory = async((categoryName) => {
    return exception.try(() => {
        categoryName = categoryName.trim().toLowerCase(); 
        var output = [];

        var products = await(_products.all());

        for (var n=0; n<products.length; n++) {
            var prod = products[n]; 
            if (prod.category.trim().toLowerCase() === categoryName)
                output.push(prod); 
        }

        return output; 
    });
});

// ------------------------------------------------------------------------------------------------------
// gets a list of products offered by the given manufacturer
//
// args
//  manufacturerName: name of the manufacturer for which to get products
//
// returns: array of products
const getProductsForManufacturer = async((manufacturerName) => {
    return exception.try(() => {
        manufacturerName = manufacturerName.trim().toLowerCase(); 
        var output = [];

        var products = await(_products.all());

        for (var n=0; n<products.length; n++) {
            var prod = products[n]; 
            if (prod.manufacturer.trim().toLowerCase() === manufacturerName)
                output.push(prod); 
        }

        return output; 
    });
});

// ------------------------------------------------------------------------------------------------------
// gets a product by its name 
//
// args
//  name: the name of the desired product; 
//
// returns: product object 
const getProductByName = async((productName) => {
    return exception.try(() => {
        return await(_products.findByName(productName));
    }); 
});

// ------------------------------------------------------------------------------------------------------
// attempts to get some entity that has a matching name 
//
// args
//  name: the name of the desired entity 
//
// returns: single category, product, or manufacturer (or null) 
const getEntityByName = async((name) => {
    return exception.try(() => {
        var output = await(_categories.findByName(name)); 
        if (!output){
            output = await(_manufacturers.findByName(name)); 
            if (!output) {
                output = await(_prod.findByName(name));
            }
        }
        
        return output; 
    });
}); 

// ------------------------------------------------------------------------------------------------------
// gets all of the name properties from every object in the given table. Removes any resulting 
// elements that are undefined or null. 
// 
// args
//  table: the data table container 
//
// returns: string[]
const getAllNames = async((table) => {
    return exception.try(() => {
        return common.arrays.removeWhereNullOrUndefined(common.arrays.select(await(table.all()), 'name')); 
    });
});

// ------------------------------------------------------------------------------------------------------
// determines whether a category by the given name exists in the database.
//
// args
//  name: category name
//
// returns: boolean 
const categoryExists = async((name) => {
    return exception.try(() => {
        return (!common.types.isUndefinedOrNull(await(_categories.findByName(name)))); 
    });
});

// ------------------------------------------------------------------------------------------------------
// determines whether a manufacturer by the given name exists in the database.
//
// args
//  name: manufacturer name
//
// returns: boolean 
const manufacturerExists = async((name) => {
    return exception.try(() => {
        return (!common.types.isUndefinedOrNull(await(_manufacturers.findByName(name)))); 
    });
});

// ------------------------------------------------------------------------------------------------------
// determines whether a product by the given name exists in the database.
//
// args
//  name: product name
//
// returns: boolean 
const productExists = async((name) => {
    return exception.try(() => {
        return (!common.types.isUndefinedOrNull(await(_products.findByName(name)))); 
    });
});

// ------------------------------------------------------------------------------------------------------
// determines whether an entity (catgeory, manufacturer, or product) by the given name exists 
// in the database.
//
// args
//  name: catgeory, manufacturer, or product name
//
// returns: boolean 
const entityExists = async((name) => {
    return exception.try(() => {
        if (await(categoryExists(name)))
            return true; 
        else{
            if (await(manufacturerExists(name)))
                return true; 
            else{
                if (await(productExists(name)))
                    return true; 
            }
        }

        return false;
    });
});



module.exports = {
    getCategories,
    getManufacturers,
    getCategoriesForManufacturer,
    getProductsForCategory,
    getProductsForManufacturer,
    getProducts: getProducts,
    getProductByName,
    getEntityByName,
    getAllProductNames : () => { return getAllNames(_products);},
    getAllCategoryNames : () => { return getAllNames(_categories);},
    getAllManufacturerNames : () => { return getAllNames(_manufacturers);},
    categoryExists,
    productExists,
    manufacturerExists,
    entityExists,

    getUser: users.getUser
};