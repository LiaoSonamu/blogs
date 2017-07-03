const crypto = require('crypto');

// 生成验证码
const createCode = () => '000000'.replace(/0/g, v => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.random()*26|0]);

module.exports = {
  
  // 首页页面加载
  index(req, res) {
    $db.query(`UPDATE article a SET a.read=a.read+1 ORDER BY a.create_time DESC LIMIT 1`, (e, r) => {
      if(e) res.render('index', {article: null, code: -1});
      $db.query(`SELECT a.id, a.title, a.context, a.create_time, a.type, a.link, a.read, a.category categoryid, c.name category, u.id userid, u.nickname,
          (SELECT GROUP_CONCAT('{"id":', tag.id, ',"name":"', tag.name, '"}') FROM article_tag LEFT JOIN tag ON tag.id=article_tag.tag_id WHERE article_tag.article_id=a.id) tags
        FROM article a
        LEFT JOIN user u ON a.author=u.id
        LEFT JOIN category c ON a.category=c.id
        WHERE a.state=3
        ORDER BY a.create_time DESC
        LIMIT 1`, (e, r) => {
          if(e) return res.render('index', {article: null, code: -1});
          if(!r.length) return res.render('index', {article: null, code: -1});
          r = r[0];
          console.log(r);
          r.tags = JSON.parse(`[${r.tags}]`);
          res.render('index', {article: r, code: 1});
        }
      );
    });
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