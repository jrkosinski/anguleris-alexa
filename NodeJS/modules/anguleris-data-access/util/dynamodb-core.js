
// ===============================================================================================
// dynamodb-core - interface to dynamoDB storage 
// 
// John R. Kosinski
// 30 Nov 2017
const async = require("asyncawait/async");
const await = require("asyncawait/await");
const AWS = require("aws-sdk");

const config = require("../config");
const common = require("anguleris-common")
const exception = common.exceptions("DYN");
const logger = common.logger("DYN");
const types = common.types;


//create dynamo instance 
var dynamo = new AWS.DynamoDB({
    apiVersion: '2012-08-10',
    region: config.aws.dynamodb.region(),
    accessKeyId: config.aws.dynamodb.apiKey(),
    secretAccessKey: config.aws.dynamodb.apiSecret()
});

var dbEnvironment = config.environmentSuffix();

// ----------------------------------------------------------------------------------------------- 
// gets the real table name, given the requested table name. The real
// table name may be dependent on the db environment in config.
// 
// args
//  table: name of the table requested
//
// returns: string
function getTableName(table) {
    if (dbEnvironment && dbEnvironment.length) {
        return table + "-" + dbEnvironment;
    }
    return table;
}

// ----------------------------------------------------------------------------------------------- 
// get all items of a certain type
// 
// args
//  table: name of the table from which to query
//
// returns: array of objects (Promise)
function scanTable(table) {
    return new Promise((resolve, reject) => {
        var errorOptions = {
            onError: () => { resolve(null); },
            functionName: 'scanTable'
        };

        exception.try(() => {
            //logger.info('scanTable ' + table);
            var params = {
                TableName: getTableName(table)
            };

            dynamo.scan(params, (err, data) => {
                if (err) {
                    logger.error(err);
                    resolve(null);
                }
                else {
                    //logger.info('scan got data');
                    resolve(data ? data.Items : null);
                }
            });
        }, errorOptions);
    });
}

// ----------------------------------------------------------------------------------------------- 
// selects all items of a certain type, with the given characteristics
// 
// args
//  table: name of the table from which to query
//  args: query arguments
//
// example args:
//   {
//        ExpressionAttributeValues: {
//        ":v1": {
//                S: "No One You Know"
//            }
//        }, 
//        KeyConditionExpression: "Artist = :v1", 
//        ProjectionExpression: "SongTitle"
//    }
//
// returns: array of objects (Promise)
function query(table, params) {
    return new Promise((resolve, reject) => {
        params.TableName = getTableName(table);

        var errorOptions = {
            onError: () => { resolve(null); },
            functionName: 'query'
        };

        exception.try(() => {
            logger.info('query ' + JSON.stringify(params));

            dynamo.query(params, (err, data) => {
                if (err) {
                    logger.error(err);
                    resolve(null);
                }
                else {
                    logger.info('query got data');
                    resolve(data ? data.Items : null);
                }
            });
        }, errorOptions);
    });
}

// ----------------------------------------------------------------------------------------------- 
// get all items of a certain type, with given criteria
// 
// args
//  table: name of the table from which to query
//  keys: dynamoDB format, specifies which items to retrieve
//
// returns: array of objects  (Promise)
function getItems(table, keys) {

    //if no keys, do a full table scan 
    if (!keys)
        return scanTable(table);

    return new Promise((resolve, reject) => {
        var errorOptions = {
            onError: () => { resolve(null); },
            functionName: 'getItems'
        };

        exception.try(() => {
            logger.info('getItems ' + getTableName(table) + ', ' + (keys ? JSON.stringify(keys) : "null"));
            var params = { RequestItems: {} };

            params.RequestItems[getTableName(table)] = { Keys: keys };

            dynamo.batchGetItem(params, (err, data) => {
                if (err) {
                    logger.error(err);
                    resolve(null);
                }
                else {
                    logger.info('got data from ' + getTableName(table));
                    if (data && data.Responses && data.Responses[table])
                        resolve(data.Responses[table]);
                    else
                        resolve(null);
                }
            });

        }, errorOptions);
    });
}

// ----------------------------------------------------------------------------------------------- 
// retrieve a single item from a given table; the first one that 
// matches the given criteria.
// 
// args
//  table: name of the table from which to query
//  keys: dynamoDB format, specifies which items to retrieve
//
// returns: a single object 
var getSingleItem = async(function (table, keys) {
    var items = await(getItems(table, keys));

    return exception.try(() => {
        if (items && items.length)
            return items[0];

        return null;
    });
});

// ----------------------------------------------------------------------------------------------- 
// retrieve a single item by its id property value.
// 
// args
//  table: name of the table from which to query    
//  id: value of the id property
//
// returns: a single object or null if not found
var getItemById = async(function (table, id) {
    return await(getSingleItem(table, [{ 'id': { 'S': id } }]));
});

// ----------------------------------------------------------------------------------------------- 
// deletes an item from a table. 
// 
// args
//  table: name of the table from which to delete
//  key: dynamoDB format, specifies the item to delete 
// 
// returns: boolean (true on success) (Promise)
function deleteItem(table, key) {
    return new Promise((resolve, reject) => {
        var errorOptions = {
            onError: () => { resolve(null); },
            functionName: 'deleteItem'
        };

        exception.try(() => {
            logger.info('deleteItem ' + getTableName(table) + ', ' + JSON.stringify(key));
            var params = {
                TableName: getTableName(table),
                Key: key
            };

            dynamo.deleteItem(params, (err) => {
                if (err) {
                    exception.handleError(err);
                    resolve(false);
                }
                else {
                    logger.info('successful delete from ' + getTableName(table));
                    resolve(true);
                }
            });

        }, errorOptions);
    });
}

