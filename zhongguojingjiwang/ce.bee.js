new _CEBee();

function _CEBee() {
    Bee.setType("www.ce.cn");
    Bee.setImgReferer("www.ce.cn");

    var adTexts = ["更多精彩作品请点击"];

    Bee.onListLoaded = function(dom) {
        var items = [];
        var list_left = dom.byClass("list_left", true);
        if (list_left) {
            var links = list_left.byTags("a");
            extractLinks(links);
        }
        var left = dom.byClass("left", true);
        if (left) {
            var ul = left.byTag("ul", true);
            if (ul) {
                var links = ul.byTags("a");
                extractLinks(links);
            }
        }
        var cons = dom.byClasses("con", true);
        for (var i = 0; i < cons.length; i++) {
            var links = cons[i].byTags("a");
            extractLinks(links);
        }
        var lbcons = dom.byClasses("lbcon", true);
        for (var i = 0; i < lbcons.length; i++) {
            var links = lbcons[i].byTags("a");
            extractLinks(links);
        }

        var neirong = dom.byClass("neirong", true);
        if (neirong) {
            var links = neirong.byTags("a");
            extractLinks(links);
        }

        var box = dom.byClass("box", true);
        if (box) {
            var links = box.byTags("a");
            extractLinks(links);
        }

        if (Bee.getCurChannel().url == "http://www.ce.cn/newmain/right/feature/index.shtml") {
            var links = dom.byTags("a");
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

    Bee.onItemDomLoaded = function(dom, item) {
        dom.removeTags("iframe");

        setTimeout(function() {
            var articleTitle = dom.byId("articleTitle", true);
            if (articleTitle == null) {
                console.log("未知格式：" + item.url);
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
                    return;
                } else {
                    console.log("未知来源:" + item.source);
                }
            }
            var TRS_Editor = dom.byClass("TRS_Editor", true);
            if (TRS_Editor) {
                item.content = Bee.htmlToJson(TRS_Editor, adTexts);

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
                if (hasSubItem == false) {
                    Bee.finishExtractItem(item);
                }

                function extractSubItems(links) {
                    hasSubItem = true;
                    var lastLinks = links[links.length - 1];
                    var substring = lastLinks.href.substring(item.url.length - 6);
                    substring = substring.substring(substring.indexOf("_") + 1);
                    substring = substring.substring(0, substring.indexOf("."));
                    var subCount = parseInt(substring);

                    var baseUrl = item.url.substring(0, item.url.lastIndexOf("."));
                    var appendix = item.url.substring(baseUrl.length);
                    var subUrls = [];
                    for (var i = 0; i < subCount; i++) {
                        subUrls.push(baseUrl + "_" + (i + 1) + appendix);
                    }
                    Bee.finishExtractSubUrls(subUrls, item);
                }

            } else {
                var articleText = dom.byId("articleText");
                item.content = Bee.htmlToJson(articleText, adTexts);
                Bee.finishExtractItem(item);
            }
        }, 1000);
    };

    Bee.onSubItemDomLoaded = function(dom, item) {
        item.content = item.content.concat(Bee.htmlToJson(dom.byClass("TRS_Editor"), adTexts));
        var hasNext = Bee.continueSubItem(item);
        if (hasNext == false) {
            Bee.finishExtractItem(item);
        }
    };

}