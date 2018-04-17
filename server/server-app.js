var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var dotenv = require('dotenv').config();
var mongoose = require('mongoose');
var cors = require('cors');
var index = require('./routes/index');
var users = require('./routes/users');
var contentPackagesRoute = require('./routes/api/content-packages');

var setupRoutes = require('./setup-routes');

var app = express();

// enable CORS so react client can request from different port or domain
app.use(cors())

/**
 * Get db uri from environment
 */

var dbUri;

if(process.env.NODE_ENV === "test"){
  dbUri = process.env.TEST_DB_URI;
}else{
	dbUri = process.env.DB_URI;
}
if(!dbUri){
  console.log('=====>   Hey chump!  I epected you to provide DB_URI either as an environment variable in the host process or in a .env file.  See DotEnv npm package for configuration details');
}

/**
 * Open database connection
 */

var db = mongoose
  .connect(dbUri)
  .catch(function (reason) {
    console.log('Unable to connect to the mongodb instance. Error: ', reason)
  });

mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open to ' + dbUri);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(${__dirname}/../client/build)); // serve client (react) build files from server app
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap

// Dynamically load all routes
setupRoutes(path.join(__dirname, './routes'), app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});





module.exports = app;
