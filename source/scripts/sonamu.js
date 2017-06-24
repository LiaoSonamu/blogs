var $vm = null;
// 自定义滚动条配置
const scrollOption = {
  mouseWheel: true,
  scrollbars: true,
  bounce: false,
  interactiveScrollbars: true
};

const scrollObj = {filter: null, folder: null};

const vueData = {

  showBox: 'filter', // filter(筛选) folder(分类标签)

  searchData: { // 搜索内容
    keywords: '', // 关键字
    nature: 'all', // 文章来源 all(全部) original(原创) translate(翻译) reprint(转载) excerpt(节选)
    sort: { // 排序
      id: 'date', // 排序ID  （date, read, comment, collection, thumb）
      type: 'desc' // 方式 desc/asc
    }, 
    filter: { // 筛选
      type: '', // 筛选类型 tag/categories
      id: '' // 筛选ID (标签/分类ID)
    }
  },

  // 所有页面data都有一个state属性，0未加载  1 已加载 -1 加载失败

  filterData: {
    articles: [], // 文章列表
  },
  folderData: {
    state: 0,
    tags: [], // 标签列表
    categories: [], // 分类列表
  },
  userData: {
    state: 0,
    loginOrRegister: 'login', // 登录login/注册register (登录状态不考虑该字段)
    userinfo: null
  }
};

// 加载标签，分类数据
const folderDataLoad = () => {
  fetch('/folder/lists')
    .then(res => res.json())
    .then(data => {
      if(data === -1) {
        vueData.folderData.state = -1;
        vueData.folderData.message = '服务器异常';
        return ;
      }
      vueData.folderData.state = 1;
      Vue.set(vueData.folderData, 'tags', data.tags);
      Vue.set(vueData.folderData, 'categories', data.categories);
      $vm.$nextTick(() => new IScroll('.right-folder', scrollOption));
    });
}

// 加载用户信息
const userDataLoad = () => {
  vueData.userData.state = 1;
  // TODO 加载真实数据  设置userinfo
}

$vm = new Vue({
  el: '#app',
  data: vueData,
  mounted() {
    new IScroll('.layout_left', scrollOption);
  },
  methods: {
    showFolderBox() {
      this.showBox = 'folder';
      if(this.folderData.state !== 1) folderDataLoad();
    },
    showFilterBox() {
      this.showBox = 'filter';
    },
    showUserBox() {
      this.showBox = 'user';
      if(this.userData.state !== 1) userDataLoad();
    }
  }
});

window.vueData = vueData;
