var mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: String
});

module.exports = mongoose.connection.model('tag', tagSchema);