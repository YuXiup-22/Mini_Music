// components/ranking-song-v1/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    rankingList:{
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
    clickRanking:function (params) {
      console.log(params.currentTarget.dataset.idx);
      this.triggerEvent("clickRanking",params.currentTarget.dataset.idx)
    }
  }
})
