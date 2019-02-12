/** 
 * 时间戳格式化函数 
 * @param  {string} format    格式 
 * @param  {int}    timestamp 要格式化的时间 默认为当前时间 
 * @return {string}           格式化的时间字符串 
 */
function date(timestamp){  
  if(timestamp.toString().length<=10){
    var d = new Date(timestamp * 1000);// 时间戳为10位需*1000，时间戳为13位的话不需乘1000
  }else{
    var d = new Date(timestamp);// 时间戳为10位需*1000，时间戳为13位的话不需乘1000
  }
  
  let yyyy = d.getFullYear() + '年';
  let MM = (d.getMonth()+1 < 10 ? '0'+(d.getMonth()+1) : d.getMonth()+1) + '月';
  let dd = d.getDate() + '日';
  let HH = d.getHours() + ':';
  let mm = d.getMinutes() + ':';
  let ss = d.getSeconds();
  return yyyy + MM + dd; 
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


var req=()=>{
  return "https://xrz.xq.hk/";
}



//添加finally：因为还有一个参数里面还有一个complete方法。
Promise.prototype.finally = function (callback) {
    let P = this.constructor;
    return this.then(
        value => P.resolve(callback()).then(() => value),
        reason => P.resolve(callback()).then(() => { throw reason })
    );
};
// 封装post请求
const post = (url,data) => {
  var promise = new Promise((resolve, reject) => {
    //网络请求
    wx.request({
      url: req()+url,
      data: data,
      method: 'POST',
      header: { 
        'content-type': 'application/x-www-form-urlencoded',
        'token':wx.getStorageSync('token')
      },
      success: function (res) {//服务器返回数据
        if (res.statusCode == 200) {
          resolve(res.data);
        } else {//返回错误提示信息
          reject(res.data);
        }
      },
      error: function (e) {
        reject('网络出错');
      }
    })
  });
  return promise;
}
// 封装get请求
const get = (url, data) => {
  var promise = new Promise((resolve, reject) => {
    //网络请求
    wx.request({
      url: req()+url,
      data: data,
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('token')
      },
      success: function (res) {//服务器返回数据
        if (res.statusCode == 200) {
          resolve(res.data);
        } else {//返回错误提示信息
          reject(res.data);
        }
      },
      error: function (e) {
        reject('网络出错');
      }
    })
  });
  return promise;
}

//多图片上传
function uploadimg(data){
  var promise = new Promise((resolve, reject) => {
    var that=this,
   
    i=data.i?data.i:0,
    success=data.success?data.success:0,
  
    fail=data.fail?data.fail:0;
    
    wx.showLoading({
      title: '第'+(i+1)+'张图片上传中...',
      mask: true
    })
  
    wx.uploadFile({
  
    url: data.url, 
  
    filePath: data.path[i],
  
    name: 'file',
  
    formData:null,
  
    success: (resp) => {
      success++;
      data.msg[i] = resp.data;
      resolve(data.msg);
  
      // console.log(i);
 
    //这里可能有BUG，失败也会执行这里
    },
  
    fail: (res) => {
  
      fail++;
      reject(res.data);
  
    },
  
    complete: () => {
  
      // console.log(i);
  
      i++;
  
    if(i==data.path.length){ //当图片传完时，停止调用   
  
      // console.log('执行完毕');

      // console.log('成功：'+success+" 失败："+fail);
      wx.hideLoading()
  
    }else{//若图片还没有传完，则继续调用函数
  
      //console.log(i);
  
      data.i=i;
  
      data.success=success;
  
      data.fail=fail;
  
      that.uploadimg(data);
  
    }   
  
    }
  
    });
  });
  return promise;
 
 }


//导出自定义函数
module.exports = {
  get:get,
  post:post,
  req:req,
  uploadimg:uploadimg,
  date:date
}