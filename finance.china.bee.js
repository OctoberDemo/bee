/**
 * Created by guyiyang on 2015/12/28.
 */
var chinaFinanceBee = new _ChinaFinanceBee();
function _ChinaFinanceBee() {
    Bee.setType("http://finance.china.com.cn/");
    Bee.requestNoScript();
    Bee.requestNoIframe();
    Bee.setImgReferer("http://finance.china.com.cn/");
    Bee.setRefreshTime(60 * 60 * 1000);

    Bee.onListLoaded = function(dom) {
        var items = [];
        if (dom.byClass("news_list", true) != null) {
            var itemDivs = dom.byClass("news_list").byTags("li");
            for (var i = 0; i < itemDivs.length; i++) {
                var item = {};
                var tags = itemDivs[i].byTags("a", true);
                if (tags != null) {
                    var tag = tags[tags.length - 1];
                    item.title = tag.innerText;
                    item.url = tag.href;
                    item.key = Bee.hashCode(item.url);
                    items.push(item);
                }
            }
        }
        Bee.finishExtractList(items);
    }

    Bee.onItemLoaded = function(dom, item) {
        setTimeout(function() {
            var srcTag = dom.byId("source_baidu", true);
            if (srcTag != null) {
                var src = srcTag.innerText;
                src = src.replace("来源：","");
                if (src.search("中国网") < 0) {
                    if (Bee.existSource(src)) {
                        console.log("跳过来源：" + src);
                        Bee.passItem(item);
                        return;
                    } else {
                        console.log("未知来源：" + src);
                    }
                }
                item.source = src;
                var time = dom.byId("pubtime_baidu").innerText;
                time = time.replace("发布时间：","");
                item.created_at = Bee.convertTime(time);
                if (dom.byId("content", true) != null) {
                    var content = Bee.htmlToJson(dom.byId("content"));
                    item.content = JSON.stringify(content);
                    Bee.finishExtractItem(item);
                } else {
                    Bee.passItem(item);
                }
            } else {
                Bee.passItem(item);
            }
        }, 1000)
    }
}