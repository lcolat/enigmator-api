
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
    var err = {};
    if (userId !== id) {
      var friendRequest = {
        state: 'request',
        ID_FROM: userId,
        ID_TO: id,
      };
      Friends.find({where: friendRequest}, function(err, models) {
        if (models.length === 0) {
          Friends.create(friendRequest);
          result = {
            statusCode: 200,
            status: "La requète d'amis à été créer",
          };
          callback(null, result);
        } else {
          err = {
            statusCode: 422,
            message: "La requète d'amis a déja été envoyé",
          };
          callback(err);
        }
      });
    }
    if (userId === id) {
      err = {
        statusCode: 422,
        message: 'Vous ne pouvez pas vous ajouter vous même en amis',
      };
      callback(err);
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
              statusCode: '404',
              message: "Cette requète n'existe pas",
            };
            callback(null, result);
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
            callback(null, result);
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
            callback(null, result);
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
              callback(null, result);
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
          if (resultReq.length === 0) {
            result = {
              statusCode: '204',
            };
          } else {
            result = {
              result: resultReq,
              statusCode: '200',
            };
          }
          callback(null, result);
        });
      });
    });
  };

  Userenigmator.prototype.IsFriend = function(id, options, callback) {
    var app = Userenigmator.app;
    var Friends = app.models.Friends;
    const token = options && options.accessToken;
    const userId = token && token.userId;
    const user = userId ? 'user#' + userId : '<anonymous>';
    var result = {};
    var friendRequest = {
      state: 'accepted',
      ID_FROM: userId,
      ID_TO: id,
    };
    var MyfriendRequest = {
      state: 'accepted',
      ID_TO: userId,
      ID_FROM: id,
    };

    Friends.find({where: friendRequest}, function(err, friendsPart1) {
      Friends.find({where: MyfriendRequest}, function(err, friendsPart2) {
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
        var result;
        if (userArray.length === 0) {
          result = {
            message: "Cet user n'est pas votre amis",
            isFriend: false,
          };
        } else {
          result = {
            message: 'Cet utilisateur est votre amis',
            isFriend: true,
          };
        }
        callback(null, result);
      });
    });
  };
};

