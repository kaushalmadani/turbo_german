var connect=require("./connection.js");

exports.get_group = function(request,response){
	var result={};
	result.status=1;
	result.msg="success";
	if(request.body.level_id){
		var q="SELECT group_master.*,user_stat.is_complete FROM group_master LEFT JOIN user_stat ON group_master.group_id= user_stat.group_id and user_stat.user_id="+request.body.user_id+" where group_master.level_id="+request.body.level_id;
		console.log(q);
		connect.getConnection().query(q,function(err,rows){
			if(err){
				console.log("Error in inserting car_type.");
				response.setHeader('Access-Control-Allow-Origin', '*');
				result.status=0;
				result.msg="Server Error.";
				response.send(result);
			}else{
				response.setHeader('Access-Control-Allow-Origin', '*');
				result.data=rows;
				response.send(result);
			}
		});
	}else{
		result.status=2;
		result.msg="level_id is missing.";
	}	
}