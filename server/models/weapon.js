'use strict';

var relationValidator = require('./../lib/relation-validator.js');
var AbstractItem = require('./abstract-item.js');

module.exports = function (Weapon) {

  console.log('calling base class validator...');

  // call the base validator
  AbstractItem.validateItem(Weapon);

  console.log('performing weapon specific validations...');

  relationValidator.validateRelation(Weapon, 'weaponTypeId', 'WeaponType');

  console.log('performing weapon specific validations... OK');

};
