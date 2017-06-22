const mongoose = require('mongoose');

const columnSchema = new mongoose.Schema({
  name: String // 一级分类名字
});


module.exports = mongoose.connection.model('column', columnSchema);