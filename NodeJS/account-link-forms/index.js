'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const async = require('asyncawait/async');
const await = require('asyncawait/await');

const config = require('./config');
const common = require('anguleris-common');
const exception = common.exceptions('IDX');


function run() {
    //app.use(bodyParser.raw());
    app.use(bodyParser.json());

    var sendFile = (res, filename) => {
        exception.try(() => {
            res.sendfile('./client' + filename);
        });
    }

    var registerGetFile = (url, filename) => {
        if (!filename)
            filename = url; 
            
        app.get(url, (req, res) => {
            sendFile(res, filename);
        });
    }

    registerGetFile('/', '/index.html');
    registerGetFile('/index.html');

    registerGetFile('/js/main.js');    

    registerGetFile('/css/main.css');    
    registerGetFile('/css/spinner.css');    
    
    registerGetFile('/images/close-button.png');    

    app.options('/', (req, res) => {
        exception.try(() => {
            console.log('OPTIONS /');

            res.setHeader('Access-Control-Allow-Origin', 'http://localhost');
            res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'X-Custom-Header');
            res.send('{}');
        });
    });

    app.post('/', async((req, res) => {
        exception.try(() => {
            logger.info('POST /auth');
            res.send(await(common.postAuth(req.query, req.body)));
        });
    }));


    //open http port 
    app.listen(config.httpPort, () => console.log('account-link listening on port ' + config.httpPort));
}


module.exports = {
    run: run
}

run();
