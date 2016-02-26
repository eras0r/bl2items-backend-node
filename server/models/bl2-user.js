var app = require('../../server/server');

module.exports = function (Bl2User) {

  'use strict';

  // remove unwanted remote methods that we are overriding
  Bl2User.disableRemoteMethod('__create__roles', false);
  Bl2User.disableRemoteMethod('__delete__roles', false);
  Bl2User.disableRemoteMethod('__link__roles', false);
  Bl2User.disableRemoteMethod('__unlink__roles', false);
  Bl2User.disableRemoteMethod('__findById__roles', false);
  Bl2User.disableRemoteMethod('__updateById__roles', false);
  Bl2User.disableRemoteMethod('__destroyById__roles', false);
  Bl2User.disableRemoteMethod('__exists__roles', false);

  /**
   * Add the user to the given role by name.
   *
   * @param {string} roleName
   * @param {Function} callback
   */
  Bl2User.prototype.addToRole = function (roleName, callback) {
    var Role = app.models.Bl2Role;
    var RoleMapping = app.models.Bl2RoleMapping;
    var error, userId = this.id;

    Role.findOne(
      {
        where: {name: roleName}
      },
      function (err, role) {
        if (err) {
          return callback(err);
        }

        if (!role) {
          error = new Error('Role ' + roleName + ' not found.');
          error.statusCode = 404;
          return callback(error);
        }

        RoleMapping.findOne(
          {
            where: {
              principalId: userId,
              roleId: role.id
            }
          },
          function (err, roleMapping) {
            if (err) {
              return callback(err);
            }

            if (roleMapping) {
              return callback();
            }

            role.principals.create(
              {
                principalType: RoleMapping.USER,
                principalId: userId
              },
              callback
            );
          }
        );
      }
    );
  };

  Bl2User.remoteMethod(
    'addToRole',
    {
      description: 'Add User to the named role',
      accessType: 'WRITE',
      isStatic: false,
      accepts: [
        {
          arg: 'roleName',
          type: 'string',
          required: true,
          description: 'Name of the role to add.',
          http: {
            source: 'path'
          }
        }
      ],
      http: {
        path: '/roles/:roleName',
        verb: 'put'
      }
    }
  );

  /**
   * Remove the user from the given role by name.
   *
   * @param {string} roleName
   * @param {Function} callback
   */
  Bl2User.prototype.removeFromRole = function (roleName, callback) {
    var Role = app.models.Bl2Role;
    var RoleMapping = app.models.Bl2RoleMapping;
    var error, userId = this.id;
    Role.findOne(
      {
        where: {name: roleName}
      },
      function (err, role) {
        if (err) {
          return callback(err);
        }

        if (!role) {
          error = new Error('Role ' + roleName + ' not found.');
          error.statusCode = 404;
          return callback(error);
        }

        RoleMapping.findOne(
          {
            where: {
              principalId: userId,
              roleId: role.id
            }
          },
          function (err, roleMapping) {
            if (err) {
              return callback(err);
            }

            if (!roleMapping) {
              return callback();
            }

            roleMapping.destroy(callback);
          }
        );
      }
    );
  };

  Bl2User.remoteMethod(
    'removeFromRole',
    {
      description: 'Remove User to the named role',
      accessType: 'WRITE',
      isStatic: false,
      accepts: [
        {
          arg: 'roleName',
          type: 'string',
          required: true,
          description: 'Name of the role to remove.',
          http: {
            source: 'path'
          }
        }
      ],
      http: {
        path: '/roles/:roleName',
        verb: 'delete'
      }
    }
  );

};
