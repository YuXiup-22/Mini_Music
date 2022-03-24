// pages/video-detail/index.js
import { getMVinfo,getMVurl, getRelatedMV } from '../../service/api_video'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mvURL:{},
    mvInfo:{},
    relatedMV:{},
    danmulist:[{
      text:"zx你好傻啊",
      color:"#ff0000",
      time:3,
    },{
      text:"zx快来听歌",
      color:"#ff0000",
      time: 2,
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const id = options.id
    console.log(id);
    // 1.获取页面的数据
    this.getPageData(id);
    // 
  },
  /**
   * 获取页面的所有数据
   * @param {*} id 
   */
  getPageData:function (id) {
  // 1.请求播放地址
  getMVurl(id).then(res=>{
    this.setData({mvURL:res.data.data})
  })
  // 2.请求播放信息
  getMVinfo(id).then(res=>{
    this.setData({mvInfo:res.data.data})
  })
  // 3.请求推荐信息
  getRelatedMV(id).then(res=>{
    this.setData({relatedMV:res.data.data})
  })
},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})