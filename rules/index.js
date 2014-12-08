module.exports = function(webot) {
    var reg_help = /^(help|\?)$/i;
    webot.set({
        // name 和 description 都不是必须的
        name: 'info welcome',
        description: '欢迎信息',
        pattern: function(info) {
            //首次关注时,会收到subscribe event
            return info.is('event') && info.param.event === 'subscribe' || reg_help.test(info.text);
        },
        handler: function(info){
            var reply = {
                title: '感谢你收听懒人记账！',
                pic: 'http://carly.notes18.com/images/getqrcode.jpg',
                url: 'http://carly.notes18.com/',
                description: [
                    "这里您可以实现文字记账功能并设定每日额度。",
                    "文字输入格式：",
                    "消费类别（1：餐饮，2：交通，3：日用）+",
                    "价格 +",
                    "详细信息+",
                    "备注",
                    "例如：1,20,午饭",
                    "表示：餐饮+20元+午饭"
                ].join('\n')
            };
            // 返回值如果是list，则回复图文消息列表
            return reply;
        }
    });
    // 更简单地设置一条规则
    webot.set(/^123$/i, function(info){
        return '666';
    });
}