var XinhuaBee = new _XinhuaBee();
function _XinhuaBee() {

    Bee.setType("www.news.cn");
    Bee.setImgReferer("www.news.cn");
    Bee.setRefreshTime(1000 * 60 * 10);
    Bee.onListLoaded = function (dom) {
        var pageButton = dom.byClass("moreBtn", true);
        if (pageButton) {
            pageButton.click();
        }
        setTimeout(function () {
            var items = [];
            var dataList = dom.byClasses("dataList");
            for (var j = 0; j < dataList.length; j++) {
                var lis = dataList[j].byClasses("clearfix", true);
                if (lis == undefined) {
                    continue;
                }
                for (var i = 0; i < lis.length; i++) {
                    var a = lis[i].byTag("a", true);
                    if (a == undefined) {
                        continue;
                    }
                    var item = {};
                    item.url = a.href;
                    item.title = a.innerText;
                    var listImg = lis[i].byTag("img", true);
                    if (listImg) {
                        var image = {};
                        image.src = listImg.src;
                        image.height = listImg.clientHeight;
                        image.width = listImg.clientWidth;
                        item.cover_img = image;
                    }
                    var des = lis[i].byClass("summary", true);
                    if (des && des.innerText.length > 0) {
                        item.content = [];
                        var desc = {};
                        desc.desc = des.innerText;
                        item.content.add(desc);
                    }
                    items.push(item);
                }
            }

            Bee.finishExtractList(items);
        }, 1000);
    };

    function creatContent(article, item) {
        article.removeId("videoArea");
        article.removeId("div_currpage");
        var content = Bee.htmlToJson(article);
        if (item.content) {
            item.content = item.content.concat(content);
        } else {
            item.content = content;
        }
        return item;
    }
    Bee.onItemDomLoaded = function (dom, item) {

        var article = dom.byClass("article", true);
        if (article == undefined) {
            console.log("article == undefined");
            Bee.finishExtractItem();
            return;
        }
        var attrib = dom.byClass("source");
        var sourceString = attrib.byId("source").innerText;
        if (sourceString.indexOf("新华") >= 0) {
            sourceString = "新华网";
        } else {
            if (Bee.existSource(sourceString)) {
                console.log("跳过来源：" + sourceString);
                Bee.passItem(item);
                return;
            } else {
                console.log("未知来源：" + sourceString);
            }
        }
        item.source = sourceString;
        var timeString = attrib.byClass("time").innerText;
        item.created_at = Bee.convertTime(timeString);
        item.class = "";
        var isPages = article.byId("div_currpage", true);
        item = creatContent(article, item);
        if (isPages) {
            isPages.removeClass("nextpage");
            var as = isPages.byTags("a");
            var subUrls = [];
            for (var i = 0; i < as.length; i++) {
                subUrls.push(as[i].href);
            }
            Bee.finishExtractSubUrls(subUrls, item);
        } else {
            Bee.finishExtractItem(item);
        }
    };

    Bee.onSubItemLoaded = function(dom, item) {
        var article = dom.byClass("article", true);
        item = creatContent(article, item);
        var result = Bee.continueSubItem(item);
        if (result == false) {
            Bee.finishExtractItem(item);
        }
    };

    this.addChannel = function(category, tag, url) {
        Bee.addChannel(category, tag, url);
    };

    this.start = function() {
        Bee.start();
    }
}