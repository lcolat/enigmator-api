'use strict';

module.exports = function(Friends)  {
  Friends.disableRemoteMethodByName('create');
};
