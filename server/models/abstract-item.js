var relationValidator = require('./../lib/relation-validator.js');
var app = require('../../server/server');

module.exports = function (AbstractItem) {

  // async validation (see https://github.com/strongloop/loopback/issues/1527)
  AbstractItem.validateAsync('manufacturerId', customValidator, {message: 'Manufacturer does not exist'});
  function customValidator(err, done) {
    console.log('AbstractItem custom validator');

    // check if a manufacturer with the given manufacturerId exists
    console.log('calling relationValidator...');
    // accessing another model via app.models.
    relationValidator.validateRelation('manufacturerId', this.manufacturerId, app.models.Manufacturer, err, done);

    console.log('calling relationValidator... OK');
  }

};
