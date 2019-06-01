'use strict';

module.exports = function(Userenigmator) {
  Userenigmator.disableRemoteMethodByName('upsert');
  Userenigmator.disableRemoteMethodByName('prototype.__destroyById__accessTokens'); // DELETE
  Userenigmator.disableRemoteMethodByName('prototype.__updateById__accessTokens'); // PUT

  Userenigmator.prototype.AddAFriend = function(id, options, callback) {
    // TODO
    var app = Userenigmator.app;
    var Friends = app.models.Friends;
    const token = options && options.accessToken;
    const userId = token && token.userId;
    const user = userId ? 'user#' + userId : '<anonymous>';
    var result = {};

    if (userId !== id) {
      var friendRequest = {
        state: 'request',
        ID_FROM: userId,
        ID_TO: id,
      };
      Friends.find({where: friendRequest}, function(err, models) {
        console.log(models);
        if (models.length === 0) {
          Friends.create(friendRequest);
          result = {
            statusCode: 200,
            message: "La requète d'amis à été créer",
          };
        } else {
          result = {
            statusCode: 422,
            message: "La requète d'amis a déja été envoyé",
          };
        }
        callback(result);
      });
    }
    if (userId === id) {
      result = {
        statusCode: 422,
        message: 'Vous ne pouvez pas vous ajouter vous même en amis',
      };
      callback(result);
    }
  };

  Userenigmator.prototype.AcceptAFriendRequest = function(id, options, callback) {
    var app = Userenigmator.app;
    var Friends = app.models.Friends;
    const token = options && options.accessToken;
    const userId = token && token.userId;
    const user = userId ? 'user#' + userId : '<anonymous>';
    var result = {};

    Userenigmator.findById(id, function(err, friend) {
      if (friend !== undefined && userId !== id) {
        var friendRequest = {
          state: 'request',
          ID_FROM: id,
          ID_TO: userId,
        };
        Friends.find({where: friendRequest}, function(err, models) {
          console.log(models);
          if (models.length === 0) {
            result = {
              statusCode: 404,
              message: "La requète n'existe pas",
            };
            callback(result);
          } else {
            var validateRequest = {
              state: 'accepted',
              ID_FROM: id,
              ID_TO: userId,
            };
            Friends.upsertWithWhere(friendRequest, validateRequest, function(err, models) {
              console.log(models);
              result = {
                statusCode: 200,
                message: "La requète d'amis a deja été accepté",
              };
            });
            callback(result);
          }
        });
      }
      if (userId === id) {
        result = {
          statusCode: 422,
          message: 'Vous ne pouvez pas vous ajouter vous même en amis',
        };
        callback(result);
      }
    });
  };
  Userenigmator.prototype.DenyAFriendRequest = function(id, options, callback) {
    var app = Userenigmator.app;
    var Friends = app.models.Friends;
    const token = options && options.accessToken;
    const userId = token && token.userId;
    const user = userId ? 'user#' + userId : '<anonymous>';
    var result = {};

    Userenigmator.findById(id, function(err, friend) {
      if (friend !== undefined && userId !== id) {
        var friendRequest = {
          state: 'request',
          ID_FROM: id,
          ID_TO: userId,
        };
        Friends.find({where: friendRequest}, function(err, models) {
          console.log(models);
          if (models.length === 0) {
            result = {
              statusCode: 404,
              message: "La requète n'existe pas",
            };
            callback(result);
          } else {
            var validateRequest = {
              state: 'denyed',
              ID_FROM: id,
              ID_TO: userId,
            };
            Friends.upsertWithWhere(friendRequest, validateRequest, function(err, models) {
              result = {
                statusCode: 200,
                message: "La requète d'amis a été refusée",
              };
              callback(result);
            });
          }
        });
      }
      if (userId === id) {
        result = {
          statusCode: 422,
          message: 'Vous ne pouvez pas vous ajouter vous même en amis',
        };
        callback(result);
      }
    });
  };

  Userenigmator.GetMyFriend = function(options, callback) {
    var app = Userenigmator.app;
    var Friends = app.models.Friends;
    const token = options && options.accessToken;
    const userId = token && token.userId;
    const user = userId ? 'user#' + userId : '<anonymous>';
    var result = {};
    var friendRequest = {
      state: 'accepted',
      ID_FROM: userId,
    };
    var MyfriendRequest = {
      state: 'accepted',
      ID_TO: userId,
    };

    Friends.find({where: friendRequest}, function(err, friendsPart1) {
      Friends.find({where: MyfriendRequest}, function(err, friendsPart2) {
        console.log(friendsPart1);
        console.log(friendsPart2);
        var userArray = [];
        friendsPart1.forEach(function(element) {
          userArray.push({id: element['id']});
        });
        friendsPart2.forEach(function(element) {
          userArray.push({id: element['id']});
        });
        var research = {
          where: {
            or: userArray,
          },
        };
        Userenigmator.find(research, function(err, resultReq) {
          result = {
            result: resultReq,
            statusCode: '200',
          };
          callback(result);
        });
      });
    });
  };
};

