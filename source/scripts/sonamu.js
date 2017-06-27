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

const fetchResponse = r => {
  if(r.ok) return r.json();
  else throw '请求失败';
}

// 加载标签，分类数据等筛选数据
const filterLists = () => {
  fetch('/filter/lists', {...fetchOption})
    .then(fetchResponse)
    .then(d => {
      if(d.code === -1) throw d.message;
        
      vueData.filterData.state = 1;
      vueData.filterData.tags = d.tags;
      vueData.filterData.categories = d.categories;

      $vm.$nextTick(() => filterScroll = new IScroll('.right-filter', scrollOption));
    }).catch(e => {
      vueData.filterData.state = -1;
      alert('string' === typeof e ? e : '服务器异常');
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
    this.post.state = 1; //TODO 如果是编辑文章 需在Ajax后设置
    this.filterData.state !== 1 && filterLists();
  }
}

// 发布文章或者编辑文章相关
const postArticles = {
  postChangeNature(nature) {
    this.post.nature = nature;
  },
  postChangeCategory(category) {
    this.post.category = category;
  },
  postChangeTags(tag) {
    let i = this.post.tags.indexOf(tag);
    if(~i) this.post.tags.splice(i, 1);
    else this.post.tags.push(tag);
  },
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
  },
  postAddtag() {
    if(!this.post.isAddTag && this.post.addTag.trim()) {
      this.post.isAddTag = true;
      fetch('/filter/tag', {
        method: 'POST',
        ...fetchOption,
        body: JSON.stringify({name: this.post.addTag})
      }).then(fetchResponse)
      .then(d => {
        this.post.isAddTag = false;
        if(d.code === -1) throw d.message;
        this.filterData.tags.push(d);
        this.post.addTag = '';
        this.post.tags.push(d._id);
      }).catch(e => {
        this.post.isAddTag = false;
        alert('string' === typeof e ? e : '服务器异常');
      });
    }
  },
  postAddCategory(){
    if(!this.post.isAddCategory && this.post.addCategory) {
      this.post.isAddCategory = true;
      fetch('/filter/category', {
        method: 'POST',
        ...fetchOption,
        body: JSON.stringify({name: this.post.addCategory})
      }).then(fetchResponse)
      .then(d => {
        this.post.isAddCategory = false;
        if(d.code === -1) throw d.message;
        this.filterData.categories.push(d);
        this.post.addCategory = '';
        this.post.category = d._id;
      }).catch(e => {
        this.post.isAddCategory = false;
        alert('string' === typeof e ? e : '服务器异常');
      });
    }
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
      }).then(fetchResponse)
      .then(d => {
        if(d.code === -1) throw d.message;

        this.registerData.time = 60;
        let timmer = setInterval(() => --this.registerData.time <= 0 && clearInterval(timmer), 1000);
      }).catch(e => {
        this.registerData.time = 0;
        alert('string' === typeof e ? e : '服务器异常');
      });
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
        if(d.code === -1) throw d.message;
        
        this.userinfo = d;
        this.rightBoxGo('ucenter');
        this.historyRemove('login', 'register');
      }).catch(e => {
        this.loginData.state = 0;
        alert('string' === typeof e ? e : '服务器异常');
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
  },
  methods: {
    ...showRightBox,
    ...validateFns,
    ...commonMethod,
    ...postArticles
  },
  watch: {
    filterData: {
      deep: true,
      handler(v){
        if(v.state === 1 && this.post.state === 1) 
          $vm.$nextTick(() => {
            postFilterScroll = new IScroll('.post-box-info', scrollOption);
            postViewScroll = new IScroll('.post-box-view', scrollOption);
          });
　　　}
    },
    post: {
      deep: true,
      handler(v){
        if(v.state === 1 && this.filterData.state === 1) 
          $vm.$nextTick(() => {
            postFilterScroll = new IScroll('.post-box-info', scrollOption);
            postViewScroll = new IScroll('.post-box-view', scrollOption);
          });
　　　}
    }
  }
});

window.vueData = vueData;
