function BeeWebView() {
    WebView.apply(this);

    var self = this;

    var srcUrl;

    this.setSrcUrl = function(url) {
        srcUrl = url;
    };

    this.getDom = function() {
        var dom = this.getFrame().contentWindow.document;
        var window = this.getWindow();
        if (window) {
            if (window.Node.prototype.byId == undefined) {
                window.Node.prototype.byId = function(t, ignoreCheck) {
                    var node = dom.getElementById(t);
                    if (node == undefined && ignoreCheck != true) {
                        BeeUtils.warning(getUrl() + " | byId \"" + t + "\" fail!");
                    }
                    return node;
                };
            }

            if (window.Node.prototype.byTags == undefined) {
                window.Node.prototype.byTags = function(t, ignoreCheck) {
                    var nodes = this.getElementsByTagName(t);
                    if (nodes.length == 0 && ignoreCheck != true) {
                        BeeUtils.warning(getUrl() + " | byTags \"" + t + "\" empty!");
                    }
                    return nodes;
                };
            }

            if (window.Node.prototype.byTag == undefined) {
                window.Node.prototype.byTag = function (t, ignoreCheck) {
                    var node = this.getElementsByTagName(t)[0];
                    if (node == undefined && ignoreCheck != true) {
                        BeeUtils.warning(getUrl() + " | byTag \"" + t + "\" fail!");
                    }
                    return node;
                };
            }

            if (window.Node.prototype.byClasses == undefined) {
                window.Node.prototype.byClasses = function (c, ignoreCheck) {
                    var nodes = this.getElementsByClassName(c);
                    if (nodes.length == 0 && ignoreCheck != true) {
                        BeeUtils.warning(getUrl() + " | byClasses \"" + c + "\" empty!");
                    }
                    return nodes;
                };
            }

            if (window.Node.prototype.byClass == undefined) {
                window.Node.prototype.byClass = function (c, ignoreCheck) {
                    var node = this.getElementsByClassName(c)[0];
                    if (node == undefined && ignoreCheck != true) {
                        BeeUtils.warning(getUrl() + " | byClass \"" + c + "\" fail!");
                    }
                    return node;
                };
            }

            if (window.Node.prototype.attr == undefined) {
                window.Node.prototype.attr = function (a, ignoreCheck) {
                    var node = this.getAttribute(a);
                    if (node == undefined && ignoreCheck == true) {
                        BeeUtils.warning(getUrl() + " | attr \"" + a + "\" fail!");
                    }
                    return node;
                };
            }

            if (window.Node.prototype.removeId == undefined) {
                window.Node.prototype.removeId = function(id) {
                    var node = this.byId(id, true);
                    if (node) {
                        node.parentNode.removeChild(node);
                    }
                }
            }

            if (window.Node.prototype.removeClass == undefined) {
                window.Node.prototype.removeClass = function(c) {
                    var node = this.byClass(c, true);
                    if (node) {
                        node.parentNode.removeChild(node);
                    }
                }
            }

            if (window.Node.prototype.removeClasses == undefined) {
                window.Node.prototype.removeClasses = function(c) {
                    var nodes = this.byClasses(c, true);
                    while (nodes.length > 0) {
                        var node = nodes[0];
                        node.parentNode.removeChild(node);
                    }
                }
            }

            if (window.Node.prototype.removeTag == undefined) {
                window.Node.prototype.removeTag = function(t) {
                    var node = this.byTag(t, true);
                    if (node) {
                        node.parentNode.removeChild(node);
                    }
                }
            }

            if (window.Node.prototype.removeTags == undefined) {
                window.Node.prototype.removeTags = function(t) {
                    var nodes = this.byTags(t, true);
                    while (nodes.length > 0) {
                        var node = nodes[0];
                        node.parentNode.removeChild(node);
                    }
                }
            }
        }

        return dom;
    };

    function getUrl() {
        if (srcUrl) {
            return srcUrl;
        }
        return self.getFrame().contentWindow.location.href;
    }
}

