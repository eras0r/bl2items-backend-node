'use strict';

var log = require('./../middleware/logger');

module.exports = function (app) {

  if (process.env.NODE_ENV === 'development') {

    app.dataSources.mongoDb.automigrate('Rarity', function (err) {
      if (err) {
        throw err;
      }

      app.models.Rarity.create([
        {
          name: 'common',
          color: '#ffffff',
          sortOrder: 1
        },
        {
          name: 'uncommon',
          color: '#00ff00',
          sortOrder: 2
        },
        {
          name: 'rare',
          color: '#2f78ff',
          sortOrder: 3
        },
        {
          name: 'very rare',
          color: '#9132c8',
          sortOrder: 4
        },
        {
          name: 'e-tech',
          color: '#ff00ff',
          sortOrder: 5
        },
        {
          name: 'legendary',
          color: '#ff9600',
          sortOrder: 6
        },
        {
          name: 'pearlescent',
          color: '#00ffff',
          sortOrder: 7
        },
        {
          name: 'seraph',
          color: '#ff69b4',
          sortOrder: 8
        }
      ], function (err, rarities) {
        if (err) {
          throw err;
        }

        log.debug('Number of Rarity created: %d', Object.keys(rarities).length);
      });

    });

  }

};
