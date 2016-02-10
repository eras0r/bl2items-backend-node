'use strict';

var Q = require('q');

var app = require('../../server/server');

/**
 * Loads all weapons by applying the given filter.
 * @param filter the filter to be applied.
 * @returns {*} a promise which will contain an array of all retrieved weapons upon fulfillment.
 */
function loadWeapons(filter) {
  return app.models.Weapon.find(filter);
}

/**
 * Loads all shields by applying the given filter.
 * @param filter the filter to be applied.
 * @returns {*} a promise which will contain an array of all retrieved shields upon fulfillment.
 */
function loadShields(filter) {
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
      console.log('error retrieving items ', error);
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
      console.log('error counting items ', error);
      deferred.reject(error);
    });

  return deferred.promise;

};
