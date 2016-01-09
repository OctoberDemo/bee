new _CEBee();

function _CEBee() {
    Bee.setType("www.ce.cn");
    Bee.setImgReferer("www.ce.cn");

    Bee.requestNoScript();
    Bee.requestNoIframe();
    Bee.requestNoCss();

    Bee.onListLoaded = function(dom) {
        var items = [];
        var list_left = dom.byClass("list_left", true);
        if (list_left) {
            var links = list_left.byTags("a");
            extractLinks(links);
        }
        var left = dom.byClass("left", true);
        if (left) {
            var ul = left.byTag("ul");
            var links = ul.byTags("a");
            extractLinks(links);
        }
        var cons = dom.byClasses("con", true);
        for (var i = 0; i < cons.length; i++) {
            var links = cons[i].byTags("a");
            extractLinks(links);
        }

        function extractLinks(links) {
            for (var i = 0; i < links.length; i++) {
                var item = {};
                item.url = links[i].href;
                item.class = "news";
                //item.status = 5;
                items.push(item);
            }
        }

        Bee.finishExtractList(items);
    };

    Bee.onItemLoaded = function(dom, item) {
        var articleTitle = dom.byId("articleTitle", true);
        if (articleTitle == null) {
            console.log("未知格式");
            Bee.passItem(item);
            return;
        }
        item.title = articleTitle.innerText;
        var articleTime = dom.byId("articleTime");
        item.created_at = Bee.convertTime(articleTime.innerText);
        item.source = dom.byId("articleSource").innerText.trim();
        if (item.source.indexOf("来源：") == 0 || item.source.indexOf("来源:") == 0) {
            item.source = item.source.substring(3).trim();
        }
        if (item.source.indexOf("中国经济网") < 0) {
            if (Bee.existSource(item.source)) {
                console.log("已知来源：" + item.source);
                Bee.passItem(item);
            } else {
                console.log("未知来源:" + item.source);
            }
        }
        item.content = Bee.htmlToJson(dom.byClass("TRS_Editor"));

        Bee.finishExtractItem(item);
    }

}