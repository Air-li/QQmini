Page({
  data: {
    isLogin: false,
    tips: '要照顾好自己呀',
    avatarUrl: 'https://nenuyouth.com/img/icon/nenuyouth.png',
    nickName: '',
    list: {
      content: [
        {
          text: '通知消息',
          icon: '/icon/notice.svg',
          url: '/pages/views/notice'
        },
        {
          text: '收藏夹',
          icon: '/icon/myFavor.svg',
          button: 'removeBadge'
        },
        {
          text: '联系客服',
          icon: '/icon/GM.svg',
          button: 'handleContact'
        }
      ]
    }
  },

  /** 列表控制函数 */
  list({ detail }: WXEvent.Touch) {
    if (detail.event) this[detail.event as 'removeBadge' | 'handleContact']();
  },

  handleContact() {
    wx.setClipboardData({ data: '2284490400' });
  },

  removeBadge() {
    wx.removeTabBarBadge({
      index: 2,
      success: res => {
        console.log(res);
      }
    });

    wx.navigateTo({ url: '/pages/views/favor' });
  },
  login(event: any) {
    const { nickName, avatarUrl } = event.detail.userInfo;

    this.setData({ nickName, avatarUrl, isLogin: true });
  }
});
