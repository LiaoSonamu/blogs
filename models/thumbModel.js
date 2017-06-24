const
  mongoose = require(`mongoose`);

const thumbSchama = new mongoose.Schema({
  article: {type: mongoose.Schema.Types.ObjectId, ref: 'article'},
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
  create_time: {type: Date, default: Date.now}
}, {
  versionKey: false
});

module.exports = mongoose.connection.model('thumb', thumbSchama, 'thumb');