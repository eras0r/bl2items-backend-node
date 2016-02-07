'use strict';

var relationValidator = require('./../lib/relation-validator.js');

module.exports = function (AbstractItem) {

  relationValidator.validateRelation(AbstractItem, 'manufacturerId', 'Manufacturer');
  relationValidator.validateRelation(AbstractItem, 'rarityId', 'Rarity');

};
