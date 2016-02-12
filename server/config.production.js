'use strict';

var log = require('./middleware/logger');

log.info('loading config for production environment');

module.exports = {
  restApiRoot: '/api',
  host: process.env.OPENSHIFT_NODEJS_IP || 'localhost',
  port: process.env.OPENSHIFT_NODEJS_PORT || 3000
};
