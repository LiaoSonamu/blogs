const
  mongoose = require(`mongoose`);

const userSchema = new mongoose.Schema({
  nickname: String, // 昵称
  password: String, // 密码
  create_time: {type: Date, default: Date.now}, // 注册时间
  role: {type: String, enum: ['reader', 'author', 'admin'], default: 'reader'}, // 角色  读者，作者，管理员   默认读者
  email: String, // 邮箱
  isdelete: Boolean // 是否被删除
}, {
  versionKey: false
});

userSchema.statics = {
  findByEmail(email) {
    return new Promise((resolve, reject) => this.model('user').findOne({email: email}, (e, r) => e ? reject('服务器异常') : resolve(r)));
  }
}

module.exports = mongoose.connection.model('user', userSchema, 'user');