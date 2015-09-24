require('newrelic')
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Twit = require('twit');
GLOBAL.Parse = require('parse').Parse;
Parse.initialize("vysdh19Gum7JGv4dv965WUKrrBCDicYrtGfb91dD", "2BHDnHGIdieNtYbcwFvpLJ2T7RpOUvxtpfNafUTa");

var routes = require('./routes/index');
var users = require('./routes/users');

var track = require('./routes/track');
var acceptsHTML = true;

//console.log("xmlparsertest initialize" + xmlParserTest);


var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);


var tw = new Twit({
  consumer_key: "xHN8QKKM1XiejeCqPm28BFzvL",
  consumer_secret: "wB3zC77VyVVgSTTJPn13RaL9kzwAiFAhrYUVQag2REFNLpBFz2",
  access_token:  "28385137-v4UDWsjBLzptX4RbiZUPpCKXVVBEipyGzzGrzYehM",
  access_token_secret:  "DDHlEAb3pJU3AfSGd6Kxvrh2g5VcByAfUcSf1DyHT5eRR"
});

//
//  search twitter for all tweets containing the word 'banana' since Nov. 11, 2011
//
//
//  filter the twitter public stream by the word 'mango'.
//
var stream = tw.stream('statuses/filter', { track: 'immigration' })

stream.on('tweet', function (tweet) {
  io.emit('tweet',tweet);
});



if (app.get("/ios")) {
  acceptsHTML = false

}

module.exports.acceptsHTML = acceptsHTML;
module.exports = app;

var xmlParserTest = require('./routes/xmlparsertest');

//xmlParserTest(io);
//Set the sockets.io configuration.
//THIS IS NECESSARY ONLY FOR HEROKU!
/*io.configure(function() {
  io.set('transports', ['xhr-polling']);
  io.set('polling duration', 10);
});*/


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(xmlParserTest);

app.use('/', routes);
app.use('/users', users);
app.use('/parse', xmlParserTest);
app.use('/ios', xmlParserTest);
app.use('/track', track);
app.use('/iostrack', track);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



server.listen(3000);
