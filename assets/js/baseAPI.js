$.ajaxPrefilter(function (options) {
  options.url = "http://www.liulongbin.top:3007" + options.url;

  // 统一为用权限的借口设置请求头
  if (options.url.indexOf('/my/') !== -1) {
    options.headers = {
      Authorization: localStorage.getItem('token') || ''
    }
  }
  // 全局统一挂载complete回调函数
  options.complete = function (res) {
    //  在complete中,可以使用res.responseJSON拿到服务器响应的数据
    if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
      localStorage.removeItem('token');
      location.href = '/login.html';
    }
  }
})