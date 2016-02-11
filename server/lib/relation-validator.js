'use strict';

var Q = require('q');
var util = require('util');

var app = require('../../server/server');

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
        console.log(errorMsg);
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

      //console.log('Going to delete %s matching %j',
      //  ctx.Model.pluralModelName,
      //  ctx.where);

      // generic test whether related objects exist (based on the models configured relations)

      // iterate over relations
      var relations = ctx.Model.relations;

      // create an array of promises for the relation lookups
      var relCountPromises = [];

      for (var relKey in relations) {
        if (relations.hasOwnProperty(relKey)) {
          var relation = relations[relKey];

          console.log('found relation with key: ', relKey);
          var relationType = relation.type;
          //console.log('relation type: ', relationType);

          if (relationType === 'hasMany') {
            var relationName = relation.name;
            var modelTo = relation.modelTo;
            //console.log('================================');
            console.log('checking relation with name %s linking to model %s', relationName, modelTo.modelName);
            //console.log('modelTo: ', modelTo.modelName);

            relCountPromises.push(checkForExistingModelRelation(modelTo, idToDelete));

          }
        }
      }
      console.log('================================');

      Q.all(relCountPromises)
        .then(function (results) {
          console.log('No relations found. Manufacturer can be deleted');
          // just delete the manufacturer
          next();
        })
        .catch(function (error) {
          var errorMsg = util.format('Document cannot be deleted, because there are still other documents referencing to %s with id %s', model.modelName, idToDelete);
          // throw an error
          var err = new Error(errorMsg);
          err.statusCode = 422;
          console.log(err.toString());
          next(err);
        });

    }

  });
};

function checkForExistingModelRelation(targetModel, idToSearch) {

  console.log('check for existing model relation with model %s and id %s', targetModel.modelName, idToSearch);
  var deferred = Q.defer();
  // TODO count should be executed in parallel if there are multiple relations
  console.log('checking for relation of model %s with id %s', targetModel.modelName, idToSearch);
  targetModel.count({manufacturerId: idToSearch})
    .then(function (relatedItemsCount) {
      console.log('number of related items for model %s: %d', targetModel.modelName, relatedItemsCount);
      if (relatedItemsCount === 0) {
        deferred.resolve(relatedItemsCount);
      }
      else {
        deferred.reject(util.format('There are still %d number of %s', relatedItemsCount, targetModel.modelName));
      }
    })
    .catch(function (error) {
      // TODO allow deletion or not if query could not be executed?
      console.log('error searching models: ', error);
      deferred.reject('Errors checking for existing relation for target model %s with id: ', targetModel.modelName, idToSearch);
    });

  return deferred.promise;
}
