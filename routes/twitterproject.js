var twit = require('twit'); 
var followers; 
var array;
var id;

var T = new twit({
    consumer_key:        process.env.twitter_app_id 
  , consumer_secret:     process.env.twitter_app_secret
  , access_token:        process.env.twitter_access_token
  , access_token_secret: process.env.twitter_access_token_secret
});

exports.printStatuses = function(req, res) {
T.get('statuses/user_timeline', { screen_name: 'immaSOCIAL' },  function (err, reply) {
var jsonArray = [];
function increment(i) { 
  if (i < 8) {
    var tempJSON = {};
    tempJSON.text = reply[i].text;
    jsonArray.push(tempJSON);
    increment(i+1);
   }
}
increment(0);
 var data = {statuses: jsonArray};
 function myFunction(field, data){
  if (typeof document.getElementsByName("+field+")[0] != 'undefined'){
  document.getElementsByName("+field+")[0].value=data;
 }
}
res.render('twitterapp', data);
});
}