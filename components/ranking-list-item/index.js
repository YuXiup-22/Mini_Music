// components/ranking-list-item/index.js
import {musicPlayStore} from '../../store/index'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    songinfo:{
      type:Object,
      value:{}
    },
    index:{
      type:Number,
      value:0
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
    // 网页跳转到播放页面
    ClickToPlayer:function (event) {
      const id = event.currentTarget.dataset.id
      wx.navigateTo({
        url: "/pages/music-player/index?id="+id,
      })
      musicPlayStore.dispatch("getCurrentMusicPlayAction",{ id })
    }
  }
})
