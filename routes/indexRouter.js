const 
  fs = require(`fs`),
  marked = require(`marked`),
  router = require(`express`).Router();

  const md = require('markdown-it')();

module.exports = app => {
  router.get('/', function(req, res, next) {
    // let getTags = tagModel.findAll().then(d => console.log(d), e => console.log(e));
    // let getColumns = columnModel.findAll().then(d => console.log(d), e => console.log(e));
    // var a = new categoryModel({
    //   colunm: '594db9aef2c7b11cc4a861c2',
    //   name: 'Javascript权威指南'
    // }).save();
    // Promise.all([getTags, getColumns]).then(() => {
      fs.readFile(`test.md`, `utf8`, (e, d) => {
        res.render(`index`, {article: md.render(d)});
      });
    // });
  });

  app.use(`/`, router);
}