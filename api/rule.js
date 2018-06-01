var connect=require("./connection.js");
var Constant=require("../Constant.js");

exports.get_rule = function(request,response){
	var result={};
	result.status=1;
	result.msg="success";
	var q="select rule.*,concat('"+Constant.getServer()+"',image.image_name) as image_path from rule_master rule,image_master image where image.image_id=rule.image_id";
	//console.log(q);
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