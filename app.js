'use strict';

const config = require('./cfg/config.json')


// finally start server
require('./lib/server').startServer(config);