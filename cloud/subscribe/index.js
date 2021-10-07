// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const {
      OPENID
    } = cloud.getWXContext();
    // 在云开发数据库中存储用户订阅的抽奖
    const result = await cloud.database().collection('messages')
      .add({
        data: {
          touser: OPENID, //订阅者的openid
          page: 'pages/test/test', //订阅消息卡片点击后打开的小程序页面
          data: event.data, //订阅消息的数据
          templateId: event.templateId, //订阅消息模板ID
          done: false, //消息发送状态设置为false
        }
      })
    return result
  } catch (error) {
    return error
  }

}