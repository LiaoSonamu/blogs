const 
  router = require(`express`).Router(),
  specialController = require('./controllers/specialController'),
  tagsAndCategoriesController = require('./controllers/tagsAndCategoriesController'),
  articleController = require('./controllers/articleController');

/***************特殊路由，非REST模式****************/
router.get('/', specialController.index); // 首页
router.post('/login', specialController.login); // 登录
router.post('/register', specialController.register); // 注册
router.post('/logout', specialController.logout); // 退出

/***************验证码相关****************/
router.get('/registerCode', specialController.registerCode); // 获取注册验证码

/***************标签分类****************/
router.get('/tags-and-categories', tagsAndCategoriesController.tagsAndCategories); // 获取所有分类和标签
router.post('/tag', tagsAndCategoriesController.addTag); // 添加标签
router.post(`/category`, tagsAndCategoriesController.addCategory); // 添加分类

/***************文章****************/
router.post('/article', articleController.addArticle);

module.exports = router;