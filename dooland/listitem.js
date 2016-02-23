function ListItem() {
    ViewGroup.apply(this);

    var model;

    var index = new View();
    index.setTextSize(R.dimen.sub_text);
    index.setTextColor(R.color.sub_text);
    index.setStyle("textAlign", "center");
    index.setStyle("lineHeight", "44px");
    this.addView(index);

    var name = createTextView();
    this.addView(name);

    var url = createTextView();
    this.addView(url);

    var category = createTextView();
    this.addView(category);

    var tag = createTextView();
    this.addView(tag);

    var refresh = createTextView();
    this.addView(refresh);

    var status = createTextView();
    this.addView(status);

    function createTextView() {
        var v = new View();
        v.setTextSize(R.dimen.text);
        v.setTextColor(R.color.text);
        v.setStyle("lineHeight", "44px");
        return v;
    }

    var display = new MButton();
    display.setDimBg(false);
    display.setOnClickListener(function() {
        var url = "http://greatlibrary.jndroid.cn/main/?source=" + encodeURI(model.weixin_name);
        console.log(url);
        window.open(url);
    });
    display.setText("展示");
    this.addView(display);

    var more = new MIconButton();
    more.setImageUri("more.png");
    more.setImgDimen(28, 28);
    more.setCornerSize(30);
    more.setDimBg(false);
    more.setOnClickListener(function() {
        var editPanel = new BeePanel(model);
        editPanel.show();
    });
    this.addView(more);

    var line = new View();
    line.setBg(0x1a000000);
    this.addView(line);

    this.setModel = function(m) {
        model = m;
        index.setText(m.index);
        name.setText(m.name);
        url.setText(m.url);
        category.setText(m.category);
        tag.setText(m.tag);
        refresh.setText(m.refresh_min);
    };

    this.setHoverEnterListener(function() {
        this.setBg(R.color.select);
    });

    this.setHoverExitListener(function() {
        this.setBg(0);
    });

    this.onMeasure = function(wMS) {
        var w = MS.getSize(wMS);

        index.measure(44, 44);
        name.measure(120, 44);
        url.measure(320, 44);
        category.measure(80, 44);
        tag.measure(160, 44);
        refresh.measure(120, 44);

        Utils.measureExactly(display, 72, 32);
        Utils.measureExactly(more, 60, 60);

        line.measure(w - 44, 1);

        this.setMD(w, 44);
    };

    this.onLayout = function() {
        var x = 0;
        var y = 0;
        index.layout(x, y);

        x += index.getMW();
        name.layout(x, y);

        x += name.getMW();
        url.layout(x, y);

        x += url.getMW();
        category.layout(x, y);

        x += category.getMW();
        tag.layout(x, y);

        x += tag.getMW();
        refresh.layout(x, y);

        x = this.getMW() - display.getMW() - 60;
        y = (this.getMH() - display.getMH()) / 2;
        display.layout(x, y);

        x += 80;
        y = (this.getMH() - more.getMH()) / 2;
        more.layout(x, y);

        line.layout(44, this.getMH() - 1);
    }
}