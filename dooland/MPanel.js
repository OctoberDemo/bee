function MPanel() {
    FrameLayout.apply(this);

    this.setBackgroundColor(0xFFFFFFFF);
    this.setCornerSize(2,2,0,0);
    this.setBoxShadow(0,0,12,8,0x33000000);
    this.setClickable(true);

    var mSelf = this;

    var mMaskView = new View();
    mMaskView.setOnClickListener(function() {
        mSelf.hide();
    });
    mMaskView.setBackgroundColor(0x33000000);

    var mPanelLp = new LayoutParams(LayoutParams.FILL_PARENT, LayoutParams.FILL_PARENT);
    var rootWidth = getRootView().getMeasuredWidth();
    var rootHeight = getRootView().getMeasuredHeight();
    var paddingX = rootWidth / 10;
    var paddingY = rootHeight / 10;
    mPanelLp.setMargins(paddingX, paddingY, paddingX, 0);
    this.setLP(mPanelLp);

    var mDuration = 300;
    var mIsShowing = false;
    var mIsHiding = false;

    this.show = function() {
        if (mIsHiding || mIsShowing) {
            return;
        }
        var state = {title : "Panel", url : "panel"};
        history.pushState(state, "Panel", "");

        mIsShowing = true;
        getRootView().addView(mMaskView);

        var alphaAni = new AlphaAnimation(0, 1);
        alphaAni.setDuration(mDuration);
        mMaskView.startAnimation(alphaAni);

        getRootView().addView(this);

        var animSet = new AnimationSet();
        animSet.setDuration(mDuration);
        var panelAlpha = new AlphaAnimation(0.5, 1);
        animSet.addAnimation(panelAlpha);
        var translate = new TranslateAnimation(0, 0, rootHeight / 4, 0);
        animSet.setAnimationEndListener(function() {
            mIsShowing = false;
        });
        animSet.addAnimation(translate);

        this.startAnimation(animSet);
    };

    this.hide = function() {
        if (mIsShowing || mIsHiding) {
            return;
        }
        mIsHiding = true;

        history.back(-1);

        var alphaAni = new AlphaAnimation(1, 0);
        alphaAni.setDuration(mDuration);
        mMaskView.startAnimation(alphaAni);

        var rootHeight = getRootView().getMeasuredHeight();

        var animSet = new AnimationSet();
        animSet.setFillAfter(true);
        animSet.setDuration(mDuration);
        var panelAlpha = new AlphaAnimation(1, 0.5);
        animSet.addAnimation(panelAlpha);
        var translate = new TranslateAnimation(0, 0, 0, rootHeight / 4);
        animSet.setAnimationEndListener(function() {
            getRootView().removeView(mMaskView);
            getRootView().removeView(mSelf);

            mIsHiding = false;
        });
        animSet.addAnimation(translate);

        this.startAnimation(animSet);
    };

    window.onpopstate = function (e) {
        console.log(e);
        if (e.state == null || e.state.url == "panel") {
            mSelf.hide();
        }
    };
}