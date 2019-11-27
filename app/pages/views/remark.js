let openid;
let user;
let orientation;

Page({
  data: {
    inputValue: '',
    remarks: [],
    orientation: ''
  },
  refreshInfo() {
    wx.request({
      url: 'https://lin.innenu.com/query-remark.php',
      data: { orientation },
      success: res => {
        console.log(res.data);
        this.setData({ remarks: res.data });
      }
    });
  },
  onLoad(e) {
    setTimeout(() => {
      ({ openid } = getApp().globalData);
    }, 500);

    ({ orientation } = e);
    this.setData({ orientation });
    this.refreshInfo();
  },
  valueChange(event) {
    this.setData({ inputValue: event.detail.value });
  },

  login(event) {
    user = event.detail.userInfo.nickName;
    this.setData({ is_login: true });
  },

  faBu() {
    wx.request({
      url: 'https://lin.innenu.com/addRemark.php',
      data: {
        orientation,
        content: this.data.inputValue,
        user,
        openid
      },
      success: res => {
        console.log(res.data);
        this.refreshInfo();
      }
    });
  }
});
