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
	var hash = location.hash;
	$('a[href=' + hash + ']').tab('show');
	$('[data-toggle="tab"]').click(function(e){
		var href = $(this).attr('href');
		window.location.href = href;
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
		$.get('/materials?json=0&type=img', function(data){
			$('#materialsImg').html(data);
		});
	});
	$('#uploadImgBtn').change(function(){
		var form = $(this).parents('form');
		form.submit();
		// var files = $(this)[0].files[0];
		// var data = {
		// 	name:files.name,
		// 	size:files.size,
		// 	path:$(this).val()
		// };
		// $.post('/mod/upload',data,function(r){
		// 	console.log(r);
		// });
	});
	$('#uploadImgConfirm').click(function(e){
		var img = document.getElementById('uploadImgIframe').contentWindow.document.getElementById('uploadImgTag').src;
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
		console.log($('#uploadImgText').val());
	});
});