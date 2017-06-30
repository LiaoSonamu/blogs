module.exports = {

  // 获取所有标签和分类
  tagsAndCategories(req, res) {
    $db.query(`SELECT id, name FROM tag`, (e, tags) => {
      if(e) return res.json({code: -1, message: '服务器异常'});
      $db.query(`SELECT id, name FROM category`, (e, categories) => {
        if(e) return res.json({code: -1, message: '服务器异常'});
        res.json({tags: tags, categories: categories});
      });
    });
  },

  // 添加分类
  addTag(req, res) {
    let userinfo = req.session.userinfo;    
    if(!userinfo) return res.json({code: -1, message: '请重新登录!'});
    if(userinfo.role === 'reader') return res.json({code: -1, message: '读者没有添加权限'});
    let name = req.body.name;
    $db.query(`INSERT INTO tag (name) VALUES (?)`, [name], (e, r) => {
      if(e) return res.json({code: -1, message: '服务器异常'});
      res.json({id: r.insertId, name: name});
    });
  },

  // 添加分类
  addCategory(req, res) {
    let userinfo = req.session.userinfo;
    if(!userinfo) return res.json({code: -1, message: '请重新登录!'});
    if(userinfo.role === 'reader') return res.json({code: -1, message: '读者没有添加权限'});
    let name = req.body.name;
    $db.query(`INSERT INTO category (name) VALUES (?)`, [name], (e, r) => {
      if(e) return res.json({code: -1, message: '服务器异常'});
      res.json({id: r.insertId, name: name});
    });
  }
}