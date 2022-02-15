<template>
<!--
   //! Login模块的基本的业务逻辑：
    //-1、对应组件的创建
    //- 2、数据的绑定
    //- 3、使用element-ui中的表单校验对输入的用户名和密码进行登录之前的校验
    //- 4、通过ref获取到指定的节点的实例对象，利用element-ui提供的方法进行点击登录按钮发送axios之前，进行表单验证是否
           //- 4.1 合法，合法再进行axios请求的发送
    //- 5、登陆成功之后，将获取的token数据保存到window的sessionStorage中，为了让用户登录过系统之后，下次再次进入系统免登录
 -->
  <div class="login-container">
    <div class="login-box">
      <!-- 图片的box域 -->
      <div class="avatar-box">
        <img src="@/assets/logo.png" alt="">
      </div>
      <el-form label-width="0px" class="login-form" :model="loginForm" :rules="loginFormRules" ref="loginFromRef">
        <!-- 用户名输入框 -->
        <el-form-item label="" prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username" type="text"></el-input>
        </el-form-item>
        <!-- 用户密码输入框 -->
        <el-form-item label="" prop="password">
          <el-input prefix-icon="iconfont icon-3702mima" v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <!-- 登录和重置按钮 -->
        <el-form-item label="" class="login-button">
          <el-button type="primary" @click="loginFormLogin">登录</el-button>
          <el-button type="info" @click="loginFormReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>

</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      // - 登录表单的数据模型
      loginForm: {
        //* 用户名
        username: 'admin',
        //* 密码
        password: '123456'
      },
      // -表单的验证规则，其中包括用户名和密码的验证规则
      loginFormRules: {
        username: [{
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        },
        {
          min: 3,
          max: 10,
          message: '长度在 3 到 10 个字符',
          trigger: 'blur'
        }
        ],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        },
        {
          min: 6,
          max: 15,
          message: '长度在 3 到 15 个字符',
          trigger: 'blur'
        }
        ]
      }
    }
  },
  methods: {
    // - 点击重置按钮，该事件响应，通过ref获取表单的实例对象，调用resetFields函数，达到重置表单的目的
    loginFormReset () {
      this.$refs.loginFromRef.resetFields()
    },
    // -点击登录按钮，响应该事件，对表单进行预验证，通过判断isValid的值，可以判断出验证是否通过
    loginFormLogin () {
      //! 对整个表单进行校验的方法，参数为一个回调函数。该回调函数会在校验结束后被调用，
      //! 并传入两个参数：是否校验成功和未通过校验的字段。若不传入回调函数，则会返回一个 promise
      this.$refs.loginFromRef.validate(async isValid => {
        //* 校验失败，直接返回
        if (!isValid) return false
        else {
          const { data: res } = await this.$http.post('login', this.loginForm)
          // console.log(res)
          if (res.meta.status !== 200) {
            //! 登录失败，弹出失败提示信息
            this.$message.error('登录失败')
          } else {
            //! 登录成功，弹出登录成功提示信息
            this.$message.success('登录成功')
            //* 登录成功的基本的业务逻辑
            //* 1、将获取的接口数据中的token保存到客户端的sessionStrong中
            window.sessionStorage.setItem('token', res.data.token)
            // - 1.1使用token的目的是判断用户是否已经登录，避免重复登录
            // - 1.2保存在sessionStorage中的目的是判断当前是否登录只是在本次会话中的生效
            // ? 2、通过编程式路由的导航直接跳转到Home主页
            this.$router.push('/home')
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  //- 登录容器
  .login-container {
    height: 100%;
    background-color: #2b4b6b;
    position: relative;
  }

  //- 登录盒子
  .login-box {
    width: 500px;
    height: 300px;
    background-color: #fff;
    position: absolute;
    margin: auto;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;

    //- 登录上方图片的盒子
    .avatar-box {
      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      background-color: #fff;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: -65px;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        border: 1px solid #eee;
        background-color: #eee;

      }
    }
  }

  .login-form {
    box-sizing: border-box;
    padding: 10px;
    width: 100%;
    position: absolute;
    bottom: 0;

    .login-button {
      display: flex;
      justify-content: center;
    }
  }
</style>
