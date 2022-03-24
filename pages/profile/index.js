// pages/profile/index.js
import { getUserInfo }from '../../service/api_login'
Page({
  data: {

  },
  onLoad: function (options) {

  },
  getUserInfo:async function (params) {
    const res = await getUserInfo()
    console.log(res);
  }
 
})