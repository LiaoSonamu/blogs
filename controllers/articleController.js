module.exports = {
  // 添加文章
  addArticle(req, res) {
    let userinfo = req.session.userinfo;
    let article = req.body.article;
    if(!userinfo) res.json({code: -1, message: '请登录!'});
    
  },
  getDetail(req, res) {
    // ArticleModel.find
  }
}