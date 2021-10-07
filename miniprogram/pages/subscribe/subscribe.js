// pages/subscribe/subscribe.js
Page({
  data: {
    item: {
      thing1: {
        value: '红包抽奖'
      },
      time3: {
        value: '2021/10/8 10:00'
      },
      thing5: {
        value: '你订阅的礼包抽奖已开启， 点击参与'
      }
    }
  },

  onSubscribe() {
    let that = this;
    let awardTmplId = 'M69uq0MCawMUmIL6giskavHI88KDB32fHiABFEUCICc'
    // 申请发送订阅消息
    wx.requestSubscribeMessage({
      tmplIds: [awardTmplId],
      success(res) {
        console.log(res);
        // 申请订阅成功
        if (res.errMsg === 'requestSubscribeMessage:ok' && res[awardTmplId] === 'accept') {
          // 这里将订阅的课程信息调用云函数存入云开发数据
          wx.cloud.callFunction({
              name: 'subscribe',
              data: {
                data: that.data.item,
                templateId: awardTmplId
              }
            })
            .then((res) => {
              console.log(res);
              "订阅成功~".msg();
            })
            .catch(err => {
              console.log(err);
              "订阅失败！！！".msg();
            })
        }
      }
    })
  }
})