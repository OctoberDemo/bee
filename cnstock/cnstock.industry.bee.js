/**
 * Created by zhaoyun on 16-2-19.
 *
 * 产业
 */

new cnStockBee();

function cnStockBee() {

    Bee.setType("www.cnstock.com");
    Bee.setImgReferer("www.cnstock.com");

    Bee.requestNoScript();
    Bee.requestNoCss();

    Bee.onListDomLoaded = function(dom) {
        var items = [];

        var newsList = dom.byClass("new-list article-mini");

        for (var i = 0; i < Math.min(5, newsList.childElementCount); i++) {
            var news = newsList.children[i];

            // 分割线
            if (news.className != "line") {
                var item = {};

                item.created_at = news.byClass("time").innerText.trim();
                item.created_at = Bee.convertTime(item.created_at.substr(1, item.created_at.length - 2));
                item.url = news.byTag("a").attr("href").trim();
                item.title = news.byTag("a").innerText.trim();

                items.push(item);
            }
        }
        Bee.finishExtractList(items);
    }

    Bee.onItemDomLoaded = function(dom, item) {
        item.source = "中国证券网";
        var source = dom.byClass("source");
        if (source != undefined) {
            if (source.childElementCount != 0) {
                item.source = dom.byClass("source").byTag("a").innerText.trim();
            } else {
                item.source = dom.byClass("source").innerText.trim();
                if (item.source.startsWith("来源：") && item.source.length > "来源：".length) {
                    item.source = item.source.substring("来源：".length)
                }
            }
        }
        var author = dom.byClass("author");
        if (author != undefined) {
            item.author = dom.byClass("author").innerText.trim();
            if (item.author.startsWith("作者：") && item.author.lenght > "作者：".length) {
                item.author = item.author.substring("作者：".length);
            } else {
                item.author = "";
            }
        }

        var content = dom.byId("qmt_content_div");
        content.removeClass("content");
        content.removeTags("div");
        content.removeId("fujian");

        var needToRemove = [];
        var relatedLinks = false;
        for (var i = 0; i < content.childElementCount; i++) {
            var subContent = content.children[i];

            // “相关阅读”
            if (subContent.childElementCount != 0 && subContent.children[0].innerText.indexOf("相关阅读") >= 0) {
                relatedLinks = true;
            }
            if (relatedLinks) {
                needToRemove.push(subContent);
            }
        }
        for (var i = 0; i < needToRemove.length; i++) {
            content.removeChild(needToRemove[i]);
        }
        item.content = BeeUtils.htmlToJson(content);

        Bee.finishExtractItem(item);
    }
}