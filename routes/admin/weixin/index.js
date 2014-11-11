var weixin = require('../../../module/weixin');
var date = require('../../../pluin/date');
exports.index = function(req, res){
	weixin.list(req.session.email, function (err, list) {
		if (err) {
			return next(err);
		}
		if(list === null){
			list = [];
		}	
		res.render('admin/weixin/index', {
			title: '管理公众号',
			list: list,
			email: req.session.email,
			format: date.dateFormat,
			endDate: date.endDate
		});
	});
};
exports.add = function(req, res){
	res.render('admin/weixin/add', {
		title: '添加公众号',
		success:req.flash('success').toString(),
		error:req.flash('error').toString(),
		email: req.session.email
	});
};