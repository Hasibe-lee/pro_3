$(function () {
  let layer = layui.layer;
  let form = layui.form;
  let laypage = layui.laypage;
  // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date)

    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())

    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
  }

  // 定义补零的函数
  function padZero(n) {
    return n > 9 ? n : '0' + n
  }

  // 定义一个查询的参数对象，将来请求数据的时候，
  // 需要将请求参数对象提交到服务器
  var q = {
    pagenum: 1, // 页码值，默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据，默认每页显示2条
    cate_id: '', // 文章分类的 Id
    state: '' // 文章的发布状态
  }

  initTable();
  initCate();

  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败！')
        }
        // 使用模板引擎渲染页面的数据
        let htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr);
        // 调用渲染分页的方法
        renderPage(res.total);

      }
    })
  }

  // 初始化文章分类的方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取分类数据失败!')
        }
        let htmlStr = template('tpl-cate', res);
        $('[name=cate_id]').html(htmlStr);
        form.render('select');
      }
    })
  }

  // 为筛选表单绑定submit事件
  $('#form-search').on('submit', function (e) {
    e.preventDefault();
    let cate_id = $('[name=cate_id]').val()
    let state = $('[name=state]').val()

    // 为查询参数对象q中的对应的属性赋值
    q.cate_id = cate_id;
    q.state = state;

    initTable();
  });

  // 定义渲染分页的方法
  function renderPage(total) {
    // 渲染分页
    laypage.render({
      elem: 'pageBox',
      count: total, // 数据总数
      limit: q.pagesize, // 每页显示几条数据
      curr: q.pagenum, //默认选中某一页
      limits: [2, 5, 10, 15, 20],
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      //分页发生切换的回调
      jump: function (obj, first) {
        q.pagesize = obj.limit;
        q.pagenum = obj.curr;
        if (!first) {
          initTable();
        }

      }
    })
  }

  // 代理形式,为删除按钮绑定点击事件处理函数
  $('tbody').on('click', '.btn-delete', function () {
    // 可以用删除按钮的个数来判断页面是否还有数据
    let len = $('.btn-delete').length;
    let data_id = $(this).attr('data-id');
    layer.confirm('是否删除该文章?', {
      icon: 3,
      title: '提示'
    }, function (index) {
      $.ajax({
        method: "GET",
        url: '/my/article/delete/' + data_id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg("删除失败!")
          }
          layer.msg('删除成功!');
          if (len == 1) {
            // 页码值最小必须是1
            q.pagenum = q.pagenum === 1 ? q.pagenum : q.pagenum - 1;
          }
          initTable();
        }
      })

      layer.close(index);
    });
  })

  $('tbody').on('click', '.btn-edit', function () {
    
    let EditId = $(this).attr('data-id');
    location.href = '/article/art_pub.html';
  })
})