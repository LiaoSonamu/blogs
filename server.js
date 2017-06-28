const 
    express = require(`express`),
    path = require(`path`),
    favicon = require(`serve-favicon`),
    logger = require(`morgan`),
    cookieParser = require(`cookie-parser`),
    bodyParser = require(`body-parser`),
    partial = require('express-partials'),
    session = require('express-session'),
    http = require(`http`),
    nodemailer = require(`nodemailer`),
    mysql = require('mysql'),

    app = express(),
    config = require(`require-yml`)(`config.yml`);

global.$db = mysql.createPool(config.mysql);
global.$mail = nodemailer.createTransport(config.mail);
// pool.getConnection(function(err, conn) {
//   console.log(err, conn);
// });

app.set(`views`, path.join(__dirname, `views`));
app.set(`view engine`, `ejs`);

app.use(logger(`dev`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'sonamu'
}));
app.use(favicon(path.join(__dirname, `/favicon.jpg`)));
app.use(express.static(path.join(__dirname, `public`)));
app.use(partial());


app.use('*', (req, res, next) => {
  res.locals.$userinfo = req.session.userinfo;
  res.locals.$static = config.static;
  next();
});

app.use('/', require(`./routers`));

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get(`env`) === `development` ? err : {};

  res.status(err.status || 500);
  console.log(err);
});

// 创建HTTP连接
(http
  .createServer(app)
  .listen(config.httpPort))
  .on('error', error => {throw error})
  .on('listening', () => console.log(`HTTP服务创建成功，监听端口：${config.httpPort}`));
