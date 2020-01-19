const { globalData } = getApp();

Page({
  data: {
    /** 卡片列表 */
    cardList: []
  },

  privateData: {
    badge: 1,
    myFavor: [],
    extensionCards: []
  },

  /** 获取卡片列表 */
  onLoad() {
    wx.showLoading({ title: 'loading' });
    wx.request({
      url: 'https://lin.innenu.com/query-card-fixed.php',
      success: res => {
        const cardList = [res.data[0], res.data[1], res.data[2]];

        this.privateData.extensionCards = [res.data[3], res.data[4]];

        this.setData({ cardList });
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

    cardList[0].class = animationClass;

    this.setData({ cardList }, () => {
      setTimeout(() => {
        cardList[0].class = '';
        const firstEle = cardList.shift();
        const firstExtensionEle = this.privateData.extensionCards.shift();

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
    const {
      objId,
      category = 'card',
      name,
      locate,
      restaurant,
      src
    } = cardList[0];
    const { myFavor } = this.privateData;

    for (let i = 0; i < myFavor.length; i++)
      if (category === myFavor[i].category && objId === myFavor[i].objId) {
        isDuplicated = true;
        wx.showToast({
          title: '它已经在收藏夹里啦',
          duration: 1000
        });
        this.removeCard();
      }

    if (isDuplicated === false) {
      myFavor.push({
        objId,
        category,
        name,
        locate,
        restaurant,
        src
      });

      console.log(globalData.openid);

      wx.setTabBarBadge({
        index: 2,
        text: String(this.privateData.badge)
      });

      this.privateData.badge += 1;

      wx.request({
        url: 'https://lin.innenu.com/addToFavorFixed.php',
        data: {
          openid: globalData.openid,
          objId,
          category,
          name,
          locate,
          restaurant,
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
