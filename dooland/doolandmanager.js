var DoolandManager = new _DoolandManager();
function _DoolandManager() {

    this.addBee = function(name, url, category, tag) {
        var sql = "INSERT INTO `doolandbees` (`name`, `url`, `category`, `tag`) VALUES ('" + name + "', '" + url + "', '" + category + "','" + tag + "');";
        DB.exec(sql, function(d) {
            console.log(d);
        });
    };

    this.loadBees = function(callback) {
        var sql = "select * from doolandbees";
        DB.exec(sql, function(d) {
            var json = JSON.parse(d);
            if (json.err_no == 0) {
                if (callback) {
                    callback.call(this, json.result);
                }
            }
        });
    }
}