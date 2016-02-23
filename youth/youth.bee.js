new _YouthBee();

function _YouthBee() {

    Bee.setType("www.youth.cn");
    Bee.setImgReferer("www.youth.cn");

    Bee.requestNoScript();
    Bee.requestNoCss();
    Bee.requestNoIframe();


    Bee.onListLoaded = function(dom) {
        var items = [];

        var rdwz = dom.byClass("rdwz", true);
        if (rdwz) {
            var links = rdwz.byTags("a");
            extractLinks(links);
        }
        var list = dom.byClass("list", true);
        if (list) {
            var links = list.byTags("a");
            extractLinks(links);
        }

        Bee.finishExtractList(items);

        function extractLinks(links) {
            for (var i = 0; i < links.length; i++) {
                if (links[i].href == "") {
                    continue;
                }
                var item = {};
                item.url = links[i].href;
                item.class = "news";
                //item.status = 5;
                items.push(item);
            }
        }
    };

    Bee.onItemLoaded = function(dom, item) {
        dom.removeClass("copy-share");

        var main_l = dom.byClass("main_l", true);
        if (main_l == null) {
            console.log("未知格式：" + item.url);
            Bee.passItem(item);
            return;
        }
        var l_tit = main_l.byClass("l_tit", true);
        if (l_tit == null) {
            console.log("未知格式：" + item.url);
            Bee.passItem(item);
            return;
        }
        item.title = l_tit.innerText.trim();
        var pubtime_baidu = dom.byId("pubtime_baidu");
        var time = pubtime_baidu.innerText;
        if (time.indexOf("发稿时间：") == 0 || time.indexOf("发稿时间:") >= 0) {
            time = time.substring(5);
        }
        item.created_at = Bee.convertTime(time);

        var source_baidu = dom.byId("source_baidu", true);
        var source = "中国青年网";
        if (source_baidu) {
            source = source_baidu.innerText;
        }
        if (source.indexOf("来源：") == 0 || source.indexOf("来源:") == 0) {
            source = source.substring(3);
        }
        source = source.trim();
        if (source.contains(" ")) {
            source = source.substring(0, source.indexOf(" "));
            source = source.trim();
        }
        if (source.contains("中国青年网")) {

        } else {
            if (Bee.existSource(source)) {
                console.log("已知来源：" + source);
                Bee.passItem(item);
                return;
            } else {
                console.log("未知来源：" + source);
            }
        }
        item.source = source;

        var author_baidu = dom.byId("author_baidu", true);
        if (author_baidu) {
            var author = author_baidu.innerText;
            if (author.indexOf("作者：") == 0 || source.indexOf("作者:") == 0) {
                author = author.substring(3);
            }
            item.author = author;
        }

        var TRS_Editor = dom.byClass("TRS_Editor", true);
        if (TRS_Editor) {
            item.content = Bee.htmlToJson(TRS_Editor);

            if (hasSubItem() == false) {
                finishExtractItem(item);
            }

        } else {
            var articleText = dom.byClass("article");
            item.content = Bee.htmlToJson(articleText);

            if (hasSubItem() == false) {
                finishExtractItem(item);
            }
        }

        function hasSubItem() {
            var hasSubItem = false;
            var page = dom.byClass("page", true);
            if (page != null) {
                if (page.innerText.indexOf("下一页") >= 0) {
                    if (page != null && page != undefined) {
                        var links = page.byTags("a");
                        extractSubItems(links);
                    }
                }
            }
            var laiyuans = dom.byClasses("laiyuan", true);
            for (var i = 0; i < laiyuans.length; i++) {
                if (laiyuans[i].innerText.indexOf("下一页") >= 0) {
                    var links = laiyuans[i].byTags("a");
                    extractSubItems(links);
                    break;
                }
            }
            return hasSubItem;

            function extractSubItems(links) {
                hasSubItem = true;
                var lastLinks = links[links.length - 2];
                var substring = lastLinks.href.substring(item.url.length - 6);
                substring = substring.substring(substring.indexOf("_") + 1);
                substring = substring.substring(0, substring.indexOf("."));
                var subCount = parseInt(substring);

                var baseUrl = item.url.substring(0, item.url.lastIndexOf("."));
                var appendix = item.url.substring(baseUrl.length);
                var subUrls = [];
                for (var i = 1; i < subCount; i++) {
                    subUrls.push(baseUrl + "_" + (i + 1) + appendix);
                }
                console.log(subUrls);
                if (subUrls.length == 0) {
                    finishExtractItem(item)
                } else {
                    Bee.finishExtractSubUrls(subUrls, item);
                }
            }
        }
    };

    Bee.onSubItemDomLoaded = function(dom, item) {
        dom.removeClass("copy-share");

        var TRS_Editor = dom.byClass("TRS_Editor", true);
        if (TRS_Editor) {
            item.content = item.content.concat(Bee.htmlToJson(TRS_Editor));
        } else {
            var articleText = dom.byClass("article");
            item.content = item.content.concat(Bee.htmlToJson(articleText));
        }
        var hasNext = Bee.continueSubItem(item);
        if (hasNext == false) {
            finishExtractItem(item);
        }
    };

    function finishExtractItem(item) {
        Bee.finishExtractItem(item);
    }
}