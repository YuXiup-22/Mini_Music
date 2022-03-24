// components/scroll-view-song-v1/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    songMenu:{
      type:Object,
      value:{}
    },
    title:{
      type:String,
      value:"默认标题"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    songMenuClick:function (params) {
      const item = params.currentTarget.dataset.item
      wx.navigateTo({
        url: `/pages/ranking_menu/index?id=${item.id}&type=menu`,
      })
    }
  }
})
