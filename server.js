var express = require('express');
var app = express();
var path = require('path');
var passport = require('passport');
var flash = require('connect-flash');
var morgan       = require('morgan');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var appConfig = require('./config/appconfig');
var useroAuth = require('./routes/frontend/oAuth')(passport);
var backend =  require('./routes/backend/backend');
var frontend =  require('./routes/frontend/frontend')(passport);
var preRendered = require('prerender-node');
var cloudinary = require('cloudinary');




process.env.NODE_ENV = 'production';
process.env.NODE_PATH =  path.join( __dirname + "/") ;
process.env.UPLOAD_PATH =  path.join( __dirname + "/uploads/") ;
process.env.CLOUDINARY_URL= "cloudinary://131957787152229:sBObmg6MjtjkcMy3tzEU1ZJOd0g@drieypcyz";
//process.env.PRERENDER_SERVICE_URL = "http://service.prerender.io";

//app.use(preRendered.set('prerenderServiceUrl', 'http://service.prerender.io'));//.set('prerenderToken', 'fnu9gwOPhdT0b30IXLI8'));
//app.use(preRendered.set('prerenderServiceUrl', 'http://localhost:3000'));
app.use(preRendered.set('prerenderServiceUrl', 'https://prerender-test402.herokuapp.com'));
//app.use(require('prerender-node').set('crawlerUserAgents',arr));
cloudinary.config( appConfig.cloudinary );

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()) // parse application/json
app.use(bodyParser.urlencoded({ extended: true })) // parse application/x-www-form-urlencoded

app.use(session({ secret: 'meanstack402', saveUninitialized: true, resave: true})); // session secret
app.use(express.static( path.join(__dirname + '/app')));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use('/bower_components',  express.static(path.join(__dirname + '/bower_components')));
app.use("/uploads", express.static(__dirname + '/uploads'));


app.use('/admin', express.static(__dirname + '/app/backend') ); //go to static directoy backend while accessing /admin from url
app.use('/admin', backend);  //accessing /admin will get you to route backend


app.use('/', express.static(__dirname + '/app/frontend') ); //go to static directoy fronend while accessing / from url


app.use('/', frontend); //accessing / will get you to frontend route

/*app.all('/*', function(req, res, next) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile('index.html', { root: './app/frontend/' });
});*/


//app.use(preRendered.set('prerenderServiceUrl', 'https://prerender-test402.herokuapp.com/').set('prerenderToken', 'fnu9gwOPhdT0b30IXLI8'));



app.set('views', __dirname + '/views');
app.set('view engine','ejs');
app.set('view cache', false);



app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
var port = process.env.PORT || 8010;

app.listen(port, function(){
	console.log('listening @ port : ' + port);
});

module.exports = app;