import mini_request from './index'

export function getTopMV( offset ,limit=10){
  return mini_request.get("/top/mv",{
    offset,
    limit
  })
}

/**
 * 请求MV播放地址
 * @param {number} id  MV的id
  */
export function  getMVurl(id) {
  return mini_request.get("/mv/url",{
    id,
  })
}
/**
 * 请求MV的信息
 * @param {number} id  MV的id
 * 
 */
export function  getMVinfo(mvid) {
  return mini_request.get("/mv/detail",{
    mvid,
  })
}

/**
 * 请求MV的相关信息
 * @param {number} id  MV的id
 * 
 */
export function getRelatedMV(id) {
  return mini_request.get("/related/allvideo",{
    id
  })
}
