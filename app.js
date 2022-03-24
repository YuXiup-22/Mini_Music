// app.js
// 获取code的api
import {getCode,codeToToken,checkToken,checkSession} from './service/api_login'
import { TOKEN_KEY } from './constants/const_token'
// import { login_request } from './service'
App({
  globalData: {
    userInfo: null,
    navHeight:Number,
    ScreenHeight:Number,
    tabBarHeight:44,
    ScreenRadio:Number
  },
    onLaunch: async function () {
    // 展示本地存储能力
    // const logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    // 拿到导航栏的高度
    const info =wx.getSystemInfoSync()
    this.globalData.navHeight = info.statusBarHeight
    this.globalData.ScreenHeight = info.screenHeight
    const screenWidth  =info.screenWidth
    this.globalData.ScreenRadio = info.screenHeight / screenWidth

    // 代码优化，由于判断是一个异步操作，为了避免影响launch方法，把其拿在外面，内部调用，
    // 而且，调用这步是同步，不会等到函数内容执行完才执行，若后面还要，则会立即执行后面的
   this.handleLogin()
  },
  async handleLogin(){
// 2,让用户进行默认登录，不需要弹窗授权
    // 判断有无token
    const token = wx.getStorageSync(TOKEN_KEY)
    // 判断token有无过期
    const checkRes = await checkToken(token)
    // 判断session_key有无过期
      const checkSeRes = await checkSession()
    // token过期 || 没有token || seccion_key过期  都要重新登录
      if(checkRes.statusCode !== 200 || !token || !checkSeRes){
        this.loginAction()
      }
  },
  // 登录操作
  loginAction:async function () {
    // 1.拿到小程序发的code
    const code = await getCode()

    // 2.发送code给开发服务器
    const result = await codeToToken(code)
    const token = result.data.token
  // 3.保存token
  wx.setStorageSync(TOKEN_KEY, token)
  }
})
