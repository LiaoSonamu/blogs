const mongoose = require('mongoose');

const columnSchema = new mongoose.Schema({
  name: String // 一级分类名字
}, {
  versionKey: false
});

columnSchema.statics = {
  // 查询所有
  findAll(){
    return new Promise((resolve, reject) => this.model('column').find((err, result) => err ? reject(err) : resolve(result)));
  }
}


module.exports = mongoose.connection.model('column', columnSchema, 'column');