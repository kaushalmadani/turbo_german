var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : '38.135.32.251',
  user     : 'pricemon_kaushal',
  password : 'Python@1234',
  database : 'pricemon_turbo_german',
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
