// components/recommond-song/index.js
import {musicPlayStore} from '../../store/index'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item:{
      type:Object,
      value:{}
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
    ClickToplayer:function (event) {
      const id = event.currentTarget.dataset.id
      // 1.跳转页面
      wx.navigateTo({
        url: "/pages/music-player/index?id="+id,
      })
      //2. 同时在store中，进行网络请求拿数据 方法名+参数
      musicPlayStore.dispatch("getCurrentMusicPlayAction",{ id })
    }
  }
})
