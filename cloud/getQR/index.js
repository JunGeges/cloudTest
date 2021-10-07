// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const {
    WXMINIUser,
    WXMINIQR
  } = require('wx-js-utils');

  const appId = 'wxe264490c4b26fea0'; // 小程序 appId
  const secret = '5484daea0809220b39346cb419cee6e2'; // 小程序 secret

  // 获取小程序码，A接口
  let wXMINIUser = new WXMINIUser({
    appId,
    secret
  });

  // 一般需要先获取 access_token
  let access_token = await wXMINIUser.getAccessToken();
  let wXMINIQR = new WXMINIQR();

  let qrResult = await wXMINIQR.getMiniQRLimit({
    access_token,
    path: 'pages/index/index',
    is_hyaline: true
  });

  return await cloud.uploadFile({
    cloudPath: 'normalQr.png',
    fileContent: qrResult
  })
}