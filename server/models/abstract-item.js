'use strict';

var log = require('./../middleware/logger');
var relationValidator = require('./../lib/relation-validator.js');
var itemsFinder = require('./../lib/items-finder.js');

module.exports = function (AbstractItem) {

  // disable all default REST API endpoints
  AbstractItem.disableRemoteMethod('create', true);                // Removes (POST) /abstract-items
  AbstractItem.disableRemoteMethod('upsert', true);                // Removes (PUT) /abstract-items
  AbstractItem.disableRemoteMethod('deleteById', true);            // Removes (DELETE) /abstract-items/:id
  AbstractItem.disableRemoteMethod('updateAll', true);             // Removes (POST) /abstract-items/update
  AbstractItem.disableRemoteMethod('updateAttributes', false);     // Removes (PUT) /abstract-items/:id
  AbstractItem.disableRemoteMethod('createChangeStream', true);    // removes (GET|POST) /abstract-items/change-stream

  //AbstractItem.disableRemoteMethod('find', true);
  AbstractItem.disableRemoteMethod('findById', true);
  AbstractItem.disableRemoteMethod('findOne', true);

  //AbstractItem.disableRemoteMethod('count', true);
  AbstractItem.disableRemoteMethod('exists', true);

  AbstractItem.disableRemoteMethod('__get__manufacturer', false);
  AbstractItem.disableRemoteMethod('__get__rarity', false);

  AbstractItem.on('dataSourceAttached', function (obj) {

    // override find method in model
    AbstractItem.find = function (filter, cb) {
      // use the itemsFinder to merge all items
      itemsFinder.findItems(filter)
        .then(function (items) {
          cb(null, items);
        })
        .catch(function (error) {
          log.error('error retrieving items ', error);
          cb(null, []);
        });
    };

    // override count method in model
    AbstractItem.count = function (filter, cb) {
      // use the itemsFinder to merge all items
      itemsFinder.countItems(filter)
        .then(function (items) {
          cb(null, items);
        })
        .catch(function (error) {
          log.error('error counting items ', error);
          cb(null, []);
        });
    };

  });

};

module.exports.validateItem = function (Item) {
  // setup validation
  relationValidator.validateRelation(Item, 'manufacturerId', 'Manufacturer');
  relationValidator.validateRelation(Item, 'rarityId', 'Rarity');
};
