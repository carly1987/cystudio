exports.dateFormat = function(str){
	return str.getFullYear()+'-'+(str.getMonth()+1)+'-'+str.getDate();
}
exports.endDate = function(str,step){
	var y = step%12+1;
	var m = step-12*y;
	return (str.getFullYear()+y)+'-'+(str.getMonth()+1+m)+'-'+str.getDate();
}