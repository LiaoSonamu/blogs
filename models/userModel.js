const
  mongoose = require(`mongoose`);

const userSchema = new mongoose.Schema({
  nickname: String, // 昵称
  password: String, // 密码
  avatar: {type: String, default: 'images/avatar.png'}, // 头像
  create_time: {type: Date, default: Date.now}, // 注册时间
  role: {type: String, enum: ['reader', 'author', 'admin'], default: 'reader'}, // 角色  读者，作者，管理员   默认读者
  email: String, // 邮箱
  is_delete: {type: Boolean, default: false} // 是否被删除
}, {
  versionKey: false
});

module.exports = mongoose.connection.model('user', userSchema, 'user');