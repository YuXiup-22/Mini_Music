import mini_request from '../service/index'

export function getHotSearch(params) {
  return mini_request.get('/search/hot')
}
export function  getSearchRes(keywords) {
  return mini_request.get("/search/suggest",{
    keywords,
    type:"mobile"
  })
}
// 搜索点击确定，拿到最终选择搜索的结果
export function  getSearchActionRes( keywords) {
  return mini_request.get('/search',{
    keywords
  })
}