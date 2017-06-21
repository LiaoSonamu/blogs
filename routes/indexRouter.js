const 
  fs = require(`fs`),
  marked = require(`marked`),
  router = require(`express`).Router();

  var userModel = require(`../models/userModel`);
  var md = require('markdown-it')();

module.exports = app => {
  router.get('/', function(req, res, next) {
    userModel.find((err, re) => console.log(err, re));
    // fs.readFile(`test.md`, `utf8`, (e, d) => {
    //   res.send(md.render(d));
    // });
    // res.render(`index`);
  });

  app.use(`/`, router);
}