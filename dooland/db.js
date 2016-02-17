var DB = new _DB();
function _DB() {
    var remoteUrl = "http://jground.jndroid.com/database/query?databasename=jground";

    this.exec = function(sql, callback, async) {
        if (async == undefined) {
            async = true;
        }
        liteAjax(remoteUrl, function(e) {
            if (callback) {
                callback.call(this, e);
            }
        }, "post", sql, async);
    }
}