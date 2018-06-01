var connect=require("./connection.js");

exports.get_level = function(request,response){
	var result={};
	result.status=1;
	result.msg="success";
	var q="select level.* from level_master level";
	connect.getConnection().query(q,function(err,rows){
		if(err){
			console.log("Error in inserting car_type.");
			response.setHeader('Access-Control-Allow-Origin', '*');
			result.status=0;
			result.msg="Error in inserting";
			result.data=false;
			response.send(result);
		}else{
			response.setHeader('Access-Control-Allow-Origin', '*');
			result.data=rows;
			response.send(result);
		}
	});
}