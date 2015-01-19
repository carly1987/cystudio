define('multi',[],function(){
	var $single = $('.li-single');
	$single.change(function(){
		var self = $(this);
		var $ids = $("input[name='ids']");
		var $titles = $("input[name='titles']");
		var $imgs = $("input[name='imgs']");
		var ids = $ids.val();
		var titles = $titles.val();
		var imgs = $imgs.val();
		if(ids == ''){
			ids = [];
		}else{
			ids = ids.split(',');
		}
		if(titles == ''){
			titles = [];
		}else{
			titles = titles.split(',');
		}
		if(imgs == ''){
			imgs = [];
		}else{
			imgs = imgs.split(',');
		}
		$("input[name='title']").val(titles[0]);
		var idsv = self.attr('data-id');
		var titlesv = self.attr('data-title');
		var imgsv = self.attr('data-img');
		if(self.is(':checked')){
			ids.push(idsv);
			titles.push(titlesv);
			imgs.push(imgsv);
		}else{
			var a = idsv.indexOf(ids);
			var b = titlesv.indexOf(titles);
			var c = imgsv.indexOf(imgs);
			ids.splice(a,1);
			titles.splice(b,1);
			imgs.splice(c,1);
		}
		ids = ids.join(',');
		titles = titles.join(',');
		imgs = imgs.join(',');
		$ids.val(ids);
		$titles.val(titles);
		$imgs.val(imgs);
	});
});