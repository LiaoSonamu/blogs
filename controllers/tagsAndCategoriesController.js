const 
  TagModel = require(`../models/tagModel`),
  CategoryModel = require(`../models/categoryModel`);

module.exports = {

  // 获取所有标签和分类
  tagsAndCategories(req, res) {
    let result = {};
    Promise.all([
      TagModel.findAll().then(r => result.tags = r), 
      CategoryModel.findAll().then(r => result.categories = r)
    ]).then(() => res.json(result), e => res.json({code: -1, message: e}));
  },

  // 添加分类
  addTag(req, res) {
    new TagModel({name: req.body.name}).save((e, r) => e ? res.json({code: -1, message: '服务器异常'}) : res.json(r));
  },

  // 添加分类
  addCategory(req, res) {
    new CategoryModel({name: req.body.name}).save((e, r) => e ? res.json({code: -1, message: '服务器异常'}) : res.json(r));
  }
}