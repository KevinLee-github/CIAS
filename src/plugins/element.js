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
  Message,
  // -容器
  Container,
  // - 头部区
  Header,
  // - 侧边栏
  Aside,
  // -右侧内容区
  Main,
  MenuItemGroup,
  MenuItem,
  // - 一级菜单
  Submenu,
  // - 二级菜单
  Menu,
  // - 面包屑导航栏的主体区
  Breadcrumb,
  // - 面包屑导航栏的子菜单区
  BreadcrumbItem,
  // - 卡片
  Card,
  // - 栅格布局-row
  Row,
  // - 栅格布局-col
  Col,
  // - 表格
  Table,
  // - 表格中的每一列
  TableColumn,
  // - switch开关
  Switch,
  // -Tooltip文字提示
  Tooltip,
  // - 分页条
  Pagination,
  // - 对话框
  Dialog,
  // -  消息提示框
  MessageBox

} from 'element-ui'
// -将对应组件安装为插件，以便使用
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(MenuItemGroup)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Menu)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
//! 将message组件挂载到vue的原型对象上
Vue.prototype.$message = Message
//! 将messageBox的confirm对象挂载到Vue原型上
Vue.prototype.$confirm = MessageBox.confirm
