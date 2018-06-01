var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'ec2-107-20-133-82.compute-1.amazonaws.com',
  user     : 'kixlkcoaclciri',
  password : '88bb2e09fa106acde9ba1dca72f10b49eee12f031b6ada7fe88f32f33572e3cd',
  database : 'dbfj5rs69grbmu',
  multipleStatements: true
});
connection.connect(function(err){
	if(err)
		console.log("Not Connected");
	else
		console.log("Connected!!");
});
exports.getConnection=function(response){
	return connection;
}
exports.closeConnection=function(response){
	connection.end();
}