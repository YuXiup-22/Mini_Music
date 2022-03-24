// pages/video_music/inedx.js
//网络请求 非默认导出，一定要加{}
import {getTopMV} from "../../service/api_video"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topMVs:[],
    hasMore:true,
    dataItem:Object
  },

  /**
   * 生命周期函数--监听页面加载
   * 
   * me:在这里面请求数据，使用全局的api
   */
  onLoad: function (options) {
  //  getTopMV(0).then(res =>{
  //    this.setData( { topMVs : res.data.data})
  //  })
    this.getTopMvData(0);
  },

/**
 * 其他函数
 * 进行网络请求的在一次封装，避免代码重复
 */
async getTopMvData(offset){
  //判断是否可以加载新数据
  if(!this.data.hasMore) return
  let newData = this.data.topMVs;
  const res = await getTopMV(offset);
  // 下拉刷新动画
  wx.showNavigationBarLoading();

  if(offset === 0){
    // 覆盖原先的所有数据——第一次加载或下拉请求加载最新数据
    newData = res.data.data;
  }else{
    // 拼接数据，下拉加载新数据
    newData = newData.concat(res.data.data);
  }
  // 将更新的数据，传递给页面中的数据
  this.setData({topMVs:newData});
  this.setData({hasMore:res.data.hasMore})
  // 隐藏下拉刷新动画
  wx.hideNavigationBarLoading();
  if(offset === 0){
    // 必须在下拉刷新后停止，内部自己设定有时间结束，但是此时数据已经请求成功
    // 所以当请求成功时，就立即结束下拉刷新
    wx.stopPullDownRefresh()
  }
},

/**
 * 处理组件点击事件
 */
videoItemClick: function(event) {
  console.log("item click",event)
  // 通过id，获取该点击数据的更加详细的数据
  const id = event.currentTarget.dataset.item.id;
  // 页面跳转
  wx.navigateTo({
    url: '/pages/video-detail/index?id='+id,

  })
},
 /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: async function () {
    //判断有无可请求数据  ,注意使用数据必须添加this.data.xx
    // if(!this.data.hasMore) return
    
    // const res = await getTopMV(this.data.topMVs.length);
    // this.setData({ topMVs : this.data.topMVs.concat(res.data.data)})
    // this.setData({hasMore : res.data.hasMore})
    this.getTopMvData(this.data.topMVs.length);
  },
    /**
   * 页面相关事件处理函数--监听用户下拉动作
   *下拉刷新时，就是请求最新的数据，就是便宜量为0时的数据
   * 这个方法，一旦使用会一直进行，所以在请求数据后，手动结束，如上
   */
  async onPullDownRefresh () {
    // const res = await getTopMV(0);
    // this.setData({topMVs:res.data.data})
    this.getTopMvData(0);
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})