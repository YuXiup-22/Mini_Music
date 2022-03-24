// baseUI/nav-bar/index.js
Component({
  options:{
    multipleSlots:true
  },
  properties: {
    title:{
      type:String,
      value:"我是标题"
    }
  },
  data: {
    navBarHeight:getApp().globalData.navHeight,
    tabBarHeight:getApp().globalData.tabBarHeight
  },
  methods: {
    leftClick:function () {
      // 发送事件给应用页面，决定做什么操作
      this.triggerEvent('click')
    }
  },
  // 组件的生命周期
  lifetimes:{
    ready:function (params) {
      
    }
  }
})
