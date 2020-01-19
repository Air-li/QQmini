Page({
  data: {
    character: '',
    foodlist: []
  },

  onLoad(event) {
    const { foodlist } = getApp().globalData;

    console.log(foodlist);
    this.setData({
      character: event.character,
      foodlist
    });
  }
});
