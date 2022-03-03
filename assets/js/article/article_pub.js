$(function () {
  let layer = layui.layer;
  let form = layui.form;

  initCate();
  initEditor();

  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('初始化文章分类失败!');
        }
        let htmlStr = template('tpl-cate', res);
        $('[name=cate_id]').html(htmlStr);
        form.render('select');
      }
    })
  }

  // 1. 初始化图片裁剪器
  var $image = $('#image')

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }

  // 3. 初始化裁剪区域
  $image.cropper(options)

  $('#btnChooseImage').on('click', function () {
    $('#coverFile').click();
  })

  $('#coverFile').on('change', function (e) {
    var files = e.target.files;
    if (files.length === 0) {
      return layer.msg('请选择文件');
    }
    var newImgURL = URL.createObjectURL(files[0]);

    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', newImgURL) // 重新设置图片路径
      .cropper(options) // 重新初始化裁剪区域
  })

  let art_state = '已发布';

  $('#btnSave2').on('click', function () {
    art_state = '草稿';
  })


  $('#form-pub').on('submit', function (e) {
    e.preventDefault();
    let fd = new FormData($(this)[0]);
    fd.append('state', art_state);
    // 将裁剪的图片输出为一个文件对象
    $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        fd.append('cover_img', blob);
        publishArticle(fd);
      })

  })


  function publishArticle(fd) {
    $.ajax({
      method: 'POST',
      url: '/my/article/add',
      data: fd,
      // 如果向服务器提交FormData 格式的数据 ，必须添加的两个配置项
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('发布失败!')
        }
        layer.msg('发布成功');
        location.href = '/article/art_list.html'
      }
    })
  }

  function getArticleinfo() {
    let id = localStorage.getItem('article_id');
    $.ajax({
      method: 'GET',
      url: '/my/article/' + id,
      success: function (res) {
        form.val('form-edit', res.data);
        form.render('select');
        console.log(res.data.content);
        document.querySelector('[data-id=content]').innerHTML = res.data.content;
        localStorage.removeItem('article_id');
      }
    })
  }
  let urlHref = window.location.href;
  if (urlHref.includes('art_pub.html')) {
    // console.log(parent.document.querySelector('iframe').getAttribute('src'));
    getArticleinfo();
  }

  /*  function UpArticle(fd) {
     $.ajax({
       method: 'POST',
       url: '/my/article/edit',
       data: fd,
       // 如果向服务器提交FormData 格式的数据 ，必须添加的两个配置项
       contentType: false,
       processData: false,
       success: function (res) {
         if (res.status !== 0) {
           return layer.msg('更新失败!')
         }
         layer.msg('更新成功');
         location.href = '/article/art_list.html'
       }
     })
   } */

})