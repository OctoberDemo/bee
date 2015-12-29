var SohuPicBee = new _SohuPicBee();
function _SohuPicBee() {

    Bee.setType("www.sohu.com");
    Bee.setImgReferer("www.sohu.com");
    Bee.setRefreshTime(1000*60*10);
    Bee.onListDomLoaded = function(dom) {
        var pp = dom.byClass("pp", true);
        var lis = pp.byTags("li");
        var items = [];
        for (var i = 0; i < lis.length; i++) {
            var item = {};
            var li = lis[i];
            var a = li.byTag("a");
            item.url = a.href;
            item.title = a.byClass("desc").innerText;
            items.push(item);
        }
        console.log(items);
        Bee.finishExtractList(items);
    };

    Bee.onItemLoaded = function(dom, item) {
        var groupData = this.getWindow()["groupData"];
        var pics = groupData.items;
        var meta = groupData.meta;
        var sourceString = meta.src.title;
        if (sourceString.length == 0) {
            sourceString = "搜狐大视野";
        }
        if (sourceString.indexOf("搜狐") < 0) {
            if (Bee.existSource(sourceString)) {
                console.log("跳过来源：" + sourceString);
                Bee.passItem(item);
                return;
            } else {
                console.log("未知来源：" + sourceString);
            }
        }
        item.source = sourceString;
        item.created_at = meta.date / 1000;
        item.class = "image";
        item.content = {};
        item.content.imgs = [];
        loadImage();

        function loadImage() {
            if (pics == undefined) {
                Bee.passItem(item);
                return;
            }
            if (pics.length == 0) {
                item.cover_img = {};
                item.cover_img.src = item.content.imgs[0].src;
                item.cover_img.width = item.content.imgs[0].width;
                item.cover_img.height = item.content.imgs[0].height;
                Bee.finishExtractItem(item);
                return;
            }
            var imgInfo = pics.shift();
            var img = {};
            img.desc = imgInfo.desc;
            img.src = Bee.makeImgJumpUrl(imgInfo.pic3, "163.com");
            var imgNode = document.createElement("img");
            dom.body.appendChild(imgNode);
            imgNode.src = img.src;
            imgNode.onload = function() {
                img.width = imgNode.clientWidth;
                img.height = imgNode.clientHeight;
                item.content.imgs.push(img);
                loadImage();
            }
        }
    };

    this.addChannel = function(category, tag, url) {
        Bee.addChannel(category, tag, url);
    };

    this.start = function() {
        Bee.start();
    }
}