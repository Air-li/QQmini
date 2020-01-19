Component({
  properties: {
    /** 普通列表配置 */
    config: Object
  },

  methods: {
    /** 导航到指定页面 */
    navigate(res): void {
      const { url } = this.data.config.content[res.currentTarget.id];

      wx.navigateTo({ url });
    }
  },

  options: {
    addGlobalClass: true, // 兼容QQ
    styleIsolation: 'shared'
  }
});
