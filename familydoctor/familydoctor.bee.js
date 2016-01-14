new _FamilyDoctorBee();

function _FamilyDoctorBee() {
    Bee.setType("www.familydoctor.com.cn");
    Bee.setImgReferer("www.familydoctor.com.cn");

    Bee.requestNoScript();
    Bee.requestNoCss();
    Bee.requestNoIframe();

    Bee.onListLoaded = function(dom) {
        var items = [];
        var content = dom.byClass("content", true);
        if (content) {
            var h4s = content.byTags("h4");
            for (var i = 0; i < h4s.length; i++) {
                var h4 = h4s[i];
                h4.removeTag("span");
                var link = h4.byTag("a");
                extractLink(link);
            }
        }
        var art_lists = dom.byClasses("art-list", true);
        for (var i = 0; i < art_lists.length; i++) {
            var h2s = art_lists[i].byTags("h2");
            for (var j = 0; j < h2s.length; j++) {
                var h2 = h2s[j];
                h2.removeTag("span");
                var link = h2.byTag("a");
                extractLink(link);
            }
        }

        function extractLink(link) {
            var item = {};
            item.url = link.href;
            //item.status = 5;
            items.push(item);
        }

        Bee.finishExtractList(items);
    };

    Bee.onItemLoaded = function(dom, item) {
        var endContent = dom.byClass("endContent");
        item.title = endContent.byTag("h1").innerText;

        var info = dom.byClass("info").innerText;
        var frames = info.split(" ");
        var timeStr = frames[0];
        item.created_at = Bee.convertTime(timeStr);

        var source = "";
        for (var i = 1; i < frames.length; i++) {
            if (frames[i].trim() != "") {
                source = frames[i].trim();
                break;
            }
        }

        source = Bee.convertSource(source, "家庭医生在线");
        if (source == null) {
            Bee.passItem(item);
            return;
        }
        item.source = source;


        dom.removeClass("xgTj");
        dom.removeClass("jkHot");
        item.content = Bee.htmlToJson(dom.byId("viewContent"));

        Bee.finishExtractItem(item);
    };
}