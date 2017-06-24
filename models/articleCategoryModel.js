const mongoose = require('mongoose');

const articleCategorySchema = new mongoose.Schema({
  article: {type: mongoose.Schema.Types.ObjectId, ref: 'article'},
  category: {type: mongoose.Schema.Types.ObjectId, ref: 'category'}
}, {
  versionKey: false
});

module.exports = mongoose.connection.model('articleCategory', articleCategorySchema, 'articleCategory');