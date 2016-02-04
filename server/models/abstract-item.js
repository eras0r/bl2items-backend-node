var relationValidator = require('./../lib/relation-validator.js');
var app = require('../../server/server');

module.exports = function (AbstractItem) {

  // async validation (see https://github.com/strongloop/loopback/issues/1527)
  AbstractItem.validateAsync('manufacturerId', manufacturerValidator, {message: 'Manufacturer does not exist'});
  function manufacturerValidator(err, done) {
    console.log('AbstractItem manufacturer validator');

    // check if a manufacturer with the given manufacturerId exists
    console.log('calling relationValidator...');
    // accessing another model via app.models.
    relationValidator.validateRelation('manufacturerId', this.manufacturerId, app.models.Manufacturer, err, done);

    console.log('calling relationValidator... OK');
  }

  AbstractItem.validateAsync('rarityId', rarityValidator, {message: 'Rarity does not exist'});
  function rarityValidator(err, done) {

    // check if a rarity with the given id exists
    // accessing another model via app.models.
    relationValidator.validateRelation('rarityId', this.rarityId, app.models.Rarity, err, done);
  }

};
