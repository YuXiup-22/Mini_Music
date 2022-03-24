// pages/search-box/index.js
import {getHotSearch, getSearchRes,getSearchActionRes} from '../../service/api_search'
import stringToNodes from '../../utils/string-to-node'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    keywords:[],
    suggestsearch:[],
    suggestres:[],
    value:"",
    resultSongs:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取页面数据
    this.getPageData()
  },
// 网络请求
  getPageData:function (params) {
    getHotSearch().then(res=>{
      this.setData({keywords:res.data.result.hots})
    })
  },
// search事件处理
  handleSearch:function (event) {
    // 保存搜索关键字
    const keyword = event.detail;
    this.setData({value:keyword})
    // 搜索逻辑
    if(!keyword.length) {
      this.setData({suggestsearch:[]})
      this.setData({resultSongs:[]})
      return
    }
    getSearchRes(keyword).then(res=>{
      // 拿到搜索结果
      const suggestres = res.data.result.allMatch;
      this.setData({suggestres})
      // 如果搜索结果没有值时
      if(!suggestres) return
      // 拿到每个关键字，并添加到数组中
      const keywords = suggestres.map(item=>item.keyword)
      // 富文本的nodes
      const suggestsearch =[]
      for(const item of keywords){
        const nodes = stringToNodes(item,this.data.value)
        //将每个结果的不同node，添加到总的结果中
        suggestsearch.push(nodes)
      }
      // 拿到每个结果的富文本nodes，将数据保存
      this.setData({suggestsearch})
    })
  },
  // 点击搜索确定，搜索最后的结果
  handleSearchAction:function () {
    getSearchActionRes(this.data.value).then(res=>{
      this.setData({resultSongs:res.data.result.songs})
    })
  },
  // 由于代码优化，将此函数与下方的函数进行整合
  // handleSuggestItemClick:function (event) {
  //   const index = event.currentTarget.dataset.index
  //   const keyword = this.data.suggestres[index].keyword
  //   this.setData({value:keyword})
  //   this.handleSearchAction()
  // },
  handleSearchActionRes:function (event) {
    // 1.获取搜索的关键词，进行搜索
    const keyword = event.currentTarget.dataset.keyword
    // 2.设置value，使得搜索框同步
    this.setData({value:keyword})
    // 3.发送网络请求，得到搜索结果
    this.handleSearchAction()
  }
})
// 问题，一次搜索确定后想要再次进行搜索，建议搜索不显示，因为当value为空时，没有清空搜索结果！