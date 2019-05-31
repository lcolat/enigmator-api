'use strict';

module.exports = function(Friends)  {
  Friends.disableRemoteMethodByName('create');
  Friends.prototype.SendFriendRequest = function(id, options, callback) {
    var app = Friends.app;
    var Userenigmator = app.models.UserEnigmator;
    const token = options && options.accessToken;
    const userId = token && token.userId;
    const user = userId ? 'user#' + userId : '<anonymous>';
    var result = {};

    Userenigmator.findById(id, function(err, friend) {
      console.log(friend);
      if (friend !== undefined) {
        var friendRequest = {
          state: 'request',
          ID_FROM: userId,
          ID_TO: id,
        };
        Friends.find({where: friendRequest}, function(err, models) {
          console.log(models);
          if (models.length === 0) {
            Friends.create(friendRequest);
            result['message'] = "Requete d'amis créer";
          } else {
            console.log('alreadyhere');
            result = {
              statusCode: 422,
              message: "La requète d'amis a deja été envoyé",
            };
          }
          callback(result);
        });
      }
      // callback(result);
    });
  };
};
