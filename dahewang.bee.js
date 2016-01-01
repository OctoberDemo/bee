var DaHeBee = new _DaHeBee();
function _DaHeBee() {

    Bee.setType("http://news.dahe.cn/");
    Bee.setImgReferer("http://news.dahe.cn/");
    Bee.setRefreshTime(1000 * 60 * 10);
    Bee.onListDomLoaded = function (dom) {
        var items = [];
        var contList = dom.byClass("ulTxtList clearfix", true);
        if (contList == undefined) {
            Bee.finishExtractList();
            return;
        }
        var lis = contList.byTags("li");
        for (var i = 0; i < lis.length; i++) {
            var item = {};
            var header = lis[i];
            item.url = header.byTag("a").href;
            item.title = header.byTag("a").innerText;
            var createdAt = header.byTag("span").innerHTML;
            item.created_at = Bee.convertTime(createdAt);
            items.push(item);
        }
        Bee.finishExtractList(items);
    };

    Bee.onItemDomLoaded = function (dom, item) {

        var article = dom.byId("mainCon");
        if (article == undefined) {
            console.log("article == undefined");
            Bee.finishExtractItem();
            return;
        }
        var attrib = dom.byId("source_baidu").innerText;
        var sourceString = attrib.replace("来源:", "");
        if (sourceString.indexOf("大河网") < 0) {
            if (Bee.existSource(sourceString)) {
                console.log("跳过来源：" + sourceString);
                Bee.passItem(item);
                return;
            } else {
                console.log("未知来源：" + sourceString);
            }
        }
        item.source = sourceString;
        var content = Bee.htmlToJson(article);
        item.content = content;
        item.class = "";
        Bee.finishExtractItem(item, true, true);
    };

    this.addChannel = function(category, tag, url) {
        Bee.addChannel(category, tag, url);
    };

    this.start = function() {
        Bee.start();
    }
}