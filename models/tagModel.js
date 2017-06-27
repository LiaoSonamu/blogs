const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: String,
}, {
  versionKey: false
});

// 静态方法
tagSchema.statics = {
  // 查询所有
  findAll() {
    return new Promise((resolve, reject) => this.model('tag').find((err, result) => err ? reject('服务器异常') : resolve(result)));
  }
};

module.exports = mongoose.connection.model('tag', tagSchema, 'tag');