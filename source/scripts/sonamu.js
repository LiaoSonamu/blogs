var $vm = null;
// 自定义滚动条配置
const scrollOption = {
  mouseWheel: true,
  scrollbars: true,
  bounce: false,
  interactiveScrollbars: true
};

const fetchOption = {
  headers: {
    'Accept': 'application/json', 
    'Content-Type': 'application/json'
  },
  credentials: 'include'
};

const scrollObj = {filter: null, folder: null};


// 加载标签，分类数据
const folderDataLoad = () => {
  fetch('/folder/lists', {...fetchOption})
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
  showLoginBox() {
    this.showBox = this.userData.noLoginShow = 'login';
  },
  showRegisterBox() {
    this.showBox = this.userData.noLoginShow = 'register';
  },
  showResetBox() {
    this.showBox = this.userData.noLoginShow = 'reset';
  },
  showUserBox() {
    if(!this.userData.userinfo) this.showBox = this.userData.noLoginShow;
    else this.showBox = 'user';
  }
}

// 表单验证 method
const validate = {
  email: /^\w+@\w+\.\w+$/,
  username: /^\w{6,20}$/,
  password: /^\w{6,16}$/,
  code: /^[a-z]{6}$/i
}

const validateFns = {
  // 注册验证
  validateRegisterPassword() { return this.registerData.isPassword = validate.password.test(this.registerData.password) },
  validateRegisterEmail() { return this.registerData.isEmail = validate.email.test(this.registerData.email) },
  validateRegisterCode() { return this.registerData.isCode = validate.code.test(this.registerData.code) },
}

// 公共method
const commonMethod = {
  sendRegisterCode(){
    if(!this.registerData.time && this.validateRegisterEmail()) {
      this.registerData.time = 61;
      fetch('/common/sendCode', {
        ...fetchOption,
        method: 'POST',
        body: JSON.stringify({
          type: 'register',
          email: this.registerData.email
        })
      }).then(res => res.json())
      .then(d => {
        if(d && d.code === -1) {
          alert(d.message);
          this.registerData.time = 0;
        }else{
          this.registerData.time = 60;
          let timmer = setInterval(() => --this.registerData.time <= 0 && clearInterval(timmer), 1000);
        }
      }, () => this.registerData.time = 0)
    }
  },
  // 注册
  registerFn(){
    if(!this.registerData.state && this.validateRegisterEmail() && this.validateRegisterCode() && this.validateRegisterPassword()) {
      fetch('/common/register', {
        method: 'POST',
        ...fetchOption,
        body: JSON.stringify({
          email: this.registerData.email,
          password: this.registerData.password,
          code: this.registerData.code.toUpperCase()
        })
      }).then(res => res.json())
      .then(d => {
        if(d.code === -1) alert(d.message);
        else {
          alert('注册成功！');
          this.userData.userinfo = d;
          this.showFilterBox();
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
