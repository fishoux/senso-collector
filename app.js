'use strict';

var SwaggerExpress = require('swagger-express-mw');

var app = require('express')();
module.exports = app; // for testing

global.config = {
  appRoot: __dirname, // required config
  dbHost : '',
  dbHostweb : '',
  dbUser: '',
  dbPassword: '',
  dbDatabase: ''
};

const DBConnect = require('./api/js/db_connect');
  global.DBConnect =  new DBConnect();

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  app.listen(port);

  if (swaggerExpress.runner.swagger.paths['/save']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/save?mac=test&sensorid=test&sensorvalue=1');
  }
});
