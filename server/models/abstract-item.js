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

  AbstractItem.remoteMethod(
    'listItems',
    {
      accepts: {arg: 'filter', type: 'string'},
      returns: {
        type: 'array',
        // see https://docs.strongloop.com/display/public/LB/Remote+methods#Remotemethods-Settingaremotemethodroute
        root: true // the array is not wrapped in a json object,
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
