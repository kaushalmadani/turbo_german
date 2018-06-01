var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var path = require('path');
var dir = path.join(__dirname, './uploads');
var user = require('./api/user.js');
var level = require('./api/level.js');
var group = require('./api/group.js');
var rule = require('./api/rule.js');
var question = require('./api/question.js');

var port = process.env.PORT || 5100;

app.use(express.static(dir));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(port, function(err) {
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log(`server is listening on `+port);
});

app.get("/home",function(request,response){
	var status={};
	status.error=1;
	status.msg="running";
	response.send(status);
});
//Login
app.post("/user_login",function(request,response){
	user.user_login(request,response);
});

//Register
app.post("/save_user",function(request,response){
	user.save_user(request,response);
});

//Save Stat
app.post("/save_stat",function(request,response){
	user.save_stat(request,response);
});

//Forgot Password
app.post("/forgot_password",function(request,response){
	user.forgot_password(request,response);
});

//Change Password
app.post("/change_password",function(request,response){
	user.change_password(request,response);
});

//User List
app.get("/get_user",function(request,response){
	user.get_user(request,response);
});

//Level List
app.get("/get_level",function(request,response){
	level.get_level(request,response);
});

//Level List
app.post("/get_group",function(request,response){
	group.get_group(request,response);
});

//Question List
app.post("/get_question",function(request,response){
	question.get_question(request,response);
});

//Rule List
app.get("/get_rule",function(request,response){
	rule.get_rule(request,response);
});

module.exports = app;