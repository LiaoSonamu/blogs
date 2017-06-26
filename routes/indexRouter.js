const 
  fs = require(`fs`),
  router = require(`express`).Router(),
  hljs = require('highlight.js'),
  md = require('markdown-it')({
    html: true,
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(lang, str).value;
        } catch (__) {}
      }

      return ''; // use external default escaping
    }
  });

module.exports = app => {
  router.get('/(:articleid)?', function(req, res, next) {
    fs.readFile(`test.md`, `utf8`, (e, d) => {
      res.render(`index`, {article: md.render(d)});
    });
  });

  app.use(`/`, router);
}