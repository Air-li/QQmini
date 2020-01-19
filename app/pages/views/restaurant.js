const app = getApp();
Page({
  data: {
    List: [],
    load: true,
    restaurant: ''
  },
  onLoad(e) {
    this.setData({
      restaurant: e.restaurant
    });
    const that = this;
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    wx.request({
      url: 'https://lin.innenu.com/query-restaurant.php',
      data: {
        restaurant: e.restaurant
      },
      success(res) {
        console.log(res);
        const list = res.data;
        that.setData({
          List: list
        });
      }
    });
  },
  goBack() {
    wx.navigateBack({
      delta: 1
    });
  },
  goBackToHome() {
    wx.navigateBack({
      delta: 100
    });
  },
  serach(e) {
    wx.redirectTo({
      url: '/pages/detail/detail'
    });
  },
  onReady() {
    wx.hideLoading();
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      MainCur: e.currentTarget.dataset.id,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
    });
  },
  VerticalMain(e) {
    const that = this;
    const { list } = this.data;
    let tabHeight = 0;
    if (this.data.load) {
      for (let i = 0; i < list.length; i++) {
        const view = wx.createSelectorQuery().select(`#main-${list[i].id}`);
        view
          .fields(
            {
              size: true
            },
            data => {
              list[i].top = tabHeight;
              tabHeight += data.height;
              list[i].bottom = tabHeight;
            }
          )
          .exec();
      }
      that.setData({
        load: false,
        list
      });
    }
    const scrollTop = e.detail.scrollTop + 20;
    for (let i = 0; i < list.length; i++)
      if (scrollTop > list[i].top && scrollTop < list[i].bottom) {
        that.setData({
          VerticalNavTop: (list[i].id - 1) * 50,
          TabCur: list[i].id
        });
        return false;
      }
  }
});
