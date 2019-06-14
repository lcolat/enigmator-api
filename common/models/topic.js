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
      content: '',
      creationDate: now.toJSON(),
      userId: userId,
      topicId: id,
    };
    Message.create(message);
    result = {
      statusCode: 200,
      status: "Le message est posté",
    };
    callback(null, result);
  };

  Topic.prototype.GetMessages = function(id, callback) {
    var app = Topic.app;
    var Message = app.models.Message;
    var filter = { where : {topicId : id}};
    Message.find(filter,callback ,function(data){
      if(data.length !== 0){
        callback(null,data);
      }else{
        callback(null);
      }
    });

  };



};
