define('multi',[],function(){
	var Multi = $('#data-multi tbody');
	var Single = $('#data-single tbody');
	Single.find('td').click(function(){
		var td = $(this);
		var tr = td.parent();
		var id = tr.attr('data-id');
		var title = tr.attr('data-title');
		var img = tr.attr('data-img');
		var list = [];
		var html = '<tr data-id="'+id+'"><td>'+title+'</td><td><img src="'+img+'" width="100"/></td></tr>';
		if(Multi.find('tr').length>0){
			list.push(id);
		}else{
			$('[type="hidden"][name="id"]').val(id);
			$('[type="hidden"][name="title"]').val(title);
			$('[type="hidden"][name="img"]').val(img);
		}
		Multi.append(html);
		$('[type="hidden"][name="list"]').val(list);
	});
});