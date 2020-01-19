let category = false;

Page({
  data: {
    category: false
  },
  categoryToggle(): void {
    category = !category;
    this.setData({ category });
  }
});
