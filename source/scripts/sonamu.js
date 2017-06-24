var $vm = null;
// 自定义滚动条配置
const scrollOption = {
  mouseWheel: true,
  scrollbars: true,
  bounce: false,
  interactiveScrollbars: true
};

const headers = {
  'Accept': 'application/json', 
  'Content-Type': 'application/json'
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
    login: {
      username: '',
      checkUsername: true,
      password: '',
      checkPassword: true,
    },
    register: {
      codeTime: 0,
      username: '',
      checkUsername: true,
      password: '',
      checkPassword: true,
      email: '',
      checkEmail: true,
      code: '',
      checkCode: true
    },
    reset: {
      codeTime: 0,
      email: '',
      checkEmail: true,
      password: '',
      checkPassword: true,
      code: '',
      checkCode: true
    },
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
  $vm.$nextTick(() => new IScroll('.right-user', scrollOption));
}

/*********************************methods start************************************ */

// 打开某个right
const showRightBox = {
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

// 表单验证 method
const validate = {
  email: /^\w+@\w+\.\w+$/,
  username: /^\w{3,16}$/,
  password: /^\w{6,16}$/,
  code: /^[a-z]{6}$/i
}

const validateFns = {
  // 登录验证
  validateLoginUsername() {
    return this.userData.login.checkUsername = validate.username.test(this.userData.login.username);
  },
  validateLoginPassword() {
    return this.userData.login.checkPassword = validate.password.test(this.userData.login.password);
  },
  // 注册相关验证
  validateRegisterEmail() {
    return this.userData.register.checkEmail = validate.email.test(this.userData.register.email);
  },
  validateRegisterUsername() {
    return this.userData.register.checkUsername = validate.username.test(this.userData.register.username);
  },
  validateRegisterPassword() {
    return this.userData.register.checkPassword = validate.password.test(this.userData.register.password);
  },
  validateRegisterCode() {
    return this.userData.register.checkCode = validate.code.test(this.userData.register.code);
  },
  // 重置密码相关
  validateResetEmail() {
    return this.userData.reset.checkEmail = validate.email.test(this.userData.reset.email);
  },
  validateResetCode() {
    return this.userData.reset.checkCode = validate.code.test(this.userData.reset.code);
  },
  validateResetPassword() {
    return this.userData.reset.checkPassword = validate.password.test(this.userData.reset.password);
  }
}

// 公共method
const commonMethod = {
  sendCode(type){
    let data = {type: type};
    if(!this.userData[type].codeTime && validateFns[`validate${type.replace(/\w/, v => v.toUpperCase())}Email`].bind(vueData)()){
      this.userData[type].codeTime = 61;
      data.email = vueData.userData[type].email;
      fetch('/common/sendCode', {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      }).then(res => res.json())
      .then(data => {
        if(data) {
          alert('发送验证码失败，请重试！');
          this.userData[type].codeTime = 0;
        } else {
          this.userData[type].codeTime = 60;
          let timer = setInterval(() => --this.userData[type].codeTime || clearInterval(timer), 1000);
        }
      });
    }
  }
}

/*********************************methods end************************************ */

$vm = new Vue({
  el: '#app',
  data: vueData,
  mounted() {
    new IScroll('.layout_left', scrollOption);
  },
  methods: {
    ...showRightBox,
    ...validateFns,
    ...commonMethod
  }
});

window.vueData = vueData;
