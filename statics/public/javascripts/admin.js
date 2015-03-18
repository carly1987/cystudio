$(function () {
	$(document).on('click', '.app-tool', function(){
		var self = $(this);
		var haved = self.attr('data-haved');
		if(haved==0){
			self.attr('data-haved',1);
			var html = self[0].outerHTML;
			$('.app-haved').append(html);
			self.remove();
		}else if(haved==1){
			self.attr('data-haved',0);
			var html = self[0].outerHTML;
			$('.app-list').prepend(html);
			self.remove();
		}
	});
});