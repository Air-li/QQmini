interface OldFoodList {
  /** 食物名称 */
  food: string;
  /** 食物描述 */
  description: string;
  /** 价格 */
  price: string;
  /** 档口 */
  restaurant: string;
  /** 评分 */
  score: string;
  /** 图片地址 */
  src: string;
  /** 标签 */
  tag: string;
}

interface FoodList {
  /** 食物名称 */
  name: string;
  /** 食物描述 */
  desc: string;
  /** 价格 */
  price: number;
  /** 档口 */
  location: string;
  /** 评分 */
  score: number;
  /** 图片地址 */
  img: string;
  /** 标签 */
  tag: string[];
}

/** 全局数据 */
interface GlobalData {
  /** 用户的标识符 */
  openid: string;
  /** 用户收藏夹 */
  myFavor: any;

  /** 食物列表 */
  foodList: FoodList[];

  /** 设备信息 */
  info: WechatMiniprogram.GetSystemInfoSyncResult;

  /** 系统环境 */
  env: 'wx' | 'qq';
}

interface QQOpenIDResult {
  /** QQ OpenID */
  openid: string;
}

App({
  globalData: {
    openid: '',
    myFavor: [],
    foodList: [],
    info: {} as WechatMiniprogram.GetSystemInfoSyncResult,
    env: 'wx'
  } as GlobalData,
  onLaunch() {
    // 获取设备与运行环境信息
    this.globalData.info = wx.getSystemInfoSync();
    if (this.globalData.info.AppPlatform === 'qq') this.globalData.env = 'qq';

    // 登录
    if ((this, this.globalData.env === 'qq'))
      wx.login({
        success: res => {
          wx.request({
            url: 'https://lin.innenu.com/getQQOpenId.php',
            method: 'POST',
            data: { code: res.code },
            success: res1 => {
              const { data } = res1 as WX.RequestResult<QQOpenIDResult>;

              this.globalData.openid = data.openid;

              // 初始化收藏夹
              wx.request({
                url: 'https://lin.innenu.com/getUserFavor.php',
                data,
                success: res2 => {
                  this.globalData.myFavor = res2.data;
                }
              });
            }
          });
        }
      });

    wx.request({
      url: 'https://lin.innenu.com/getFoodList.php',
      success: res => {
        const { data } = res as WX.RequestResult<FoodList[]>;

        this.globalData.foodList = data;
      }
    });
  }
});
