<template>
  <!-- Home页容器 -->
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="@/assets/heima.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="loginOut">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse? '64px': '200px'">
        <!-- 折叠按钮 -->
        <div class="toggle-button" @click="toggleCollapse" title="显示/隐藏侧边栏"><i :class="isFoldicon"></i></div>
        <!-- 侧边栏的功能展示区 -->
        <!-- 使用双层for循环来进行渲染一级导航菜单项和二级导航菜单项 -->
        <el-menu
        background-color="#333744"
         text-color="#fff"
         active-text-color="#409eff"
         :unique-opened="true"
         :collapse="isCollapse"
         :collapse-transition="false"
         :router="true"
         :default-active="activePath"
         >
          <!-- 第一个一级菜单项 -->
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 子菜单项 -->
            <el-menu-item
            :index="'/'+subItem.path"
            v-for="subItem in item.children"
            :key="subItem.id"
            @click="saveNavStatu('/'+subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主题区域 -->
      <el-main>
        <!-- 添加router-view -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      //! 菜单导航栏名称的数据模型
      menuList: [],
      //! iconfont 图标的对象，用于设置一级菜单项的图标
      iconObj: {
        '125': 'iconfont icon-users',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      //* 控制侧边栏的折叠与展开
      isCollapse: false,
      //* 折叠图标
      isFoldicon: 'el-icon-s-unfold',
      //* 点击二级菜单来链接的地址
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')

    // console.log(this.activePath)
  },
  methods: {
    //! 获取侧边栏的所有菜单项
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
      // - 获取菜单数据失败
        this.$message.error(res.meta.msg)
      } else { //* 将解构出的res的data数组赋值给menuList数组
        this.menuList = res.data
      }
    },
    // ? 点击退出按钮，执行该函数，清除token表示当前操作是退出登录，导航到登录页面重新登录
    loginOut () {
      this.$confirm('此操作将退出当前系统, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //! 清除token
        window.sessionStorage.clear()
        //! 编程式路由导航到login页面
        this.$router.push('/login')
        this.$message.success('退出成功')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消此操作'
        })
      })
    },
    // ? 点击折叠按钮响应该事件
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
      if (!this.isCollapse) {
        // 展开的情况下
        this.isFoldicon = 'el-icon-s-unfold'
      } else {
        this.isFoldicon = 'el-icon-s-fold'
      }
    },
    // ? 点击二级菜单的链接，将触发该事件，将对应的path保存在sessionStorage中，
    // ? 当刷新网页的时候，还是可以直接进入到以前点击的页面
    saveNavStatu (path) {
      // console.log(11)
      // console.log(path)
      //! 将当前的hash地址赋值给activePath属性
      this.activePath = path
      //! 将path保存到sessionStorage中，当刷新浏览器的时候，对应的子菜单项依然高亮
      window.sessionStorage.setItem('activePath', path)
    }
  }

}
</script>

<style lang="less" scoped>
  .home-container {
    height: 100%;
  }

  .el-header {
    background-color: #09334E;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;

    >div {
      display: flex;
      align-items: center;

      span {
        margin-left: 15px;
      }
    }
  }

  .el-aside {
    background-color: #333744;
    //! 将默认的设置的菜单的边框重置为none
    .el-menu{
      border-right: none;
    }
  }

  .el-main {
    background-color: #eaedf1;
  }
  //设置字体标题和菜单标题之间的间距
  .iconfont{
    margin-right: 10px;
  }
  //折叠按钮
  .toggle-button {
    background-color: #4a5064;
    font-size: 20px;
    line-height: 25px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
  </style>
