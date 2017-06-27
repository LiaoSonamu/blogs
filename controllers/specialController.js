const 
  hljs = require('highlight.js'),
  crypto = require('crypto'),

  // UserModel = require('../models/userModel'),
  
  md = require('markdown-it')({
    html: true,
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) 
        try {
          return hljs.highlight(lang, str).value;
        } catch (__) {}
      return ''; // use external default escaping
    }
  });


// 生成验证码
const createCode = () => '000000'.replace(/0/g, v => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.random()*26|0]);

module.exports = {
  
  // 首页页面加载
  index(req, res) {
    res.render('index',  {article: md.render('# Hellow word')});
  },

  // // 登录
  // login(req, res) {
  //   let {email, password} = req.body;
  //   password = crypto.createHash('md5').update(password).digest('hex');
  //   UserModel.findOne({email: email, password: password}, '-password', (e, r) => {
  //     if(e) res.json({code: -1, message: '服务器异常'});
  //     if(!r) res.json({code: -1, message: '邮箱或者密码错误'});
  //     req.session.userinfo = r; // session存入用户信息
  //     res.json(r);
  //   });
  // },

  // 注册
  register(req, res) {
    let {email, password, code} = req.body;
    // if(code === req.session.registerCode) res.json({code: -1, message: '验证码错误'});
    $db.query(`INSERT INTO user (nickname, email, password, create_time) VALUES (?, ?, ?, ?)`, [email, email, password, Date.now() / 1000 | 0], (e, r) => {
      // console.log(e, r, f);
    });
  },

  // // 退出登录
  // logout(req, res) {
  //   delete req.session.userinfo;
  //   res.json(1);
  // },

  // // 获取注册验证码
  // registerCode(req, res) {
  //   let email = req.query.email;
  //   UserModel.findOne({email: email}, (e, r) => {
  //     if(e) res.json({code: -1, message: '服务器异常'});
  //     if(r) res.json({code: -1, message: '邮箱已被注册'});
  //     let code = createCode();
  //     req.session.registerCode = code;
  //     app.get('mail').sendMail({
  //       from: 'admin@sonamu.cn',
  //       to: email,
  //       subject: 'Sonamu - 注册账号',
  //       text: `您正在Sonamu注册账号，请保管好自己的验证码： ${code} !`
  //     }, e => res.json(e ? {code: -1, message: '验证码发送失败'} : {code: 1}));
  //   });
  // }
}