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
				var html = '';
				var list = data.list
				$.each(list, function(i,v){
					html+= '<option value="'+v._id+'">'+v.title+'</option>';
				});
				$('#keyFedBySelect').removeClass('hide').append(html);
			});
		}
	});
	var hash = location.hash;
	$('a[href=' + hash + ']').tab('show');
	$.get('/admin/material?json=0&type='+hash, function(data){
		console.log(data);
		var html = '';
		$.each(data.list, function(i,v){
			html += '<div class="col-xs-6 col-md-3 li-img"><a href="javascript:;" class="thumbnail"><img src="'+v.url+'"></a></div>';
		});
		$('#tab-material-tabpanel').find(hash).find('.row').html(html);
	});
	$('[data-toggle="tab"]').click(function(e){
		var href = $(this).attr('href');
		window.location.href = href;
	});
	$('#tab-material a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
		var href = $(this).attr('href');
		var type = href.replace('#');
		$.get('/admin/material?json=0&type='+type, function(data){
			console.log(data);
			var html = '';
			$.each(data.list, function(i,v){
				html += '<div class="col-xs-6 col-md-3 li-img"><a href="javascript:;" class="thumbnail"><img src="'+v.url+'"></a></div>';
			});
			$(href).find('.row').html(html);
		});
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
			$('#uploadImgValue').val(img);
		}else{
			document.execCommand('insertimage',false, img);
		}	
	});
	$('#myModal').on('show.bs.modal', function (e) {
	  var button = $(e.relatedTarget);
	  var stage = button.data('stage');
	  var modal = $(this);
	  $('#uploadImgConfirm').attr('data-stage',stage);
	});
	$('#editor').blur(function(e){
		var self = $(this);
		var html = self.html();
		$('#uploadImgText').val(html);
	});
});