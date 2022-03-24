// pages/ranking_menu/index.js
import {rankingstore} from '../../store/index'
import {getMenuSong} from '../../service/api_music'
import {musicPlayStore} from '../../store/index'
Page({
  data: {
    rankingName:"巅峰榜名字",
    rankingData:{},
    type:{}
  },
  onLoad: function (options) {
    //拿到url中某个参数RankingName的值
    const type = options.type
    this.setData({type})
    if(type === 'menu'){
      const id = options.id
      //请求数据
      getMenuSong(id).then(res=>{
        this.setData({rankingData:res.data.playlist})
        console.log(this.data.rankingData);
      })

    }else if(type === 'rank'){
        const rankingName = options.RankingName
        this.setData({rankingName})
        //拿到数据共享中的对应数据，并利用钩子函数进行相应的处理
        rankingstore.onStates([rankingName],this.getRankingData)
    }
  },
  onUnload: function () {

  },
  getRankingData(res){
    var name = this.data.rankingName
    console.log(name);
    // res = res[]
    console.log(res);
    res=res[name]
    this.setData({rankingData:res})
  },
  playList:function (event) {
    // 拿到点击的index,和歌曲列表
    const index = event.currentTarget.dataset.index
    const musicList = this.data.rankingData.tracks
    musicPlayStore.setState(["musicIndex"],index)
    musicPlayStore.setState(["musicList"],musicList)
  }
})