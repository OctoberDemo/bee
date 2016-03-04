Bee.setType("house.qq.com");
Bee.setImgReferer("house.qq.com");
Bee.requestNoCss();
Bee.onListLoaded = function (dom) {
    setTimeout(function () {
        var items = [];
        var contentList = null;
        if (Bee.getContentList) {
            contentList = Bee.getContentList(dom);
        } else {
            switch (Bee.getCurTag()) {
                case "上海":
                case "西安":
                    contentList = dom.byClass("mod newslist", true);
                    break;
                case "广东":
                    contentList = dom.byClass("leftList", true);
                    break;
                case '重庆':
                    contentList = dom.byId("page_1", true);
                    break;
                case '成都':
                    contentList = dom.byClass("news_list_con", true);
                    break;
                case '':
                    contentList = dom.byClass("list c", true);
                    break;
                case '福州':
                    contentList = dom.byClass("zxlb w630 f-l", true);
                    break;
                default :
                    contentList = dom.byClass("leftList", true);
                    break;
            }
        }

        if (contentList== null) {
            console.log("emty or unknown type");
            return;
        }

        var lis = contentList.byTags("li");
        for (var i = 0; i < lis.length; i++) {
            var item = {};
            var li = lis[i];
            var a = li.byTag("a", true);
            if (a == undefined) {
                continue;
            }
            item.url = a.href;
            item.title = a.innerText;
            items.push(item);
        }
        console.log(items);
        Bee.finishExtractList(items);
    }, 1000);
};

function loadItem(dom, item) {
    var article = dom.byId("Cnt-Main-Article-QQ", true);
    console.log(article);
    if (article == undefined) {
        console.log("article == undefined");
        Bee.finishExtractItem();
        return;
    }
    var attrib = dom.byClass("tit-bar clearfix", true);
    var sourceString = attrib.byClass("color-a-1").innerText;
    var timeString = attrib.byClass("article-time").innerText;
    item.created_at = Bee.convertTime(timeString);
    if (sourceString.indexOf("腾讯") < 0) {
        if (Bee.existSource(sourceString)) {
            console.log("跳过来源：" + sourceString);
            Bee.passItem(item);
            return;
        } else {
            console.log("未知来源：" + sourceString);
        }
    } else {
        sourceString = "腾讯房产";
    }
    item.source = sourceString;

    var des = article.byClass("titdd-Article", true);
    if (des && des.innerText.length > 0) {
        item.content = [];
        var desc = {};
        desc.desc = des.innerText.replace("[摘要]", "");
        item.content.add(desc);
    }

    article.removeClass("titdd-Article");
    article.removeClass("gallery");
    article.removeTag("table");
    article.removeTags("div");


    var content = Bee.htmlToJson(article);
    var newContent = [];
    if (Bee.getNewContent) {
        newContent = Bee.getNewContent(content);
    } else {
        for (var i = 0; i < content.length; i++) {
            var p = content[i].p;
            if (p == undefined) {
                continue;
            }
            if (p.indexOf("》》》》特别推荐") >= 0) {
                content = content.slice(0, i);
                break;
            }

            if (p.startsWith("相关阅读：")) {
                content = content.slice(0, i);
                break;
            }

            if (p.startsWith("<strong>今日推荐：")) {
                content = content.slice(0, i);
                break;
            }
            if (p.startsWith("扫描下方二维码") || p.startsWith("<strong>扫描下方二维码")) {
                content = content.slice(0, i);
                break;
            }
            if (p.startsWith(">>返回腾讯") || p.startsWith("转播到腾讯微博")) {
                continue;
            }

            if (p.indexOf("》》》相关阅读") >= 0) {
                continue;
            }

            var index = p.indexOf("返回腾讯");
            if (index >= 0) {
                content[i].p = p.substring(0, index);
                newContent.push(content[i]);
                break;
            }
            newContent.push(content[i]);
        }
    }

    if (newContent.length == 0) {
        Bee.passItem(item);
        console.log("pass cause empty content");
        return;
    }
    if (item.content == undefined) {
        item.content = newContent;
    } else {
        item.content = item.content.concat(newContent);
    }
    item.class = "";
//        item.status = 5;
    Bee.finishExtractItem(item);
}

Bee.onItemLoaded = function (dom, item) {
    console.log("item load");

    var pageAll = dom.byClass("page-Article-QQ", true);
    if (pageAll) {
        var lis = pageAll.byTags("li");
        for (var i = 0; i < lis.length; i++) {
            var showAll = lis[i].attr("bosszone", true);
            if (showAll == "showAll") {
                console.log("click");
                lis[i].byTag("a").click();
            }
        }
//            setTimeout(function () {
//                loadItem(dom, item);
//            }, 2000);
        return;
    }
    setTimeout(function () {
        loadItem(dom, item);
    }, 1000);
};