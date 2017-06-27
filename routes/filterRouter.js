const 
  router = require(`express`).Router(),

  TagModel = require(`../models/tagModel`),
  CategoryModel = require(`../models/categoryModel`);

module.exports = app =>{

  // 获取所有分类、列表
  router.get(`/lists`, (req, res) => {
    let result = {};
    Promise.all([
      TagModel.findAll().then(r => result.tags = r), 
      CategoryModel.findAll().then(r => result.categories = r)
    ]).then(() => res.json(result), 
      e => res.json({code: -1, message: e})
    );
  });

  // 新增标签
  router.post(`/tag`, (req, res) => {
    new TagModel({name: req.body.name}).save((e, r) => e ? res.json({code: -1, message: '服务器异常'}) : res.json(r));
  });

  // 新增分类
  router.post('/category', (req, res) => {
    new CategoryModel({name: req.body.name}).save((e, r) => e ? res.json({code: -1, message: '服务器异常'}) : res.json(r));
  });
  app.use('/filter', router);
}