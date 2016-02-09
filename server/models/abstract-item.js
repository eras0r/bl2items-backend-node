'use strict';

var Q = require('q');

var relationValidator = require('./../lib/relation-validator.js');
var app = require('../../server/server');

module.exports = function (AbstractItem) {

  // disable all default REST API endpoints
  AbstractItem.disableRemoteMethod('create', true);                // Removes (POST) /abstract-items
  AbstractItem.disableRemoteMethod('upsert', true);                // Removes (PUT) /abstract-items
  AbstractItem.disableRemoteMethod('deleteById', true);            // Removes (DELETE) /abstract-items/:id
  AbstractItem.disableRemoteMethod('updateAll', true);             // Removes (POST) /abstract-items/update
  AbstractItem.disableRemoteMethod('updateAttributes', false);     // Removes (PUT) /abstract-items/:id
  AbstractItem.disableRemoteMethod('createChangeStream', true);    // removes (GET|POST) /abstract-items/change-stream

  AbstractItem.disableRemoteMethod('find', true);
  AbstractItem.disableRemoteMethod('findById', true);
  AbstractItem.disableRemoteMethod('findOne', true);

  AbstractItem.disableRemoteMethod('count', true);
  AbstractItem.disableRemoteMethod('exists', true);

  AbstractItem.disableRemoteMethod('__get__manufacturer', false);
  AbstractItem.disableRemoteMethod('__get__rarity', false);

  /**
   * Lists all items by merging all models which extend the AbstractItem model
   * Unfortunately this cannot be done by simply overriding the find method. Because the find method is being invoked by
   * the extending models as well, which would lead to a stack overflow error
   * @param filter Filter defining fields, where, include, order, offset, and limit
   * @param cb the callback
   */
  AbstractItem.listItems = function (filter, cb) {

    console.log('>>> listItems invoked');

    function loadWeapons(filter) {
      return app.models.Weapon.find(filter);
    }

    function loadShields(filter) {
      return app.models.Shield.find(filter);
    }

    Q.all([
        loadWeapons(filter),
        loadShields(filter)
      ])
      .then(function (promiseResults) {
        var items = [];

        // iterate over the promise Results
        promiseResults.forEach(function (promiseResult) {
          // iterate over items
          promiseResult.forEach(function (item) {
            items.push(item);
          });
        });

        cb(null, items);
      })
      .catch(function (error) {
        console.log('error retrieving items ', error);
        cb(null, []);
      });

  };

  AbstractItem.remoteMethod(
    'listItems',
    {
      accepts: {arg: 'filter', type: 'string'},
      returns: {
        type: 'array',
        root: true // the array is not wrappe in a json object, see https://docs.strongloop.com/display/public/LB/Remote+methods#Remotemethods-Settingaremotemethodroute
      },
      http: {verb: 'get', path: '/'}
    }
  );

};

module.exports.validateItem = function (Item) {
  // setup validation
  relationValidator.validateRelation(Item, 'manufacturerId', 'Manufacturer');
  relationValidator.validateRelation(Item, 'rarityId', 'Rarity');
};
