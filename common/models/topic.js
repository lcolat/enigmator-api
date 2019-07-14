'use strict';

module.exports = function(Topic) {

  Topic.prototype.PostAMessage = function(id,content, options, callback) {
    // TODO
    var now = new Date();
    var app = Topic.app;
    var Message = app.models.Message;
    const token = options && options.accessToken;
    const userId = token && token.userId;
    const user = userId ? 'user#' + userId : '<anonymous>';
    var result = {};
    var err = {};
    var message = {
      content: content,
      creationDate: now.toJSON(),
      userId: userId,
      topicId: id,
    };
    Message.create(message);
    Topic.findById(id, {}, function(err, topic) {
      var topicBuffer = JSON.parse(JSON.stringify(topic));
      topicBuffer.lastEditDate = now.toJSON();
      topicBuffer.messagesCount = topicBuffer.messagesCount+=1;

      delete topicBuffer.id;
      Topic.replaceById(id,
        topicBuffer);
    });
    result = {
      statusCode: 200,
      status: "Le message est posté",
    };
    callback(null, result);
  };

  Topic.prototype.GetMessages = function(id, callback) {
    var app = Topic.app;
    var Message = app.models.Message;
    Message.find({where :{topicId : id}},function(err,data){
      if(data.length !== 0){
        callback(null,data);
      }else{
        callback(err);
      }
    });
  };

  Topic.prototype.LikeTopic = function(id, options, callback) {
    // TODO
    var now = new Date();
    var app = Topic.app;
    var UserEnigmator = app.models.UserEnigmator;
    var History = app.models.History;
    const token = options && options.accessToken;
    const userId = token && token.userId;
    const user = userId ? 'user#' + userId : '<anonymous>';
    var result;
    var addRank = false;
    var topicLiked = {
      userEnigmatorId: userId,
      topicId: id,
      type: 'like',
    };
    History.find({where: topicLiked}, function(err, data) {
      if (data.length === 0) {
        Topic.findById(id, {}, function(err, topic) {
          var topicBuffer = JSON.parse(JSON.stringify(topic));
          topicBuffer.likes = topicBuffer.likes + 1;
          delete topicBuffer.id;
          console.log(topicBuffer);
          Topic.replaceById(id,
            topicBuffer,
            function(err, data) {
              if (err)
                callback(err);
              else {
                console.log(data);
                var result = {
                  message: 'topic liked ',
                };
                topicLiked.date = now.toJSON();
                History.create(topicLiked);
                callback(null, result);
              }
            });
        });
      } else {
        console.log(data);
        var result = {
          message: 'topic already liked ',
        };
        callback(null, result);
      }
    });
  };
};
