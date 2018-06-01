var connect=require("./connection.js");
var async = require("async");

exports.get_question = function(request,response){
	var result={};
	result.status=1;
	result.msg="success";
	if(request.body.group_id){
		var q="SELECT q . *  FROM question_master q, group_master g WHERE g.group_id = q.group_id AND q.group_id ="+request.body.group_id;
		console.log(q);
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
				var answers=[];
				async.each(rows,
					function(option, callback){
						var image="select * from answer_master where question_id="+option.question_id;
						connect.getConnection().query(image, function (err, attribute, fields) {
						if(err){
							array.data=false;
							response.send(array);
						}else{
							option.answers=attribute;
							callback();
						}
					});
				},
				function(err){
					result.data=rows;
					response.send(result);
				});
			}
		});
	}else{
		result.status=0;
		result.msg="group_id missing!!";
		response.send(result);
	}
}