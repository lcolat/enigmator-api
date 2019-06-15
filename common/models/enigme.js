'use strict';

module.exports = function(Enigme) {
  // Friends.disableRemoteMethodByName('upsert');

  Enigme.prototype.AnswerEnigme = function(id, answer, options, callback) {
    // TODO
    var now = new Date() ;
    var app = Enigme.app;
    var UserEnigmator = app.models.UserEnigmator;
    var History = app.models.History;
    const token = options && options.accessToken;
    const userId = token && token.userId;
    const user = userId ? 'user#' + userId : '<anonymous>';
    var result ;
    Enigme.findById(id,{},function(err,enigme){
      if(answer === enigme['answer'] ){
         result = {
          message : 'bonne réponse ! ',
        };
         var userHistory = {
            userEnigmatorId : user,
            enigmeId : id ,
            type : 'success',
            date : now.toJSON()
         };
         History.create(userHistory);
         //TODO ADD THE SCORE TO USER RANK
        UserEnigmator.findById(userId,{},function(err,userData){
          userData['rank'] += enigme['scoreReward'];
          UserEnigmator.upsert(userData,function(err,obj){

            callback(null,result);
          });
        });
        UserEnigmator.upsert()
         callback(null,result);
      }else{
        result = {
          message : 'mauvaise réponse ! ',
        };
        callback(null,result);
      }

    });

  };

  Enigme.CreateEnigme = function(data, file, callback) {
    // TODO
    callback(null);
  };
};
