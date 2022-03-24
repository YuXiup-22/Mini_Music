// pages/music-player/index.js
import {audioContext,musicPlayStore} from '../../store/index'
//  0 顺序  1 循环 2 随机
const ModelName = ["order","repeat","random"]

Page({
  data: {
    duration:Number,
    currentSong:{},
    lyricRes:[],

    currentLyric:String,
    currentLyricIndex:Number,
    currentTime:Number,

    musicPlayModeIndex:Number,
    currentModelName:String,

    isPlaying:false,
    iconPlayingName:String,

    currentPage:0,
    swipperItemHeight:Number,
    isMusicShow:false,
    
    sliderValue:Number,
    isSliderChanging:false,
    
    // 设置滚动的距离
    scrollTop:0
  },
  onLoad: function (options) {
    // 1.拿到对应数据的id
    const id = options.id
    // 2.进行网络数据请求
    // this.getPageData(id)
    // 2.进行store管理中，数据的监听，将监听的数据拿过来用
    this.setUpMusicPlayListner()


    //3.动态计算高度，做不同机型的适配 
    const globalData = getApp().globalData
    const ScreenHeight = globalData.ScreenHeight
    const statusHeight = globalData.navHeight
    const tabBarHeight = globalData.tabBarHeight
    const ScreenRadio = globalData.ScreenRadio
    const swipperItemHeight = ScreenHeight-statusHeight-tabBarHeight
    this.setData({swipperItemHeight})
    this.setData({isMusicShow:ScreenRadio>2})

    // 4. 音乐播放
    // audioContext.stop()
    // audioContext.src=`https://music.163.com/song/media/outer/url?id=${id}.mp3`
    // audioContext.autoplay = true
    // audioContext.onCanplay(()=>{
    //   audioContext.play()
    // })
    // playContext.play()
    // autoplay() 需要先缓存数据再播放
    // play就是直接播放，不需要先缓存

    // 拿到歌曲播放的进度,注意，在滑动时，不触发，但是滑动停止但是没有松手，又继续执行
    // audioContext.onTimeUpdate(()=>{
    //   // 1.注意此时拿到的是秒钟，但是之前写的时间的转换器，用的毫秒
    //   const currentTime = audioContext.currentTime*1000
    //   // 2.当没有滑动进度条时，根据播放内容实时更新当前时间和进度，
    //   if(!this.data.isSliderChanging){
    //     this.setData({currentTime})
    //     // 拿到当前的进度，使得进度条实时变化
    //     const sliderValue = currentTime / this.data.duration *100
    //     this.setData({sliderValue})
    //     const  scrollTop = this.data.currentLyricIndex * 35
    //     this.setData({scrollTop})
    //   }
    //   // 3.拿到当前的歌词，因为无论是否滑动进度条，都会改变当前时间，所以写在外面
    //   // 为什么在滑动的时候，歌词没有改变呢，因为在滑动时，没有执行该函数，所以没有获取当前的时间，时间依然停留在移动之前
    //   const lyricInfo = this.data.lyricRes
    //   const len = lyricInfo.length
    //   for(let i = 0;i < len ;i ++){
    //     if(currentTime<lyricInfo[i].time){
    //       // 拿到当前歌词的索引
    //       let currentIndex = i-1
    //       // 避免每时每刻的时间变化时，都在给当前歌词赋值，只需要第一次赋值就可以，当索引改变，再进行下一次赋值，优化性能
    //       if(currentIndex !== this.data.currentLyricIndex){
    //         let text = lyricInfo[currentIndex].text
    //         this.setData({currentLyric:text,currentLyricIndex:currentIndex})
    //       }   
    //       break
    //     }
    //   }
    // })
  },
  //------------------ 网络请求--------------------
  // getPageData:function (id) {
  //   getPlayMusicDetail(id).then(res=>{
  //     this.setData({currentSong:res.data.songs[0]})
  //     this.setData({duration:res.data.songs[0].dt})
  //   })
  //   // 拿到解析后的歌词
  //   getLyric(id).then(res=>{
  //     const lyricRes = parseLyric(res.data.lrc.lyric)
  //     this.setData({lyricRes})
  //   })
  // },

  //----------------- 事件响应操作---------------------
  pageChange:function (event) {
    // 拿到当前分页，并设置给数据，使得导航栏跟着一起移动
    this.setData({currentPage:event.detail.current})
  },
  handleSliderChange:function (event) {
    // 1.获取当前进度的value值  0——100
    const value = event.detail.value
    // 2.获取当前时间,毫秒
    const currentTime = this.data.duration * value / 100
    // 3.设置播放的内容，根据当前进度时间,先暂停，等缓存，避免当前播放和拖动同时进行时，发生冲突
    // 这里就不作暂停缓存了，因为一旦暂停，会改变btn按钮
    // audioContext.pause()
    // 注意接收的时间单位是秒
    audioContext.seek(currentTime/1000)
    // 4.使得进度条跟着时间播放移动
    this.setData({sliderValue:value,isSliderChanging:false})
  },
  // 拖动进度条ing事件
  handleSliderChanging:function (event) {
    // 1.获取当前进度的value值  0——100
    const value = event.detail.value
    // 2.获取当前时间,毫秒
    const currentTime = this.data.duration * value / 100
    this.setData({currentTime,isSliderChanging:true})
  },
  handleNavLeftClick:function () {
    wx.navigateBack()
  },
  musicModeChange:function () {
    // 1.计算最新的模式
    let currentIndex = this.data.musicPlayModeIndex + 1
    if(currentIndex === 3) currentIndex = 0
    // 2.将最新数据设置store中的数据
    musicPlayStore.setState("musicPlayModeIndex",currentIndex)
  },
  // 暂停播放
  handlePlaying:function () {
    // musicPlayStore.setState("isPlaying",!this.data.isPlaying)
    // 直接在store中改变
    musicPlayStore.dispatch("setUpMusicStateAction")
  },
  // 下一首
  btnNext:function (params) {
    musicPlayStore.dispatch("changeMusicPlay")
  },
  // 上一首
  btnPrev:function (params) {
    musicPlayStore.dispatch("changeMusicPlay",false)
  },
  // ============监听数据==============
  setUpMusicPlayListner:function () {
    // 1.监听歌曲的基本信息
    musicPlayStore.onStates(["currentSong","duration","lyricRes"],({
      currentSong,
      duration,
      lyricRes
    })=>{
      // 用对象拿的好处，就是如果只拿一个更新的内容，不需要等到其他都传过来，只拿其中一个需要的即可
      if(currentSong) this.setData({currentSong})
      if(duration) this.setData({duration})
      if(lyricRes) this.setData({lyricRes})
    })
    // 2，监听当前歌词、事件的变化
    musicPlayStore.onStates(["currentLyric","currentLyricIndex","currentTime"],({
      currentTime,
      currentLyricIndex,
      currentLyric
    })=>{
      // 时间变化,同时没有滑动进程
      if(currentTime && !this.data.isSliderChanging){
        this.setData({currentTime})
        // 拿到当前的进度，使得进度条实时变化
        const sliderValue = currentTime / this.data.duration *100
        this.setData({sliderValue})
      }
      // 歌词变化
      if(currentLyricIndex){
        const  scrollTop = currentLyricIndex * 35
        this.setData({scrollTop,currentLyricIndex})
      }
      if(currentLyric){
        this.setData({currentLyric})
      }
    })
    // 3.监听模仿模式
    musicPlayStore.onStates(["musicPlayModeIndex","isPlaying"],({musicPlayModeIndex,isPlaying})=>{
      // 拿到当前的播放模式,设置对应的模式名
      if(musicPlayModeIndex!==undefined){
        this.setData({musicPlayModeIndex,currentModelName:ModelName[musicPlayModeIndex]})
      }
      // 注意一定判断的是有无值，
     if(isPlaying !== undefined){
       this.setData({
         isPlaying,
        iconPlayingName:isPlaying ? "pause":"resume"
        })
     }
    })
    
  },
 
})