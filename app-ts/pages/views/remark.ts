Page({
  privateData: {
    openid: '',
    user: ''
  },
  data: {
    inputValue: '',
    remarks: [] as any[],
    orientation: '',
    isLogin: false
  },
  onLoad(event) {
    this.setData({ orientation: event.orientation });
    this.refreshInfo();
  },
  refreshInfo() {
    wx.request({
      url: 'https://lin.innenu.com/query-remark.php',
      data: { orientation: this.data.orientation },
      success: res => {
        const { data } = res as WX.RequestResult<any[]>;

        console.log(data);
        this.setData({ remarks: data });
      }
    });
  },

  valueChange(event: WXEvent.Input) {
    this.setData({ inputValue: event.detail.value });
  },

  login(event: WXEvent.Touch) {
    this.privateData.user = event.detail.userInfo.nickName;
    this.setData({ isLogin: true });
  },

  /** 提交评论 */
  submit() {
    wx.request({
      url: 'https://lin.innenu.com/addRemark.php',
      data: {
        orientation: this.data.orientation,
        content: this.data.inputValue,
        user: this.privateData.user,
        openid: this.privateData.openid
      },
      success: res => {
        console.log(res.data);
        this.refreshInfo();
      }
    });
  }
});
