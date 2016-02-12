'use strict';

var util = require('util');

var relationValidator = require('./../lib/relation-validator.js');

module.exports = function (Manufacturer) {

  relationValidator.ensureNoExsitingRelationsBeforeDelete(Manufacturer);

};
