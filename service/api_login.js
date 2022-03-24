import {login_request} from '../service/index'

export function getCode() {
  return new Promise((resolve,reject)=>{
    wx.login({
      timeout: 1000,
      success:res=>{
        const code = res.code
        resolve(code)
      },
      fail:err=>{
        reject(err)
      }
    })
  })
}
export function  codeToToken(code) {
  return login_request.post('/login',{ code })
}
export function checkToken(token) {
  // header里面添加token判断过期
  return login_request.post('/auth',{},{
    token
  })
}export function checkSession() {
  return new Promise(resolve=>{
    wx.checkSession({
      success: () => {
        resolve(true)
      },
      fail:()=>{
        resolve(false)
      }
    })
  })
}
export function getUserInfo() {
  return new Promise((resolve,reject)=>{
    wx.getUserProfile({
      desc: 'Can I get Your Info ?',
      success:res=>{
        resolve(res)
      },
      fail:err=>{
        reject(err)
      }
    })
  })
}