// ----------------------------------------------------------------------------------------------- 
// adds a new item or updates an existing item, in given table. 
// 
// args
//  table: name of the table from which to delete
//  item: the item to add or update 
// 
// returns: the modified or added object  (Promise)
function putItem(table, item) {
    return new Promise((resolve, reject) => {
        var errorOptions = {
            onError: () => { resolve(null); },
            functionName: 'putItem'
        };

        exception.try(() => {
            logger.info('putItem ' + getTableName(table));
            var params = {
                TableName: getTableName(table),
                Item: item
            };

            dynamo.putItem(params, (err, data) => {
                if (err) {
                    exception.handleError(err);
                    resolve(item);
                }
                else {
                    logger.info('successful put to ' + getTableName(table));
                    resolve(item);
                }
            });

        }, errorOptions);
    });
}

// ----------------------------------------------------------------------------------------------- 
// converts a single property to proper db format
// 
// args
//  input: the raw json object
//  output: the desired output object
//  propertyType: the string identifier of DB data type (e.g 'S')
//  propertyName: the name of the property to convert
// 
// returns: the converted object
function formatPropertyForDB(input, output, propertyType, propertyName, jsonPropertyName) {
    return exception.try(() => {
        if (!output)
            output = {};

        if (!jsonPropertyName)
            jsonPropertyName = propertyName;

        if (!types.isUndefinedOrNull(input[propertyName])) {
            var value = input[jsonPropertyName];

            //convert bool to N
            if (propertyType == 'bool') {
                propertyType = 'N';
                value = (value ? 1 : 0);
            }
            //convert json to string
            if (propertyType == 'json') {
                propertyType = 'S';

                //don't stringify if already a string 
                if (value && (typeof(value) !== 'string'))
                    value = JSON.stringify(value);
            }
            //convert lists to arrays
            if (propertyType == 'list') {
                propertyType = 'S';
                if (value && Array.isArray(value))
                    value = value.join();
            }
            var propValue = {};
            propValue[propertyType] = value.toString();
            output[propertyName] = propValue;
        }
        return output;
    });
}

// ----------------------------------------------------------------------------------------------- 
// converts a single property from db object to plain json format
// 
// args
//  input: the database object
//  output: the desired output object
//  propertyType: the string identifier of DB data type (e.g 'S')
//  propertyName: the name of the property to convert
// 
// returns: the converted object
function formatPropertyForJson(input, output, propertyType, propertyName, jsonPropertyName) {
    return exception.try(() => {
        if (!output)
            output = {};

        var isJson = false;
        var isList = false;

        //assume both property names are the same 
        if (!jsonPropertyName)
            jsonPropertyName = propertyName;

        if (propertyType == 'bool')
            propertyType = 'N';
        if (propertyType == 'json') {
            propertyType = 'S';
            isJson = true;
        }
        //convert lists to arrays
        if (propertyType == 'list') {
            propertyType = 'S';
            isList = true;
        }

        if (!types.isUndefinedOrNull(input[propertyName])) {
            output[jsonPropertyName] = input[propertyName][propertyType];
			if (propertyType === 'N') {
				output[jsonPropertyName] = types.tryParseFloat(output[jsonPropertyName]);
			}
			
            if (isJson && output[jsonPropertyName])
                output[jsonPropertyName] = JSON.parse(output[jsonPropertyName]);
                
            if (isList && output[jsonPropertyName])
                output[jsonPropertyName] = (output[jsonPropertyName]).split(',');
        }
        return output;
    });
}

// ----------------------------------------------------------------------------------------------- 
// converts an array of objects from db format to json format
// 
// args
//  inputArray: array of database objects 
//  formatter: a function that takes a database object and returns a json object
//          (e.g.) formatTriggerForJson
// 
// returns: array of json objects 
function formatArrayForJson(inputArray, formatter) {
    return exception.try(() => {
        var output = [];
        if (inputArray) {
            for (var n = 0; n < inputArray.length; n++) {
                output.push(formatter(inputArray[n]));
            }
        }
        return output;
    });
}

// -----------------------------------------------------------------------------------------------
// given a specification in a certain form, transforms an ordinary object into a dynamo-db 
// formatted object. 
// 
// args
//  classSpec: a specification in the form { properties: [ {name: <string>, type:<string> ...} ...]}
//  obj: the object to format 
//  
// returns: object formatted for dyanamo db
function formatObjectForDB(classSpec, obj) {
    return exception.try(() => {
        var output = null; 

        if (classSpec && obj) {
            output = {}; 

            for (var n=0; n<classSpec.properties.length; n++) {
                var prop = classSpec.properties[n]; 

                if (prop.getDefaultValue) {
                    if (!obj[prop.name])
                        obj[prop.name] = prop.getDefaultValue(obj); 
                }
                formatPropertyForDB(obj, output, prop.type, prop.name);
            }
        }

        return output; 
    });
}

// -----------------------------------------------------------------------------------------------
// given a specification in a certain form, transforms a dynamo-db formatted object 
// into an ordinary json object.
// 
// args
//  obj: the object to format 
//  
// returns: object formatted as ordinary json
function formatObjectForJson(classSpec, obj) {
    return exception.try(() => {
        var output = null; 

        if (classSpec && obj) {
            output = {}; 

            for (var n=0; n<classSpec.properties.length; n++) {
                var prop = classSpec.properties[n];             
                formatPropertyForJson(obj, output, prop.type, prop.name);
            }
        }

        return output; 
    });
}


module.exports = {
    scanTable,
    getItems,
    getSingleItem,
    getItemById,
    query,
    putItem,
    deleteItem,
    formatPropertyForDB,
    formatPropertyForJson,
    formatArrayForJson,
    formatObjectForJson,
    formatObjectForDB
}; 