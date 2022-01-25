$(function () {
  $('#link_reg').on('click', function () {
    $('.login-box').hide();
    $('.reg-box').show();
  });

  $('#link_login').on('click', function () {
    $('.login-box').show();
    $('.reg-box').hide();
  })

  let form = layui.form;

  form.verify({
    pass: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    repass: function (value) {
      if ($('.reg-box [name=password]').val() !== value) {
        return '两次密码不一致';
      }
    }
  })

  let layer = layui.layer;
  $('#form_reg').on('submit', function (e) {
    e.preventDefault();
    let data = {
      username: $('#form_reg [name=username]').val(),
      password: $('#form_reg [name=password]').val(),
    }
    $.ajax({
      method: 'POST',
      url: '/api/reguser',
      data,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        layer.msg('注册成功,请登录!');
        $('#link_login').click();
      }

    })
  })

  $('#form_login').on('submit', function (e) {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/api/login',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('用户名或密码不正确');
        }
        layer.msg('登录成功');
        localStorage.setItem('token', res.token)
        location.href = '/index.html'
      }
    })
  })
})