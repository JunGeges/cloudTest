// miniprogram/pages/cloudFun/cloudFun.js
Page({
  onLoad() {
    wx.cloud.callFunction({
      name: 'getData'

    }).then( res => {
      console.log(res);
    })

    wx.cloud.callFunction({
      name: 'updateData'

    }).then( res => {
      console.log('updateData', res);
    })
  }
})