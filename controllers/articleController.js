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
    let pagesize = 20, where = '', values = [];
    let {page, keywords, nature, tags, categories} = req.query;

    if(nature !== 'all') values.push(nature) && (where += ` AND a.nature=?`);
    if(!~tags.indexOf(-1)) values.push(`(${tags.join(', ')})`) && (where += ` AND t.tag_id IN ?`);
    if(!~tags.indexOf(-1)) values.push(`(${categories.join(', ')})`) && (where += ` AND a.category IN ?`);
    if(keywords.trim()) values.push(`%${keywords}%`) && values.push(`%${keywords}%`) && (where += ` AND a.title LIKE ? OR a.context LIKE ?`);
    $db.query(`SELECT a.title, a.id, a.type
      FROM article a
      LEFT JOIN user u ON a.author=u.id
      LEFT JOIN category c ON a.category=c.id
      LEFT JOIN article_tag t ON a.id=t.article_id
      WHERE state=3${where}
      GROUP BY a.id
      LIMIT ${pagesize*page},${pagesize}`, values, (e, r) => {
        if(e) return res.json({code: -1, message: '服务器异常'});
        res.json(r);
      });
  },
  // 获取文章详情内容 根据id
  getDetail(req, res) {
    let article_id = req.params.id;
  }
}