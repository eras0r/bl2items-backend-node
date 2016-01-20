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

      console.log('Models created: \n', manufacturers);
    });

  });

};
