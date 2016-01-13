new sinapic();
function sinapic() {
    //chanel url 在index下的 BASEURL；
    Bee.setType("photo.sina.com");
    Bee.setImgReferer("www.sinaimg.cn");
    Bee.requestNoCss();

    Bee.requestNoIframe();

    Bee.onListDomLoaded = function(dom) {
        var jsonData = JSON.parse(dom.body.innerText).data;
        console.log(jsonData.length);
        var items = [];

        function loadList() {
            var data = jsonData.shift();
            if (jsonData.length == 0) {
                Bee.finishExtractList(items);
                return;
            }
            var item = {};
            item.url = data.url;
            item.title = data.name;
            item.key = Bee.hashCode(item.url);
            var sourceString = data.source;
            if (sourceString.indexOf("新浪") < 0) {
                if (Bee.existSource(sourceString)) {
                    console.log("跳过来源：" + sourceString);
                    BeeUtils.addKey("bee", item.key);
                    loadList();
                    return;
                } else {
                    console.log("未知来源：" + sourceString);
                    //为了集中量，暂时这样吧，，
                    if (sourceString != "其他") {
                        item.tag = sourceString;
                    }
                }
            }

            console.log(sourceString);
            item.source = "新浪图片";
            item.created_at = Bee.convertTime(data.createtime);

            if (data.cover_img == "") {
                items.push(item);
                loadList();
                return;
            }
            var img = {};
            img.src = Bee.makeImgJumpUrl(data.cover_img, "www.sinaimg.cn");
            var imgNode = document.createElement("img");
            dom.body.appendChild(imgNode);
            imgNode.src = img.src;
            imgNode.onload = function() {
                img.width = imgNode.clientWidth;
                img.height = imgNode.clientHeight;
                item.cover_img = img;
                items.push(item);
                loadList();
            };
            imgNode.onerror = function() {
                console.log("图片加载失败");
                items.push(item);
                loadList();
            }

        }
        loadList();
    };

    function beeByDom(dom, item) {
        var listContent = dom.byClass("scroll-section clearfix", true);
        if (listContent == undefined) {
            Bee.finishExtractItem();
            return;
        }
        var deses = dom.byId("imageDesc").byClasses("desc-text-item");
        var scrollItems = listContent.byClasses("scroll-item", true);
        var desCount = 0;
        for (var i = 0; i < scrollItems.length; i++) {
            var imgWrap = scrollItems[i].byClass("img-wrap", true);
            if (imgWrap && imgWrap.byTag("img", true) != undefined) {
                var img = {};
                var des = deses[desCount].innerText.trim();
                img.desc = des;
                desCount++;
                if (des.indexOf("感谢观看本期《看见》") != -1) {
                    continue;
                }
                var imgTag = imgWrap.byTag("img");
                img.src = Bee.makeImgJumpUrl(imgTag.src, "www.sina.com");
                img.width = imgTag.clientWidth;
                img.height = imgTag.clientHeight;
                item.content.imgs.push(img);
            }
        }
    }
    Bee.onItemDomLoaded = function(dom, item) {
        item.class = "image";
        item.content = {};
        item.content.imgs = [];
        //item.status = 5;
        var page = this.getWindow().PAGE;
        if(page == undefined || page.FullScreen == undefined || page.FullScreen.___ytreporp___ == undefined) {
            beeByDom(dom, item);
            return;
        }
        var images = page.FullScreen.___ytreporp___.opt.data.images;
        loadImage();

        function loadImage() {
            if (images == undefined) {
                Bee.passItem(item);
                return;
            }
            if (images.length == 0) {
                if (item.cover_img == undefined) {
                    item.cover_img = {};
                    item.cover_img.src = item.content.imgs[0].src;
                    item.cover_img.width = item.content.imgs[0].width;
                    item.cover_img.height = item.content.imgs[0].height;
                }
                Bee.finishExtractItem(item);
                return;
            }
            var imgInfo = images.shift();
            var url = imgInfo.image_url;
            if (url == "") {
                loadImage();
                return;
            }
            var img = {};
            img.desc = imgInfo.intro.trim();
            if (img.desc.indexOf("感谢观看本期《看见》") != -1) {
                loadImage();
                return;
            }
            img.src = Bee.makeImgJumpUrl(url, "www.sinaimg.cn");
            var imgNode = document.createElement("img");
            dom.body.appendChild(imgNode);
            imgNode.src =  img.src;
            imgNode.onerror = function() {
                console.log("error");
                loadImage();
            };
            imgNode.onload = function() {
                img.width = imgNode.clientWidth;
                img.height = imgNode.clientHeight;
                item.content.imgs.push(img);
                loadImage();
            }
        }
    };
}