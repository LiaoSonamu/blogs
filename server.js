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
    mongoose = require(`mongoose`),
    nodemailer = require(`nodemailer`),
    MongoStore = require('connect-mongo')(session),

    app = express(),
    config = require(`require-yml`)(`config.yml`);

mongoose.Promise = require('bluebird');

app.set('mail', nodemailer.createTransport(config.mail));
app.set(`views`, path.join(__dirname, `views`));
app.set(`view engine`, `ejs`);

app.use(logger(`dev`));
// app.use(express.favicon(path.join(__dirname, `public`)));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, `public`)));
app.use(partial());
app.use(session({
  store: new MongoStore({
    interval: 3600000,
    url: config.mongoUrl
  }),
  secret: 'sonamu',
  cookie: {maxAge: 3600000}
}));

app.use('*', (req, res, next) =>{
  res.locals.$static = config.static;
  next();
});

// 路由配置
require(`./routes/indexRouter`)(app);
require(`./routes/commonRouter`)(app);
require(`./routes/folderRouter`)(app);

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get(`env`) === `development` ? err : {};

  res.status(err.status || 500);
  console.log(err);
});

// 创建MongoDB连接
mongoose
  .connect(config.mongoUrl)
  .connection
  .on(`connected`, () => {
    console.log(`Mongodb连接成功！`);
    // 创建HTTP连接
    (http
      .createServer(app)
      .listen(config.httpPort))
      .on('error', error => {throw error})
      .on('listening', () => console.log(`HTTP服务创建成功，监听端口：${config.httpPort}`));
  })
  .on(`error`, err => console.log(`Mongodb连接失败：${err}`))
  .on(`disconnected`, () => console.log(`Mongodb断开连接！`));