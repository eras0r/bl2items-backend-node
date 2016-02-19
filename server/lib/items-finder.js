'use strict';

var Q = require('q');

var app = require('../../server/server');
var log = require('./../middleware/logger');
var _ = require('lodash');

/**
 * Removes non allowed includes from the given filter. If filter.include contains a value that is not present in
 * the given model's relations, this include will be removed from the filter.
 * @param model The model which will be filtered
 * @param filter the filter which contains the includes
 * @return the adjusted filter
 */
function getFilter(model, filter) {
  if (!filter) {
    return null;
  }

  // make e clone as the same filter instance is being used for all entities
  var adjustedFilter = _.clone(filter);

  if (adjustedFilter && adjustedFilter.include) {
    log.debug('filter.include has been found. Removing non exsiting included now.');
    var allowedIncludes = [];

    // get relations from model and determine allowedIncludes
    log.debug('Looking for relations with of model "%s"', model.modelName);
    var relations = model.relations;
    for (var relKey in relations) {
      if (relations.hasOwnProperty(relKey)) {
        log.debug('Adding relation key "%s" to allowedIncludes.', relKey);
        allowedIncludes.push(relKey);
      }
    }

    // remove includes without relations
    adjustedFilter.include = _.intersection(adjustedFilter.include, allowedIncludes);
  }

  return adjustedFilter;
}

/**
 * Loads all items by applying the given filter.
 * @param model the base model to load the items from (sub-model of AbstractItem)
 * @param filter the filter to be applied.
 * @returns {*} a promise which will contain an array of all retrieved items of the given model filtered by the
 * given filter upon fulfillment.
 */
function loadItems(model, filter) {
  return model.find(getFilter(model, filter));
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
