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

  app.use('/filter', router);
}