// miniprogram/pages/test/test.js
import {
  Phone
} from './phone.js'
var db, _;
var limit = 3;
const IMG = 0,
  VIDEO = 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadMoreList: []
  },

  onLoad: function (options) {
    db = wx.cloud.database()
    _ = db.command

    this.getDataByType()
    // this.getGoodsCount().then(res => {
    //   this.goodsCount = res.total
    // })
    console.log(this.getTotal());
    this.getGoodsCount();
  },

  async getTotal() {
    return wx.cloud.database().collection('goods').count()
  },

  async getGoodsCount() {
    try {
      const result = await this.getTotal()
      this.count = result.total
    } catch (error) {
      console.log(error);
    }

  },

  getDataByType() {
    db.collection('goods').limit(10).orderBy('price', 'asc').orderBy('_id', 'asc').get().then(res => {
      this.setData({
        list: res.data
      })
    })
  },

  addData() {
    this.add('红米', 1999, 'android')
  },

  add(name, price, type) {
    wx.cloud.database().collection('goods').add({
      data: new Phone(name, price, type)
    }).then(res => {
      console.log('添加成功', res)
      this.getDataByType()
    }).catch(err => {
      console.log('添加失败', err);
    })
  },

  updateById(e) {
    // wx.cloud.database().collection('goods').update
    const {
      id
    } = e.currentTarget.dataset;
    console.log(id);
    wx.cloud.database().collection('goods').where({
      _id: id
    }).update({
      data: {
        price: 9999
      }
    }).then(res => {
      console.log(res);
      this.getDataByType()
    }).catch(err => {
      console.error(err);
    })
  },

  remove() {
    const _ = db.command
    wx.cloud.database().collection('goods').where({
        price: _.gte(8888)
      }).remove()
      .then(res => {
        console.log('删除成功');
        this.getDataByType()
      })
  },

  // 分页加载数据
  loadMore() {
    let loadMoreList = this.data.loadMoreList || []
    if (loadMoreList.length >= this.count) return '没有更多了哦~'.msg()
    wx.cloud.database().collection('goods')
      .limit(limit)
      .skip(loadMoreList.length)
      .get()
      .then(res => {
        loadMoreList = loadMoreList.concat(res.data)
        this.setData({
          loadMoreList
        })
      }).catch(err => {
        console.error(err);
      })
  },

  uploadFile(e) {
    const {
      type
    } = e.currentTarget.dataset
    this.chooseFile(parseFloat(type))
  },

  chooseFile(type) {
    switch (type) {
      case IMG:
        this.chooseImage();
        break
      case VIDEO:
        this.chooseVideo();
        break
    }
  },

  uploadFileToServe(cloudPath, filePath, type) {
    wx.showLoading({
      title: '上传中...',
    })
    wx.cloud.uploadFile({
      cloudPath,
      filePath,
    }).then(res => {
      wx.hideLoading({
        success: (ress) => {
          '上传成功~'.msg()
          this.setData({
            [`${['imageUrl','videoUrl'][type]}`]: res.fileID
          })
        },
      })
    }).catch(err => {
      console.error(err.errMsg);
    }).finally(() => {
      console.log('finally');
    })
  },


  chooseImage() {
    wx.chooseImage({
      count: 1,
      sourceType: ['album', 'camera'],
      sizeType: ['original', 'compressed'],
      success: res => {
        this.uploadFileToServe(`img/temp${Math.ceil(Math.random()*1000+1)}.jpg`, res.tempFilePaths[0], IMG);
      }
    });

  },

  chooseVideo() {
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: res => {
        this.uploadFileToServe(`video/temp${Math.ceil(Math.random()*1000+1)}.MP4`, res.tempFilePath, VIDEO);
      }
    })
  },

  getORCode() {
    wx.cloud.callFunction({
      name: 'getQR'
    }).then(res => {
      this.setData({
        qrImg: res.result.fileID
      })
    }).catch(error => {
      console.log(error);
    })
  }
})