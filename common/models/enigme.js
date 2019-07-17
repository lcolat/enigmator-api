'use strict';

module.exports = function(Enigme) {
  // Friends.disableRemoteMethodByName('upsert');

  Enigme.prototype.AnswerEnigme = function(id, answer, options, callback) {
    // TODO
    var now = new Date();
    var app = Enigme.app;
    var UserEnigmator = app.models.UserEnigmator;
    var History = app.models.History;
    const token = options && options.accessToken;
    const userId = token && token.userId;
    const user = userId ? 'user#' + userId : '<anonymous>';
    var result;
    var addRank = false;
    Enigme.findById(id, {}, function(err, enigme) {
      console.log(enigme);
      if (enigme.status === false) {
        result = {
          message: 'vous ne pouvez pas repondre a cette enigme',
        };
        callback(null, result);
        return;
      }
      if (answer.toLowerCase() === enigme['answer'].toLowerCase()) {
        result = {
          message: 'bonne réponse ! ',
        };
        console.log(user);
        var enigmeDone = {
          userEnigmatorId: userId,
          enigmeId: id,
          type: 'success',
        };
        History.find({where: enigmeDone}, function(err, data) {
          console.log(data);
          if (data.length === 0) {
            addRank = true;
          }
          UserEnigmator.findById(userId, {}, function(err, userData) {
            if (addRank === true) {
              console.log("addScore")
              userData['score'] += enigme['scoreReward'];
            }
            var userHistory = {
              userEnigmatorId: userId,
              enigmeId: id,
              type: 'success',
              date: now.toJSON(),
            };

            console.log(userData);
            UserEnigmator.upsert(userData, function(err, obj) {
            });
            History.create(userHistory);
            callback(null, result);
          });
        });

      } else {
        result = {
          message: 'mauvaise réponse ! ',
        };
        callback(null, result);
      }
    });
  };

  Enigme.CreateEnigme = function(question, answer,scoreReward, name, options, callback) {
    const token = options && options.accessToken;
    const userId = token && token.userId;
    const user = userId ? 'user#' + userId : '<anonymous>';
    var now = new Date();
    var app = Enigme.app;
    var Container = app.models.Container;
    var Topic = app.models.Topic;

    var topicName = 'Topic sur ' + name;
    var topic = {
      creationDate: now.toJSON(),
      title: topicName,
      userEnigmatorsId: userId,
      isAutomatic:true,
      description: question
    };
    Topic.create(topic, function(err, dataTopic) {
      var enigmeToCreate = {
        question: question,
        answer: answer,
        status: false,
        UserID: userId,
        scoreReward: scoreReward,
        topicId: dataTopic.id,
        name: name,
      };
      enigmeToCreate.topicId = dataTopic.id;
      Enigme.create(enigmeToCreate, function(err, data) {
        if (err) {
          Topic.destroyById(dataTopic.id);
          callback(err);
        } else {
          var result = {
            message: 'enigme created ! ',
            id: data.id,
          };
          callback(null, result);
        }
      });
    });
  };
  Enigme.prototype.AddMediaToEnigme = function(id, req, res, callback) {
    var app = Enigme.app;
    var Container = app.models.Container;
    var Media = app.models.Media;
    var result = {};
    Container.upload(req, res, {container: 'enigme'}, function(err, data) {
      console.log(data);
      if (err) {
      } else {
        var namefile = data.files.file[0].name;
        if (namefile !== undefined && data.fields.mediaType !== undefined) {
          var media = {
            type: data.fields.mediaType,
            filename: namefile,
            enigmeID: id,
          };
          result = {
            message: 'Media added',
          };
          Media.create(media);
          callback(null, result);
        } else {
          var message = '';
          if (namefile === undefined) message += 'missing file check the name of the field |';
          if (data.fields.mediaType === undefined) message += 'missing mediaType check the name of the field';
          result = {
            message: message,
          };
          callback(result);
        }
      }
    });
  };
  Enigme.prototype.ValidateEnigme = function(id, options, callback) {
    var now = new Date();
    var app = Enigme.app;
    var UserEnigmator = app.models.UserEnigmator;
    const token = options && options.accessToken;
    const userId = token && token.userId;
    const user = userId ? 'user#' + userId : '<anonymous>';
    UserEnigmator.findById(userId, {}, function(err, user) {
      // TODO RESTRICT USER
      /* if(user.role==='ADMIN'){

      } */
      Enigme.findById(id, {}, function(err, enigme) {
        var enigmeBuffer = JSON.parse(JSON.stringify(enigme));
        enigmeBuffer.status = true;
        delete enigmeBuffer.id;
        console.log(enigmeBuffer);
        Enigme.replaceById(id,
          enigmeBuffer,
          function(err, data) {
            if (err)
              callback(err);
            else {
              console.log(data);
              var result = {
                message: 'enigme validated ! ',
              };
              callback(null, result);
            }
          });
      });
    });
  };
  Enigme.prototype.RefuseEnigme = function(id, options, callback) {
    var now = new Date();
    var app = Enigme.app;
    var UserEnigmator = app.models.UserEnigmator;
    const token = options && options.accessToken;
    const userId = token && token.userId;
    const user = userId ? 'user#' + userId : '<anonymous>';
    UserEnigmator.findById(userId, {}, function(err, user) {
      // TODO RESTRICT USER
      /* if(user.role==='ADMIN'){

      } */
      Enigme.findById(id, {}, function(err, enigme) {
        var enigmeBuffer = JSON.parse(JSON.stringify(enigme));
        enigmeBuffer.status = false;
        delete enigmeBuffer.id;
        console.log(enigmeBuffer);
        Enigme.replaceById(id,
          enigmeBuffer,
          function(err, data) {
            if (err)
              callback(err);
            else {
              console.log(data);
              var result = {
                message: 'enigme refused ! ',
              };
              callback(null, result);
            }
          });
      });
    });
  };

  Enigme.prototype.LikeEnigme = function(id, options, callback) {
    // TODO
    var now = new Date();
    var app = Enigme.app;
    var UserEnigmator = app.models.UserEnigmator;
    var History = app.models.History;
    const token = options && options.accessToken;
    const userId = token && token.userId;
    const user = userId ? 'user#' + userId : '<anonymous>';
    var result;
    var addRank = false;
    var enigmeLiked = {
      userEnigmatorId: userId,
      enigmeId: id,
      type: 'like',
    };
    History.find({where: enigmeLiked}, function(err, data) {
      if (data.length === 0) {
        Enigme.findById(id, {}, function(err, enigme) {
          var enigmeBuffer = JSON.parse(JSON.stringify(enigme));
          enigmeBuffer.likes = enigmeBuffer.likes + 1;
          delete enigmeBuffer.id;
          console.log(enigmeBuffer);
          Enigme.replaceById(id,
            enigmeBuffer,
            function(err, data) {
              if (err)
                callback(err);
              else {
                console.log(data);
                var result = {
                  message: 'enigme liked ',
                };
                enigmeLiked.date = now.toJSON();
                History.create(enigmeLiked);
                callback(null, result);
              }
            });
        });
      } else {
        console.log(data);
        var result = {
          message: 'enigme already liked ',
        };
        callback(null, result);
      }
    });
  };
};
