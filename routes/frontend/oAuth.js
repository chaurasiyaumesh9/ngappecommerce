var appconfig = require('../../config/appconfig');
var UserSchema            = require('../../models/user');
var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var TwitterStrategy  = require('passport-twitter').Strategy;

console.log('UserSchema : ',UserSchema);
var User = appconfig.db.conn.model('User', UserSchema);
//var User = new u;
//console.log('User : ',User);

module.exports = function( passport ){
	
	passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form
		var message = {};
        User.findOne({ 'local.email' :  email }, function(err, user) {
            if (err){
				return done(err);
			}
            if (!user){
                return done(null, false, req.flash('loginMessage', 'No user found.')); 
			}
		    if (!user.validPassword(password)){
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); 
			}
            return done(null, user, req.flash('loginMessage', 'Login Successful!'));
        });

    }));

	passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
        process.nextTick(function() {
        User.findOne({ 'local.email' :  email }, function(err, user) {
			console.log('signup server - err :', err );
			console.log('signup server - user :', user );
            if (err){
                return done(err);
			}
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {
                var newUser = new User();
                newUser.local.email    = email;
				newUser.local.displayName    = req.body.displayName;
                newUser.local.password = newUser.generateHash(password);
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }
        });    
     });

    }));

	passport.use(new FacebookStrategy({
		clientID        : process.env.NODE_ENV=="production"? appconfig.social.prod.facebook.appID : appconfig.social.dev.facebook.appID,
		clientSecret    : process.env.NODE_ENV=="production"? appconfig.social.prod.facebook.appSecret : appconfig.social.dev.facebook.appSecret,
		//passReqToCallback : true,
		profileFields: ['id', 'displayName', 'name', 'gender', 'picture.type(large)','email'],
		callbackURL     : process.env.NODE_ENV=="production"? appconfig.social.prod.facebook.callbackURL: appconfig.social.dev.facebook.callbackURL
	}, function(accessToken, refreshToken, profile, done) {
		process.nextTick(function() {
			//console.log('profile :',profile);
			User.findOne({ 'facebook.email' : profile.emails[0].value }, function(err, user) {
				if (err){
					//console.log("err :",err);
					return done(err);
				}
				if (user) {
					//console.log("user alredy exist! :",user);
					return done(null, user); // user found, return that user
				} else {
					
					// if there is no user found with that facebook id, create them
					var newUser  = new User();

					// set all of the facebook information in our user model
					newUser.facebook.id    = profile.id; // set the users facebook id  
					newUser.facebook.name = profile.displayName;
					newUser.facebook.gender = profile.gender;
					newUser.facebook.profilePic = profile.photos ? profile.photos[0].value : '../assets/images/unknown-user-pic.jpg';
					newUser.facebook.token = accessToken; // we will save the token that facebook provides to the user                    
					newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
					newUser.save(function(err) {
						if (err){
							console.log("Error in saving :",err);
							throw err;
						}
						return done(null, newUser);
					});
				}

			}); 
		});
	 }));

	 passport.use(new GoogleStrategy({
		profileFields: ['id', 'displayName', 'name', 'gender', 'picture.type(large)','email'],
        clientID        : process.env.NODE_ENV=="production"? appconfig.social.prod.google.clientID : appconfig.social.dev.google.clientID,
        clientSecret    : process.env.NODE_ENV=="production"? appconfig.social.prod.google.clientSecret : appconfig.social.dev.google.clientSecret,
        callbackURL     : process.env.NODE_ENV=="production"? appconfig.social.prod.google.callbackURL : appconfig.social.dev.google.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {

        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {
			//console.log('profile :',profile);
            // try to find the user based on their google id
            User.findOne({ 'google.email' : profile.emails[0].value }, function(err, user) {
                if (err)
                    return done(err);

                if (user) {

                    // if a user is found, log them in
                    return done(null, user);
                } else {
                    // if the user isnt in our database, create a new user
                    var newUser          = new User();

                    // set all of the relevant information
					newUser.google.id    = profile.id; // set the users google id  
					newUser.google.name = profile.displayName;
					newUser.google.gender = profile.gender;
					newUser.google.profilePic = profile.photos ? profile.photos[0].value : '../assets/images/unknown-user-pic.jpg';
					newUser.google.token = accessToken; // we will save the token that facebook provides to the user                    
					newUser.google.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

					//return done(null, newUser);
                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });
    }));


	passport.use(new TwitterStrategy({
		profileFields: ['id', 'displayName', 'name', 'gender', 'picture.type(large)'],
        consumerKey     : process.env.NODE_ENV=="production"? appconfig.social.prod.twitter.consumerKey : appconfig.social.dev.twitter.consumerKey,
        consumerSecret  : process.env.NODE_ENV=="production"? appconfig.social.prod.twitter.consumerSecret : appconfig.social.dev.twitter.consumerSecret,
        callbackURL     : process.env.NODE_ENV=="production"? appconfig.social.prod.twitter.callbackURL : appconfig.social.dev.twitter.callbackURL
    },
    function(accessToken, tokenSecret, profile, done) {
        process.nextTick(function() {
			//console.log('twitter profile :',profile);
            User.findOne({ 'twitter.username' : profile.username }, function(err, user) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user, create them
                    var newUser                 = new User();

                    // set all of the user data that we need
                   /* newUser.twitter.id          = profile.id;
                    newUser.twitter.token       = token;
                    newUser.twitter.username    = profile.username;
                    newUser.twitter.name = profile.displayName; */

					newUser.twitter.id    = profile.id; // set the users google id  
					newUser.twitter.name = profile.displayName;
					newUser.twitter.gender = profile.gender;
					newUser.twitter.username    = profile.username;
					newUser.twitter.profilePic = profile.photos ? profile.photos[0].value : '../assets/images/unknown-user-pic.jpg';
					newUser.twitter.token = accessToken; 
					//newUser.twitter.email = profile.emails[0].value; 
					
					//return done(null, newUser);
                    // save our user into the database
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
		});
    }));

	passport.serializeUser( function( user, done ){
		done(null, user);	
	});

	passport.deserializeUser( function( user, done ){
		done(null, user);	
	});
}

