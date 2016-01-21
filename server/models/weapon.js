module.exports = function (Weapon) {

  console.log('calling base class validator...');
  // call the base validator
  require('./abstract-item.js')(Weapon);
  console.log('calling base class validator... OK');

  console.log('performing weapon specific validations...');

  // TODO add relation validations for weapon specific relation (such as weaponTypeId and damageTypeId)
  //Weapon.validate('manufacturerId', customValidator, {message: 'Manufacturer does not exist'});
  //function customValidator(err) {
  //
  //}

  console.log('performing weapon specific validations... OK');

};
