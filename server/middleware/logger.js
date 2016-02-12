'use strict';

var winston = require('winston');

// create custom logger
var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      level: 'silly',
      colorize: true,
      timestamp: true,
      prettyPrint: true
    })
    //new (winston.transports.File)({filename: 'somefile.log'})
  ]
});

module.exports = logger;
