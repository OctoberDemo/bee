function AdvancedTableView(ItemFunc) {
    ViewGroup.apply(this);

    var actionDownIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAA+dJREFUeJzt3FmolVUYxvHnf5yHzLIEI0GhAwkplEQSDVBeiCAFFYFB1EXYRVRQFNFAQoQXEUUjFEU0UTRgFIIgRUUYoYSQQYKCgpAkWeY8ddEnrAMmDnuftc/+/r/Lw9lrPet91znfHta3E0mSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJElSC5FkXu0QI8Dc2gG6YRD4DjiW5KHaYXoUwHLgGLAyybTagTppIrC6WdyxJI/XDtRjAFYcrw/wSpKB2qE6bTzwZbHI5fnvstB2AC8WdXk+fVyXscBnxWJXpI8XewoGgNeLejybFtRjDPBhsegX0oJFn8Ao4O3isvhUWlSHUcA7xSZ4NX14zTuJMcAHRfMfrR2ohgHgjWITvJlkVO1Qw2As8GnR/AdqB6ppAHip2ATvJhldO1QXDXkinOTe2oF6AcBzxSb4KMmY2qG6oHwpfDTJ3bUD9RKAZ4pN8HmScbVDddBk4JtmbYeTLK0dqFc9WWyCr5KMrx2oA84FfmjWdCjJrbUD9bpHik2wOsnE2oHOwvnAT81aDiRZUjvQSHF/sQm+TjK5dqAzcCHwc7OGfUkW1Q400iwrNsH3SabUDnQaZgC/NNn3JLmxdqCR6i7gaFPIH5OcVzvQKbgY+K3JvDvJtbUDjXRLgcNNQdcnuaB2oJOYBWxusu5KsqB2oH5xC3CoKeyGJNNrBzqBQWBrk3Fnkvm1A/WbJcCBpsC/JrmodqDCHGB7k21HPPnUNYuAfU2hNyWZWTtQknnAjibT9iRzagfqdzcAe5qCb04yq2KW+cDOJsu2JIMVs7TKNcDfTeG3JrmkQoYFwK4mw5YksytkaLWrigZsT3LpMM59HbC7xy5FrXRF8S/49ySXDcOcC4G9zZwbk8wYhjl1EnOLJ2F/JLm8i3MtBvb3+MvRVipfhv2Z5MouzHEzcLCZY1367Nx+PxgEtjUN+ivJ1R0c+/bi3ci1SaZ2cGx10GxgS9Oof5Jc34Ex7wSONGN+m+ScDoypLpoJbGoatjfJwrMY657iw6g1SSZ1KKO6bAawsWnc/iSLz2CM+4qPo1clmdDhjOqy6cCGpoEHk9x0Go99uGj+yvTX+cRWmQasK87j3XYKj3miaP7H6c8Tyq0yFVjbNPRIkjv+5/dg6Mnk99Lf9yi0yhSa7yfgxGfyYei9CW+lHXcptcokYM3xJidZ1vx8AHi5aP5radd9iq0yAVhVbIIHGXp/YlvvVG6VccAXRdP9roIWGgt8UjT/6dj81hkNvJ/ksdpBVI9/9ZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSRp+/wJPMulcOghsLAAAAABJRU5ErkJggg==";
    var actionUpIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAA+FJREFUeJzt3FuoVFUcx/Hf1xtihmWJpmIiRgkpaKBEEhRIURRFESFBN7BeSnrQN3uqpy4PUQ9dIIqCLg/igwVdIAmEKMooQ0XFbpJmWWZ5tx5cBzdiYnb2rH3G7wcOHM7sWeu313/NzJm110wiSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSVJ145KMrx1CdYwHPgPWJZlQO4x6awLwJfB3+VmfZFLtUOqNi4BvSuH/AvaW3zclmVo7nNo1FdhUCr43yTVJrgJ+L3/bmmR63Yhqy3Rgayn0niQLG7fNB34tt32bZGaljGrJTOC7UuDdSRac5Ji5wM/lmB+TXNbjjGrJLGB7KeyuJPNOcezlwE/l2B1JZvcoo1oyG9hRCrozyZzTuM+lwA+NCTO35YxqyTxgVynk9iSz/sN9ZwDbGi8Z81vKqJYsAHaXAn6f5JIzaGMasPlf/mlUhy0E9pTCbUsy43+0NRnYcMLbRnXYtY2Fnc1Jpg1CmxOBrwYWjpJcNwhtqgXXA/tKoTYkmTyIbV8AfF7a3p/kpkFsW4PgZmB/KdDXSSa20Md5wCelj4NJbmuhD52B24GDpTBfJLmwxb7OBT4ufR1OsrjFvnQaFgOHS0E+TXJ+D/o8B/iw9HkkyT096FMncS9wpBRibY5t7uiV0cC7pe+jSZb0sG8leQA4WgqwJsnYChlGAasG9hQkebhChrPS0sZGjg+SjKmYZSTwVmMSLKuY5aywvFH8d5KMrh0oyXDgtcYkWFE7UL96tFH8VUlG1Q7UMAx4qZHvsdqB+grweGNw304ysnamkwB4rpHzydqB+gLwVGNQX08yvHamUwGebuR9Ngm1Mw1VJz6iXk4yrHao03HCM9YLGSK5u2QY8GJjEJ/P0HskrWjkfyUdf+bqkuHAq43BeyZDr/gDljXO440kI2oH6roRwJuNQXuidqBB8FBj0WpluvXupVNGASv79K3UksYkWJ1urF90ymhgdZ8vptzduHD1XuquYHbKGOD9RvGX1w7UojuBQ+VcP0qdaxidMhZY0yj+0tqBeuBW4EClq5idMg5Y27ik+mDtQD10Y2MHU6/2MXTKwGfzBzZV3Fc7UAWLgD/LGKxLuzuZOmUCsK6xrequ2oEquhr4g+N7Gfv+OwomAevLCR9KckftQB1wJfBbGZONSabUDtSWKcDGcqIHktxSO1CHXAH8UsZmS5KLawcabFOALeUE9yW5oXagDpoD7OT4dxT01SQYluT+MrsX1Q7TYbM49qGWR+J1A0mSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJKmP/QNp/uh2m+kx4gAAAABJRU5ErkJggg==";
    var searchIcon = "data:image/png;base64,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";
    var searchWhiteIcon = "data:image/png;base64,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";

    var advancedTableView = this;

    var tableHeader = null;
    var tableHeaderCols = [];

    var matchCount = 0;
    var currentIndex = 0;

    var padding = 16;
    var textSize = 16;
    var subTextSize = 14;
    var titleSize = 22;
    var tableHeaderHeight = 36;
    var themeColor = 0xff0000ff;
    var textColor = 0xff212121;
    var subTextColor = 0xff757575;
    var selectedColor = 0x1a1499f7;

    if (window.R) {
        if (R.dimen) {
            if (R.dimen.padding) {
                padding = R.dimen.padding;
            }
            if (R.dimen.text) {
                textSize = R.dimen.text;
            }
            if (R.dimen.sub_text) {
                subTextSize = R.dimen.sub_text;
            }
            if (R.dimen.title) {
                titleSize = R.dimen.title;
            }
        }
        if (R.color) {
            if (R.color.text) {
                textColor = R.color.text;
            }
            if (R.color.sub_text) {
                subTextColor = R.color.sub_text;
            }
            if (R.color.theme) {
                themeColor = R.color.theme;
            }
            if (R.color.select) {
                selectedColor = R.color.select;
            }
        }
    }

    var list = new ListView(ItemFunc);
    list.setOnItemUpdateListener(function(index, view) {
        var model = list.get(index);
        updateSelect();
        model.onSelected = updateSelect;
        function updateSelect() {
            if (model.selected) {
                view.setBg(selectedColor);
            } else {
                view.setBg(0);
            }
        }
    });
    this.addView(list);
    var scrollbar = null;

    var titlebar = new Titlebar();
    var searchbar = titlebar.getSearchbar();
    this.addView(titlebar);

    this.setTitle = function(t) {
        titlebar.setTitle(t);
    };

    this.setLogo = function(imgUrl) {
        titlebar.setLogo(imgUrl);
    };

    this.addActionButton = function(imgUrl, onclick, iconsize, index) {
        titlebar.addActionButton(imgUrl, onclick, iconsize, index);
    };

    this.getTitlebar = function() {
        return titlebar;
    };

    this.getTableHeaderCols = function() {
        return tableHeaderCols;
    };

    this.addTableHeaderCol = function(title, width) {
        if (tableHeader == null) {
            tableHeader = new TableHeader();
            this.addHeader(tableHeader);
        }
        var view = new View();
        view.setTextSize(subTextSize);
        view.setTextColor(subTextColor);
        view.setStyle("lineHeight", tableHeaderHeight + "px");
        view.setText(title);

        var lp = new LP(width, tableHeaderHeight);
        view.setLP(lp);

        tableHeaderCols.push(view);
        tableHeader.addColumn(view);
    };

    this.requestScrollBar = function() {
        scrollbar = new ScrollBar(list);
        this.addView(scrollbar);
    };

    this.getSize = function() {
        return list.getSize();
    };

    this.get = function(index) {
        return list.get(index);
    };

    this.setData = function(datas) {
        extendModels(datas);
        list.setData(datas);
    };

    this.appendData = function(datas)  {
        extendModels(datas);
        list.appendData(datas);
    };

    this.add = function(data, index) {
        if (Utils.isArray(data)) {
            extendModels(data);
        } else {
            extendModel(data);
        }
        list.add(data, index);
    };

    this.removeAt = function(index) {
        list.removeAt(index);
    };

    this.clear = function() {
        list.clear();
    };

    this.addHeader = function(header) {
        list.addHeader(header);
    };

    function extendModels(models) {
        for (var i = 0; i < models.length; i++) {
            extendModel(models[i]);
        }
    }

    function extendModel(model) {
        model.selected = false;
        model.onSelected = null;
        model.setSelected = function(selected) {
            model.selected = selected;
            if (model.onSelected != null) {
                model.onSelected.call(this);
            }
        }
    }

    this.clearQuery = function() {
        unselectAll();
        searchbar.clear();
    };

    this.doQuery = function(query) {
        unselectAll();
        if (query.trim() == "") {
            return;
        }
        console.log(query);
        matchCount = 0;
        for (var i = 0; i < list.getSize(); i++) {
            if (this.match(i, query)) {
                list.get(i).setSelected(true);
                matchCount++;
            }
        }
        if (searchbar != null) {
            searchbar.setMatchCount(matchCount, 0);
        }
        this.queryAt(query, 0);
    };

    this.queryAt = function(query, index) {
        if (query.trim() == "") {
            return;
        }
        var passcount = 0;
        var itemHeight = list.getItemHeight();
        for (var i = 0; i < list.getSize(); i++) {
            if (this.match(i, query)) {
                if (passcount == index) {
                    var headHeight = 0;
                    if (list.getHeader()) {
                        headHeight = list.getHeader().getMH();
                    }
                    var t = i * itemHeight + headHeight;
                    var view = list.getChildAt(0);
                    var maxScroll = view.getMH() - list.getMH();
                    t = Math.min(t, maxScroll);
                    list.flingTo(t);

                    if (searchbar != null) {
                        searchbar.setMatchCount(matchCount, passcount + 1);
                    }

                    return;
                }
                passcount++;
            }
        }
    };

    this.match = function(index, query) {
        return false;
    };

    function unselectAll() {
        for (var i = 0; i < list.getSize(); i++) {
            list.get(i).setSelected(false);
        }
    }

    this.onMeasure = function(wMS, hMS) {
        var w = MS.getSize(wMS);
        var h = MS.getSize(hMS);

        titlebar.measure(w, 52);
        if (scrollbar) {
            list.measure(w - 12, h - 52);
            scrollbar.measure(12, h - 52);
        } else {
            list.measure(w, h - 52);
        }

        this.setMD(w, h);
    };

    this.onLayout = function() {
        titlebar.layout(0, 0);
        list.layout(0, 52);
        if (scrollbar) {
            scrollbar.layout(this.getMW() - scrollbar.getMW(), 52);
        }
    };

    function Titlebar() {
        ViewGroup.apply(this);

        var self = this;

        this.setBg(themeColor);
        this.setBoxShadow(0, 0, 12, 3, 0x33000000);

        var actionBtns = [];

        var logo = new ImageView();
        logo.setVisibility(View.GONE);
        this.addView(logo);

        var title = new TextView();
        title.setTextSize(titleSize);
        title.setTextColor(0xffffffff);
        title.setSingleLine(true);
        title.setGravity(Gravity.LEFT | Gravity.CENTER_VERTICAL);
        this.addView(title);

        this.getActionBtns = function() {
            return actionBtns;
        };

        this.getSearchbar = function() {
            return searchbar;
        };

        this.setLogo = function(imgUrl) {
            logo.setAlpha(0.99);
            logo.setVisibility(View.VISIBLE);
            logo.setImageUri(imgUrl);
            logo.setImgWidth(36);
        };

        this.setTitle = function(t) {
            title.setText(t);
        };

        this.addActionButton = function(imgUrl, onclick, iconSize, index) {
            var btn = new MImageButton();
            btn.setImageUri(imgUrl);
            if (iconSize) {
                btn.setImgWidth(iconSize);
            } else {
                btn.setImgWidth(28);
            }
            btn.setOnClickListener(onclick);
            btn.setDimBg(false);
            btn.setWaveColor(0x33ffffff);
            btn.setCornerSize(40);
            if (index == undefined) {
                index = actionBtns.length;
            }
            actionBtns.add(index, btn);
            this.addView(btn, 0);
        };

        this.addActionButton(searchWhiteIcon, function() {
            self.showSearchBar();
        });

        document.onkeydown = function(event) {
            var e = event || window.event || arguments.callee.caller.arguments[0];
            if (e.metaKey == true && e.keyCode == 70) {
                e.returnValue = false;
                self.showSearchBar();
            }
            if (searchbar.getParent() != null) {
                if (e.keyCode == 27) {
                    e.returnValue = false;
                    self.hideSearchBar();
                } else if (e.keyCode == 13) {
                    e.returnValue = false;
                    searchbar.next();
                }
            }
        };

        var coverView = new View();
        coverView.setOnClickListener(function() {
            self.hideSearchBar();
        });
        coverView.setVisibility(View.GONE);
        this.addView(coverView);

        var searchbar = new Searchbar();

        this.showSearchBar = function() {
            if (searchbar.getParent() != null) {
                return;
            }
            this.addView(searchbar);
            coverView.setVisibility(View.VISIBLE);
            var alpha = new AlphaAnimation(0, 1);
            alpha.setDuration(200);
            alpha.setAnimationEndListener(function() {
                searchbar.focus();
            });
            searchbar.startAnimation(alpha);
        };

        this.hideSearchBar = function() {
            advancedTableView.clearQuery();

            var alpha = new AlphaAnimation(1, 0);
            alpha.setDuration(200);
            alpha.setAnimationEndListener(function() {
                self.removeView(searchbar);
                coverView.setVisibility(View.GONE);
            });
            searchbar.startAnimation(alpha);
        };

        this.onMeasure = function(wMS) {
            var w = MS.getSize(wMS);
            if (logo.getVisibility() == View.VISIBLE) {
                logo.measure(52, 52);
            }
            Utils.measureExactly(title, w, 52);
            for (var i = 0; i < actionBtns.length; i++) {
                actionBtns[i].measure(80, 80);
            }
            coverView.measure(w, 52);
            searchbar.measure(Math.min(320, w - 60), 32);
            this.setMD(w, 52);
        };

        this.onLayout = function() {
            var x = 0;
            var y = 0;

            if (logo.getVisibility() == View.VISIBLE) {
                x += 52;
            }
            title.layout(x, y);

            x = this.getMW() - actionBtns.length * 52 - 14;
            y = -14;
            for (var i = 0; i < actionBtns.length; i++) {
                actionBtns[i].layout(x, y);
                x += 52;
            }
            coverView.layout(0, 0);

            x = this.getMW() - searchbar.getMW() - padding / 2;
            y = (this.getMH() - searchbar.getMH()) / 2;
            searchbar.layout(x, y);
        }
    }

    function Searchbar() {
        ViewGroup.apply(this);

        var actionBtns = [];

        this.setBg(0xffffffff);
        this.setCornerSize(2);
        this.setBoxShadow(0, 1, 2, 0, 0x33000000);
        this.setOnClickListener(function() {
            console.log("click")
        });

        var search = new ImageView();
        search.setImageUri(searchIcon);
        search.setImgWidth(28);
        this.addView(search);

        var countView = new View();
        countView.setTextColor(subTextColor);
        countView.setTextSize(subTextSize);
        countView.setStyle("textAlign", "right");
        countView.setStyle("paddingRight", "6px");
        countView.setClickable(false);
        this.addView(countView);

        var editText = new EditText();
        editText.setTextSize(subTextSize);
        editText.setTextColor(textColor);
        editText.getInput().style.paddingRight = "92px";
        editText.setTextChangedListener(function() {
            advancedTableView.doQuery(editText.getText());
            if (editText.getText() == "") {
                searchbar.setMatchCount(0, 0);
            }
        });
        this.addView(editText);

        var up = createActionBtn(actionUpIcon, function() {
            if (currentIndex == 0) {
                currentIndex = matchCount - 1;
            } else {
                currentIndex--;
            }
            advancedTableView.queryAt(editText.getText(), currentIndex);
        });
        actionBtns.push(up);
        this.addView(up);

        var down = createActionBtn(actionDownIcon, function() {
            searchbar.next();
        });
        actionBtns.push(down);
        this.addView(down);

        function createActionBtn(imgUrl, onclick) {
            var btn = new MImageButton();
            btn.setCornerSize(30);
            btn.setDimBg(false);
            btn.setImageUri(imgUrl);
            btn.setImgWidth(20);
            btn.setOnClickListener(onclick);
            return btn;
        }

        this.clear = function() {
            editText.setText("");
            countView.setText("");
        };

        this.next = function() {
            currentIndex++;
            if (currentIndex == matchCount) {
                currentIndex = 0;
            }
            advancedTableView.queryAt(editText.getText(), currentIndex);
        };

        this.setMatchCount = function(count, currentIndex) {
            countView.setText("第" + currentIndex + "条，共" + count + "条");
        };

        this.focus = function() {
            editText.requestFocus();
        };

        this.onMeasure = function(wMS, hMS) {
            var w = MS.getSize(wMS);
            var h = MS.getSize(hMS);

            search.measure(40, h);
            Utils.measureExactly(editText, w - 48 - 32 * actionBtns.length, h);
            Utils.measureExactly(countView, 100, h);
            countView.setStyle("lineHeight", h + "px");
            for (var i = 0; i < actionBtns.length; i++) {
                actionBtns[i].measure(48, 48);
            }


            this.setMD(w, h);
        };

        this.onLayout = function() {
            var x = 0;
            var y = 0;
            search.layout(x, y);

            x += search.getMW();
            editText.layout(x, y);

            x += editText.getMW() - 92;
            countView.layout(x, y);

            x = this.getMW() - 32 * actionBtns.length - 16;
            y = -8;
            for (var i = 0; i < actionBtns.length; i++) {
                actionBtns[i].layout(x, y);
                x += 32;
            }
        }
    }

    function TableHeader() {
        ViewGroup.apply(this);

        var cols = [];
        var line = new View();
        line.setBg(0x33000000);
        this.addView(line);

        this.addColumn = function(col) {
            cols.push(col);
            this.addView(col);
        };

        this.onMeasure = function(wMS) {
            var w = MS.getSize(wMS);

            for (var i = 0; i < cols.length; i++) {
                var lp = cols[i].getLayoutParams();
                cols[i].measure(lp.width, lp.height);
            }
            line.measure(w, 1);

            this.setMD(w, tableHeaderHeight);
        };

        this.onLayout = function() {
            var x = 0;
            for (var i = 0; i < cols.length; i++) {
                cols[i].layout(x, 0);
                x += cols[i].getMW();
            }
            line.layout(0, this.getMH() - 1);
        }
    }
}