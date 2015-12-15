var GLOperator = new _GLOperator();
function _GLOperator() {

    var mSelf = this;

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
            mSelf.putModel(models, callback);
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
            console.log(eObj);
            result = (eObj.err_no == 0);
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
}