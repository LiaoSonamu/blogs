const mongoose = require('mongoose');

const articleTagSchema = new mongoose.Schema({
  article: {type: mongoose.Schema.Types.ObjectId, ref: 'article'},
  tag: {type: mongoose.Schema.Types.ObjectId, ref: 'tag'}
});

module.exports = mongoose.connection.model('articleTag', articleTagSchema);