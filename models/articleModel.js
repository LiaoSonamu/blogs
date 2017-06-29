const
  mongoose = require(`mongoose`);

const articleSchema = new mongoose.Schema({
  title: String, // 标题
  context: String, // 内容
  create_time: {type: Date, default: Date.now}, // 创建时间
  author: {type: mongoose.Schema.Types.ObjectId, ref: 'user'}, // 作者 user外键
  type: {type: String, enum: ['original', 'translate', 'reprint', 'excerpt'], default: 'original'}, // 文章类型 原创 翻译 转载 节选摘抄  默认原创
  // category: {type: mongoose.Schema.Types.ObjectId, ref: 'category'}, // 分类
  // tags: [{type: mongoose.Schema.Types.ObjectId, ref: 'tag'}], // 标签
  link: String, // 非原创文章 原文链接
  read: {type: Number, default: 0}, // 阅读量
  is_publish: {type: Boolean, default: false}, // 是否发布
  is_delete: {type: Boolean, default: false}, // 是否被删除
}, {
  versionKey: false
});

module.exports = mongoose.connection.model('article', articleSchema, 'article');