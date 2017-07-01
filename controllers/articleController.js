module.exports = {
  // 添加文章
  addArticle(req, res) {
    let userinfo = req.session.userinfo;
    let article = req.body.article;
    if(!userinfo) return res.json({code: -1, message: '请登录!'}); // 检测登录状态
    if(userinfo.role === 'reader') article.state = 2; // 读者设置为待审核
    else article.state = 3; // 管理员或者作者不需要审核，直接通过
    $db.query(`INSERT INTO article (title, context, type, link, author, state, category, create_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [article.title, article.context, article.type, article.link, userinfo.id, article.state, article.category, Date.now() / 1000 | 0],
      (e, r) => {
        if(e) return res.json({code: -1, message: '服务器异常'});
        let article_id = r.insertId;
        let placeholder = [], values = [];
        article.tags.forEach(tag => {
          placeholder.push('(?, ?)');
          values.push(article_id, tag);
        });
        $db.query(`INSERT INTO article_tag (article_id, tag_id) VALUES ${placeholder.join(', ')}`, values, (e, r) => {
          if(e) return res.json({code: -1, message: '服务器异常'});
          res.json({code: 1});
        });
      }
    );
  },
  // 获取文章列表
  getArticleLists(req, res) {

  },
  // 获取文章详情内容 根据id
  getDetail(req, res) {
    let article_id = req.params.id;
  }
}