'use strict';

var Q = require('q');

var app = require('../../server/server');
var log = require('./../middleware/logger');
var _ = require('lodash');

/**
 * Removes non allowed includes from the given filter. If filter.include contains a value that is not present in
 * allowdeIncludes, this include will be removed from the filter.
 * @param filter the filter which contains the includes
 * @param allowedIncludes array containing all allowed includes
 */
function removeNonAllowedIncludes(filter, allowedIncludes) {
  if (filter && filter.include) {
    filter.include = _.intersection(filter.include, allowedIncludes);
  }
}

/**
 * Loads all weapons by applying the given filter.
 * @param filter the filter to be applied.
 * @returns {*} a promise which will contain an array of all retrieved weapons upon fulfillment.
 */
function loadWeapons(filter) {
  var allowedIncludes = ['manufacturer', 'rarity', 'damageType', 'weaponType'];
  removeNonAllowedIncludes(filter, allowedIncludes);
  return app.models.Weapon.find(filter);
}

/**
 * Loads all shields by applying the given filter.
 * @param filter the filter to be applied.
 * @returns {*} a promise which will contain an array of all retrieved shields upon fulfillment.
 */
function loadShields(filter) {
  var allowedIncludes = ['manufacturer', 'rarity'];
  removeNonAllowedIncludes(filter, allowedIncludes);
  return app.models.Shield.find(filter);
}

/**
 * Counts all items by applying the given filter.
 * @param filter the filter to be applied.
 * @returns {*} a promise which will contain the number of items which matched the given filter upon fulfillment.
 */
exports.findItems = function (filter) {

  var deferred = Q.defer();

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
