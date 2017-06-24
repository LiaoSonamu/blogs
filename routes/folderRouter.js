const 
  router = require(`express`).Router(),

  TagModel = require(`../models/tagModel`),
  ColumnModel = require(`../models/columnModel`),
  CategoryModel = require(`../models/categoryModel`);

module.exports = app =>{

  // 获取所有分类、列表
  router.get(`/lists`, (req, res) => {
    let result = {};
    TagModel.findAll().then(tags => {
      result.tags = tags;
      return ColumnModel.findAll();
    }).then(columns => {
      result.categories = [];
      return Promise.all(
        columns.map(column => CategoryModel.findAllByColumnID(column._id)
          .then(categories => result.categories.push({column: column, categories: categories}))
        )
      );
    }).then(() => res.json(result), e => res.json(-1));
  });


  app.use('/folder', router);
}