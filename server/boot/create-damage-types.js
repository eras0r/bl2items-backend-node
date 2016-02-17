'use strict';

var log = require('./../middleware/logger');

module.exports = function (app) {

  if (process.env.NODE_ENV === 'development') {

    app.dataSources.mongoDb.automigrate('DamageType', function (err) {
      if (err) {
        throw err;
      }

      app.models.DamageType.create([
        {
          name: '-none-',
          sortOrder: 1,
          color: '#ffffff'
        },
        {
          name: 'corrosive',
          sortOrder: 2,
          color: '#09f108',
          damageLabel: 'Corrosive Dmg/Sec',
          chanceLabel: 'Chance to corrode',
          additionalText: 'Highly effective vs Armor'
        },
        {
          name: 'electro',
          sortOrder: 3,
          color: '#1f4fbd',
          damageLabel: 'Electrocute Dmg/Sec',
          chanceLabel: 'Chance to shock',
          additionalText: 'Highly effective vs Shields'
        },
        {
          name: 'explosive',
          sortOrder: 4,
          color: '#dcc824',
          additionalText: 'Deals bonus explosive damage'
        },
        {
          name: 'fire',
          sortOrder: 5,
          color: '#e57b0e',
          damageLabel: 'Burn Dmg/Sec',
          chanceLabel: 'Chance to Ignite',
          additionalText: 'Highly effective vs Flesh'
        },
        {
          name: 'slag',
          sortOrder: 6,
          color: '#7014af',
          chanceLabel: 'Chance to Slag',
          additionalText: 'Slagged enemies take more damage'
        }
      ], function (err, damageTypes) {
        if (err) {
          throw err;
        }

        log.debug('Number of DamageType created: %d', Object.keys(damageTypes).length);
      });

    });

  }

};
