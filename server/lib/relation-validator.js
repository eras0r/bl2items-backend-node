exports.validateRelation = function (propertyName, propertyValue, targetCollection, err, done) {

  console.log('propertyName', propertyName);
  console.log('propertyValue', propertyValue);
  //console.log('targetCollection', targetCollection);
  //console.log('err', err);

  console.log('calling exists for ' + targetCollection + ' with id= ' + propertyValue);

  targetCollection.exists(propertyValue, function (queryErr, exists) {
    console.log('queryErr = ', queryErr);
    console.log('exists = ', exists);

    if (!exists) {
      console.log('Model with id %s does not exist! Throwing error now.', propertyValue);
      err();
    }

    // always call done
    done();

  });

};
