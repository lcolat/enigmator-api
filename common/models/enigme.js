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
    Enigme.findById(id, {}, function(err, enigme) {
      console.log(enigme)
      if (enigme.status === false) {
        result = {
          message: 'vous ne pouvez pas repondre a cette enigme',
        };
        callback(null, result);
        return;
      }
      if (answer === enigme['answer']) {
        result = {
          message: 'bonne réponse ! ',
        };
        var userHistory = {
          userEnigmatorId: user,
          enigmeId: id,
          type: 'success',
          date: now.toJSON(),
        };
        History.create(userHistory);
         // TODO ADD THE SCORE TO USER RANK
        UserEnigmator.findById(userId, {}, function(err, userData) {
          userData['rank'] += enigme['scoreReward'];
          UserEnigmator.upsert(userData, function(err, obj) {
            callback(null, result);
          });
        });
        UserEnigmator.upsert();
        callback(null, result);
      } else {
        result = {
          message: 'mauvaise réponse ! ',
        };
        callback(null, result);
      }
    });
  };

  Enigme.CreateEnigme = function(req, res, question, answer, mediaType, options, callback) {
    const token = options && options.accessToken;
    const userId = token && token.userId;
    const user = userId ? 'user#' + userId : '<anonymous>';

    var app = Enigme.app;
    var Container = app.models.Container;
    var Media = app.models.Media;
    var enigmeToCreate = {
      question: question,
      answer: answer,
      status: false,
      UserId: userId,
      scoreReward: 0,
      topicId: 0,
    };
    //TODO CREER UN TOPIC
    Enigme.create(enigmeToCreate, function(err, data) {
      console.log(data);
      Container.upload(req, res, {container: 'enigme'}, function(err, data) {
        if  (err) {
        } else {
          console.log(data.files.file.name);
          var media = {
            type: mediaType,
            filename: data.files.file.name,
            enigmeId: data.id,
          };
          Media.create(media);
        }
      });
      var result = {
        message: 'enigme created ! ',
      };
      callback(null, result);
    });
  };
};
