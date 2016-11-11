/**
 * Created by yijhuang on 11/12/16.
 */

'use strict';

const spawn = require('child_process').spawn;
const ROOT_PATH = './public';
const PORT = 3000;

exports.start = (rootPath, port) => {

    let hs = spawn('http-server', [rootPath | ROOT_PATH, '-p', port | PORT]);

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