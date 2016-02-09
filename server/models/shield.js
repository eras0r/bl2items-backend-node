'use strict';

var AbstractItem = require('./abstract-item.js');

module.exports = function (Shield) {

  // call the base validator
  AbstractItem.validateItem(Shield);

};
