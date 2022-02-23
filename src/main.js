import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
//! 导入字体图标样式文件，全局使用
import '@/assets/fonts/iconfont.css'
//! 导入全局样式表，全局使用
import '@/assets/css/global.css'
//! 导入tree-grid插件
import TreeTable from 'vue-table-with-tree-grid'
//! 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
//! 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
//! 导入nprogress的js和css
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
//* 使用axios的基本步骤（全局使用）
// - 1、导入axios
import axios from 'axios'
// - 2、将axios挂载到vue的原型对象上，以便于在其他组件中可以通过this.$http访问到axios
Vue.prototype.$http = axios
// - 3、配置axios的访问的根路径
// axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'
// axios.defaults.baseURL = 'http://vueshop.pixiv.download/api/private/v1/'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//! 配置axios的请求拦截器，因为需要授权的 API ，必须在请求头中使用 `Authorization` 字段提供 `token` 令牌
//! 只有当浏览器获取并验证了请求头中的token字段，才对该请求进行放行
// ? 主要的拦截原理就是，在向服务器发送axios请求的时候，该拦截器会获取到浏览器发送的请求头数据，添加sessionStorage中的
// ? token字段，服务器验证了该接口的安全性，提供指定的数据，便达到了控死数据接口的访问的权限
// - 在请求拦截器中，展示网络请求的进度条
axios.interceptors.request.use(config => {
  NProgress.start()
  // - config对象中包含请求头header
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 返回添加了Authorization的config对象
  return config
})
// - 在响应的拦截器中，隐藏网络请求的进度条
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
Vue.config.productionTip = false
//! 将tree-grid插件注册为全局可用的组件
Vue.component('tree-table', TreeTable)
//! 将富文本编辑器注册成为全局可用的组件
Vue.use(VueQuillEditor)
//! 使用过滤器来格式化商品列表中的商品创建时间的格式
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  //* 年 padStart(2, '0')：字符串的方法，当字符串长度不足两位时，使用0在前面补充到两位
  const y = dt.getFullYear()
  //* 月
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  //* 日
  const d = (dt.getDate() + '').padStart(2, '0')
  //* 时
  const hh = (dt.getHours() + '').padStart(2, '0')
  //* 分
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  //* 秒
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
