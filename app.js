'use strict';

const config = require('./cfg/config.json')


// finally start server
require('./lib/server').start(config.publicPath, config.server.address, config.server.port);