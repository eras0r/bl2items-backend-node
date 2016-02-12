'use strict';

var Q = require('q');
var util = require('util');

var app = require('../../server/server');
var log = require('./../middleware/logger');

/**
 * Async model validator, that ensures that the there is an existing model within the referenced collection.
 * @param validatedCollection the collection to be validated
 * @param propertyName the property name of the foreign key to be validated
 * @param targetCollectionName the name of the target collection to which the relation points
 */
exports.validateRelation = function (validatedCollection, propertyName, targetCollectionName) {

  var errorMsg = util.format('%s with the given id does not exist.', targetCollectionName);

  // async validation (see https://github.com/strongloop/loopback/issues/1527)
  validatedCollection.validateAsync(propertyName, RelationValidator, {message: errorMsg});

  /**
   *
   * @param err
   * @param done
   */
  function RelationValidator(err, done) {

    // get the target collection
    var targetCollection = app.models[targetCollectionName];
    // detemine the property value of the foreign key property
    var propertyValue = this[propertyName];

    // check if a model in the target collection exists
    targetCollection.exists(propertyValue, function (queryErr, exists) {
      if (!exists) {
        log.warn('%s cannot be saved, because referenced %s with the id "%s" does not exist.',
          validatedCollection.modelName, targetCollectionName, propertyValue);
        err();
      }

      // always call done
      done();

    });
  }

};

exports.ensureNoExsitingRelationsBeforeDelete = function (model) {

  // before delete hook
  model.observe('before delete', function (ctx, next) {

    // check if we have an id
    if (ctx.where && ctx.where.id) {
      var idToDelete = ctx.where.id;

      // generic test whether related objects exist (based on the models configured relations)

      // iterate over relations
      var relations = ctx.Model.relations;

      // create an array of promises for the relation lookups
      var relCountPromises = [];

      log.debug('Looking for relations with target model %s ', model.modelName);
      for (var relKey in relations) {
        if (relations.hasOwnProperty(relKey)) {
          var relation = relations[relKey];

          log.debug('found relation with target model %s and key %s', model.modelName, relKey);
          var relationType = relation.type;
          var relationName = relation.name;
          var modelTo = relation.modelTo;

          if (relationType === 'hasMany') {
            log.debug('Considering relation %s with target model %s for referential integrity checks',
              relationName, modelTo.modelName);
            relCountPromises.push(checkForExistingModelRelation(modelTo, idToDelete));
          }
        }
      }

      // executing all relation count promises in parallel
      Q.all(relCountPromises)
        .then(function (results) {
          log.debug('No relations have been found for %s with id', model.modelName, idToDelete);
          // just delete the manufacturer
          next();
        })
        .catch(function (error) {
          // there are still other documents referencing the document to be deleted -> throwing validation error
          var errorMsg = util.format('Document cannot be deleted, because there are still other documents' +
            ' referencing to %s with id %s', model.modelName, idToDelete);
          log.warn(errorMsg);

          var err = new Error(errorMsg);
          err.statusCode = 422;

          next(err);
        });

    }

  });
};

function checkForExistingModelRelation(targetModel, idToSearch) {

  log.debug('check for existing relations with target model %s and id %s', targetModel.modelName, idToSearch);
  var deferred = Q.defer();

  targetModel.count({manufacturerId: idToSearch})
    .then(function (relatedItemsCount) {
      log.info('number of related documents for model %s: %d', targetModel.modelName, relatedItemsCount);
      if (relatedItemsCount === 0) {
        deferred.resolve(relatedItemsCount);
      }
      else {
        deferred.reject(util.format('There are still %d number of %s', relatedItemsCount, targetModel.modelName));
      }
    })
    .catch(function (error) {
      log.error('error searching models: ', error);
      deferred.reject('Errors checking for existing relations for target model %s with id: ',
        targetModel.modelName, idToSearch);
    });

  return deferred.promise;
}
