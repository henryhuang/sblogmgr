/**
 * Created by yijhuang on 11/12/16.
 */
'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');

const ROOT_PATH = './public';
const PORT = 3000;
const PORT_WH = 3001;
const ADDRESS = '127.0.0.1';

exports.startServer = (cfg) => {

    let rootPath = cfg.public.root || ROOT_PATH;
    let address = cfg.public.address || ADDRESS;
    let port = cfg.public.port || PORT;

    let appPublic = express();

    appPublic.all('/*', (req, res, next) => {
        console.log(req.method, req.path);
        next();
    });

    appPublic.listen(port, address, () => {
        console.log('Server listening on ', address + ':' + port);
    });

    let appWebhook = express();
    let portWh = cfg.webhook.port || PORT_WH;

    /**
     * /public static files
     */
    appWebhook.use(express.static(rootPath));

    let upload = multer(); // for parsing multipart/form-data
    appWebhook.use(bodyParser.json()); // for parsing application/json
    appWebhook.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

    /**
     * Webhook handler
     */
    appWebhook.post('/wh', upload.array(), function (req, res, next) {
        console.log(req.body);
        if(cfg.webhook.token && cfg.webhook.token === req.body.token) {
            res.send('ok!');
        } else {
            res.send('invalid token!');
        }
    });

    appWebhook.listen(portWh, address, () => {
        console.log('Server listening on ', address + ':' + portWh);
    });

}