var mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: String,
  colunm: {type: mongoose.Schema.Types.ObjectId, ref: 'column'}
});

module.exports = mongoose.connection.model('category', categorySchema);