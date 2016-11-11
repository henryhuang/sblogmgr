/**
 * Created by yijhuang on 11/12/16.
 */

'use strict';

const spawn = require('child_process').spawn;
const ROOT_PATH = './public';
const PORT = 3000;
const ADDRESS = '127.0.0.1';

exports.start = (rootPath = ROOT_PATH, address = ADDRESS, port = PORT) => {

    let hs = spawn('http-server', [rootPath, '-p', port, '-a', address]);

    hs.stdout.on('data', (data) => {
        console.log(data.toString());
    });

    hs.stderr.on('data', (data) => {
        console.log(data.toString());
    });

    hs.on('exit', (code) => {
        console.log(`Blog exited with code ${code}`);
    });

}