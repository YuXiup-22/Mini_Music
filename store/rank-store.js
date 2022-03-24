import {HYEventStore} from 'hy-event-store'
import {getRanking} from '../service/api_music'

// import MyEventStore from '../myEventEmitter/eventStore'
const RankMenuMap={0:"newSong",1:"hotRanking",2:"orignSong",3:"riseSong"}

const rankingstore = new  HYEventStore({
  // 存储的内容
  state:{
    newSong:{},//0.新歌
    hotRanking:{},//1.热歌
    orignSong:{},//2.原创
    riseSong:{}//3.飙升
  },
  actions:{
    // 获取巅峰榜的数据，根据传入的值idx，获取不同的数据
    getRankingDataActions(ctx){
      // getRanking(1).then(res=>{
      //   //拿到数据
      //   ctx.hotRanking = res.data.playlist;
      // })
      /**
       * 利用循环，发送idx不同的网络请求，并且保存到对应的全局数据中，
       */
      for(let i=0;i<4;i++){
        getRanking(i).then(res=>{
          
          //获取键值对应的value
          const dataName = RankMenuMap[i];
          ctx[dataName] = res.data.playlist;
        })
      }
    }
  }
})
// 导出
export {
  rankingstore,
  RankMenuMap
}