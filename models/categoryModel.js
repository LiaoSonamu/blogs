var mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: String
}, {
  versionKey: false
});

categorySchema.statics = {
  findAll(){
    return new Promise((resolve, reject) => this.model('category').find((err, result) => err ? reject('服务器异常') : resolve(result)));
  }
};

module.exports = mongoose.connection.model('category', categorySchema, 'category');