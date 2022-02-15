import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
//! 导入字体图标样式文件，全局使用
import '@/assets/fonts/iconfont.css'
//! 导入全局样式表，全局使用
import '@/assets/css/global.css'
//* 使用axios的基本步骤（全局使用）
// - 1、导入axios
import axios from 'axios'
// - 2、将axios挂载到vue的原型对象上，以便于在其他组件中可以通过this.$http访问到axios
Vue.prototype.$http = axios
// - 3、配置axios的访问的根路径
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'
//! 配置axios的请求拦截器，因为需要授权的 API ，必须在请求头中使用 `Authorization` 字段提供 `token` 令牌
//! 只有当浏览器获取并验证了请求头中的token字段，才对该请求进行放行
// ? 主要的拦截原理就是，在向服务器发送axios请求的时候，该拦截器会获取到浏览器发送的请求头数据，添加sessionStorage中的
// ? token字段，服务器验证了该接口的安全性，提供指定的数据，便达到了控死数据接口的访问的权限
axios.interceptors.request.use(config => {
  // - config对象中包含请求头header
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 返回添加了Authorization的config对象
  return config
})
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
