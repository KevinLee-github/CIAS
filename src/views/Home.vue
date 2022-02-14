<template>
  <div>
    <el-button type="info" @click="loginOut">退出</el-button>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    // ? 点击退出按钮，执行该函数，清除token表示当前操作是退出登录，导航到登录页面重新登录
    loginOut () {
      //! 清除token
      window.sessionStorage.clear()
      //! 编程式路由导航到login页面
      this.$router.push('/login')
      this.$message.success('退出成功')
    }
  }

}
</script>

<style lang="less" scoped>

</style>
