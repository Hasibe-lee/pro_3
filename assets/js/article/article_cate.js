$(function () {
  let layer = layui.layer;
  let form = layui.form;
  initArtCateList();

  function initArtCateList() {
    $.ajax({
      type: "GET",
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败！');
        }
        let htmlStr = template('tpl-table', res);
        $('tbody').html(htmlStr);
      }
    })
  }

  // 添加类别绑定点击事件
  let indexAdd = null;
  $('#btnAddCate').on('click', function () {
    let dialogHtml = $('#dialog-add').html();
    indexAdd = layer.open({
      type: 1,
      area: ['500px', '300px'],
      title: '添加文章分类',
      content: dialogHtml,
    });

    $('body').on('submit', '#form-add', function (e) {
      e.preventDefault();
      $.ajax({
        method: "POST",
        url: '/my/article/addcates',
        data: $(this).serialize(),
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('新增分类失败！');
          }
          initArtCateList();
          layer.msg('新增分类成功！');
          layer.close(indexAdd);
        }
      })
    })
  })
  let indexEdit = null;

  $('tbody').on('click', '.btn-edit', function () {
    let editHtml = $('#dialog-edit').html();
    indexEdit = layer.open({
      type: 1,
      area: ['500px', '300px'],
      title: '修改文章分类',
      content: editHtml,
    });
    let EditId = $(this).attr('data-id');

    $.ajax({
      method: 'GET',
      url: '/my/article/cates/' + EditId,
      success: function (res) {
        form.val('form-edit', res.data);
      }
    })
    $('body').on('submit', '#form-edit', function (e) {
      e.preventDefault();
      $.ajax({
        method: 'POST',
        url: '/my/article/updatecate',
        data: $(this).serialize(),
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('更新失败！');
          }
          initArtCateList();
          layer.msg('更新成功！');
          layer.close(indexEdit);
        }
      })
    })
  })

  $('tbody').on('click', '.btn-del', function () {
    let DelId = $(this).attr('data-id');
    layer.confirm('是否删除该分类?', {
      icon: 3,
      title: '提示'
    }, function (index) {
      $.ajax({
        method: "GET",
        url: "/my/article/deletecate/" + DelId,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除失败！');
          }
          initArtCateList();
          layer.msg('删除成功！');

        }
      })

      layer.close(index);
    });
  })
})