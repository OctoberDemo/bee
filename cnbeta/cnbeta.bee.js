new _cnBetaBee();

function _cnBetaBee() {
    Bee.setType("cnbeta");
    Bee.setImgReferer("www.cnbeta.com");

    Bee.requestNoScript();

    Bee.onListLoaded = function(dom) {
        var items = [];

        var all_news_wildlist = dom.byClass("all_news_wildlist");
        var itemNodes = all_news_wildlist.byClasses("item");
        for (var i = 0; i < Math.min(5, itemNodes.length); i++) {
            var itemNode = itemNodes[i];

            var item = {};
            var titleNode = itemNode.byClass("title");
            item.title = itemNode.byTag("a").innerText;
            if (item.title.indexOf("[视频]") >= 0) {
                item.title = item.title.substring(4);
            }
            item.url = itemNode.byTag("a").href;
            item.status = 5;

            items.push(item);
        }

        Bee.finishExtractList(items);
    };

    Bee.onItemLoaded = function(dom, item) {
        var where = dom.byClass("where").innerText.trim();
        if (where.indexOf("稿源：") == 0 || where.indexOf("稿源:") == 0) {
            where = where.substring(3).trim();
        }
        if (where.indexOf("cnBeta") >= 0) {
            item.source = "cnBeta.COM";
        } else {
            if (Bee.existSource(where)) {
                console.log("已知来源：" + where);
                Bee.passItem(item);
                return;
            } else {
                console.log("未知来源：" + where);
            }
            item.source = where;
        }

        var date = dom.byClass("date");
        item.created_at = Bee.convertTime(date.innerText);

        var content = dom.byClass("content");
        item.content = Bee.htmlToJson(content);

        var intro = dom.byClass("introduction");
        var p = {};
        p.p = intro.innerText.trim();
        item.content.add(0, p);

        Bee.finishExtractItem(item, true);
    }
}