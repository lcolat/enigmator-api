'use strict';

module.exports = function(Friends)  {
  Friends.disableRemoteMethodByName('insert');
  Friends.prototype.SendFriendRequest = function(id, options, callback) {
    // TODO
    const token = options && options.accessToken;
    const userId = token && token.userId;
    const user = userId ? 'user#' + userId : '<anonymous>';
    console.log(user);
    var app = Friends.app;
    var Userenigmator = app.models.UserEnigmator;
    var friend = Userenigmator.findById(id, function(err, friend) {
      console.log(friend);
      if (friend !== undefined) {
        var friendRequest = {
          state: 'request',
          ID_FROM: userId,
          ID_TO: id
        };
        Friends.create(friendRequest);
      }
      callback(err);
    });
    console.log(friend);
  };
};
