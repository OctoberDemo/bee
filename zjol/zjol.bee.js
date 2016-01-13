var ZjolBee = new _ZjolBee();

function _ZjolBee() {

    var self = this;

    this.openPaper = function(baseUrl) {
        liteAjax(baseUrl, function(e) {
            var url = e.substring(e.indexOf("URL=") + 4);
            url = url.substring(0, url.indexOf("\""));
            url = baseUrl + url;

            setTimeout(function() {
                var webView = new BeeWebView();
                Bee.addWebView(webView);
                webView.loadUrl(url);
                webView.setOnPageFinishListener(function() {
                    var dom = webView.getDom();
                    var main_ednav_nav = dom.byClass("main-ednav-nav");
                    var links = main_ednav_nav.byTags("a", true);
                    for (var i = 0; i < links.length; i++) {
                        var link = links[i];
                        if (link.attr("id") == "pageLink") {
                            var tag = link.innerText;
                            tag = tag.substring(tag.indexOf(":") + 1);
                            tag = tag.substring(tag.indexOf("：") + 1);
                            if (tag.indexOf("广告") >= 0) {
                                continue;
                            }
                            if (tag.indexOf("今日购") >= 0) {
                                continue;
                            }
                            if (tag.indexOf("码上生活") >= 0) {
                                continue;
                            }
                            tag = (tag + " 浙江").trim();

                            console.log(tag + "|" + link.href);
                            Bee.addChannel("", tag, link.href);
                        }

                    }
                    Bee.removeView(webView);
                    Bee.start();
                });
            }, 1000);
        });
    };

    var source;

    this.setSource = function(s) {
        source = s;
    };

    this.tagToCategory = function(tag) {
        return "";
    };

    Bee.requestNoScript();
    Bee.requestNoCss();

    Bee.onListLoaded = function(dom) {
        var articlenav_list = dom.byClass("main-ed-articlenav-list");
        var links = articlenav_list.byTags("a");
        var items = [];
        for (var i = 0; i < links.length; i++) {
            var item = {};
            item.url = links[i].href;
            item.class = "news";
            //item.status = 5;
            items.push(item);
        }
        Bee.finishExtractList(items);
    };

    Bee.onItemLoaded = function(dom, item) {

        item.title = dom.byClass("main-article-title").innerText;
        item.content = Bee.htmlToJson(dom.byClass("main_ar_pic_text"));
        item.content = item.content.concat(Bee.htmlToJson(dom.byClass("main-article-con")));

        var now = new Date();
        item.created_at = Bee.convertTime(now.toLocaleDateString());

        var curChannel = Bee.getCurChannel();
        if (curChannel) {
            item.category = self.tagToCategory(curChannel.tag);
        }
        item.source = source;

        Bee.finishExtractItem(item);
    };
}