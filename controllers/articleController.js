const ArticleModel = require('../models/articleModel');

module.exports = {
  // 添加文章
  addArticle(req, res) {
    let userinfo = req.session.userinfo;
    let article = req.body.article;
    if(!userinfo) res.json({code: -1, message: '请登录!'});
    article.author = userinfo._id;
    new ArticleModel(article).save((e, r) => e ? res.json({code: -1, message: '服务器异常'}) : res.json(r));
  }
}