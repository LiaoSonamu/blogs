const 
  router = require(`express`).Router(),
  nodemailer = require(`nodemailer`);

// 生成验证码
const createCode = () => '000000'.replace(/0/g, v => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.random()*26|0]);

module.exports = app => {
  
  // 登录
  router.post('/sendCode', (req, res) => {  
    let {email, type} = req.body;
    let code = createCode();
    req.session.bbb = 1;
    req.session[`${type}Code`] = code;
    console.log(req.session.registerCode);
    app.get('mail').sendMail({
      from: 'admin@sonamu.cn',
      to: email,
      subject: `Sonamu - ${type === 'register' ? '注册账号' : '修改密码'}`,
      text: `您${type === 'register' ? '注册账号' : '修改密码'}的验证码为: ${code}`
    }, e => res.json(e));
  });

  // 注册
  router.post('/register', (req, res) => {
    console.log(req.session.aaa);
    console.log(req.session.bbb);
    console.log(req.body);
    console.log(req.session.registerCode);
  });

  app.use(`/common`, router);
}
