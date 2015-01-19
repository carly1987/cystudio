exports.indexOf = function(arr, str){
	arr.forEach(function(v,i){
		if(v == str){
			 return i;
		}
	});
	
}