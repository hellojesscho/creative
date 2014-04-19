//dependencies for each module used
var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars');
var app = express();

var twitterproject = require('./routes/twitterproject');

//route files to load
var index = require('./routes/index');

//database setup - uncomment to set up your database
//var mongoose = require('mongoose');
//mongoose.connect(process.env.MONGOHQ_URL || 'mongodb://localhost/DATABASE1);

var graph = require('fbgraph');

var conf = {
	client_id: '535404896572009'
   ,client_secret: '074f8e552c3b1305a1dd2907fa883d79'
   ,scope: 'email, user_about_me, user_birthday, user_location, publish_stream' //permission to access e-mail 
   ,redirect_uri: 'http://localhost:3000/auth/facebook'
}

//authentication 
app.get('/auth/facebook', function(req, res){
	if (!req.query.code) {
		var authUrl = graph.getOauthUrl({
			"client_id": conf.client_id, 
			"client_secret": conf.client_secret,
			"redirect_uri": conf.redirect_uri
		});

	if (!req.query.error) { 
      res.redirect(authUrl);
    } else {  
      res.send('access denied');
    }
    return;
  }
		graph.authorize({
			"client_id": conf.client_id,
			"redirect_uri": conf.redirect_uri,
			"client_secret": conf.client_secret,
			"code": req.query.code

		}, function(err, facebookRes){
			res.redirect('/loggedIn');
	});
});

// user gets sent here after being authorized
app.get('/loggedIn', function(req, res) {
  res.render("index", { title: "Logged In" });

graph
  .setOptions(options)
  .get("/me", function(err, res) {
   console.log(res); // { id: '4', name: 'Mark Zuckerberg'... }
  });


});

var options = {
    timeout:  3000
  , pool:     { maxSockets:  Infinity }
  , headers:  { connection:  "keep-alive" }
};


//Configures the Template engine
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.bodyParser());

//routes
app.get('/', index.view);
//set environment ports and start application
app.set('port', process.env.PORT || 3000);
http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});


//routes
app.get('/', index.view);
app.get('/twitterapp', twitterapp.view);
app.get('/facebookapp', facebookapp.view);
// twitter login
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new TwitterStrategy({
    consumerKey: process.env.twitter_consumer_key,
    consumerSecret: process.env.twitter_consumer_secret,
    //callbackURL: "http://letsgetsocial.herokuapp.com/auth/twitter/callback"
    callbackURL: "http://localhost:3000/twitterapp"
  },
  function(token, tokenSecret, profile, done) {
    User.findOrCreate({ twitterId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));

app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { successRedirect: '/',
                                     failureRedirect: '/' }));
//app.get('/followers', twitterapp.print);
app.get('/statuses', twitterapp.printStatuses);
app.get('/twitterapp', function(req, res){
  res.render('twitterapp', { user: "hello" });
});
