var relationValidator = require('./../lib/relation-validator.js');
var app = require('../../server/server');

module.exports = function (Weapon) {

  console.log('calling base class validator...');
  // call the base validator
  require('./abstract-item.js')(Weapon);
  console.log('calling base class validator... OK');

  console.log('performing weapon specific validations...');

  Weapon.validateAsync('weaponTypeId', weaponTypeValidator, {message: 'WeaponType does not exist'});
  function weaponTypeValidator(err, done) {
    relationValidator.validateRelation('weaponTypeId', this.weaponTypeId, app.models.WeaponType, err, done);
  }

  console.log('performing weapon specific validations... OK');

};
