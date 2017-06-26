let hljs = require('highlight.js');
let $vm = null, scrollObj = null;
const scrollOption = {
  mouseWheel: true,
  scrollbars: true,
  bounce: false,
  preventDefault: false,
  interactiveScrollbars: true
};

$vm = new Vue({
  el: '#app',
  data: vueData,
  mounted() {
    scrollObj = new IScroll('.post-left', scrollOption)
  },
  methods: {
    updateContent() {
      this.html = markdownit({
        html: true,
        highlight: function (str, lang) {
          if (lang && hljs.getLanguage(lang)) {
            try {
              return hljs.highlight(lang, str).value;
            } catch (__) {}
          }
          return ''; // use external default escaping
        }
      }).render(this.markdown);
      scrollObj.refresh();
    }
  }
});