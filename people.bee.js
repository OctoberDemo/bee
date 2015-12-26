var PeopleBee = new _PeopleBee();
function _PeopleBee() {
    _Bee.apply(this);

    var self = this;

    this.setType("people.com.cn");
    this.setImgReferer("people.com.cn");
    this.requestNoScript();
    this.requestNoCss();
    this.requestNoIframe();

    this.onListLoaded = function(dom) {
        var items = [];
        var lists = dom.byClasses("list_14", true);
        for (var i = 0; i < lists.length; i++) {
            var links = lists[i].byTags("a");
            getItems(links);
        }
        dom.removeClasses("t2_title");
        var dot_14s = dom.byClasses("dot_14", true);
        for (var i = 0; i < dot_14s.length; i++) {
            var links = dot_14s[i].byTags("a");
            getItems(links);
        }
        var ej_right = dom.byClass("ej_right", true);
        if (ej_right) {
            var uls = ej_right.byTags("ul");
            for (var i = 0; i < uls.length; i++) {
                var links = uls[i].byTags("a");
                getItems(links);
            }
        }

        self.finishExtractList(items);

        function getItems(links) {
            for (var i = 0; i < links.length; i++) {
                var item = {};
                item.title = links[i].innerText;
                item.url = links[i].href;
                item.key = self.hashCode(item.url);
                item.class = "news";
//                item.status = 5;
                items.push(item);
            }
        }
    };

    this.onItemLoaded = function(dom, item) {
        var p_title = dom.byId("p_title", true);
        if (p_title) {
            item.title = dom.byId("p_title").innerText;
            item.created_at = self.convertTime(dom.byId("p_publishtime").innerText);

            var source = dom.byId("p_origin").innerText;
            if (source.indexOf("来源：") == 0 || source.indexOf("来源:") == 0) {
                source = source.substring(3);
            }
            if (source.indexOf("人民") < 0) {
                if (self.existSource(source)) {
                    console.log("已知来源：" + source);
                    self.passItem(item);
                    return;
                } else {
                    console.log("未知来源：" + source);
                }
            } else {
                console.log("source:" + source);
                source = "人民网";
            }
            item.source = source;

            var contentNode = dom.byId("p_content");
            contentNode.removeClass("otitle");
            item.content = self.htmlToJson(contentNode);

            var zdfy = dom.byClass("zdfy", true);
            if (zdfy) {
                console.log("需要分页，后续采集");
                self.passItem(item);
                return;
            }

            self.finishExtractItem(item);
        } else {
            var contentNode = dom.byClass("text", true);
            if (contentNode == null) {
                console.log("未知格式，跳过");
                self.passItem(item)
                return;
            }
            item.title = contentNode.byTag("h1").innerText;
            contentNode.removeTag("h1");

            var pubText = contentNode.byTag("h2").innerText;
            var time = pubText.substring(pubText.lastIndexOf(" "));
            item.created_at = self.convertTime(time);

            var source = pubText.substring(0, pubText.length - time.length).trim();
            if (source.indexOf("来源：") == 0 || source.indexOf("来源:") == 0) {
                source = source.substring(3);
            }
            if (source.indexOf("人民") < 0) {
                if (self.existSource(source)) {
                    console.log("已知来源：" + source);
                    self.passItem(item);
                    return;
                } else {
                    console.log("未知来源：" + source);
                }
            }
            item.source = source;
            contentNode.removeTag("h2");
            contentNode.removeClass("editor");

            var zdfy = dom.byClass("zdfy", true);
            if (zdfy) {
                var urls = [];
                var links = zdfy.byTags("a");
                for (var i = 1; i < links.length; i++) {
                    urls.push(links[i].href);
                }
                contentNode.removeClass("zdfy");
                item.content = self.htmlToJson(contentNode);
                self.finishExtractSubUrls(urls, item);
            } else {
                item.content = self.htmlToJson(contentNode);
                self.finishExtractItem(item);
            }

        }
    };

    this.onSubItemDomLoaded = function(dom, item) {
        var p_title = dom.byId("p_title", true);
        if (p_title) {

        } else {
            var contentNode = dom.byClass("text");
            contentNode.removeTag("h1");
            contentNode.removeTag("h2");
            contentNode.removeClass("zdfy");
            contentNode.removeClass("editor");
            item.content = item.content.concat(self.htmlToJson(contentNode));
            var hasNext = self.continueSubItem(item);
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

                self.finishExtractItem(item);
            }
        }
    };
}