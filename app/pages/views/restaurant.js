Page({
  data: {
    List: [],
    load: true,
    restaurant: ''
  },

  onLoad(event) {
    console.log(event);
    this.setData({ restaurant: event.restaurant });

    wx.showLoading({
      title: '加载中...',
      mask: true
    });

    wx.request({
      url: 'https://lin.innenu.com/query-restaurant.php',
      data: { restaurant: event.restaurant },
      success: res => {
        console.log(res);
        const List = res.data;
        this.setData({ List });
      }
    });
  },

  onReady() {
    wx.hideLoading();
  },

  serach() {
    wx.redirectTo({ url: '/pages/detail/detail' });
  },

  tabSelect(event) {
    const { id } = event.currentTarget.dataset;

    this.setData({
      TabCur: id,
      MainCur: id,
      VerticalNavTop: (id - 1) * 50
    });
  },
  verticalMain(event) {
    const { list } = this.data;
    let tabHeight = 0;

    if (this.data.load) {
      for (let i = 0; i < list.length; i++) {
        const view = wx.createSelectorQuery().select(`#main-${list[i].id}`);

        view
          // eslint-disable-next-line no-loop-func
          .fields({ size: true }, data => {
            list[i].top = tabHeight;
            tabHeight += data.height;
            list[i].bottom = tabHeight;
          })
          .exec();
      }

      this.setData({ load: false, list });
    }

    const scrollTop = event.detail.scrollTop + 20;

    for (let i = 0; i < list.length; i++)
      if (scrollTop > list[i].top && scrollTop < list[i].bottom)
        this.setData({
          VerticalNavTop: (list[i].id - 1) * 50,
          TabCur: list[i].id
        });
  }
});
