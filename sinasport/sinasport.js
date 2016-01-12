new Sinasport();
function Sinasport() {
    Bee.setType("sports.sina.cn");
    Bee.setImgReferer("sports.sina.cn");

    Bee.requestNoCss();
    Bee.requestNoIframe();


    function loadNewList(dom) {
        Bee.scrollToBottom(dom);
        setTimeout(function() {
            var items = [];
            var contList = dom.byClass("feed-card-content", true);
            if (contList == undefined) {
                Bee.log("list content undefined");
                return false;
            }
            var lis = contList.byClasses("feed-card-item", true);
            for (var i = 0; i < lis.length; i++) {
                var li = lis[i];
                var item = {};
                var title = li.byTag("h2", true);
                if (title) {
                    item.url = title.byTag("a").href;
                    item.title = title.byTag("a").innerText;
                } else {
                    continue;
                }
                var listImg = li.byTag("img", true);
                if (listImg) {
                    var image = {};
                    image.src = listImg.src;
                    image.height = listImg.clientHeight;
                    image.width = listImg.clientWidth;
                    item.cover_img = image;
                }
                var des = li.byClass("feed-card-txt", true);
                if (des && des.byTag("a").innerText.length > 0) {
                    item.content = [];
                    var desc = {};
                    desc.desc =  des.byTag("a").innerText;
                    item.content.add(desc);
                }
                items.push(item);
            }
            Bee.finishExtractList(items);
            return true;
        }, 500);
    }

    function loadOldList(dom) {
        var td = dom.byTags("td");
        for (var i = 0; i < td.length; i++) {
            if (td[i].attr("class", true) == "l19") {
                var listContent = td[i];
            }
        }
        if (listContent == undefined) {
            Bee.log("listcontent == undefined");
            return false;
        }
        var items = [];
        var lists = listContent.byTags("a", true);
        for (var i = 0; i < lists.length; i++) {
            var item = {};
            item.title = lists[i].innerText;
            item.url = lists[i].href;
            items.push(item);
        }
        Bee.finishExtractList(items);
        return true;
    }

    Bee.onListLoaded = function(dom) {
        if ( !loadOldList(dom) && !loadNewList(dom)) {
            Bee.log("两个版本都不是");
            Bee.finishExtractList([]);
        }
    };

    Bee.onItemDomLoaded = function (dom, item) {

        var article = dom.byId("artibody", true);
        if (article == undefined) {
            console.log("article == undefined");
            Bee.finishExtractItem();
            return;
        }
        article.removeClass("artical-player-wrap");
        article.removeClass("sinaads sinaads-done");
        article.removeClass("weibo-widget weibo-list");

        var artInfo = dom.byClass("artInfo");
        if (artInfo == undefined) {
            Bee.log("artInfo == null");
            Bee.finishExtractItem();
            return;
        }
        var sourceString = "";
        var mediaName = artInfo.byId("media_name");
        var tagA = mediaName.byTags("a");
        if (tagA.length == 1 && tagA[0].innerText == "微博") {
            sourceString = mediaName.innerText.split(" ")[0];
        } else {
            sourceString = tagA[0].innerText;
        }
        if (sourceString.indexOf("新浪体育") < 0) {
            if (Bee.existSource(sourceString)) {
                console.log("跳过来源：" + sourceString);
                Bee.passItem(item);
                return;
            } else {
                console.log("未知来源：" + sourceString);
            }
        }
        item.source = sourceString;

        var timeString = artInfo.byId("pub_date").innerText;
        item.created_at = Bee.convertTime(timeString);

        var artKeyword = dom.byClass("art_keywords", true);
        if (artKeyword) {
            var words = [];
            var keys = artKeyword.byTags("a", true);
            for (var i = 0; i < keys.length; i++) {
                words.push(keys[i].innerText);
            }
            item.tag = words.join(" ");
        }
        var content = Bee.htmlToJson(article);
        if (item.content) {
            item.content = item.content.concat(content);
        } else {
            item.content = content;
        }
        item.class = "";
        Bee.finishExtractItem(item);
    };
}