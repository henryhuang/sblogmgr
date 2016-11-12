/**
 * Created by yijhuang on 11/12/16.
 */
'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');

const ROOT_PATH = './public';
const PORT = 3000;
const ADDRESS = '127.0.0.1';

exports.startServer = (cfg) => {

    let rootPath = cfg.publicPath || ROOT_PATH;
    let address = cfg.server.address || ADDRESS;
    let port = cfg.server.port || PORT;

    let app = express();
    let upload = multer(); // for parsing multipart/form-data

    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

    app.all('/*', (req, res, next) => {
        console.log(req.method, req.path);
        next();
    });

    /**
     * /public static files
     */
    app.use(express.static(rootPath));

    /**
     * Webhook handler
     */
    app.post('/wh', upload.array(), function (req, res, next) {
        console.log(req.body);
        if(cfg.webhook.token && cfg.webhook.token === req.body.token) {
            res.send('ok!');
        } else {
            res.send('invalid token!');
        }
    });

    app.listen(port, address, () => {
        console.log('Server listening on ', address + ':' + port);
    });

}