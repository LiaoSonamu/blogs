const scrollOption = {
  mouseWheel: true,
  scrollbars: true,
  bounce: false,
  // fadeScrollbars: true,
  interactiveScrollbars: true
};

// 底部菜单切换
// const changeMenu = menu => {
//   $(`.menu-${menu}`).addClass('active').siblings().removeClass('active');
//   $(`.box-${menu}`).addClass('active').siblings().removeClass('active');
// }

$('.J_menu').on('click', 'li', function(){
  changeMenu($(this).attr('data-menu'));
});

new Vue({
  el: '#vue-box',
  data: {},
  mounted() {
    new IScroll('.left', scrollOption);

    new IScroll('.right_content', scrollOption);
  }
})