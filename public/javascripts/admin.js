requirejs.config({
  baseUrl: '/javascripts/'
});
require([
	'multi'
],function(multi){
	$('#accordionFed').on('hide.bs.collapse', function () {
  	$(this).find('textarea').html('');
  	$(this).find('select').val('');
	})
	var hash = location.hash;
	$('a[href=' + hash + ']').tab('show');

	$('[data-toggle="tab"]').click(function(e){
		var href = $(this).attr('href');
		window.location.href = href;
	});
	
	$('#myModal a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
	  $('#uploadImgConfirm').attr('data-img', '');
	});

	function initToolbarBootstrapBindings() {
			var fonts = ['Serif', 'Sans', 'Arial', 'Arial Black', 'Courier', 
						'Courier New', 'Comic Sans MS', 'Helvetica', 'Impact', 'Lucida Grande', 'Lucida Sans', 'Tahoma', 'Times',
						'Times New Roman', 'Verdana'];
			var fontTarget = $('[title=Font]').siblings('.dropdown-menu');
			$.each(fonts, function (idx, fontName) {
					fontTarget.append($('<li><a data-edit="fontName ' + fontName +'" style="font-family:\''+ fontName +'\'">'+fontName + '</a></li>'));
			});
			$('a[title]').tooltip({container:'body'});
			$('.dropdown-menu input').click(function() {return false;})
				.change(function () {$(this).parent('.dropdown-menu').siblings('.dropdown-toggle').dropdown('toggle');})
				.keydown('esc', function () {this.value='';$(this).change();});

			$('[data-role=magic-overlay]').each(function () { 
				var overlay = $(this), target = $(overlay.data('target')); 
				overlay.css('opacity', 0).css('position', 'absolute').offset(target.offset()).width(target.outerWidth()).height(target.outerHeight());
			});
			if ("onwebkitspeechchange"  in document.createElement("input")) {
				var editorOffset = $('#editor').offset();
				$('#voiceBtn').css('position','absolute').offset({top: editorOffset.top, left: editorOffset.left+$('#editor').innerWidth()-35});
			} else {
				$('#voiceBtn').hide();
			}
	};
	function showErrorAlert (reason, detail) {
		var msg='';
		if (reason==='unsupported-file-type') { msg = "Unsupported format " +detail; }
		else {
			console.log("error uploading file", reason, detail);
		}
		$('<div class="alert"> <button type="button" class="close" data-dismiss="alert">&times;</button>'+ 
		 '<strong>File upload error</strong> '+msg+' </div>').prependTo('#alerts');
	};
	initToolbarBootstrapBindings();  
	$('#editor').wysiwyg({ fileUploadError: showErrorAlert} );
	window.prettyPrint && prettyPrint();
	$('.ajax-img').click(function(){
		$.get('/admin/material?json=0&type=img', function(data){
			var html = '';
			$.each(data.list, function(i,v){
				html += '<div class="col-xs-6 col-md-3 li-img"><a href="javascript:;" class="thumbnail"><img src="'+v.url+'"></a></div>';
			});
			$('#materialsImg .row').html(html);
		});
	});
	$('#materialsImg').on('click', '.li-img', function(e){
		var self = $(this);
		var img = self.find('img').attr('src');
		$('#uploadImgConfirm').attr('data-img', img);
	});
	$('#uploadImgBtn').change(function(){
		var form = $(this).parents('form');
		form.submit();
	});
	$('#uploadImgConfirm').click(function(e){
		var img = $(this).attr('data-img');
		if(!img || img == ''){
			img = document.getElementById('uploadImgIframe').contentWindow.document.getElementById('uploadImgTag').src;
		}
		$('#myModal').modal('hide');
		var self = $(this);
		var stage = self.attr('data-stage');
		if(stage == 1){
			$('#uploadImgValueInput').val(img);
			$('#uploadImgValueImg').attr('src', img);
		}else if(stage == 2){
			document.execCommand('insertimage',false, img);
		}else{
			var i = self.attr('data-index');
			$('img[name="img'+i+'"]').attr('src', img);
		}
	});
	$('#myModal').on('show.bs.modal', function (e) {
	  var button = $(e.relatedTarget);
	  var stage = button.data('stage');
	  var index = button.data('index');
	  var modal = $(this);
	  $('#uploadImgConfirm').attr('data-stage',stage);
	  $('#uploadImgConfirm').attr('data-index',index);
	});
	$('#editor').blur(function(e){
		var self = $(this);
		var html = self.html();
		$('#uploadImgText').val(html);
	});
	$('.table-edit').on('click', '.table-edit-btn', function(){
		var self = $(this);
		var tr = self.parents('tr');
		var i = parseInt(tr.attr('data-index'));
		var $editor = tr.find('.table-edit-hide');
		$editor.toggleClass('in');
		if($editor.hasClass('in')){
			self.text('保存');
		}else{
			self.text('编辑');
			var title = tr.find('input[name="title"]').val();
			tr.find('p[name="title"]').html(title);
			var img = tr.find('img').attr('src');
			var titles = $('input[name="titles"]');
			var $titles = titles.val().split(',');
			$titles[i] = title;
			titles.val($titles);
			var imgs = $('input[name="imgs"]');
			var $imgs = imgs.val().split(',');
			$imgs[i] = img;
			imgs.val($imgs);
			var hrefs = $('input[name="hrefs"]');
			var $hrefs = hrefs.val().split(',');
			hrefs.val($hrefs);
		}
	});
	$('.table-edit-add-tr').click(function(){
		var self = $(this);
		var tr = self.parents('tr');
		var tbody = tr.parent();
		var size = tbody.find('tr').length;
		if(size<=5){
			var html = '<tr data-index="'+(size-1)+'"><td><p name="title"></p><div class="table-edit-hide in"><input type="text" class="form-control" value="" name="title"></div></td><td><p><img src="" name="img'+(size-1)+'" width="100"/></p><div class="table-edit-hide in"><a class="btn btn-primary ajax-img" data-toggle="modal" data-target="#myModal" data-stage="3" data-index="'+(size-1)+'">选择图片</a></div></td><td>-</td><td><a href="javascript:;" class="table-edit-btn">保存</a></td></tr>';
			tr.before(html);
		}else{
			self.remove();
		}
	});
	$('.slide').click(function(){
		var self = $(this);
		var href = self.attr('href');
		window.location.href=href;
	});
});