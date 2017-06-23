const scrollOption = {
  mouseWheel: true,
  scrollbars: true,
  bounce: false,
  interactiveScrollbars: true
};

const vueData = {};

new Vue({
  el: '#app',
  data: vueData,
  mounted() {
    new IScroll('.layout_left', scrollOption);

    new IScroll('.layout_right', scrollOption);
  }
})