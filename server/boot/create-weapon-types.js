'use strict';

var log = require('./../middleware/logger');

module.exports = function (app) {

  if (process.env.NODE_ENV === 'development') {

    app.dataSources.mongoDb.automigrate('WeaponType', function (err) {
      if (err) {
        throw err;
      }

      app.models.WeaponType.create([
        {
          name: 'Pistol',
          sortOrder: 1
        },
        {
          name: 'Submachine gun',
          sortOrder: 2
        },
        {
          name: 'Shotgun',
          sortOrder: 3
        },
        {
          name: 'Assault rifle',
          sortOrder: 4
        },
        {
          name: 'Sniper rifle',
          sortOrder: 5
        },
        {
          name: 'Rocket launcher',
          sortOrder: 6
        }
      ], function (err, weaponTypes) {
        if (err) {
          throw err;
        }

        log.debug('Number of WeaponType created: %d', Object.keys(weaponTypes).length);
      });

    });

  }

};
