var PeopleBee = new _PeopleBee();
function _PeopleBee() {

    Bee.setType("people.com.cn");
    Bee.setImgReferer("people.com.cn");
    Bee.requestNoScript();
    Bee.requestNoCss();
    Bee.requestNoIframe();

    Bee.onListLoaded = function(dom) {
        var items = [];

        dom.removeClasses("t2_title");

        var ej_right = dom.byClass("ej_right", true);
        if (ej_right) {
            var uls = ej_right.byTags("ul");
            for (var i = 0; i < uls.length; i++) {
                var links = uls[i].byTags("a");
                getItems(links);
            }
        }
        var newslist = dom.byClass("newslist", true);
        if (newslist) {
            var uls = newslist.byTags("ul");
            for (var i = 0; i < uls.length; i++) {
                var links = uls[i].byTags("a");
                getItems(links);
            }
        }
        var one_5 = dom.byClass("one_5", true);
        if (one_5) {
            var uls = one_5.byTags("ul");
            for (var i = 0; i < uls.length; i++) {
                var links = uls[i].byTags("a");
                getItems(links);
            }
        }
        var d2_left = dom.byClass("d2_left", true);
        if (d2_left) {
            var uls = d2_left.byTags("ul");
            for (var i = 0; i < uls.length; i++) {
                var links = uls[i].byTags("a");
                getItems(links);
            }
        }

        getItemsFromList("dot_14");
        getItemsFromList("list_14");
        getItemsFromList("list14");
        getItemsFromList("list");
        getItemsFromList("hg_4");
        getItemsFromList("list06");

        console.log("共得到列表数据" + items.length + "条");
        Bee.finishExtractList(items);

        function getItemsFromList(listclass) {
            var lists = dom.byClasses(listclass, true);
            for (var i = 0; i < lists.length; i++) {
                var links = lists[i].byTags("a");
                getItems(links);
            }
        }

        function getItems(links) {
            for (var i = 0; i < links.length; i++) {
                if (links[i].innerText != "") {
                    var item = {};
                    item.title = links[i].innerText;
                    item.url = links[i].href;
                    item.key = Bee.hashCode(item.url);
                    item.class = "news";
                    //item.status = 5;
                    items.push(item);
                }
            }
        }
    };

    Bee.onItemLoaded = function(dom, item) {
        var p_title = dom.byId("p_title", true);
        if (p_title) {
            item.title = dom.byId("p_title").innerText;
            item.created_at = Bee.convertTime(dom.byId("p_publishtime").innerText);

            var source = dom.byId("p_origin").innerText;
            if (source.indexOf("来源：") == 0 || source.indexOf("来源:") == 0) {
                source = source.substring(3);
            }
            if (source.indexOf("人民") < 0) {
                if (Bee.existSource(source)) {
                    console.log("已知来源：" + source);
                    Bee.passItem(item);
                    return;
                } else {
                    console.log("未知来源：" + source);
                }
            } else {
                console.log("source:" + source);
                source = "人民网";
            }
            if (source == "") {
                source = "人民网";
            }
            item.source = source;

            var contentNode = dom.byId("p_content");
            contentNode.removeClass("otitle");

            var zdfy = dom.byClass("zdfy", true);
            if (zdfy && zdfy.byTags("a").length > 0) {
                var urls = [];
                var links = zdfy.byTags("a");
                for (var i = 1; i < links.length; i++) {
                    urls.push(links[i].href);
                }
                contentNode.removeClass("zdfy");
                contentNode.removeTags("table");
                item.content = Bee.htmlToJson(contentNode);
                Bee.finishExtractSubUrls(urls, item);
            } else {
                item.content = Bee.htmlToJson(contentNode);
                Bee.finishExtractItem(item);
            }
        } else {
            var contentNode = dom.byClass("text", true);
            if (contentNode == null) {
                console.log("未知格式，跳过");
                Bee.passItem(item)
                return;
            }
            var titleNode = contentNode.byTag("h1", true);
            if (titleNode == null) {
                console.log("未知格式，跳过");
                Bee.passItem(item)
                return;
            }
            item.title = titleNode.innerText;
            contentNode.removeTag("h1");

            var pubText = contentNode.byTag("h2").innerText;
            var time = pubText.substring(pubText.lastIndexOf(" "));
            item.created_at = Bee.convertTime(time);

            var source = pubText.substring(0, pubText.length - time.length).trim();
            if (source.indexOf("来源：") == 0 || source.indexOf("来源:") == 0) {
                source = source.substring(3);
            }
            if (source.indexOf("人民") < 0) {
                if (Bee.existSource(source)) {
                    console.log("已知来源：" + source);
                    Bee.passItem(item);
                    return;
                } else {
                    console.log("未知来源：" + source);
                }
            }
            item.source = source;
            contentNode.removeTag("h2");
            contentNode.removeClass("editor");

            var zdfy = dom.byClass("zdfy", true);
            if (zdfy && zdfy.byTags("a").length > 0) {
                var urls = [];
                var links = zdfy.byTags("a");
                for (var i = 1; i < links.length; i++) {
                    urls.push(links[i].href);
                }
                contentNode.removeClass("zdfy");
                item.content = Bee.htmlToJson(contentNode);
                Bee.finishExtractSubUrls(urls, item);
            } else {
                item.content = Bee.htmlToJson(contentNode);
                Bee.finishExtractItem(item);
            }

        }
    };

    Bee.onSubItemDomLoaded = function(dom, item) {
        var p_title = dom.byId("p_title", true);
        if (p_title) {
            var contentNode = dom.byId("p_content");
            contentNode.removeClass("otitle");
            contentNode.removeClass("zdfy");
            contentNode.removeTags("table");
            item.content = item.content.concat(Bee.htmlToJson(contentNode));
            var hasNext = Bee.continueSubItem(item);
            if (hasNext == false) {
                Bee.finishExtractItem(item);
            }
        } else {
            var contentNode = dom.byClass("text", true);
            if (contentNode == null) {
                Bee.passItem(item);
                return;
            }
            contentNode.removeTag("h1");
            contentNode.removeTag("h2");
            contentNode.removeClass("zdfy");
            contentNode.removeClass("editor");
            item.content = item.content.concat(Bee.htmlToJson(contentNode));
            var hasNext = Bee.continueSubItem(item);
            if (hasNext == false) {
                var deleteImgs = [];
                for (var i = 0; i < item.content.length; i++) {
                    if (item.content[i].img) {
                        var img = item.content[i].img;
                        if (img.width < 100 || img.height < 100) {
                            deleteImgs.push(item.content[i]);
                        }
                    }
                }
                for (var i = 0; i < deleteImgs.length; i++) {
                    item.content.remove(deleteImgs[i]);
                }

                Bee.finishExtractItem(item);
            }
        }
    };


    this.addChannel = function(category, tag, url) {
        Bee.addChannel(category, tag, url);
    };

    this.start = function() {
        Bee.start();
    }
}