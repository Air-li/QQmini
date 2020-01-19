const { globalData } = getApp();

interface OldCardInfo {
  /** 背景颜色 */
  bg: string;
  description: string;
  locate: string;
  name: string;
  restaurant: string;
  src: string;
}

interface CardInfo {
  /** 食物名称 */
  name: string;
  /** 食物详情 */
  description: string;
  /** 大致地点 */
  locate: string;
  /** 具体档口 */

  shop: string;
  /** 图片地址 */
  src: string;
  /** 背景颜色 */
  bgColor: string;
  /** 动画 Class */
  animation?: string;
}

Page({
  data: {
    /** 卡片列表 */
    cardList: [] as CardInfo[]
  },

  privateData: {
    badge: 1,
    myFavor: [] as CardInfo[],
    extensionCards: [] as CardInfo[]
  },

  /** 获取卡片列表 */
  onLoad() {
    wx.showLoading({ title: 'loading' });
    wx.request({
      url: 'https://lin.innenu.com/getCard.php',
      success: res => {
        const { data: cardList } = res as WX.RequestResult<CardInfo[]>;

        this.privateData.extensionCards = cardList.slice(3);

        this.setData({ cardList: cardList.slice(0, 3) });
        wx.hideLoading();
      }
    });
  },

  /** 跳转到收藏夹，并移除 tabBar角标 */
  gotoFavor() {
    this.privateData.badge = 1;

    wx.removeTabBarBadge({ index: 2 });

    wx.navigateTo({ url: '/pages/views/favor' });
  },

  /**
   * 卡片动画
   *
   * @param animationClass {string} 动画过程中放置的class
   */
  cardAnimation(animationClass: string) {
    const { cardList } = this.data;

    cardList[0].animation = animationClass;

    this.setData({ cardList }, () => {
      setTimeout(() => {
        cardList[0].animation = '';
        const firstEle = cardList.shift() as CardInfo;
        const firstExtensionEle = this.privateData.extensionCards.shift() as CardInfo;

        this.privateData.extensionCards.push(firstEle);
        cardList.push(firstExtensionEle);

        this.setData({ cardList });
      }, 550);
    });
  },

  /** 移除卡片 */
  removeCard() {
    this.cardAnimation('destroy');
  },

  /** 将卡片添加到收藏夹 */

  addToFavor() {
    let isDuplicated = false;
    const { cardList } = this.data;
    const { name, locate, shop, src } = cardList[0];
    const { myFavor } = this.privateData;

    for (let i = 0; i < myFavor.length; i++)
      if (name === myFavor[i].name && shop === myFavor[i].shop) {
        isDuplicated = true;
        wx.showToast({
          title: '它已经在收藏夹里啦',
          duration: 1000
        });
        this.removeCard();
      }

    if (isDuplicated === false) {
      myFavor.push(cardList[0]);

      console.log(globalData.openid);

      wx.setTabBarBadge({
        index: 2,
        text: String(this.privateData.badge)
      });

      this.privateData.badge += 1;

      wx.request({
        url: 'https://lin.innenu.com/addToFavorList.php',
        data: {
          openid: globalData.openid,
          category,
          name,
          locate,
          shop,
          src
        },
        success: res => {
          console.log(res.data);
        }
      });

      this.cardAnimation('shrink');
    }
  }
});
