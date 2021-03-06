/**
 * Bee说明
 *
 * 蜜蜂主要方法：
 * onListLoaded -> 当列表页加载完成后的回调，参数为dom树，开发者需要在此提取出列表中的item
 * onItemLoaded -> 当详情页加载完成后的回调，参数为dom树，开发者需要在此提取文章的内容
 * finishExtractList -> 完成列表页的爬取后调用该方法，传入item数组
 * finishExtractItem -> 完成详情页的爬取后调用该方法，传入item
 * addChannel -> 增加一个频道
 * setType -> 设置该蜜蜂的名字空间，用于文章的判重
 * setImgReferer -> 设置一个referer，设置后content及cover_img中的图片均会通过云端加速加载，可用于防盗链
 * setRefreshTime -> 设置蜜蜂多久重启一次
 * start -> 蜜蜂开始运行
 * debug -> 传入一个详情页url，对其调试，爬取结果不会上传
 *
 * 工具方法：
 * hashCode -> 字符串的hashcode，主要用于文章判重
 * scrollToBottom -> 将某个dom滑到底部
 * convertTime -> 将字符串时间转换为以秒计数的时间
 * htmlToJson -> 将一个htmlNode转换为Json格式的内容，参数1为htmlNode，参数2为需要排除的文字，参数3为需要排除的图片
 * makeImgJumpUrl -> 图片通过云端加速加载
 *
 * 爬得的文章字段：
 * title -> 标题
 * source -> 来源
 * status -> 状态，默认设置为2，设置为5可进行调试
 * created_at -> 创建时间
 * class -> 形式类型，如video，image等，如不指定，默认为文字类型
 * category -> 内容分类，如军事、美食等
 * tag -> 标签，可缺省，也可以为多个，推荐系统可能会用到
 * url -> 原始链接
 * content -> 内容，Json格式
 * cover_img -> 封面图片，Json格式
 * key -> 该蜜蜂下文章的唯一标识，用于文章的判重
 *
 */
