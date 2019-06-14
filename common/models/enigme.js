'use strict';

module.exports = function(Enigme) {
  // Friends.disableRemoteMethodByName('upsert');

  Enigme.prototype.AnswerEnigme = function(id, answer, options ,callback) {
    // TODO
    var app = Enigme.app
    var UserEnigmator = app.models.UserEnigmator;
    var History = app.models.History;
    const token = options && options.accessToken;
    const userId = token && token.userId;
    const user = userId ? 'user#' + userId : '<anonymous>';
    var result ;
    Enigme.findById(id,{},function(err,enigme){
      console.log(enigme);
      console.log(answer);
      //TODO CHANGE TYPE ANWSER
      if(answer === enigme['anwser'] ){
         result = {
          message : 'bonne réponse ! ',
        };
         var userHistory = {
            userEnigmatorId : user,
            enigmeId : id ,
            type : 'success',
           //date :
         };
         History.create(userHistory);
        callback(null,result);
      }else{
        result = {
          message : 'mauvaise réponse ! ',
        };
        callback(null,result);
      }

    });

  };

};
