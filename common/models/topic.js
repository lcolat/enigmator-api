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
        callback(null,{data: data});
      }else{
        callback(err);
      }
    });
  };

};
