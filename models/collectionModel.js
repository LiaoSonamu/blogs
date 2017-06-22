const
  mongoose = require(`mongoose`);

const collectionSchama = new mongoose.Schema({
  article: {type: mongoose.Schema.Types.ObjectId, ref: 'article'},
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'user'}
});

module.exports = mongoose.connection.model('collection', collectionSchama);