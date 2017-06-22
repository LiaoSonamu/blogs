
$('.left').mCustomScrollbar();
$('.right_content').mCustomScrollbar(); 

// 底部菜单切换
const changeMenu = menu => {
  $(`.menu-${menu}`).addClass('active').siblings().removeClass('active');
  $(`.box-${menu}`).addClass('active').siblings().removeClass('active');
}

$('.J_menu').on('click', 'li', function(){
  changeMenu($(this).attr('data-menu'));
});