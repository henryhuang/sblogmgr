/**
 * Created by yijhuang on 11/12/16.
 */
'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var process = require('child_process');
var fs = require('fs');

const ROOT_PATH = './public';
const PORT = 3000;
const PORT_WH = 3001;
const ADDRESS = '127.0.0.1';
const env = {
    'token': ''
}

const initEnv = () => {
    let token = fs.readFileSync('./.token', 'utf8').trim();
    console.log('Load token webhook:', token);
    env.token = token;
}

exports.startServer = (cfg) => {

    initEnv();

    let rootPath = cfg.public.root || ROOT_PATH;
    let address = cfg.public.address || ADDRESS;
    let port = cfg.public.port || PORT;

    let appPublic = express();

    appPublic.all('/*', (req, res, next) => {
        console.log(req.method, req.path);
        next();
    });

    /**
     * /public static files
     */
    appPublic.use(express.static(rootPath));

    appPublic.listen(port, address, () => {
        console.log('Public service listening on ', address + ':' + port);
    });

    let appWebhook = express();
    let portWh = cfg.webhook.port || PORT_WH;

    let upload = multer(); // for parsing multipart/form-data
    appWebhook.use(bodyParser.json()); // for parsing application/json
    appWebhook.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

    /**
     * Webhook handler
     */
    appWebhook.get('/', function (req, res) {
        res.send('AppShowPub API.');
    });

    /**
     * Webhook handler
     */
    appWebhook.post('/wh', upload.array(), function (req, res, next) {
        console.log(req.body);
        if (env.token && env.token === req.body.token) {

            let publicDir = __dirname + '/../public';

            fs.renameSync(publicDir, publicDir + '.bak');

            let cmd = 'git clone ' + cfg.public.repository.remote + ' -b ' + cfg.public.repository.branch + ' ' + __dirname + '/../public';
            console.log(cmd)

            process.exec(cmd, (error, stdout, stderr) => {
                if (error !== null) {
                    fs.renameSync(publicDir + '.bak', publicDir);
                    res.send('<pre>fail\n' + stdout + error + '</pre>');
                } else {
                    require('rmdir')(publicDir + '.bak', function (err, dirs, files) {
                        console.log(dirs);
                        console.log(files);
                        console.log(publicDir + '.bak' + ' all files are removed');
                        console.log('update done!')
                    });
                    res.send('<pre>done\n' + stdout + '</pre>');
                }
            });

        } else {
            res.send('invalid token!');
        }
    });

    appWebhook.listen(portWh, address, () => {
        console.log('Webhook service listening on ', address + ':' + portWh);
    });

}