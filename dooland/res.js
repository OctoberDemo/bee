var R = new _R();
function _R() {

    this.string = new _string();
    this.color = new _color();
    this.dimen = new _dimen();

    function _string() {
    }

    function _color() {
        this.theme = 0xffAB121F;
        this.title = 0xff212121;
        this.text = 0xff212121;
        this.sub_text = 0xff999999;
        this.delete = 0xffb0120a;
        this.select = 0x1a1499f7;
    }

    function _dimen() {
        this.padding = 16;
        this.title = 24;
        this.text = 16;
        this.sub_text = 10;
        
    }
}
