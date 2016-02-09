'use strict';

var relationValidator = require('./../lib/relation-validator.js');

module.exports = function (AbstractItem) {

};

module.exports.validateItem = function (Item) {
  // setup validation
  relationValidator.validateRelation(Item, 'manufacturerId', 'Manufacturer');
  relationValidator.validateRelation(Item, 'rarityId', 'Rarity');
};
