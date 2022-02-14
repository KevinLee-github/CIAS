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

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
