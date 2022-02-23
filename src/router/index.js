import Vue from 'vue'
import VueRouter from 'vue-router'
//* Login登录组件
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import Welcome from '@/views/Welcome.vue'
import Users from '@/views/user/Users.vue'
import Rights from '@/views/rights/Rights.vue'
import Roles from '@/views/rights/Roles'
import Cate from '@/views/goods/Cate.vue'
import Params from '@/views/goods/Params'
import Goods from '@/views/goods/GoodsList.vue'
import Orders from '@/views/order/Orders'
import Reports from '@/views/data/Reports'
import AddGoods from '@/views/goods/AddGoods'
Vue.use(VueRouter)
//* 路由规则
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/home/welcome',
    children: [
      { path: 'welcome', component: Welcome },
      { path: '/rights', component: Rights },
      { path: '/users', component: Users },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: Goods },
      { path: '/orders', component: Orders },
      { path: '/reports', component: Reports },
      { path: '/goods/addgoods', component: AddGoods }
    ]
  }
]

const router = new VueRouter({
  routes
})
//! 设置路由导航守卫，其目的是控制用户的访问权限，防止用户在未登录的情况下，访问其他页面
router.beforeEach((to, from, next) => {
  // - 基本的业务逻辑是
  // ? 1、当用户访问的是login页面直接放行即可
  // - 通过to.path来获取url中的hash地址，，来判断访问的是哪个页面
  if (to.path === '/login') {
    next()
  } else {
    //! 判断sessionStorage中是否存在token，存在的话表示已经登录过，直接放行，不存在的话，直接跳转到登录页面
    const token = window.sessionStorage.getItem('token')
    if (token) {
      next()
    } else {
      // - 强制跳转到login
      next('/login')
    }
  }
})
export default router
