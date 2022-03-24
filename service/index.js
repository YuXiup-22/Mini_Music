const BASE_URL = 'http://123.207.32.32:9001'
const LOGIN_BASE_URL = 'http://123.207.32.32:3000'

class mini_request{
  constructor(BASE_URL){
    this.BASE_URL = BASE_URL
  }
  request(url,method,params,header={}){
    return new Promise((resolve,reject)=>{
      wx.request({
        url: this.BASE_URL+url,
        data: params, 
        header:header,  
        method:method,
        success (res) {
          resolve(res);
        },
        fail(err){
          reject(err);
        },
      })
    })
  };
  get(url,params,header){
    // 注意此处必须要返回，否则上一层的返回只作用到这里，要传递给下一次必须return
    return this.request(url,"GET",params,header);
  };
  post(url,params,header){
    return  this.request(url,"POST",params,header);
  }
}
// new 两个请求，一个数据，一个登录
const all_request = new mini_request(BASE_URL);
const login_request = new mini_request(LOGIN_BASE_URL)

export default all_request;
export {
  login_request
}