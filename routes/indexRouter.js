const 
  fs = require(`fs`),
  marked = require(`marked`),
  router = require(`express`).Router();

  const md = require('markdown-it')();

module.exports = app => {
  router.get('/', function(req, res, next) {
      fs.readFile(`test.md`, `utf8`, (e, d) => {
        res.render(`index`, {article: md.render(d)});
      });
  });

  app.use(`/`, router);
}