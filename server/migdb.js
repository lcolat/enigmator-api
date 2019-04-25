var server = require('./server');
var ds = server.dataSources.mysql;
var lbTables = ["Enigme"];
ds.automigrate( function(er) {
  if (er) throw er;
  console.log('Loopback tables [' - lbTables - '] created in ', ds.adapter.name);
  ds.disconnect();
});

