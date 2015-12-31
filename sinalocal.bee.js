var SinaLocalBee = (function () {

    Bee.setType("http://www.sina.com.cn/");
    Bee.setImgReferer("http://www.sina.com.cn/");

    Bee.onListLoaded = function(dom) {
        setTimeout(function() {
            var items = [];
            var listArticle = dom.byId("listArticle_page_0");
            var h3s = listArticle.byTags("h3");
            for (var i = 0; i < h3s.length; i++) {
                var a = h3s[i].byTag("a");
                var item = {};
                item.url = a.href;
                item.title = a.innerText;
                items.push(item);
            }
            Bee.finishExtractList(items);
        }, 5000);
    };

    Bee.onItemLoaded = function(dom, item) {
        var time_elem = dom.byClass("source-time");
        if (time_elem) {
        } else {
            Bee.passItem(item);
            return;
        }
        time_elem = time_elem.byTag("span");
        var time_string = time_elem.innerText.trim();
        item.created_at = getTime(time_string);

        var source_elem = time_elem.nextSibling.firstChild;
        if (source_elem) {
        } else {
            Bee.passItem(item);
            return;
        }
        item.source = source_elem.innerText;
        if (item.source.indexOf("新浪") < 0) {
            if (Bee.existSource(item.source)) {
                console.log("跳过来源：" + item.source);
                Bee.passItem(item);
                return;
            } else {
                console.log("未知来源：" + item.source);
            }
        }
        var content_elem = dom.byClass("article-body main-body", true);
        if (content_elem) {
        } else {
            Bee.passItem(item);
            return;
        }
        var page_elem = dom.byClass("page", true);
        if (page_elem) {
            var suburls = [];
            var next_pages = page_elem.byTags("a");
            for (var i = 0; i < next_pages.length - 1; ++i) {
                suburls.push(next_pages[i].href);
            }
            content_elem.removeClass("page");
            content_elem.removeClasses("article-video");
            content_elem.removeClasses("artice-pic");
            content_elem.removeClass("news_weixin_ercode clear tc");
            content_elem.removeClass("weiboListBox otherContent_01");
            item.content = refineItemContent(Bee.htmlToJson(content_elem));
            Bee.finishExtractSubUrls(suburls, item);
        } else {
            content_elem.removeClasses("article-video");
            content_elem.removeClasses("artice-pic");
            content_elem.removeClass("news_weixin_ercode clear tc");
            content_elem.removeClass("weiboListBox otherContent_01");
            item.content = refineItemContent(Bee.htmlToJson(content_elem));
            Bee.finishExtractItem(item);
        }

        function getTime(time_string) {
            var fields = time_string.split(/\s/);
            var dates = fields[0].split('-');
            var clocks = fields[1].split(':');
            var y = parseInt(dates[0]), m = parseInt(dates[1]) - 1,
                d = parseInt(dates[2]);
            var h = parseInt(clocks[0]), mm = parseInt(clocks[1]), s = 0;
            var date = new Date(y, m, d, h, mm, s);
            return date.getTime() / 1000;
        }
    };

    Bee.onSubItemLoaded = function(dom, item) {
        var content_elem = dom.byClass("article-body main-body");
        content_elem.removeClass("page");
        content_elem.removeClass("article-video");
        content_elem.removeClass("artice-pic");
        content_elem.removeClass("news_weixin_ercode clear tc");
        var subContent = refineItemContent(Bee.htmlToJson(content_elem));
        item.content = item.content.concat(subContent);

        var result = Bee.continueSubItem(item);
        if (result == false) {
            console.log(JSON.stringify(item.content));
            Bee.finishExtractItem(item);
        }
    };

    function refineItemContent(content_json) {
        var new_content_json = [];
        for (var i = 0; i < content_json.length; ++i) {
            if (content_json[i].img) {
                var img_src = content_json[i].img.src;
                if (img_src.endsWith("_h60.jpg")) {
                    continue;
                }
            } else if (content_json[i].p) {
                var ignoreKeywords = ['热点新闻：', '相关报道：', '延伸阅读：'];
                for (var j = 0; j < ignoreKeywords.length; ++j) {
                    if (content_json[i].p.indexOf(ignoreKeywords[j]) >= 0) {
                        return new_content_json;
                    }
                }
            }
            new_content_json.push(content_json[i]);
        }
        return new_content_json;
    }

    return {
        addChannel: function(category, tag, url) {
            Bee.addChannel(category, tag, url);
        },
        start: function() {
            Bee.start();
        },
        debug: function(itemUrl) {
            Bee.debug(itemUrl);
        }
    };

})();