var Bee = new _Bee();
function _Bee() {
    this.knownSource = "豆瓣一刻|互动百科|长江网|南都周刊|搜狐|糗百|163摄影|果壳网|中国日报|中青评论|国际在线|163新闻|百度百家|"
        + "参考消息网|喷嚏网|亚太日报|知乎日报|北京晨报|美食天下|周末画报|modernweekly|财新网|《财新周刊》|观点网|观察者|大河网|" +
        "法制晚报|环球|澎湃|新华网|中国新闻网|奥一网|第一财经|南方都市报|京华网|京华网综合";

    var self = this;

    var debug = false;
    var type = "bee";
    var imgReferer = null;

    var channelList = [];
    var curChannel;
    var detailItems = [];
    var subItems = [];

    var root = null;
    var listWebView = null;
    var itemWebView = null;
    var subItemWebView = null;
    var noScript = false;
    var noCss = false;
    var noIframe = false;

    this.onListLoaded = null;
    this.onItemLoaded = null;
    this.onSubItemLoaded = null;
    this.onListDomLoaded = null;
    this.onItemDomLoaded = null;
    this.onSubItemDomLoaded = null;

    this.getChannelList = function() {
        return channelList;
    };

    this.getListWebView = function() {
        return listWebView;
    };

    this.getDetailWebView = function() {
        return itemWebView;
    };

    this.debug = function(itemUrl) {
        if (root == null) {
            setTimeout(function() {
                self.debug(itemUrl);
            }, 100);
            return;
        }

        debug = true;
        var item = {};
        item.url = itemUrl;
        var items = [];
        items.push(item);

        this.finishExtractList(items);
    };

    this.requestNoScript = function() {
        noScript = true;
    };

    this.requestNoCss = function() {
        noCss = true;
    };

    this.requestNoIframe = function() {
        noIframe = true;
    };

    this.addChannel = function(category, tagOrSourceOrUrl, sourceOrUrl, url) {
        var channel = {};
        channel.category = category;
        if (url == undefined && sourceOrUrl == undefined) {
            channel.url = tagOrSourceOrUrl;
        } else {
            if (url == undefined) {
                channel.tag = tagOrSourceOrUrl;
                channel.url = sourceOrUrl;
            } else {
                channel.tag = tagOrSourceOrUrl;
                channel.source = sourceOrUrl;
                channel.url = url;
            }
        }
        channelList.push(channel);
    };

    this.setType = function(t) {
        type = t;
    };

    this.setImgReferer = function(referer) {
        imgReferer = referer;
    };

    this.existSource = function(source) {
        var url = "http://fw.jndroid.com/greatlibrary/source/exist?source=" + source;
        var result = true;
        liteAjax(url, function(e) {
            var json = JSON.parse(e);
            result = !(json.err_no == 0 && json.result == 0);
        }, "get", "", false);
        return result;
    };

    this.isKnownSource = function(src) {
        return this.knownSource.indexOf(src) >= 0;
    };

    this.getCurCategory = function() {
        if (curChannel) {
            return curChannel.category;
        }
        return "";
    };

    this.getCurTag = function() {
        if (curChannel && curChannel.tag) {
            return curChannel.tag;
        }
        return "";
    };

    this.getCurChannel = function() {
        return curChannel;
    };

    this.setRefreshTime = function(t) {
        //var rand = Math.floor((Math.random() - 0.5) * t / 10);
        //setTimeout(function() {
        //    location.reload();
        //}, t + rand);
    };

    this.start = function() {
        if (debug) {
            return;
        }
        if (root == null) {
            setTimeout(function() {
                self.start();
            }, 100);
            return;
        }
        if (channelList.length == 0) {
            BeeUtils.log("全部爬取成功");
            postFinishMessage();
            return;
        }
        curChannel = channelList.shift();
        detailItems.clear();

        if (listWebView != null) {
            root.removeView(listWebView);
        }
        listWebView = new BeeWebView();
        listWebView.setBorder(2, 0xff666666);
        root.addView(listWebView, 0);

        if (self.onListLoaded) {
            listWebView.setOnPageFinishListener(function () {
                var dom = listWebView.getDom();
                self.onListLoaded.call(listWebView, dom);
            });
        }
        if (self.onListDomLoaded) {
            listWebView.setOnDomLoadedListener(function () {
                var dom = listWebView.getDom();
                self.onListDomLoaded.call(listWebView, dom);
            });
        }

        if (noScript) {
            self.getNoScriptHtml(curChannel.url, function(html) {
                listWebView.loadDataWithBaseURL(html.innerHTML);
            });
            listWebView.setSrcUrl(curChannel.url);
        } else {
            var url = 'javascript:"<script>location.replace(\''+curChannel.url+'\')<\/script>"';
            listWebView.loadUrl(url);
        }
    };

    window.onerror = function() {
        console.log("Error!!!");
        postFinishMessage();
    };

    function postFinishMessage() {
        var parentWin = window.parent;
        if (parentWin) {
            parentWin.postMessage("finish", "*");
        }
        if (window.this_is_jcloud) {
            window.close();
        }
    }

    this.finishExtractList = function (items) {
        for (var i = 0; i < Math.min(5, items.length); i++) {
            var item = items[i];
            if (item.key == undefined) {
                item.key = self.hashCode(item.url);
            }
            if (debug == false && item.key && BeeUtils.exist(type, item.key)) {
                continue;
            }
            detailItems.push(item);
        }
        BeeUtils.log("共有" + detailItems.length + "条数据需要处理");
        loadItem();
    };

    this.finishExtractSubUrls = function(urls, item) {
        subItems = urls;
        loadSubItem(item);
    };

    function loadItem() {
        if (detailItems.length <= 0) {
            if (debug == false) {
                BeeUtils.log(curChannel.category + "全部处理完成");
            }
            self.start();
            return;
        }

        var item = detailItems.shift();
        if (itemWebView != null) {
            root.removeView(itemWebView);
        }
        itemWebView = new BeeWebView();
        itemWebView.setBorder(2, 0xff666666);
        root.addView(itemWebView);
        if (self.onItemLoaded) {
            itemWebView.setOnPageFinishListener(function () {
                var dom = itemWebView.getDom();
                self.onItemLoaded.call(itemWebView, dom, item);
            });
        }
        if (self.onItemDomLoaded) {
            itemWebView.setOnDomLoadedListener(function() {
                var dom = itemWebView.getDom();
                self.onItemDomLoaded.call(itemWebView, dom, item);
            });
        }
        if (noScript) {
            self.getNoScriptHtml(item.url, function(html) {
                itemWebView.loadDataWithBaseURL(html.innerHTML);
            });
            itemWebView.setSrcUrl(item.url);
        } else {
            var url = 'javascript:"<script>location.replace(\''+item.url+'\')<\/script>"';
            itemWebView.loadUrl(url);
        }
    }

    this.continueSubItem = function(item) {
        return loadSubItem(item);
    };

    function loadSubItem(item) {
        if (subItems.length == 0) {
            return false;
        }
        var url = subItems.shift();
        if (subItemWebView != null) {
            root.removeView(subItemWebView);
        }
        subItemWebView = new BeeWebView();
        subItemWebView.setBorder(2, 0xff666666);
        root.addView(subItemWebView);
        if (self.onSubItemLoaded) {
            subItemWebView.setOnPageFinishListener(function() {
                var dom = subItemWebView.getDom();
                self.onSubItemLoaded.call(subItemWebView, dom, item);
            });
        }
        if (self.onSubItemDomLoaded) {
            subItemWebView.setOnDomLoadedListener(function() {
                var dom = subItemWebView.getDom();
                self.onSubItemDomLoaded.call(subItemWebView, dom, item);
            });
        }
        if (noScript) {
            self.getNoScriptHtml(url, function(html) {
                subItemWebView.loadDataWithBaseURL(html.innerHTML);
            });
            subItemWebView.setSrcUrl(url);
        } else {
            url = 'javascript:"<script>location.replace(\''+url+'\')<\/script>"';
            subItemWebView.loadUrl(url);
        }
        return true;

    }

    this.getNoScriptHtml = function(url, callback) {
        var html;
        var async = false;
        if (callback) {
            async = true;
        }
        liteAjax(url, function(d) {
            html = document.createElement("html");
            html.innerHTML = d;
            var scripts = html.getElementsByTagName("script");
            while (scripts.length > 0) {
                var script = scripts[0];
                script.parentNode.removeChild(script);
            }

            if (noCss) {
                var links = html.getElementsByTagName("link");
                while (links.length > 0) {
                    var link = links[0];
                    link.parentNode.removeChild(link);
                }
            }

            if (noIframe) {
                var iframes = html.getElementsByTagName("iframe");
                while (iframes.length > 0) {
                    var iframe = iframes[0];
                    iframe.parentNode.removeChild(iframe);
                }
            }

            var host = getHost(url);
            var as = html.getElementsByTagName("a");
            for (var i = 0; i < as.length; i++) {
                var a = as[i];
                var href = a.getAttribute("href");
                if (href != null && href.indexOf("http") < 0) {
                    a.href = getAbsoluteUrl(url, href);
                }
            }
            var imgs = html.getElementsByTagName("img");
            for (var i = 0; i < imgs.length; i++) {
                var img = imgs[i];
                var src = img.getAttribute("src");
                if (src != null && src.indexOf("http") < 0 && src.indexOf("data:") != 0) {
                    img.src = getAbsoluteUrl(url, src);
                }
            }

            if (callback) {
                callback.call(this, html);
            }

            function getAbsoluteUrl(srcUrl, relatetiveUrl) {
                var absoluteUrl = "";
                if (relatetiveUrl.indexOf("/") == 0) {
                    absoluteUrl = "http://" + host + relatetiveUrl;
                } else {
                    var slash = srcUrl.lastIndexOf("/");
                    absoluteUrl = srcUrl.substring(0, slash + 1) + relatetiveUrl;
                }
                return absoluteUrl;
            }
        }, "get", "", async);
        return html;
    };

    var getHost = function(url) {
        var host = "null";
        if(typeof url == "undefined"
            || null == url)
            url = window.location.href;
        var regex = /.*\:\/\/([^\/]*).*/;
        var match = url.match(regex);
        if(typeof match != "undefined"
            && null != match)
            host = match[1];
        return host;
    };

    this.finishExtractItem = function(item, oneByone, test) {
        if (item == undefined) {
            loadItem();
            return;
        }
        if (debug == false && BeeUtils.exist(type, item.key)) {
            loadItem();
            return;
        }

        if (oneByone != true && test != true) {
            var timeGap = (new Date()).getTime() - item.created_at * 1000;
            console.log("timeGap:" + (timeGap / 1000 / 60) + "min");
            if (timeGap > 8 * 3600 * 1000) {
                this.passItem(item);
                return;
            }
        }

        var key = item.key;
        delete item.key;

        if (typeof item.content == "string") {
            item.content = JSON.parse(item.content);
        }

        if (imgReferer != null) {
            if (item.cover_img && item.cover_img.src.indexOf("fw.mb.lenovomm.com") < 0) {
                item.cover_img.src = this.makeImgJumpUrl(item.cover_img.src, imgReferer);
            }
            for (var i = 0; i < item.content.length; i++) {
                var img = item.content[i].img;
                if (img && img.src.indexOf("fw.mb.lenovomm.com") < 0) {
                    item.content[i].img.src = self.makeImgJumpUrl(img.src, imgReferer);
                }
            }
        }

        if (item.cover_img == undefined) {
            for (var i = 0; i < item.content.length; i++) {
                if (item.content[i].img) {
                    if (item.content[i].img.width > 150 && item.content[i].img.height > 150) {
                        var ratio = item.content[i].img.width / item.content[i].img.height;
                        if (ratio > 0.5 && ratio < 2) {
                            item.cover_img = item.content[i].img;
                            break;
                        }
                    }
                }
            }
        }

        if (item.category == undefined) {
            item.category = self.getCurCategory();
        }

        var tag = self.getCurTag();
        if (tag != "") {
            if (item.tag == undefined) {
                item.tag = tag;
            } else {
                if (item.tag.indexOf(tag) < 0) {
                    item.tag = item.tag + " " + tag;
                }
            }
        }

        if (item.status == undefined) {
            item.status = 2;
        }

        if (debug || test) {
            console.log(item);
            return;
        }
        item.title = BeeUtils.fullToHalf(item.title.trim());
        item.source = item.source.trim();
        if (item.source == "") {
            item.source = type;
        }

        if (item.category) {
            item.category = item.category.trim();
        }
        item.content = JSON.stringify(item.content);
        console.log(item);
        var result = BeeUtils.putModel(item);
        if (result) {
            BeeUtils.log("已成功爬取：" + item.title);
            BeeUtils.addKey(type, key);

            var dingUrl = "http://jcloud.jndroid.com/request?page=http://source.greatlibrary.jndroid.cn/statistics/ding.html";
            liteAjax(dingUrl, function(e) {}, "post", item.source, false);

            if (oneByone != true) {
                loadItem();
            }
        } else {
            self.warning(item.source + "来源文章上传失败");
            if (oneByone != true) {
                loadItem();
            }
        }
    };

    this.passItem = function(item) {
        if (item) {
            var checkUrl = "http://jcloud.jndroid.com/request?page=http://greatlibrary.jndroid.cn/checkExist/";
            var postData = {};
            postData.title = item.title;
            postData.noRecord = true;
            liteAjax(checkUrl, function(e) {}, "post", JSON.stringify(postData), false);

            BeeUtils.addKey(type, item.key);
        }
        loadItem();
    };

    this.log = function(msg) {
        var d = new Date();
        console.log(d.toLocaleString() + " | "  + msg);
    };

    this.warning = function(msg) {
        BeeUtils.warning(msg);
    };

    this.hashCode = function(string) {
        return BeeUtils.hashCode(string);
    };

    this.scrollToBottom = function(dom) {
        BeeUtils.scrollToBottom(dom);
    };

    this.convertTime = function(timeString) {
        var date = BeeUtils.formatTime(timeString);
        return parseInt(date.getTime() / 1000);
    };

    this.convertSource = function(sourceString, siteSource) {
        sourceString = sourceString.trim();
        if (sourceString.indexOf("来源：") == 0 || sourceString.indexOf("来源:") == 0) {
            sourceString = sourceString.substring(3);
        }
        sourceString = sourceString.trim();

        var siteSources = [];
        if (Utils.isArray(siteSource)) {
            siteSources = siteSource;
        } else {
            siteSources.push(siteSource);
        }
        for (var i = 0; i < siteSources.length; i++) {
            if (sourceString.indexOf(siteSources[i]) >= 0) {
                if (curChannel.source) {
                    return curChannel.source;
                } else {
                    return sourceString;
                }
            }
        }
        if (Bee.existSource(sourceString)) {
            console.log("已知来源：" + sourceString);
            return null;
        } else {
            console.log("未知来源：" + sourceString);
            return sourceString;
        }
    };

    this.convertImg = function(imgNode) {
        var img = {};
        if (imgReferer) {
            img.src = self.makeImgJumpUrl(imgNode.src, imgReferer);
        } else {
            img.src = imgNode.src;
        }
        img.width = imgNode.clientWidth;
        img.height = imgNode.clientHeight;
        if (img.width == 0 || img.height == 0) {
            liteAjax("http://jcloud.jndroid.com/request?page=http://playground.jndroid.cn/imagesize", function(e) {
                var size = JSON.parse(e);
                img.width = size.width;
                img.height = size.height;
            }, "post", img.src, false);
        }
        return img;
    };

    this.htmlToJson = function(htmlNode, adTexts, adImgs, imgConverter) {
        return BeeUtils.htmlToJson(htmlNode, adTexts, adImgs, imgConverter);
    };

    this.makeImgJumpUrl = function(url, referer) {
        return "http://fw.mb.lenovomm.com/loadimage/get?url=" + url + "&referer=" + referer;
    };

    this.addWebView = function(webview) {
        webview.setBorder(2, 0xff666666);
        root.addView(webview);
    };

    this.removeView = function(view) {
        root.removeView(view);
    };

    function onCreate() {
        root = new ViewGroup();
        root.setBg(0xffcccccc);
        root.onMeasure = function(wMS, hMS) {
            var w = MS.getSize(wMS);
            var h = MS.getSize(hMS);

            for (var i = 0; i < this.getChildCount(); i++) {
                this.getChildAt(i).measure(360, h);
            }

            this.setMD(w, h);
        };
        root.onLayout = function() {
            var x = 0;
            var y = 0;
            var itemW = this.getMW() / this.getChildCount();
            for (var i = 0; i < this.getChildCount(); i++) {
                this.getChildAt(i).layout(x, y);
                x += itemW;
            }
        };

        setContentView(root);
    }

    var beeJsTotal = 0;
    var beeJsCount = 0;

    includeJs("http://bee.jndroid.com/jndroid/jndroid.core.js");
    includeJs("http://bee.jndroid.com/jndroid/jndroid.layout.js");
    includeJs("http://bee.jndroid.com/jndroid/jndroid.widget.js");
    includeJs("http://bee.jndroid.com/beeutils.js");

    function includeJs(path) {
        beeJsTotal++;
        loadJS(path, function() {
            beeJsCount++;
            if (window.onJSProgressChanged) {
                window.onJSProgressChanged.call(this, beeJsCount / beeJsTotal);
            }
            if (beeJsCount == beeJsTotal) {
                if (onCreate) {
                    onCreate.call(this);
                }
                beeJsTotal = 0;
                beeJsCount = 0;
            }
        });
    }

    function loadJS(path, callback) {
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.src = path;
        s.onload = s.onreadystatechange = function () {
            if (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete') {
                if (callback) {
                    callback.call();
                }
                s.onload = s.onreadystatechange = null;
            }
        };
        var h = document.getElementsByTagName('head')[0];
        h.appendChild(s)
    }
}

