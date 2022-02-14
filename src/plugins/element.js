import Vue from 'vue'
//! 按需导入自己当前项目需要的组件
import {
  // - 按钮
  Button,
  // - 表单
  Form,
  // - 表单项
  FormItem,
  // -表单输入框组件
  Input,
  // -弹框提示组件
  Message
} from 'element-ui'
// -将对应组件安装为插件，以便使用
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
//! 将message组件挂载到vue的原型对象上
Vue.prototype.$message = Message
