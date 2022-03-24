import {HYEventStore} from 'hy-event-store'
import parseLyric from '../utils/parseLyric'
import {getPlayMusicDetail,getLyric} from '../service/api_music'

// import MyEventStore from '../myEventEmitter/eventStore'

// const audioContext = wx.createInnerAudioContext()
// 使用后台播放，让退出时依然保持音乐的播放
const audioContext = wx.getBackgroundAudioManager()
const musicPlayStore  = new HYEventStore({
  state:{
    id:Number,
    currentSong:{},
    duration:Number,
    lyricRes:[],

    currentTime:Number,
    currentLyric:String,
    currentLyricIndex:Number,
   
    musicPlayModeIndex:0, // 播放模式 0 顺序 1 循环 2 随机
     //播放列表的处理
     musicList:[],
     musicIndex:Number,

    isPlaying:false, //是否暂停
    isStop:false
   
  },
  actions:{
    // 1.歌曲信息的网络请求
    // ctx表示上下文 {id}表示对象里面有id，利于参数传入的扩展
    getCurrentMusicPlayAction(ctx,{ id ,isRefresh=false}){
      if(ctx.id == id && !isRefresh) {
        if(!ctx.isPlaying) this.dispatch("setUpMusicStateAction")
        return
      }
      ctx.id = id
      ctx.isPlaying = true

      // 为了避免点击下一首歌时，出现上一首歌的内容，需要清空上一首歌内容,其实感觉也不用。。。
    ctx.currentSong={}
    ctx.duration=0
    ctx.lyricRes=[]
    ctx.currentTime=0
    ctx.currentLyric=""
    ctx.currentLyricIndex=0


      getPlayMusicDetail(id).then(res=>{
        ctx.currentSong = res.data.songs[0]
        ctx.duration = res.data.songs[0].dt
        audioContext.title = res.data.songs[0].name
      })

      // 拿到解析后的歌词
      getLyric(id).then(res=>{
        const lyricRes = parseLyric(res.data.lrc.lyric)
        ctx.lyricRes = lyricRes
      })

      // 2.播放开始
    audioContext.stop()
    // 后台播放api必填属性
    audioContext.src=`https://music.163.com/song/media/outer/url?id=${id}.mp3`
    audioContext.title = id

    audioContext.autoplay = true
    audioContext.onCanplay(()=>{
      audioContext.play()
    })
    // 3.监听文本和时间
    this.dispatch("setUpAudioContextListenerAction")
    },

    // 2.文本监听，包括歌词和时间等
    setUpAudioContextListenerAction(ctx){
      // 只要可以播放，就立马开始
      audioContext.onCanplay(()=>{
        audioContext.play()
      })
       // 2.1拿到歌曲播放的进度,注意，在滑动时，不触发，但是滑动停止但是没有松手，又继续执行
    audioContext.onTimeUpdate(()=>{
      // 1.注意此时拿到的是秒钟，但是之前写的时间的转换器，用的毫秒
      const currentTime = audioContext.currentTime*1000
      // 2.设置当前的时间
      ctx.currentTime = currentTime
      // 3.拿到当前的歌词，因为无论是否滑动进度条，都会改变当前时间，所以写在外面
      // 为什么在滑动的时候，歌词没有改变呢，因为在滑动时，没有执行该函数，所以没有获取当前的时间，时间依然停留在移动之前
      const lyricInfo = ctx.lyricRes
      const len = lyricInfo.length
      for(let i = 0;i < len ;i ++){
        if(currentTime<lyricInfo[i].time){
          // 拿到当前歌词的索引
          let currentIndex = i-1
          // 避免每时每刻的时间变化时，都在给当前歌词赋值，只需要第一次赋值就可以，当索引改变，再进行下一次赋值，优化性能
          if(currentIndex !== ctx.currentLyricIndex){
            if(lyricInfo[currentIndex].text===undefined) break
            let text = lyricInfo[currentIndex].text
            ctx.currentLyric = text
            ctx.currentLyricIndex = currentIndex
          }   
          break
        }
      }
    })
    //2.2 自动播放下一首
    audioContext.onEnded(()=>{
    // 自动播放下一首
      this.dispatch("changeMusicPlay")
    })
    // 2.3监听播放暂停
    audioContext.onPlay(()=>{
      ctx.isPlaying = true
    })
    audioContext.onPause(()=>{
      ctx.isPlaying = false
    })
    // 播放停止,就是小程序后台一个显示，按×后，小程序停止
    audioContext.onStop(()=>{
      ctx.isPlaying = false
      ctx.isStop = true
    })
    },
    // 3.控制音乐的播放和暂停
    setUpMusicStateAction(ctx){
      // 取反
      ctx.isPlaying  = !ctx.isPlaying
      // 停止后进入点击继续
      if(ctx.isPlaying && ctx.isStop){
        audioContext.src=`https://music.163.com/song/media/outer/url?id=${ctx.id}.mp3`
        audioContext.title = ctx.currentSong.name
        ctx.isStop = false
      }
      if(ctx.isPlaying){
        audioContext.play()
      }else{
        audioContext.pause()
      }
    },
    // 4.切换歌曲
    changeMusicPlay(ctx, isNext = true){
      // 1.拿到顺序
      let index = ctx.musicIndex
      let isRefresh = false
      // 2.新的顺序
      switch(ctx.musicPlayModeIndex){
        case 0://顺序播放
          if(!isNext) index = index -1
          if(isNext) index = index + 1
          if(index === ctx.musicList.length) index = 0
          if(index === -1) index = ctx.musicList.length-1
          break
        case 1://单曲播放
          isRefresh = true
          break
        case 2://随机播放  random取值范围在0-1之间
          index = Math.floor(Math.random() * ctx.musicList.length)
          break
      }
      ctx.musicIndex = index 
      // 3.拿到新歌
      let currentSong = ctx.musicList[index]
      if(!currentSong) currentSong = ctx.currentSong

// 4.播放歌曲
      this.dispatch("getCurrentMusicPlayAction",{id:currentSong.id,isRefresh })
    }
  }
})


export{
  audioContext,
  musicPlayStore
}