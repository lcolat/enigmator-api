'use strict';

module.exports = function(Userenigmator) {
  Userenigmator.disableRemoteMethodByName('upsert');
  Userenigmator.disableRemoteMethodByName('prototype.__destroyById__accessTokens'); // DELETE
  Userenigmator.disableRemoteMethodByName('prototype.__updateById__accessTokens'); // PUT
};

