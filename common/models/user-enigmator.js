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
    Userenigmator.findById(id, function(err, friend) {
      var result = {};
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
                message: "La requete d'ami a été acceptée",
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
        console.log(research);
        console.log(userArray)
        Userenigmator.find(research, function(err, resultReq) {
          console.log(err);
          console.log(resultReq);
          if (resultReq.length === 0) {
            result = undefined;
          } else {
          }
          callback(null, resultReq);
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
  Userenigmator.prototype.SendAMessage = function(id, content, options, callback) {
    var app = Userenigmator.app;
    var PrivateMessage = app.models.PrivateMessage;
    const token = options && options.accessToken;
    const userId = token && token.userId;
    const user = userId ? 'user#' + userId : '<anonymous>';
    var result = {};
    Userenigmator.prototype.IsFriend(id, options, function(err, data) {
      console.log(data);
      if (data.isFriend === true) {
        var privateMessage = {
          userFromId: userId,
          userToId: id,
          content: content,
        };
        PrivateMessage.create(privateMessage);

        result = {
          message: 'message envoyé',
        };

        callback(null, result);
      } else {
        result = {
          message: "erreur le message n'a pas été envoyé",
        };
        callback(null, result);
      }
    });
  };
  Userenigmator.prototype.GetConversationMessage = function(id, options, callback) {
    var app = Userenigmator.app;
    var PrivateMessage = app.models.PrivateMessage;
    const token = options && options.accessToken;
    const userId = token && token.userId;
    const user = userId ? 'user#' + userId : '<anonymous>';
    var result = {};
    var privateMessageFrom = {
      userFromId: userId,
      userToId: id,
    };
    var privateMessageTo = {
      userFromId: id,
      userToId: userId,
    };
    var array = [];
    PrivateMessage.find({where: privateMessageFrom}, function(err, data1) {
      console.log(data1);
      PrivateMessage.find({where: privateMessageTo}, function(err, data) {
        console.log(data);
        array.push([data, data1]);
        array.sort(function(a, b) {
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          return new Date(b.date) - new Date(a.date);
        });
        callback(null, array);
      });
    });
  };

  Userenigmator.prototype.GetEnigmeNotDone = function(id, options, callback) {
    var app = Userenigmator.app;
    var History = app.models.History;
    var Enigme = app.models.Enigme;
    const token = options && options.accessToken;
    const userId = token && token.userId;
    const user = userId ? 'user#' + userId : '<anonymous>';
    var result = {};
    var validateEnigme = {
      status: true,
    };

    Enigme.find({include: 'Enigme_User', where: validateEnigme}, function(err, enigmeList) {
      var enigmeDone = {
        userEnigmatorId: id,
        type: 'success',
      };
      console.log(enigmeDone);
      // TODO C PEUTETRRE BUGER
      History.find({where: enigmeDone}, function(err, data) {
        console.log(data);
        data.forEach(function(value) {
          enigmeList.forEach(function(enigmeData, index, object) {
            if (enigmeData.id === value.enigmeId) {
              object.splice(index, 1);
            }
          });
        });
        callback(null, enigmeList);
      });
    });
  };
  Userenigmator.prototype.GetEnigmeDone = function(id, options, callback) {
    var app = Userenigmator.app;
    var History = app.models.History;
    var Enigme = app.models.Enigme;
    const token = options && options.accessToken;
    const userId = token && token.userId;
    const user = userId ? 'user#' + userId : '<anonymous>';
    var result = [];
    var validateEnigme = {
      status: true,
    };

    Enigme.find({include: 'Enigme_User', where: validateEnigme}, function(err, enigmeList) {
      var enigmeDone = {
        userEnigmatorId: id,
        type: 'success',
      };
      console.log(enigmeDone);
      // TODO C PEUTETRRE BUGER
      History.find({where: enigmeDone}, function(err, data) {
        console.log(data);
        data.forEach(function(value) {
          enigmeList.forEach(function(enigmeData, index, object) {
            if (enigmeData.id === value.enigmeId) {
              result.push(enigmeData);
            }
          });
        });
        callback(null, result);
      });
    });
  };
  Userenigmator.prototype.GetStats = function (id,callback) {
    var result = {}
    Userenigmator.findById(id, function (err, user) {
      var rankByCountry = {
        where: {
          country: user.country
        },
        order: 'score desc'
      };
      result['id'] = id;
      result['country'] = user.country;
      result['score'] = user.score;
        Userenigmator.find(rankByCountry, function (err, rankList) {
          rankList.forEach(function (one_user, index) {
            if (one_user['id'] === id) {
              result.localRank = index+1
            }
          });
        Userenigmator.find({order: 'score desc'}, function (err, rankList) {
          console.log(err);
          console.log(rankList);
          rankList.forEach(function (one_user, index) {
            if (one_user['id'] === id) {
              result.globalRank = index+1
            }
          });
          callback(null, result)
        });
      });
    });
  }
};

