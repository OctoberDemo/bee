var HuanqiuBee = new _HuanqiuBee();
function _HuanqiuBee() {

    Bee.setType("huanqiu.com");
    Bee.setImgReferer("huanqiu.com");

    Bee.requestNoScript();
    Bee.requestNoCss();
    Bee.requestNoIframe();

    Bee.onListLoaded = function(dom) {
        var fallsFlow = dom.byClass("fallsFlow", true);
        var items = [];
        if (fallsFlow) {
            var itemNodes = fallsFlow.byClasses("item");
            for (var i = 0; i < itemNodes.length; i++) {
                var itemNode = itemNodes[i];
                var link = itemNode.byTag("h3").byTag("a");
                var item = {};
                item.title = link.innerText;
                item.url = link.href;
                item.class = "news";
                //item.status = 5;

                var descNode = itemNode.byTag("h5", true);
                descNode.removeTag("em");
                var desc = descNode.innerText;
                if (desc.indexOf(item.title) < 0) {
                    item.desc = desc;
                }
                items.push(item);
            }
        }

        var paneT = dom.byClass("paneT", true);
        if (paneT) {
            paneT.removeTags("strong");
            var links = paneT.byTags("a");
            for (var i = 0; i < links.length; i++) {
                extractLink(links[i]);
            }
        }
        Bee.finishExtractList(items);

        function extractLink(link) {
            var item = {};
            item.title = link.innerText;
            item.url = link.href;
            item.class = "news";
            //item.status = 5;

            items.push(item);
        }
    };

    Bee.onItemLoaded = function(dom, item) {
        var conText = dom.byClass("conText", true);
        if (conText == null) {
            console.log("未知格式，跳过");
            Bee.passItem(item);
            return;
        }
        item.title = conText.byTag("h1").innerText;
        conText.removeTag("h1");

        var pubtime_baidu = dom.byId("pubtime_baidu");
        item.created_at = Bee.convertTime(pubtime_baidu.innerText);

        var source_baidu = dom.byId("source_baidu");
        var source = source_baidu.innerText;
        if (convertSource(item, source) == false) {
            return;
        }

        var text = dom.byId("text");

        var pages = dom.byId("pages", true);
        if (pages) {
            var urls = [];
            var links = pages.byTags("a");
            for (var i = 1; i < links.length - 1; i++) {
                urls.push(links[i].href);
            }
            text.removeId("pages");
            text.removeClass("editorSign");
            text.removeClass("reTopics");
            item.content  = Bee.htmlToJson(text);
            Bee.finishExtractSubUrls(urls, item);
        } else {
            text.removeId("pages");
            text.removeClass("editorSign");
            text.removeClass("reTopics");
            item.content = Bee.htmlToJson(text);
            finishExtractItem(item);
        }
    };

    Bee.onSubItemLoaded = function(dom, item) {
        var text = dom.byId("text");
        text.removeTag("h1");
        text.removeId("pages");
        text.removeClass("editorSign");
        text.removeClass("reTopics");
        item.content = item.content.concat(Bee.htmlToJson(text));
        var hasNext = Bee.continueSubItem(item);
        if (hasNext == false) {
            finishExtractItem(item);
        }
    };

    function finishExtractItem(item) {
        if (item.desc) {
            var desc = {};
            desc.desc = item.desc;
            item.content.add(0, desc);
            delete item.desc;
        }
        Bee.finishExtractItem(item);
    }

    function convertSource(item, source) {
        if (source.indexOf("来源：") == 0 || source.indexOf("来源:") == 0) {
            source = source.substring(3);
        }
        if (source.indexOf("环球") < 0) {
            if (Bee.existSource(source)) {
                console.log("已知来源：" + source);
                Bee.passItem(item);
                return false;
            } else {
                console.log("未知来源：" + source);
            }
        } else {
            console.log("source:" + source);
            source = "环球网";
        }
        if (source == "") {
            source = "环球网";
        }
        item.source = source;
        return true;
    }

    this.addChannel = function(category, tag, url) {
        Bee.addChannel(category, tag, url);
    };

    this.start = function() {
        Bee.start();
    }
}
