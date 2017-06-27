let hljs = require('highlight.js');

let $vm = null, 
mainScroll = null, postFilterScroll = null, postViewScroll = null,
filterScroll = null;

// 自定义滚动条配置
const scrollOption = {
  mouseWheel: true,
  scrollbars: true,
  bounce: false,
  preventDefault: false,
  interactiveScrollbars: true
};

const fetchOption = {
  headers: {
    'Accept': 'application/json', 
    'Content-Type': 'application/json'
  },
  credentials: 'include'
};

// 加载标签，分类数据等筛选数据
const filterLists = () => {
  fetch('/filter/lists', {...fetchOption})
    .then(res => res.json())
    .then(d => {
      if(d.code === -1) {
        vueData.filterData.state = -1;
        vueData.filterData.message = '服务器异常';
      }else{
        vueData.filterData.state = 1;
        vueData.filterData.tags = d.tags;
        vueData.filterData.categories = d.categories;
      }
      $vm.$nextTick(() => filterScroll = new IScroll('.right-filter', scrollOption));
    });
}

/*********************************methods start************************************ */

// 打开某个right
const showRightBox = {
  rightBoxGo(box) {
    let i = this.historyBox.indexOf(box);
    if(~i) box = this.historyBox.splice(i, 1)[0];
    this.historyBox.push(box);
    let {title, noctrls} = this[`${box}Data`];
    this.showBoxData.title = title;
    this.showBoxData.noctrls = noctrls;
    // 需要加载的页面
    switch(box) {
      case 'filter': this.filterData.state !== 1 && filterLists(); break;
    }
  },
  rightBoxBack() {
    this.historyBox.pop();
    let box = this.historyBox[this.historyBox.length - 1];
    let {title, noctrls} = this[`${box}Data`];
    this.showBoxData.title = title;
    this.showBoxData.noctrls = noctrls;
  },
  rightBoxHome() {
    this.historyBox.splice(1);
    let box = this.historyBox[this.historyBox.length - 1];
    let {title, noctrls} = this[`${box}Data`];
    this.showBoxData.title = title;
    this.showBoxData.noctrls = noctrls;
  },
  // 删除历史记录中的某些页面值， 避免在登录成功后返回到登录，注册等页面
  historyRemove(...x) {
    this.historyBox = this.historyBox.filter(v => !~x.indexOf(v));
  },
  // 打开发布编辑器
  showPost() {
    this.post.isShow = true;
  }
}

// 发布文章或者编辑文章相关
const postArticles = {
  postArticleChange() {
    this.post.html = markdownit({
      html: true,
      highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang))
          try {
            return hljs.highlight(lang, str).value;
          } catch (__) {};
        return ''; // use external default escaping
      }
    }).render(this.post.markdown);

    $vm.$nextTick(() => postViewScroll.refresh());
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
  // 登录验证
  validateLoginEmail(){ return this.loginData.isEmail = validate.email.test(this.loginData.email) },
  validateLoginPassword() { return this.loginData.isPassword = validate.password.test(this.loginData.password) },
  // 注册验证
  validateRegisterPassword() { return this.registerData.isPassword = validate.password.test(this.registerData.password) },
  validateRegisterEmail() { return this.registerData.isEmail = validate.email.test(this.registerData.email) },
  validateRegisterCode() { return this.registerData.isCode = validate.code.test(this.registerData.code) },
}

// 公共method
const commonMethod = {
  scrollTop() {
    mainScroll.scrollTo(0, 0);
  },
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
  // 登录
  loginFn(){
    if(!this.loginData.state && this.validateLoginEmail() && this.validateLoginPassword()) {
      this.loginData.state = 1;
      fetch('/common/login', {
        method: 'POST',
        ...fetchOption,
        body: JSON.stringify({
          email: this.loginData.email,
          password: this.loginData.password,
        })
      }).then(res => res.json())
      .then(d => {
        this.loginData.state = 0;
        // 登录成功
        if(d.code != -1) {
          this.userinfo = d;
          this.rightBoxGo('ucenter');
          this.historyRemove('login', 'register');
        }else alert(d.message);
      }, () => {
        alert('登录失败');
        this.loginData.state = 0;
      });
    }
  },
  // 注册
  registerFn(){
    if(!this.registerData.state && this.validateRegisterEmail() && this.validateRegisterCode() && this.validateRegisterPassword()) {
      this.registerData.state = 1;
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
        this.registerData.state = 0;
        if(d.code === -1) alert(d.message);
        else {
          this.userinfo = d;
          this.rightBoxGo('ucenter');
          this.historyRemove('login', 'register');
        }
      }, () => {
        alert('注册失败');
        this.registerData.state = 0
      });
    }
  }
}


/*********************************methods end************************************ */

$vm = new Vue({
  el: '#app',
  data: vueData,
  mounted() {
    mainScroll = new IScroll('.layout_left', scrollOption);
    postFilterScroll = new IScroll('.post-box-info', scrollOption);
    postViewScroll = new IScroll('.post-box-view', scrollOption);
  },
  methods: {
    ...showRightBox,
    ...validateFns,
    ...commonMethod,
    ...postArticles
  }
});

window.vueData = vueData;
