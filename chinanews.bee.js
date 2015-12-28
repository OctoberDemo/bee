var ChinanewsBee = new _ChinanewsBee();
function _ChinanewsBee() {

    Bee.setType("www.chinanews.com");
    Bee.setImgReferer("www.chinanews.com");

    Bee.requestNoScript();
    Bee.requestNoCss();
    Bee.requestNoIframe();

    Bee.onListLoaded = function(dom) {
        var items = [];

        var content_list = dom.byClass("content_list", true);
        if (content_list) {
            var links = content_list.byTags("a");
            getItems(links);
        }

        var list = dom.byId("list", true);
        if (list) {
            links = list.byTags("a");
            getItems(links);
        }
        var recomNews = dom.byClass("recomNews", true);
        if (recomNews) {
            links = recomNews.byTags("a");
            getItems(links);
        }

        Bee.finishExtractList(items);

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
        if (item.url.indexOf("www.js.chinanews") >= 0) {
            onJSItemLoaded(dom, item);
            return;
        }
        var con = dom.byId("con", true);
        if (con == null) {
            console.log("未知页面格式：" + item.url);
            Bee.passItem(item);
            return;
        }
        item.title = con.byTag("h1").innerText;
        var BaiduSpider = con.byId("BaiduSpider", true);
        if (BaiduSpider) {
            item.created_at = Bee.convertTime(con.byId("pubtime_baidu").innerText);
            var source = con.byId("source_baidu").innerText;
            if (source.indexOf("来源：") == 0 || source.indexOf("来源:") == 0) {
                source = source.substring(3);
            }
            if (source.indexOf("中新网") < 0 && source.indexOf("中国新闻网") < 0) {
                if (Bee.existSource(source)) {
                    console.log("已知来源：" + source);
                    Bee.passItem(item);
                    return;
                } else {
                    console.log("未知来源：" + source);
                }
            } else {
                console.log("source:" + source);
                source = "中新网";
            }
            if (source == "") {
                source = "中新网";
            }
            item.source = source;

            item.content = [];
            var tupian_div = con.byId("tupian_div", true);
            if (tupian_div) {
                item.content = item.content.concat(Bee.htmlToJson(tupian_div, [], [], imgConverter));
            }
            var left_ph = con.byClass("left_ph");
            while (left_ph != null) {
                item.content = item.content.concat(Bee.htmlToJson(left_ph, [], [], imgConverter));
                left_ph.parentNode.removeChild(left_ph);
                var left_pt = con.byClass("left_pt", true);
                if (left_pt) {
                    item.content = item.content.concat(Bee.htmlToJson(left_pt, [], [], imgConverter));
                    left_pt.parentNode.removeChild(left_pt);
                }
                left_ph = con.byClass("left_ph");
            }

            var left_zw = con.byClass("left_zw");
            item.content = item.content.concat(Bee.htmlToJson(left_zw, [], [], imgConverter));

            Bee.finishExtractItem(item);
        } else {
            console.log("No Baidu Spider!!!");
        }

    };

    function onJSItemLoaded(dom, item) {
        var cont = dom.byId("cont");
        if (cont == null) {
            console.log("未知格式，跳过");
            Bee.passItem(item);
            return;
        }
        item.title = cont.byTag("h1").innerText;
        item.created_at = Bee.convertTime(cont.byId("time").innerText);
        var source = cont.byId("come").innerText;
        if (convertSource(item, source) == false) {
            return;
        }
        cont.removeTag("h1");
        cont.removeId("time");
        cont.removeId("come");
        item.content = Bee.htmlToJson(cont);

        Bee.finishExtractItem(item);
    }

    function convertSource(item, source) {
        if (source.indexOf("来源：") == 0 || source.indexOf("来源:") == 0) {
            source = source.substring(3);
        }
        if (source.indexOf("中新网") < 0 && source.indexOf("中国新闻网") < 0) {
            if (Bee.existSource(source)) {
                console.log("已知来源：" + source);
                Bee.passItem(item);
                return false;
            } else {
                console.log("未知来源：" + source);
            }
        } else {
            console.log("source:" + source);
            source = "中新网";
        }
        if (source == "") {
            source = "中新网";
        }
        item.source = source;
        return true;
    }

    function imgConverter(node) {
        var image = {};
        image.src = node.src;
        image.width = node.naturalWidth;
        image.height = node.naturalHeight;
        if (image.width < 100 || image.height < 100) {
            return null;
        }
        return image;
    }


    this.addChannel = function(category, tag, url) {
        Bee.addChannel(category, tag, url);
    };

    this.start = function() {
        Bee.start();
    }

}