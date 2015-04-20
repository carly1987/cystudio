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
	$(document).on('click', '.mod-app em', function(e){
		e.preventDefault();
		var href = $(this).attr('data-href');
		console.log(href);
		window.location.href = href;
	});
	$(document).on('click', '[data-toggle="show"]', function(){
		var self = $(this);
		var id = self.attr('data-for');
		$(id).slideDown();
	});
	$(document).on('click', '#list-message a', function(){
		var self = $(this);
		self.toggleClass('active');
		var id = self.attr('data-id');
		var $input = $('[name="list-message"]');
		var $message = $input.val();
		var $multi = $('#message-multi');
		var $single = $('#message-single');
		var title = self.text();
		var pic = self.attr('data-pic');
		if($message){
			$message = $message.split(',');
		}else{
			$message = [];
		}
		if(self.hasClass('active')){
			if($message.length<2){
				$message.push(id);
				var html = '<a href="message?id='+id+'" data-id="'+id+'" class="message-li"><span>'+title+'</span><img src="'+pic+'" width="50" height="50"></a>';
				$multi.find('.bd').prepend(html);
			}else{
				self.removeClass('active');
			}
		}else{
			$message.pop(id);
			$multi.find('.bd .message-li[data-id="'+id+'"]').remove();
		}
		if($message.length<=0){
			$multi.hide();
			$single.show();
		}else{
			$multi.show();
			$single.hide();
		}

		$input.val($message);
		
	});
	$(document).on('keypress','[data-input="keypress"]', function(){
		var self = $(this);
		var id = self.attr('data-for');
		var $result = $(id);
		$result.html(self.val());
	});
	$(document).on('change','[data-input="change"]', function(){
		var self = $(this);
		var id = self.attr('data-for');
		var $result = $(id);
		$result.attr('src',self.val());
	});
	$(document).on('mouseenter', '[data-toggle="hover"]', function(){
		var self = $(this);
		var html = '<form class="form-inline hide"><div class="form-group"><label class="" for="">标题：</label><input type="text" class="form-control" name="" data-input="keypress" data-for="#form-title"></div> <div class="form-group"><label class="" for=""> 转向：</label><select class="form-control" name=""><option></option></select></div><a class="btn btn-default btn-sumit">保存</a></form><div class="panel-btns"><a class="fa fa-pencil" data-toggle="edit"></a><a class="fa fa-times"></a></div>';
		self.append(html);
		var $p = self.attr('data-p');
		self.find('>'+$p).attr('id', 'form-title');
		$(document).on('click', '[data-toggle="edit"]', function(){
			self.find('form').show();
		});
		$(document).on('click', '.btn-sumit', function(){
			self.find('form').hide();
		});
	});
	$(document).on('mouseleave', '[data-toggle="hover"]', function(){
		var self = $(this);
		self.find('form').remove();
		self.find('.panel-btns').remove();
	});
	$(document).on('change', '[data-edit="select"]', function(){
		var self = $(this);
		var fed = self.val();
		$('.form-fed').hide();
		$('[data-fed="'+fed+'"]').show();
	});
	$(document).on('click', '.toolbar .btn-icon', function(){
		var self = $(this);
		var $div = $('.toolbar-in');
		self.toggleClass('active');
		if(self.hasClass('active')){
			$div.animate({
				width:'45%'
			});
		}else{
			$div.animate({
				width:'0px'
			});
		}
	});
	$(document).on('click', '.edit-toolbar', function(){
		$('.toolbar .btn-icon').click();
	})
});