requirejs.config({
  baseUrl: '/javascripts/'
});
require([
	'multi'
],function(multi){
	$('#showSelector input[type=radio]').change(function(e){
		var self = $(this);
		if(self.is(':checked')){
			$.get('/admin/message?json=0', function(data){
				var singles = data.singles;
				var multis = data.multis;
				var html = '';
				$.each(singles, function(i,v){
					html+= '<option value="'+v._id+'">'+v.title+'</option>';
				});
				$.each(multis, function(i,v){
					html+= '<option value="'+v._id+'">'+v.title+'</option>';
				});
				$('#keyFedBySelect').removeClass('hide').append(html);
			});
		}
	});
	$('#upload').change(function(){
		var form = $(this).parents('form');
		form.submit();
	});
	var hash = location.hash;
	$('a[href=' + hash + ']').tab('show');
	$('[data-toggle="tab"]').click(function(e){
		var href = $(this).attr('href');
		window.location.href = href;
	});
});