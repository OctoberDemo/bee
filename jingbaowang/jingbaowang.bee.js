new _JingbaowangBee();

function _JingbaowangBee() {
    Bee.setType("www.bjd.com.cn");
    Bee.setImgReferer("www.bjd.com.cn");

    Bee.requestNoScript();
    Bee.requestNoCss();
    Bee.requestNoIframe()

    //Bee.debug("http://www.bjd.com.cn/10zt/201512/29/t20151229_10696552.html");

    Bee.onListLoaded = function(dom) {
        var items = [];

        var zj_txtBox = dom.byClass("zj_txtBox");
        var lis = zj_txtBox.byTags("li");
        for (var i = 0; i < lis.length; i++) {
            var li = lis[i];
            var item = {};
            item.title = li.byTag("a").innerText.trim();
            item.url = li.byTag("a").href;
            item.desc = li.byClass("zj_txt").innerText.trim();
            item.class = "news";
            //item.status = 5;
            items.push(item);
        }

        Bee.finishExtractList(items);
    };

    Bee.onItemLoaded = function(dom, item) {
        var zj_info = dom.byClass("zj_info");
        var tds = zj_info.byTags("td");
        if (tds.length != 5) {
            Bee.warning("未知网页格式：" + item.url);
            Bee.passItem(item);
            return;
        }
        var timeString = tds[1].innerText.trim();
        if (timeString.indexOf("发布时间：") >= 0 || timeString.indexOf("发布时间:") >= 0) {
            timeString = timeString.substring(5);
        }
        item.created_at = Bee.convertTime(timeString);

        var sourceString = tds[2].innerText.trim();
        if (sourceString.indexOf("文章来源：") >= 0 || sourceString.indexOf("文章来源:") >= 0) {
            sourceString = sourceString.substring(5).trim();
        }
        if (sourceString.indexOf("北京日报") >= 0 || sourceString.indexOf("北京晚报") >= 0 || sourceString.indexOf("京报网") == 0) {

        } else {
            if (Bee.existSource(sourceString)) {
                console.log("已知来源：" + sourceString);
                Bee.passItem(sourceString);
                return;
            } else {
                console.log("未知来源：" + sourceString);
            }
        }
        if (sourceString.indexOf("京报网网") >= 0) {
            console.log("来源为 京报网网， 跳过");
            Bee.passItem(item);
            return;
        }
        item.source = sourceString;

        item.content = Bee.htmlToJson(dom.byClass("zj_txt"));
        if (item.desc) {
            var desc = {};
            desc.desc = item.desc;
            item.content.add(0, desc);
            delete item.desc;
        }

        Bee.finishExtractItem(item);
    }
}