'use strict';

module.exports = function(Message) {
  // Friends.disableRemoteMethodByName('upsert');
  Message.prototype.LikeMessage = function(id, options, callback) {
    // TODO
    var now = new Date();
    var app = Message.app;
    var UserEnigmator = app.models.UserEnigmator;
    var History = app.models.History;
    const token = options && options.accessToken;
    const userId = token && token.userId;
    const user = userId ? 'user#' + userId : '<anonymous>';
    var result;
    var addRank = false;
    var messageLiked = {
      userEnigmatorId: userId,
      messageId: id,
      type: 'like',
    };
    History.find({where: messageLiked}, function(err, data) {
      if (data.length === 0) {
        Message.findById(id, {}, function(err, message) {
          var messageBuffer = JSON.parse(JSON.stringify(message));
          messageBuffer.likes = messageBuffer.likes + 1;
          delete messageBuffer.id;
          console.log(messageBuffer);
          Message.replaceById(id,
            messageBuffer,
            function(err, data) {
              if (err)
                callback(err);
              else {
                console.log(data);
                var result = {
                  message: 'message liked ',
                };
                messageLiked.date = now.toJSON();
                History.create(messageLiked);
                callback(null, result);
              }
            });
        });
      } else {
        console.log(data);
        var result = {
          message: 'message already liked ',
        };
        callback(null, result);
      }
    });
  };
};
