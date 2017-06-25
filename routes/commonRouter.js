const 
  router = require(`express`).Router(),
  userModel = require('../models/userModel'),
  crypto = require('crypto');

// 生成验证码
const createCode = () => '000000'.replace(/0/g, v => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.random()*26|0]);

module.exports = app => {
  
  // 登录
  router.post('/sendCode', (req, res) => {  
    let {email, type} = req.body;
    userModel.findByEmail(email).then(r => {
      return new Promise((resolve, reject) => {
        if(r) reject('邮箱已被注册,请更换邮箱或找回密码');
        else {
          let code = createCode();
          req.session[`${type}Code`] = code;
          app.get('mail').sendMail({
            from: 'admin@sonamu.cn',
            to: email,
            subject: `Sonamu - ${type === 'register' ? '注册账号' : '修改密码'}`,
            text: `您${type === 'register' ? '注册账号' : '修改密码'}的验证码为: ${code}`
          }, e => e ? reject('验证码发送失败,请重试') : resolve(null));
        }
      });
    }).then(r => res.json(r), e => res.json({code: -1, message: e}));
  });

  // 注册
  router.post('/register', (req, res) => {
    let {email, password, code} = req.body;
    let sessionCode = req.session.registerCode;

    if(code === sessionCode) {
      delete req.session.registerCode;
      new userModel({
        nickname: email,
        email: email,
        password: crypto.createHash('md5').update(password).digest('hex')
      }).save((e, r) => {
        if(e) res.json({code: -1, message: '注册失败，请重试'});
        else {
          req.session.userinfo = r;
          delete r.password;
          res.json(r);
        }
      });
    }else res.json({code: -1, message: '验证码错误'});
  });

  app.use(`/common`, router);
}
