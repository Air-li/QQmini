const {
  globalData: { foodlist }
} = getApp();

Page({
  data: {
    isShowed: true,
    inputValue: '',
    foodlist
  },

  onLoad() {
    console.log(foodlist);
    this.setData({ foodlist });
  },

  bindInput(event: WXEvent.Input) {
    let foodList = [];

    if (event.detail.value === '') foodList = foodlist;
    else {
      for (let i = 0; i < this.data.foodlist.length; i++)
        if (this.data.foodlist[i].food.includes(this.data.inputValue))
          foodList.push(this.data.foodlist[i]);

      this.setData({ inputValue: event.detail.value, foodlist: foodList });
    }
  },

  isShow() {
    this.setData({ isShowed: true });
  },

  bindBlur() {
    if (this.data.inputValue === '') this.setData({ isShowed: false });
  }
});
