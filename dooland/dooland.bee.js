var DoolanBee = new _DoolandBee();
function _DoolandBee() {

    var self = this;

    var magazines = [];

    this.addMagazine = function(category, tag, name, url) {
        var item = {};
        item.category = category;
        item.tag = tag;
        item.name = name;
        item.url = url;
        magazines.push(item);
    };

    this.start = function() {
        if (mRootView == null) {
            console.log("setTimeout(this.start, 100)");
            setTimeout(self.start, 100);
        } else {
            var item = magazines.shift();
            if (item) {
                var magazineWeb = new BeeWebView();
                Bee.getNoScriptHtml(item.url, function(html) {
                    magazineWeb.loadDataWithBaseURL(html.innerHTML);
                });
                Bee.addWebView(magazineWeb);

                magazineWeb.setOnPageFinishListener(function() {
                    var dom = magazineWeb.getDom();
                    var mag_intr = dom.byClass("mag-intr");
                    var link = mag_intr.byTag("a");
                    Bee.addChannel("", item.tag, item.name, link.href);

                    var past_mag = dom.byClass("past-mag");
                    var li = past_mag.byTag("li", true);
                    if (li) {
                        var link = li.byTag("a");
                        Bee.addChannel(item.category, item.tag, item.name, link.href);
                    }

                    Bee.start();
                });
            } else {
                console.log("全部完成！");
            }
        }
    };

    Bee.setType("m.dooland.com");
    Bee.setImgReferer("m.dooland.com");

    Bee.requestNoScript();

    Bee.onListLoaded = function(dom) {
        var items = [];
        var jx_Article = dom.byClass("jx_Article", true);
        if (jx_Article) {
            var links = jx_Article.byTags("a");
            for (var i = 0; i < links.length; i++) {
                var link = links[i];
                var item = {};
                item.title = link.attr("title");
                item.url = link.href;
                item.status = 5;
                items.push(item);
            }
        }
        if (items.length > 0) {
            Bee.finishExtractList(items);
        } else {
            if (Bee.getChannelList().length == 0) {
                self.start();
            } else {
                Bee.start();
            }
        }
    };

    Bee.onItemLoaded = function(dom, item) {
        dom.removeClass("share-button");
        var date = dom.byClass("date");
        var tags = date.innerText;
        tags = tags.substring(tags.indexOf("关键字") + 4);
        item.tag = tags + " " + Bee.getCurChannel().tag;
        item.source = Bee.getCurChannel().source;
        item.content = Bee.htmlToJson(dom.byId("article"));
        var now = new Date();
        item.created_at = Bee.convertTime(now.toLocaleDateString());

        var dingUrl = "http://jcloud.jndroid.com/request?page=http://source.greatlibrary.jndroid.cn/statistics/ding.html";
        liteAjax(dingUrl, function(e) {}, "post", "杂志", false);

        Bee.finishExtractItem(item, true);

        if (Bee.getChannelList().length == 0) {
            mRootView.removeAllViews();
            self.start();
        } else {
            Bee.start();
        }
    }


}