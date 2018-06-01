var connect=require("./connection.js");
var bcrypt = require('bcrypt');
var async = require("async");
var mailer=require("./mailer.js");
var Constant=require("../Constant.js");
function check_email(request,response,result){
	var q="select * from user_master where user_email='"+request.body.user_email+"'";
	connect.getConnection().query(q,function(err,rows){
		if(err){
			console.log("Error in getting users_master.");
		}else{
			if(rows.length>0){
				result.status=2;
				result.msg="Email is already registered.";
				response.send(result);
			}else{
				bcrypt.hash(request.body.user_password, 10, function(err, hash) {
					//console.log("Hash:"+hash);
					var q="insert into user_master (user_name,user_phone,user_email,user_password) values ('"+request.body.user_name+"',"+request.body.user_phone+",'"+request.body.user_email+"','"+hash+"')"
					//console.log(q);
					connect.getConnection().query(q,function(err,success){
						if(err){
							console.log("Error in inserting user.");
							response.setHeader('Access-Control-Allow-Origin', '*');
							result.status=0;
							result.msg="Error in inserting";
							response.send(result);
						}else{
							console.log("User Inserted.");
							result.user_id=success.insertId;
							result.user_name=request.body.user_name;
							response.setHeader('Access-Control-Allow-Origin', '*');
							response.send(result);
						}
					});
				});	
			}
		}
	});
}
exports.change_password=function(request,response){
		var result={};
		result.status=1;
		result.msg="success";
		response.setHeader('Access-Control-Allow-Origin', '*');
		if(request.body.user_id && request.body.user_password && request.body.new_user_password){
			var cur_user_password=request.body.user_password;
			var new_user_password=request.body.new_user_password;
			var user_id=request.body.user_id;
			var q="select * from user_master where user_id="+user_id;
			console.log(q);
			connect.getConnection().query(q, function (err, rows, fields) {
				if (err){
					result.status=0;
					result.data=false;
					response.send(result);
				}else{
					if(rows.length>0){
						bcrypt.compare(cur_user_password, rows[0].user_password, function(err, res) {
						    if(res==true){
						    	bcrypt.hash(new_user_password, 10, function(err, hash) {
									var q="update user_master set user_password='"+hash+"' where user_id="+user_id;
									console.log(q);
									connect.getConnection().query(q, function (err, rows, fields) {
										if (err){
											result.status=0;
											result.data=false;
											response.send(result);
										}else{
											result.status=1;
											result.data=true;
											response.send(result);
										}
									});
								});
						    }else{
						    	result.status=3;
								result.msg="Please Enter Correct Password.";
								result.data=false;
								response.send(result);
						    }
						});					
					}else{
						result.status=2;
						result.msg="Error.User not found.";
						response.send(result);
					}
				}
			});
		}else{
			result.status=2;
			result.msg="user_password is missing.";
			result.data=false;
			response.send(result);
		}
}
exports.forgot_password=function(request,response){
		var result={};
		result.status=1;
		result.msg="success";
		response.setHeader('Access-Control-Allow-Origin', '*');
		if(request.body.user_email){
			var email=request.body.user_email;
			var q="select * from user_master where user_email='"+email+"'";
			console.log(q);
			connect.getConnection().query(q, function (err, rows, fields) {
				if (err){
					result.status=0;
					result.data=false;
					response.send(result);
				}else{
					if(rows.length>0){
						var password = Math.random().toString(36).slice(-8);
						bcrypt.hash(password, 10, function(err, hash) {
							var q="update user_master set user_password='"+hash+"' where user_id="+rows[0].user_id
							console.log(q);
							connect.getConnection().query(q, function (err, rows, fields) {
								if (err){
									result.status=0;
									result.data=false;
									response.send(result);
								}else{
									mailer.forgotPasswordMail(email,password);
									result.status=1;
									result.data=true;
									response.send(result);
								}
							});
						});	
						
					}else{
						result.status=3;
						result.data=false;
						response.send(result);
					}
				}
			});
		}else{
			result.status=2;
			result.msg="user_email is missing.";
			result.data=false;
			response.send(result);
		}
}
exports.user_login=function(request,response){
	var result={};
	result.status=1;
	result.msg="success";
	if(request.body){
		var q="select * from user_master where user_email='"+request.body.user_email+"'";
		connect.getConnection().query(q,function(err,rows){
			if(err){
				console.log("Error in inserting user.");
				response.setHeader('Access-Control-Allow-Origin', '*');
				result.status=0;
				result.msg="Error in inserting";
				result.data=false;
				response.send(result);
			}else{
				if(rows.length>0){
					bcrypt.compare(request.body.user_password, rows[0].user_password, function(err, res) {
					    if(res==true){
					    	result.status=1;
							result.msg="success";
							result.user_id=rows[0].user_id;
							result.user_name=rows[0].user_name;
							response.send(result);
					    }else{
					    	result.status=2;
							result.msg="Please check email id and password.";
							result.data=false;
							response.send(result);
					    }
					});
				}else{
					result.status=2;
					result.msg="Please check email id and password.";
					result.data=false;
					response.send(result);
				}
			}
		});
	}else{
		result.status=0;
		result.msg="Missing Fields";
		response.send(result);
	}
}
exports.save_stat=function(request,response){
	var result={};
	result.status=1;
	result.msg="success";
	if(request.body){
		var correct=request.body.correct;
		var wrong=request.body.wrong;
		var q="select * from user_stat where user_id="+request.body.user_id+" and group_id="+request.body.group_id;
		connect.getConnection().query(q,function(err,rows){
			if(err){
				console.log("Error in inserting user.");
				response.setHeader('Access-Control-Allow-Origin', '*');
				result.status=0;
				result.msg="Error in inserting";
				result.data=false;
				response.send(result);
			}else{
				if(rows.length>0){
					var q="update user_stat set time="+request.body.time+" where user_id="+request.body.user_id+" and group_id="+request.body.group_id;
					connect.getConnection().query(q,function(err,success){
						if(err){
							console.log("Error in inserting user.");
							response.setHeader('Access-Control-Allow-Origin', '*');
							result.status=0;
							result.msg="Error in inserting";
							response.send(result);
						}else{
							console.log("User Stat Inserted."+rows[0].user_stat_id);
							var q="delete from user_stat_question where user_stat_id="+rows[0].user_stat_id;
							connect.getConnection().query(q,function(err,success){
								if(err){
									console.log("Error in inserting user.");
									response.setHeader('Access-Control-Allow-Origin', '*');
									result.status=0;
									result.msg="Error in inserting";
									response.send(result);
								}else{
									async.each(correct,
										function(question, callback){
											var q="insert into user_stat_question (question_id,is_correct,user_stat_id) values("+question+",1,"+rows[0].user_stat_id+")";
											connect.getConnection().query(q, function (err) {
												callback();
											});
									},
									function(err){
										
									});
									async.each(wrong,
										function(question, callback){
											var q="insert into user_stat_question (question_id,is_correct,user_stat_id) values("+question+",0,"+rows[0].user_stat_id+")";
											connect.getConnection().query(q, function (err) {
												callback();
											});
									},
									function(err){
										response.send(result);
									});
								}
							});
						}
					});
				}else{
					var q="insert into user_stat (user_id,group_id,time,is_complete) values ("+request.body.user_id+","+request.body.group_id+",'"+request.body.time+"',1)";
					connect.getConnection().query(q,function(err,success){
						if(err){
							console.log("Error in inserting user.");
							response.setHeader('Access-Control-Allow-Origin', '*');
							result.status=0;
							result.msg="Error in inserting";
							response.send(result);
						}else{
							response.setHeader('Access-Control-Allow-Origin', '*');
							console.log("User Stat Inserted."+success.insertId);
							async.each(correct,
								function(question, callback){
									var q="insert into user_stat_question (question_id,is_correct,user_stat_id) values("+question+",1,"+success.insertId+")";
									connect.getConnection().query(q, function (err) {
										callback();
									});
							},
							function(err){
							});
							async.each(wrong,
								function(question, callback){
									var q="insert into user_stat_question (question_id,is_correct,user_stat_id) values("+question+",0,"+success.insertId+")";
									connect.getConnection().query(q, function (err) {
										callback();
									});
							},
							function(err){
								response.send(result);
							});
						}
					});
				}
			}
		});	
	}else{
		result.status=0;
		result.msg="Missing Fields";
		response.send(result);
	}
}
exports.save_user=function(request,response){
	var result={};
	result.status=1;
	result.msg="success";
	if(request.body){
		check_email(request,response,result);	
	}else{
		result.status=0;
		result.msg="Missing Fields";
		response.send(result);
	}
}
exports.get_user = function(request,response){
	var result={};
	result.status=1;
	result.msg="success";
	var q="select * from user_master";
	connect.getConnection().query(q,function(err,rows){
		if(err){
			console.log("Error in inserting user.");
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