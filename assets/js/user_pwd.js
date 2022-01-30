$(function () {
  let form = layui.form;
  let layer = layui.layer;

  form.verify({
    pwd: [
      /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
    ],
    samepwd: function (value) {
      let oldpwd = $('.layui-form [name="oldPwd"]').val();
      if (value === oldpwd) {
        return '不能与原密码相同!!'
      }
    },

    repwd: function (value) {
      let newpwd = $('.layui-form [name="newPwd"]').val();
      if (value !== newpwd) {
        return '与新密码不一致！'
      }
    }
  })

  $('.layui-form').submit(function (e) {
    e.preventDefault();
    $.ajax({
      method: "POST",
      url: '/my/updatepwd',
      data: $(this).serialize(),
      success: res => {
        if (res.status !== 0) {
          return layer.msg('更新密码失败！');
        }
        layer.msg('更新成功！')
        $(this)[0].reset();
      }
    })
  })
})