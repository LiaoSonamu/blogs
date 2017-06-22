const
  mongoose = require(`mongoose`);

const userSchema = new mongoose.Schema({
  nickname: String, // 昵称
  create_time: Date, // 注册时间
  role: {type: String, enum: ['reader', 'author', 'admin'], default: 'reader'}, // 角色  读者，作者，管理员   默认读者
  email: String // 邮箱
});

module.exports = mongoose.connection.model('user', userSchema);