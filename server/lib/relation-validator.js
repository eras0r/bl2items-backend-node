'use strict';

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
