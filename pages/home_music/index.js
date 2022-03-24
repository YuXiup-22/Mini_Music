// pages/home_music/index.js
import {getSwiper,getHotMenu} from '../../service/api_music'
import getHeight from '../../utils/query-reac'
import {rankingstore,RankMenuMap,musicPlayStore} from '../../store/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner:{
      type:[],
      default:[],
      recommand:[]
    },
    swipperHeight:0,
    hotSongMenu:[],
    hotSongMenu_CN:[],
    //巅峰榜的数据 新歌/原创/飙升，但是这里只拿到home页面巅峰帮所要的数据
    RankingSong:{0:{},2:{},3:{}},

    currentSong:{},

    isPlaying:false,
    animStates:'pause',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取页面数据
    this.getPageData();
    // 获取推荐视频,发起共享视频数据请求，这个函数也请求了所有的歌单数据
    rankingstore.dispatch("getRankingDataActions")
      /*
      *拿到共享数据
      */
    rankingstore.onStates(["hotRanking"],res=>{
      // 如果最开始拿到的数据没有内容，则不进行
      if(!res.hotRanking.tracks) return;
      // 数组slice方法，获取0-5的下标的数组
      const recommand = res.hotRanking.tracks.slice(0,6)
      console.log(recommand);
      // 名字相同时，可以简写
      this.setData({recommand});
    })
    rankingstore.onStates(["newSong"],this.getRankingSong(0))
    rankingstore.onStates(["orignSong"],this.getRankingSong(2))
    rankingstore.onStates(["riseSong"],this.getRankingSong(3))

    /**
     * 拿到当前播放数据
     */
    musicPlayStore.onStates(["currentSong","isPlaying"],({currentSong,isPlaying})=>{
      if(currentSong) this.setData({currentSong})
      if(isPlaying!==undefined) 
        this.setData({
          isPlaying,
         animStates:isPlaying?'running':'paused'})
    })
  },
  /**
   * 网络请求swipper的数据
   */
  getPageData:function () {
     // 获取轮播图
      getSwiper().then(res=>{
        this.setData({banner:res.data.banners})
      })
      //获取歌单
      getHotMenu().then(res=>{
        this.setData({hotSongMenu:res.data.playlists})
      })
      getHotMenu("华语").then(res=>{
        this.setData({hotSongMenu_CN:res.data.playlists})
      })
  },
  
  /**
   * 获取图片的高度，就是img组件的高度
   */
  getSwipperHeight:function () {
    getHeight('.img').then(res=>{
      this.setData({swipperHeight:res[0].height})
    })
  },
  clickInput:function () {
    wx.navigateTo({
      url: '/pages/search-box/index',
    })
  },
  clickHotRanking:function () {
    this.navigateToRankingMenu("hotRanking");
  },
  clickMore:function (params) {
    const rankingname = RankMenuMap[params.detail]
      // console.log("监听巅峰榜点击",rankingname);
     this.navigateToRankingMenu(rankingname)

  },
  navigateToRankingMenu:function (rankingname) {
    //动态设置不一样的页面
    wx.navigateTo({
      url: `/pages/ranking_menu/index?RankingName=${rankingname}&type=rank`,
    })
  },
  handlePlay:function () {
    musicPlayStore.dispatch("setUpMusicStateAction")
  },
  handleMusicBarClick:function (params) {
    // 点击musicbar进行跳转
    wx.navigateTo({
      url: '/pages/music-player/index?id='+this.data.currentSong.id,
    })
  },
  /**
   * 获取巅峰帮相应的数据，并填入
   */
  getRankingSong(idx){
    //注意一定要返回函数，因为该返回函数，作为拿全局数据的钩子函数，对拿到的数据进行处理
    return (res)=>{
      var keyname = RankMenuMap[idx]
      //如果没有数据就返回
      res=res[keyname]
      if(!res.tracks) return;
      const name = res.name;
      const coverimg = res.coverImgUrl;
      const play = res.playCount;
      const songs = res.tracks.slice(0,3);
      const itemSongObj = {name,coverimg,play,songs};
      //将拿到的数据，和已经存在的数据保存到一个变量上
      const rankingData = {...this.data.RankingSong,[idx]:itemSongObj}
      //将该变量，动态赋值给原数据上，这两步，将拿到的数据根据idx，添加到原数据中，避免覆盖之前的数据
      this.setData({RankingSong:rankingData})
  
    }
  },
  musicList:function (event) {
    const index = event.currentTarget.dataset.index
    const musicList = this.data.recommand
    musicPlayStore.setState("musicIndex",index)
    musicPlayStore.setState("musicList",musicList)
  }
  
})