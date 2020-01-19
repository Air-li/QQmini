Page({
  data: {
    myFavor: []
  },

  onLoad() {
    this.setData({ myFavor: getApp().globalData.myFavor });
  }
});
