exports.validateRelation = function (propertyName, propertyValue, targetCollection, err, done) {

  console.log('propertyName', propertyName);
  console.log('propertyValue', propertyValue);

  targetCollection.exists(propertyValue, function (queryErr, exists) {
    if (!exists) {
      console.log('%s with id "%s" does not exist! Throwing error now.', targetCollection.modelName, propertyValue);
      err();
    }

    // always call done
    done();

  });

};
