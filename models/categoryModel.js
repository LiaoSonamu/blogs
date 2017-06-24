var mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: String,
  column: {type: mongoose.Schema.Types.ObjectId, ref: 'column'}
}, {
  versionKey: false
});

categorySchema.statics = {
  findAllByColumnID(collumnid){
    return new Promise((resolve, reject) => this.model('category').find({column: collumnid}, '-column', (err, result) => err ? reject(err) : resolve(result)));
  }
};

module.exports = mongoose.connection.model('category', categorySchema, 'category');