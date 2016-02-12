'use strict';

var log = require('./../middleware/logger');

module.exports = function (app) {

  app.dataSources.mongoDb.automigrate('Manufacturer', function (err) {
    if (err) {
      throw err;
    }

    app.models.Manufacturer.create([
      {name: 'Anshin'},
      {name: 'Bandit'},
      {name: 'Dahl'},
      {name: 'Eridian'},
      {name: 'Hyperion'},
      {name: 'Jakobs'},
      {name: 'Maliwan'},
      {name: 'Pangolin'},
      {name: 'Tediore'},
      {name: 'Torgue'},
      {name: 'Vladof'}
    ], function (err, manufacturers) {
      if (err) {
        throw err;
      }

      log.debug('Number of Manufacturer created: %d', Object.keys(manufacturers).length);
    });

  });

};
