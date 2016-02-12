'use strict';

module.exports = {
  restApiRoot: '/api',
  host: process.env.OPENSHIFT_NODEJS_IP || 'localhost',
  port: process.env.OPENSHIFT_NODEJS_PORT || 3000
};
