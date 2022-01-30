$(function () {
  // 调用getUserInfo 获取用户信息
  getUserInfo();
  let layer = layui.layer;

  $('#btnLogout').on('click', function () {
    // 提示用户是否退出
    layer.confirm('是否退出登录?', {
      icon: 3,
      title: '提示'
    }, function (index) {
      localStorage.removeItem('token');
      location.href = "/login.html";

      layer.close(index);
    });
  })

})

// 获取用户基本信息
function getUserInfo() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    success: function (res) {
      if (res.status !== 0) {
        return layui.layer.msg('获取用户信息失败');
      }
      renderAvatar(res.data);
    },
    // complete: function (res) {}
  })
}

// 渲染用户头像
function renderAvatar(user) {
  let name = user.nickname || user.username;
  // 欢迎文本
  $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
  if (user.user_pic !== null) {
    // 渲染图片头像
    $('.layui-nav-img').attr('src', user.user_pic).show();
    $('.text-avatar').hide();
  } else {
    $('.layui-nav-img').hide();
    // 文本头像
    let first = name[0].toUpperCase();
    $('.text-avatar').html(first).show();
  }
}