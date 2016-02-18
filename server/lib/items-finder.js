'use strict';

var Q = require('q');

var app = require('../../server/server');
var log = require('./../middleware/logger');
var _ = require('lodash');

/**
 * Removes non allowed includes from the given filter. If filter.include contains a value that is not present in
 * the given model's relations, this include will be removed from the filter.
 * @param filter the filter which contains the includes
 * @param model The model which will be filtered
 */
function removeNonAllowedIncludes(filter, model) {
  log.debug('Looking for relations with of model "%s"', model.modelName);
  var allowedIncludes = [];

  // get relations from model and determine allowedIncludes
  var relations = model.relations;
  for (var relKey in relations) {
    if (relations.hasOwnProperty(relKey)) {
      log.debug('Adding relation key "%s" to allowedIncludes.', relKey);
      allowedIncludes.push(relKey);
    }
  }

  if (filter && filter.include) {
    filter.include = _.intersection(filter.include, allowedIncludes);
  }
}

/**
 * Loads all items by applying the given filter.
 * @param model the base model to load the items from (sub-model of AbstractItem)
 * @param filter the filter to be applied.
 * @returns {*} a promise which will contain an array of all retrieved items of the given model filtered by the
 * given filter upon fulfillment.
 */
function loadItems(model, filter) {
  removeNonAllowedIncludes(filter, model);
  return model.find(filter);
}

/**
 * Counts all items by applying the given filter.
 * @param filter the filter to be applied.
 * @returns {*} a promise which will contain the number of items which matched the given filter upon fulfillment.
 */
exports.findItems = function (filter) {

  var deferred = Q.defer();

  Q.all([
      loadItems(app.models.Weapon, filter),
      loadItems(app.models.Shield, filter)
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

      log.debug('found %d items', items.length);

      deferred.resolve(items);
    })
    .catch(function (error) {
      log.error('error retrieving items ', error);
      deferred.reject(error);
    });

  return deferred.promise;

};

/**
 * Counts all items by applying the given filter.
 * @param filter the filter to be applied.
 * @returns {*} a promise which will contain an array of all retrieved items upon fulfillment.
 */
exports.countItems = function (filter) {

  var deferred = Q.defer();

  Q.all([
      app.models.Weapon.count(filter),
      app.models.Shield.count(filter)
    ])
    .then(function (promiseResults) {
      var totalCount = 0;

      // iterate over the promise Results
      promiseResults.forEach(function (count) {
        totalCount += count;
      });

      deferred.resolve(totalCount);
    })
    .catch(function (error) {
      log.error('error counting items ', error);
      deferred.reject(error);
    });

  return deferred.promise;

};
