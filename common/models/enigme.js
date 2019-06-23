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
      console.log(enigme);
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

  Enigme.CreateEnigme = function(question, answer, name, options, callback) {
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
    };
    Topic.create(topic, function(err, dataTopic) {
      var enigmeToCreate = {
        question: question,
        answer: answer,
        status: false,
        UserID: userId,
        scoreReward: 0,
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
      if  (err) {
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
};