var BeeUtils = new _BeeUtils();
function _BeeUtils() {

    var self = this;

    this.warning = function(msg) {
        var d = new Date();
        var log = d.toLocaleString() + " | " + msg;
        liteAjax("http://jcloud.jndroid.com/request?page=http://bee.jndroid.cn/beemonitor/log.html", function() {

        }, "post", log);
    };

    this.log = function(str) {
        var d = new Date();
        console.log(d.toLocaleString() + " | "  + str);
    };

    this.addKey = function(type, key) {
        var url = "http://fw.jndroid.com/greatlibrary/key/add?type=" + type + "&key=" + key;
        var result = false;
        liteAjax(url, function(e) {
            var json = JSON.parse(e);
            result = (json.err_no == 0);
        }, "get", "", false);
        return result;
    };

    this.exist = function(type, key) {
        var url = "http://fw.jndroid.com/greatlibrary/key/exist?type=" + type + "&key=" + key;
        var result = true;
        liteAjax(url, function(e) {
            var json = JSON.parse(e);
            result = !(json.err_no == 0 && json.result == 0);
        }, "get", "", false);
        return result;
    };

    this.updateStatus = function(fromStatus, toStatus, params, callback) {
        var p = "&status=" + fromStatus;
        p = p + formatParams(params);
        this.requestDatas(p, function(data) {
            console.log(data);
            var models = [];
            for (var i = 0; i < data.length; i++) {
                var model = {};
                model.id = data[i].id;
                model.status = toStatus;
                models.push(model);
            }
            self.putModel(models, callback);
        });
    };

    this.requestDatas = function(params, callback) {
        var url = "http://fw.jndroid.com/greatlibrary/content/get?sort=desc";
        if (params.startsWith("http")) {
            url = params;
        } else {
            url = url + formatParams(params);
        }
        liteAjax(url, function(e) {
            var json = JSON.parse(e);
            var data = json.result;
            if (callback) {
                callback.call(this, data);
            }
        });
    };

    this.putModel = function(model) {
        var data = {};
        if (Utils.isArray(model)) {
            data.data = model;
        } else {
            var models = [];
            models.push(model);
            data.data = models;
        }
        return putData(data);
    };

    function putData(data) {
        var url = "http://fw.jndroid.com/greatlibrary/content/put";
        var result = false;
        liteAjax(url, function(e) {
            var eObj = JSON.parse(e);
            result = (eObj.err_no == 0);
            if (result == false) {
                self.warning("putData fail! " + JSON.stringify(eObj));
            }
        }, "post", JSON.stringify(data), false);
        return result;
    }

    this.deleteByStatus = function(status) {
        var url = "http://fw.jndroid.com/greatlibrary/content/get?sort=desc&status=" + status;
        liteAjax(url, function(e) {
            var json = JSON.parse(e);
            var mData = [];
            for (var i = 0; i < json.result.length; i++) {
                var item = {};
                item.id = json.result[i].id;
                mData.push(item);
            }

            var jsonData = {};
            jsonData.data = mData;
            var delUrl = "http://fw.jndroid.com/greatlibrary/content/del";
            liteAjax(delUrl, function(e) {
                console.log(JSON.parse(e).err_no);
                if (JSON.parse(e).err_no == 0) {
                    console.log("文章已删除");
                }
            }, "post", JSON.stringify(jsonData));
        });
    };

    function formatParams(params) {
        if (params) {
            if (params.startsWith("&")) {
                return params;
            }
            params = "&" + params;
            return params;
        }
        return "";
    }

    this.scrollToBottom = function(document) {
        document.body.scrollTop = document.body.scrollHeight;
    };

    this.loadXmlDom = function(url) {
        var xmlhttp = new window.XMLHttpRequest();
        xmlhttp.open("GET", url, false);
        xmlhttp.send(null);
        return xmlhttp.responseXML;
    };

    this.getXmlValue = function(xmlNode, name) {
        for (var i = 0; i < xmlNode.children.length; i++) {
            var child = xmlNode.children[i];
            if (child.nodeName == name) {
                return child.innerHTML;
            }
        }
        return "";
    };

    this.hashCode = function(str){
        var hash = 0;
        if (str.length == 0) return hash;
        for (i = 0; i < str.length; i++) {
            char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    };

    this.formatTime = function(timeString) {
        if (!timeString) {
            console.log("Error:" + timeString);
            return;
        }
        timeString = timeString.trim();
        if (timeString.indexOf("今天") == 0) {
            var d = new Date();
            timeString = d.toLocaleDateString() + " " + timeString.substring(2);
        } else if (timeString.indexOf("昨天") == 0) {
            var now = new Date();
            var d = new Date(now.getTime() - 1000 * 60 * 60 * 24);
            timeString = d.toLocaleDateString() + " " + timeString.substring(2);
        }
        if (timeString.indexOf("日") > 0 && timeString.indexOf("月") > 0 && timeString.indexOf("年") < 0) {
            timeString = (new Date()).getFullYear() + "年" +timeString;
        }
        if (timeString.indexOf("日") > 0) {
            var timeFrames = timeString.split("日");
            timeFrames[0] = timeFrames[0].replace("年", "-");
            timeFrames[0] = timeFrames[0].replace("月", "-");
            timeString = timeFrames[0].trim() + " " + timeFrames[1].trim();
        }

        var colonCount = timeString.split(":").length - 1;
        var now = new Date();
        if (colonCount == 1) {
            var sec = Math.floor(Math.random() * 59);
            timeString += ":" + sec;
        } else if (colonCount == 0) {
            var h = Math.floor(Math.random() * now.getHours());
            var m = Math.floor(Math.random() * now.getMinutes());
            var s = Math.floor(Math.random() * now.getSeconds());
            timeString += " " + h + ":" + m + ":" + s;
        }
        timeString = timeString.replace(/-/g, "/");
        d = new Date(timeString);
        if (d != "Invalid Date") {
            return d;
        } else {
            console.log("Error:" + timeString);
            return new Date();
        }
    };

    this.htmlToJson = function(htmlNode, adTexts, adImgs, imgConverter) {
        // 测试文章：
        // 果壳网：http://www.guokr.com/article/440982/
        // 打喷嚏：http://www.dapenti.com/blog/more.asp?name=xilei&id=106454

        var jsonResult = [];
        var contentList = [];
        recursiveFormat(htmlNode);
        contentListToJson();

        return jsonResult;

        function contentListToJson() {
            for (var i = 0; i < contentList.length; i++) {
                var item = contentList[i];
                if (item.img) {
                    if (isAdImg(item.img.src)) {
                        continue;
                    }
                    var img = {};
                    img.img = item.img;
                    jsonResult.push(img);
                } else if (item.iframe) {
                    var iframe = {};
                    iframe.iframe = item.iframe;
                    jsonResult.push(iframe);
                } else if (item.video) {
                    var video = {};
                    video.video = item.video;
                    jsonResult.push(video);
                } else if (item.content) {
                    if (isAdText(item.content)) {
                        continue;
                    }
                    var p = {};
                    p.p = item.content;
                    jsonResult.push(p);
                }
            }
        }

        function recursiveFormat(htmlnode) {
            var length = htmlnode.childNodes.length;

            for (var i = 0; i < length; i++) {
                var contentItem = {};
                var node = htmlnode.childNodes[i];
                if (node.nodeName == "#text") {
                    if (node.nodeValue.trim() == "") {
                        continue;
                    }
                    var value = node.nodeValue.trim();
                    if (htmlnode.nodeName.toLowerCase() == "strong" || htmlnode.parentNode.nodeName.toLowerCase() == "strong") {
                        value = "<strong>" + value + "</strong>";
                    }
                    var bound = getBounds(node);
                    var offsetTop = bound.top;
                    var found = false;
                    for (var j = 0; j < contentList.length; j++) {
                        if (offsetTop > contentList[j].bound.top - 5
                            && offsetTop < contentList[j].bound.bottom + 5
                            && contentList[j].content) {
                            contentList[j].content += value;
                            contentList[j].bound.bottom = Math.max(contentList[j].bound.bottom, bound.bottom);
                            found = true;
                            break;
                        }
                    }
                    if (found == false) {
                        contentItem.bound = bound;
                        contentItem.content = value;
                        contentList.push(contentItem);
                    }
                } else if (node.nodeName.toLowerCase() == "img") {
                    var image = {};
                    if (imgConverter) {
                        image = imgConverter.call(this, node);
                        if (image == null || image == undefined) {
                            continue;
                        }
                    } else {
                        image.src = node.src;
                        image.width = node.clientWidth;
                        image.height = node.clientHeight;
                    }
                    contentItem.bound = getBounds(node);
                    contentItem.img = image;
                    contentList.push(contentItem);
                } else if (node.nodeName.toLowerCase() == "iframe") {
                    var iframe = {};
                    iframe.src = node.src;
                    iframe.width = node.width;
                    iframe.height = node.height;
                    contentItem.bound = getBounds(node);
                    contentItem.iframe = iframe;
                    contentList.push(contentItem);
                } else if (node.nodeName.toLowerCase() == "video") {
                    var video = {};
                    video.src = node.src;
                    video.width = node.clientWidth;
                    video.height = node.clientHeight;
                    contentItem.bound = getBounds(node);
                    contentItem.video = video;
                    contentList.push(contentItem);
                } else {
                    var embed = false;
                    //if (htmlnode.nodeName.toLowerCase() != "p" && node.childNodes.length == 1 && isText(node.childNodes[0])) {
                    //    var index = i - 1;
                    //    if (index >= 0) {
                    //        embed = isText(htmlnode.childNodes[index]);
                    //    }
                    //    index = i + 1;
                    //    if (index < htmlnode.childNodes.length) {
                    //        embed = isText(htmlnode.childNodes[index]);
                    //    }
                    //}
                    if (embed && contentList.length > 0) {
                        var text = node.innerText;
                        if (node.nodeName.toLowerCase() == "strong") {
                            text = "<strong>" + text + "</strong>";
                        }
                        var lastContentItem = contentList[contentList.length - 1];
                        if (lastContentItem.content) {
                            lastContentItem.content += text;
                        } else {
                            var bound = {};
                            bound.top = node.offsetTop;
                            bound.bottom = node.offsetTop + node.clientHeight;
                            contentItem.bound = bound;
                            contentItem.content = text;
                            contentList.push(contentItem);
                        }
                    }
                    if (embed == false) {
                        if (node.nodeName != "#comment" && node.nodeName.toLowerCase() != "script"
                            && node.style.visibility != "hidden" && node.style.display != "none") {
                            recursiveFormat(node);
                        }
                    }
                }
            }
        }

        function isAdText(text) {
            if (adTexts) {
                for (var i = 0; i < adTexts.length; i++) {
                    if (Utils.isArray(adTexts[i])) {
                        var match = true;
                        for (var j = 0; j < adTexts[i].length; j++) {
                            var word = adTexts[i][j];
                            if (text.indexOf(word) < 0) {
                                match = false;
                            }
                        }
                        if (match) {
                            return true;
                        }
                    } else {
                        if (text.indexOf(adTexts[i]) >= 0) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }

        function isAdImg(src) {
            if (adImgs) {
                for (var i = 0; i < adImgs.length; i++) {
                    if (adImgs[i] == src) {
                        return true;
                    }
                }
            }
            return false;
        }

        function isText(node) {
            return (node.nodeName == "#text" && node.nodeValue.trim() != "")
        }

        function getBounds(obj) {
            var r = {};
            if (obj.nodeName == "#text") {
                var range = document.createRange();
                range.selectNode(obj);
                var rect = range.getBoundingClientRect();
                r.top = rect.top;
                r.bottom = rect.top + rect.height;
            } else {
                var height = obj.clientHeight;
                var top = 0;
                while(obj != document.body && obj != null) {
                    top += obj.offsetTop;
                    obj = obj.offsetParent;
                }

                r.top = top;
                r.bottom = r.top + height;
            }
            return r;
        }
    };

}