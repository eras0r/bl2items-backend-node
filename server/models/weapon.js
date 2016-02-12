'use strict';

var relationValidator = require('./../lib/relation-validator.js');
var AbstractItem = require('./abstract-item.js');

module.exports = function (Weapon) {

  // call the base validator
  AbstractItem.validateItem(Weapon);

  // performing model weapon validation
  relationValidator.validateRelation(Weapon, 'weaponTypeId', 'WeaponType');

};
