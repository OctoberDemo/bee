/**
 * Created by zhaoyun on 16-2-23.
 */

new jiuPaiCn();

function jiuPaiCn() {

    Bee.setType("www.jiupaicn.com");
    Bee.setImgReferer("www.jiupaicn.com");

    Bee.requestNoCss();

    Bee.onListDomLoaded = function(dom) {
        setTimeout(function() {
            var items = [];

            var list = dom.byClasses("bankuan cc");

            for (var i = 0; i < Math.min(5, list.length); i++) {
                var article = list[i];
                var item = {};

                item.source = "九派";
                item.title = article.byTag("h3").byTag("a").innerText.trim();
                item.url = article.byTag("h3").byTag("a").attr("href").trim();
                item.desc = article.byClass("ppp").innerText.trim();

                items.push(item);
            }
            Bee.finishExtractList(items);
        }, 1000);
    };

    Bee.onItemDomLoaded = function(dom, item) {
        var about = dom.byClass("news_about").byTags("p")[1].innerText.trim();

        if (about.length >= 20) {
            item.created_at = Bee.convertTime(about.substring(0, 19));
            item.source = about.substring(20);
            if (item.source.indexOf("九派") >= 0) {
                item.source = "九派";
            } else if (item.source.indexOf(" ") > 0) {
                item.author = item.source.substring(item.source.indexOf(" ") + 1);
                item.source = item.source.substring(0, item.source.indexOf(" "));
            }
        } else {
            item.created_at = Bee.convertTime(about.substring(0, 19));
        }

        var desc = {};
        desc.desc = item.desc;

        var content = dom.byClass("ncontent");
        if (content.children[0].tagName == "P" && content.children[0].innerText.indexOf("摘要") >= 0) {
            content.children[0].remove();
        }
        item.content = BeeUtils.htmlToJson(content, [], [], function(node) {
            var img = {};
            img.src = Bee.makeImgJumpUrl(node.src, "www.jiupaicn.com");
            liteAjax("http://jcloud.jndroid.com/request?page=http://playground.jndroid.cn/imagesize", function(e) {
                var size = JSON.parse(e);
                console.log(e);
                img.width = size.width;
                img.height = size.height;
            }, "post", img.src, false);
            return img;
        });

        if (item.desc != undefined && item.desc.length > 0) {
            var desc = {};
            desc.desc = item.desc;
            item.content.add(0, desc);
        }
        delete item.desc;

        Bee.finishExtractItem(item);
    };
};