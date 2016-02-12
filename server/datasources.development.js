'use strict';

var log = require('./middleware/logger');

log.info('loading datasource for environment "development"');

module.exports = {
  mongoDb: {
    connector: 'mongodb',
    hostname: process.env.BL2ITEMS_MONGODB_DB_HOST,
    port: process.env.BL2ITEMS_MONGODB_DB_PORT,
    user: process.env.BL2ITEMS_MONGODB_DB_USERNAME,
    password: process.env.BL2ITEMS_MONGODB_DB_PASSWORD,
    database: process.env.BL2ITEMS_MONGODB_DB_NAME
  }
};
