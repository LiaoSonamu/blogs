const 
  hljs = require('highlight.js'),
  crypto = require('crypto'),

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

  // 登录
  login(req, res) {
    let {email, password} = req.body;
    password = crypto.createHash('md5').update(password).digest('hex');
    $db.query(`SELECT id, nickname, email, avatar, role, is_delete FROM user WHERE email=? AND password=?`, [email, password], (e, r) => {
      if(e) return res.json({code: -1, message: '服务器异常'});
      if(!r.length) return res.json({code: -1, message: '用户名或者密码错误'});
      req.session.userinfo = r[0];
      res.json(r[0]);
    });
  },

  // 注册
  register(req, res) {
    let {email, password, code} = req.body;
    if(email + code !== req.session.registerCode) return res.json({code: -1, message: '验证码错误'});
    password = crypto.createHash('md5').update(password).digest('hex');
    $db.query(`INSERT INTO user (nickname, email, password, create_time) VALUES (?, ?, ?, ?)`, [email, email, password, Date.now() / 1000 | 0], (e, r) => {
      if(e) return res.json({code: -1, message: '服务器异常'});
      $db.query(`SELECT id, nickname, email, avatar, role, is_delete FROM user WHERE id=?`, [r.insertId], (e, r) => {
        if(e || !r.length) return res.json({code: -1, message: '服务器异常'});
        req.session.userinfo = r[0];
        res.json(r[0]);
      });
    });
  },

  // 退出登录
  logout(req, res) {
    delete req.session.userinfo;
    res.json(1);
  },

  // 获取注册验证码
  registerCode(req, res) {
    let email = req.query.email;
    $db.query(`SELECT id, nickname, email, avatar, role, is_delete FROM user WHERE email=?`, [email], (e, r) => {
      if(e) return res.json({code: -1, message: '服务器异常'});
      if(r.length) return res.json({code: -1, message: '邮箱已被注册'});
      let code = createCode();
      req.session.registerCode = email + code;
      $mail.sendMail({
        from: 'admin@sonamu.cn',
        to: email,
        subject: 'Sonamu - 注册账号',
        text: `您正在Sonamu注册账号，请保管好自己的验证码： ${code}!`
      }, e => res.json(e ? {code: -1, message: '验证码发送失败'} : {code: 1}));
    });
  }
}