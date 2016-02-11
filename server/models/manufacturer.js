'use strict';

var util = require('util');

var relationValidator = require('./../lib/relation-validator.js');

module.exports = function (Manufacturer) {

  relationValidator.ensureNoExsitingRelationsBeforeDelete(Manufacturer);
  // check if we have an id
  //if (ctx.where && ctx.where.id) {
  //  var manufacturerId = ctx.where.id;
  //
  //  // use the itemsFinder to count all items which belong to the manufacturer to be deleted
  //  itemsFinder.countItems({manufacturerId: manufacturerId})
  //    .then(function (itemsCount) {
  //      // there are no more items for the manufacturer to be deleted
  //      if (itemsCount === 0) {
  //        // just delete the manufacturer
  //        next();
  //      }
  //      // there are still items which belong to this manufacturer
  //      else {
  //        // throw an error
  //        var err = new Error(util.format('Manufacturer with id "%s" has %d items and cannot be deleted', manufacturerId, itemsCount));
  //        err.statusCode = 422;
  //        console.log(err.toString());
  //        next(err);
  //      }
  //    })
  //    .catch(function (error) {
  //      console.log('error counting items ', error);
  //      cb(null, []);
  //    });
  //}

};
