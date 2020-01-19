/*
 * @Author: Mr.Hope
 * @Date: 2019-07-23 18:34:29
 * @LastEditors  : Mr.Hope
 * @LastEditTime : 2020-01-19 10:13:23
 * @Description: 列表组件
 */

interface Detail {
  id: number;
  content: Record<string, any>;
}

Component({
  properties: {
    /** 配置 */
    config: { type: Object },

    /** 改变触发 */
    change: { type: Object }
  },
  methods: {
    /** 导航到指定页面 */
    navigate(res): void {
      const { url } = this.getDetail(res).content;

      wx.navigateTo({ url });
    },

    /** 控制选择器显隐 */
    pickerTap(res): void {
      const {
        id,
        content: { visible: value }
      } = this.getDetail(res);

      this.setData({ [`config.content[${id}].visible`]: !value });
    },

    /** 控制选择器改变 */
    pickerChange(res): void {
      const { id, content } = this.getDetail(res);

      if (res.type === 'change') {
        const { value } = res.detail;

        // 判断为多列选择器，遍历每一列更新页面数据、并存储选择器值
        if (Array.isArray(value)) {
          value.forEach((x, y) => {
            content.value[y] = content.pickerValue[y][Number(x)];
            content.currentValue[y] = x;
          });
          wx.setStorageSync(content.key, value.join('-'));

          // 判断为单列选择器，更新页面数据并存储选择器值
        } else {
          content.value = content.pickerValue[Number(value)];
          content.currentValue = Number(value);
          wx.setStorageSync(content.key, Number(value));
        }

        // 将选择器的变更响应到页面上
        this.setData({ [`config.content[${id}]`]: content }, () => {
          this.triggerEvent('change', { value, event: content.picker });
        });
      }
    },

    /** 开关改变 */
    switch(res): void {
      const { id, content } = this.getDetail(res);

      // 更新页面数据
      this.setData(
        { [`config.content[${id}].status`]: res.detail.value },
        () => {
          console.log(this.data.config);
          this.triggerEvent('change', {
            event: content.Switch,
            value: res.detail.value
          });
        }
      );

      wx.setStorageSync(content.swiKey, res.detail.value); // 将开关值写入存储的swiKey变量中
    },

    /** 触发按钮事件 */
    button(res): void {
      const { content } = this.getDetail(res);

      this.triggerEvent('change', { event: content.button });
    },

    /** 控制滑块显隐 */
    sliderTap(res): void {
      const { id, content } = this.getDetail(res);

      // 更新页面数据
      this.setData({ [`config.content[${id}].visible`]: !content.visible });
    },

    /** 滑块改变 */
    sliderChange(res): void {
      const { id, content } = this.getDetail(res);
      const { value } = res.detail;

      // 更新页面数据，并写入值到存储
      content.value = value;

      // 写入页面数据
      this.setData({ [`config.content[${id}].value`]: value }, () => {
        this.triggerEvent('change', { value, event: content.slider });
      });

      if (res.type === 'change') wx.setStorageSync(content.sliKey, value);
    },

    /** 获得选择器位置与内容 */
    getDetail(res): Detail {
      const id = res.currentTarget.id || res.currentTarget.dataset.id;

      return { id, content: this.data.config.content[id] };
    }
  },
  observers: {
    /**
     * 改变触发
     *
     * @param detail 需要改变的键及其对应值
     */
    change(detail): void {
      if (detail) {
        const detail2: Record<string, any> = {};

        Object.keys(detail).forEach(element => {
          detail2[`config.${element}`] = detail[element];
        });
        console.log(detail2);
        this.setData(detail2);
      }
    }
  },

  options: {
    addGlobalClass: true, // 兼容QQ
    styleIsolation: 'shared'
  }
});
