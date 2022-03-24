import mini_request from './index'

export function getSwiper() {
    return mini_request.get("/banner",{
      type:2
    })
}
/**
 * 获取飙升榜的数据
 * @param {*} idx 
 */
export function getRanking(idx) {
  return mini_request.get('/top/list',{
    idx,
  })
}
export function getHotMenu(cat="全部",limit=6,offset=0) {
  return mini_request.get('/top/playlist',{
    cat,
    limit,
    offset
  })
}
export function getMenuSong(id) {
  return mini_request.get('/playlist/detail/dynamic',{
    id
  })
}
export function getPlayMusicDetail(ids) {
  return mini_request.get('/song/detail',{
    ids
  })
}
// 拿到歌词
export function getLyric(id) {
  return mini_request.get('/lyric',{
    id
  })
}