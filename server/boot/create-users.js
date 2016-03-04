'use strict';

var log = require('./../middleware/logger');

module.exports = function (app) {

  if (process.env.NODE_ENV === 'development') {

    var User = app.models.Bl2User;
    var Role = app.models.Bl2Role;
    var RoleMapping = app.models.Bl2RoleMapping;

    app.dataSources.mongoDb.automigrate('Bl2User', function (err) {
      if (err) {
        throw err;
      }

      User.create([
        {
          username: 'admin',
          email: 'admin@example.com',
          password: '4rb4l3st'
        },
        {
          username: 'eraser',
          email: 'eraser@example.com',
          password: '4rb4l3st'
        }
      ], function (err, users) {
        if (err) {
          throw err;
        }

        // delete all roles
        Role.destroyAll(function (err, info) {

          // delete all role mappings
          RoleMapping.destroyAll(function (err, info) {

            //create the admin role
            Role.create({
              name: 'admin'
            }, function (err, role) {
              if (err) {
                throw err;
              }

              log.debug('Created role:', role);

              //make 'admin' an admin
              role.principals.create({
                principalType: RoleMapping.USER,
                principalId: users[0].id
              }, function (err, principal) {
                if (err) throw err;

                log.debug('Created principal:', principal);
              });
            });

          });

        });

        log.debug('Number of Users created: %d', Object.keys(users).length);
      });

    });

  }

};
