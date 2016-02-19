Bee.setType("www.trends.com.cn");
Bee.setImgReferer("www.trends.com.cn");
Bee.requestNoScript();

Bee.requestNoCss();

Bee.onListDomLoaded = function (dom) {
    var content = dom.byClass("mst_fash_bd", true);
    if (content == undefined) {
        Bee.finishExtractList([]);
        console.log("content == null");
        return;
    }
    var items = [];
    var articles = content.byClasses("cf mst_fash_bt", true);
    for (var i = 0; i < articles.length; i++) {
        var article = articles[i];
        var item = {};
        var info = article.byClass("mst_fs_cont");
        var title = info.byClass("font20").byTag("a");
        item.title = title.attr("title");
        item.url = title.href;

        var timeString = article.byClass("font14 mst_fs_tm").innerText;
        item.created_at = Bee.convertTime(timeString);

        var pic = article.byTag("img");
        if (pic) {
            item.cover_img = {
                src: pic.src,
                weidth: pic.clientWidth,
                height: pic.clientHeight
            }
        }

        var intro = article.byClass("mst_fs_text", true);
        if (intro && intro.innerText.length > 0) {
            item.content = [];
            var desc = {};
            desc.desc = intro.innerText;
            item.content.add(desc);
        }

        var desItem = dom.byClass("mst_fs_label cf", true);
        if (desItem) {
            var tagContents = desItem.byTags("a", true);
            var tags = [];
            for (var j = 0; j < tagContents.length; j++) {
                tags.push(tagContents[j].innerText);
            }
            item.tag = tags.join(" ");
        }

        items.push(item);
    }
    Bee.finishExtractList(items);
};

function getNextString(baseString, indexString) {
    var index = baseString.indexOf(indexString);
    if (index < 0) {
        return "";
    }
    return baseString.substr(index + indexString.length, baseString.length);

}


function addContent(dom, item) {
    var content = dom.byClass("article-border", true);
    if (content == undefined) {
        Bee.finishExtractItem();
        console.log("content == null");
        return;
    }
    var text = content.byClass("text", true);
    if (text) {
        if (item.content == undefined) {
            item.content = Bee.htmlToJson(text);
        } else {
            item.content = item.content.concat(Bee.htmlToJson(text));
        }
    }
    return item.content;
}
Bee.onItemDomLoaded = function (dom, item) {
    var content = dom.byClass("article-border", true);
    if (content == undefined) {
        Bee.finishExtractItem();
        console.log("content == null");
        return;
    }

    //TODO 图片类的暂时不爬
    var galley = dom.byClass("gallery-content", true);
    if (galley) {
        Bee.passItem(item);
        return;
    }

    var infoFix = content.byTag("time", true);
    if (infoFix) {
        var sourceString = infoFix.innerText;
        var source = "";
        source = getNextString(sourceString, " 来源：");
    }

    item.source = source;

    if (source == "" || source.startsWith("时尚网")) {
        item.source = "时尚网";
        var authorString = getNextString(sourceString, "编辑：");
        if (authorString != "") {
            item.author = authorString;
        }
    }

    if (!item.source.startsWith("时尚网")) {
        if (Bee.existSource(source)) {
            console.log("跳过来源：" + item.source);
            Bee.passItem(item);
            return;
        } else {
            console.log("未知来源：" + item.source);
        }
    }

    var itemContent = addContent(dom, item);
    if (itemContent == undefined) {
        Bee.passItem(item);
        return;
    }

    //item.status = 5;

    var page = content.byClass("page", true);
    var urls = [];
    if (page) {
        var tagAs = page.byTags("a");
        if (tagAs.length > 2) {
            for (var i = 0; i < tagAs.length - 1; i++) {
                urls.push(tagAs[i].href);
            }
        }
        if (urls.length > 0) {
            Bee.finishExtractSubUrls(urls, item);
            return;
        }
    }
    Bee.finishExtractItem(item, true);
};

Bee.onSubItemLoaded = function (dom, item) {
    item.content = addContent(dom, item);
    if (item.content.length > 200) {
        console.log("文章过长！！" + item.url);
        Bee.passItem(item);
        return;
    }
    var hasNext = Bee.continueSubItem(item);
    if (hasNext == false) {
        Bee.finishExtractItem(item);
    }
};