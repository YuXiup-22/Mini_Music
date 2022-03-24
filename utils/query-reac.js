export default function (selectclass) {
  return new Promise((resolve)=>{
    const query = wx.createSelectorQuery()
    query.select(selectclass).boundingClientRect()
    query.exec((res)=>{
      resolve(res)
    })
  })
  
}