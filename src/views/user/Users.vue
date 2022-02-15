<template>
<div>
  <!-- 面包屑导航区域 -->
<el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
</el-breadcrumb>
<!-- 卡片视图区域 -->
<el-card class="box-card">
<!-- 使用栅格系统添加搜索框和搜索按钮 -->
<el-row :gutter="20">
  <el-col :span="8" >
     <el-input placeholder="请输入内容" v-model="queryInfo.query" :clearable="true" @clear="getUserList">
    <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
     </el-input>
  </el-col>
  <el-col :span="5">
    <el-button type="primary" @click="controlAddDialogVisible=true">添加用户</el-button>
  </el-col>
</el-row>
<!-- 用户表格 -->
 <el-table
       :stripe="true"
       :border="true"
      :data="userList"
      style="width: 100%">
      <el-table-column
        type="index"
        label="#"
        >
      </el-table-column>
      <el-table-column
        prop="username"
        label="姓名"
        >
      </el-table-column>
       <el-table-column
        prop="email"
        label="邮箱"
        >
      </el-table-column>
       <el-table-column
        prop="mobile"
        label="电话"
        >
      </el-table-column>
       <el-table-column
        prop="role_name"
        label="角色"
        >
      </el-table-column>
       <el-table-column
        label="状态"
        >
        <!--
          //! 使用组件的作用域插槽
          //! scope获取的是当前的行的所有数据
         -->
        <template slot-scope="scope">
          <!-- 实现开关和数据模型中的mg_state的双向数据绑定 -->
          <el-switch v-model="scope.row.mg_state" @change="userStatuChange(scope.row)"></el-switch>
        </template>
      </el-table-column>
         <el-table-column
        label="操作"
        width="180px"
        >
        <!-- 使用作用域插槽可以获取到当前列的数据 -->
        <template slot-scope="scope">
             <el-tooltip  effect="dark" content="修改" placement="top" :enterable="false" >
             <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
             </el-tooltip>
             <el-tooltip  effect="dark" content="删除" placement="top" :enterable="false">
             <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row)"></el-button>
             </el-tooltip>
             <!-- tooltip文字提示 -->
             <el-tooltip  effect="dark" content="分配角色" placement="top" :enterable="false">
               <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
             </el-tooltip>
        </template>
      </el-table-column>
 </el-table>
 <!-- 分页条 -->
 <!--
   参数的含义:
   1、size-change：当点击每页显示条数的按钮会触发给响应事件
   2、current-change：当点击页码数按钮，会触发该事件
   3、current-page:当前要显示的页码数
   4、page-sizes:设置每页显示的条数
   5、layout：控制分页条上要显示哪些控件
   6、total：数据的总条数
  -->
 <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 15 , 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="userTotal">
    </el-pagination>
</el-card>
<!-- 添加用户对话框 -->
<el-dialog
  title="添加用户"
  :visible.sync="controlAddDialogVisible"
  width="40%"
  @close="dialogClose"
  >
  <!-- 内容主体区 -->
  <el-form :model="addUserMode" :rules="addUserRules" ref="addUserRef" label-width="70px">
  <el-form-item label="用户名" prop="username">
    <el-input v-model="addUserMode.username"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="password">
    <el-input v-model="addUserMode.password"></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="addUserMode.email"></el-input>
  </el-form-item>
  <el-form-item label="手机" prop="mobile">
    <el-input v-model="addUserMode.mobile"></el-input>
  </el-form-item>
</el-form>
  <!-- 底部区域 -->
  <span slot="footer" class="dialog-footer">
    <el-button @click="controlAddDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
</el-dialog>
<!-- 修改用户信息对话框 -->
<el-dialog
  title="修改用户信息"
  :visible.sync="controlEditDialogVisible"
  width="40%"
  @close="editUserDialogClosed"
  >
  <!-- 修改用户信息的表单 -->
  <el-form
  :model="editUserFormModel"
  :rules="EditUserrules"
   ref="editUserRef"
   label-width="70px"
  >
  <!-- prop属性 对应的是要验证的数据 与rules中的每一项的名称对应 -->
  <el-form-item label="用户名">
    <el-input v-model="editUserFormModel.username" :disabled="true"></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="editUserFormModel.email"></el-input>
  </el-form-item>
  <el-form-item label="手机" prop="mobile">
    <el-input v-model="editUserFormModel.mobile"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="controlEditDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
</el-dialog>
</div>
</template>

<script>
export default {
  name: 'User',
  data () {
    //! 邮箱的验证规则
    var checkEmail = (rule, value, cb) => {
      //! 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // - 合法的邮箱
        cb()
      } else {
        //! 不是合法的邮箱
        cb(new Error('请输入合法的邮箱'))
      }
    }
    //! 手机号的验证规则
    var checkMobile = (rule, value, cb) => {
      //! 验证手机号的正则表达式
      // const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      const regMobile = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      if (regMobile.test(value)) {
        // - 合法的邮箱
        cb()
      } else {
        //! 不是合法的邮箱
        cb(new Error('请输入合法的手机号'))
      }
    }
    return {
      //! 参数参数对象
      queryInfo: {
        // - 查询参数，可以为空
        query: '',
        // - 当前页码
        pagenum: 1,
        // - 要显示的条数
        pagesize: 10
      },
      //! 用户列表的数据模型
      userList: [],
      //! 获取的用户总数
      userTotal: 0,
      //! 控制天剑用户信息对话框的显示与隐藏
      controlAddDialogVisible: false,
      //! 添加用户的数据模型
      addUserMode: {
        username: '',
        password: '',
        email: '',
        mobile: ''

      },
      //! 添加用户信息对话框中的表单的验证的规则
      addUserRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        // ? 自定义验证规则，使用validator来绑定自定义的验证规则
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ]

      },
      //! 修改用户信息对话框中的表单的验证的规则
      EditUserrules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ]
      },
      //! 控制修改用户信息对话框的显示与隐藏
      controlEditDialogVisible: false,
      //! 修改用户信息对话框中对应的数据模型
      editUserFormModel: {}
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // ? 获取用户列表数据
    async getUserList () {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      console.log(res)
      if (res.meta.status !== 200) {
        //! 请求数据失败
        this.$message.error('获取用户列表失败')
      } else {
        //! 获取请求数据成功
        this.userList = res.data.users
        this.userTotal = res.data.total
        // console.log(this.userList, this.userTotal)
      }
    },
    // ? 当点击每页显示条数的按钮会触发给响应事件
    handleSizeChange (pageSize) {
      this.queryInfo.pagesize = pageSize
      //! 由于每页显示的条数的信息发生改变，需要重新发起axios请求
      this.getUserList()
    },
    // ? 当点击页码数按钮，会触发该事件
    handleCurrentChange (pageNum) {
      this.queryInfo.pagenum = pageNum
      //! 由于页码数发生改变，需要重新发起axios请求
      this.getUserList()
    },
    // ? 当用户切换switch开关会触发该事件，目的是将开关切换的状态保存到数据库中
    async userStatuChange (userInfo) {
      const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        //! 修改用户状态失败
        //! 更新失败，状态切换回去
        userInfo.mg_state = !userInfo.mg_state
        this.$message.error('更新用户状态失败')
      } else {
        this.$message.success('更新用户状态成功')
      }
    },
    // ? 关闭添加用户对话框会触发该事件
    dialogClose () {
      //! 获取对话框的DOM实例对象，调用resetField函数，重置表单，并移除验证信息
      this.$refs.addUserRef.resetFields()
    },
    // ? 点击对话框的新增按钮，对表单进行预验证，验证通过直接发起axios，将数据添加到数据库
    addUser () {
      //! 对表单进行预验证
      this.$refs.addUserRef.validate(async isValid => {
        //! 校验失败直接退出
        if (!isValid) {
          this.controlAddDialogVisible = false
          this.$message.error('输入信息验证不通过')
        } else {
          //! 预验证成功可以发起axios请求
          const { data: res } = await this.$http.post('users', this.addUserMode)
          if (res.meta.status !== 201) {
            //! 隐藏添加用户的对话框
            this.controlAddDialogVisible = false
            this.$message.error('添加用户失败')
          } else {
            //! 添加成功
            //! 隐藏添加用户的对话框
            this.controlAddDialogVisible = false
            this.$message.success('添加用户成功')
            //* 重新获取用户的列表数据
            this.getUserList()
          }
        }
      })
    },
    // ? 点击表格每一行中的修改按钮，该事件会被触发
    async showEditDialog (row) {
      // console.log(row)
      const { data: res } = await this.$http.get('users/' + row.id)
      if (res.meta.status !== 200) {
        //! 根据id查询对应的用户信息失败
        this.$message.error('查询用户信息失败')
      } else {
        this.editUserFormModel = res.data
        console.log(res.data)
      }
      this.controlEditDialogVisible = true
    },
    // ? 当修改用户信息的对话框关闭的时候，重置验证规则的结果
    editUserDialogClosed () {
      //! 重置对话框
      this.$refs.editUserRef.resetFields()
    },
    //! 点击修改用户信息表单中的确定按钮，进行表单的预验证
    editUserInfo () {
      this.$refs.editUserRef.validate(async isValid => {
        if (!isValid) {
          //! 表单验证失败
          this.$message.error('修改的用户信息不合法')
          //! 关闭对话框
          this.controlEditDialogVisible = false
        } else {
          //! 表单验证成功，发送axios请求，修改用户信息
          const { data: res } = await this.$http.put('users/' + this.editUserFormModel.id, {
            email: this.editUserFormModel.email,
            mobile: this.editUserFormModel.mobile
          })
          if (res.meta.status !== 200) {
            //! 修改用户信息失败
            this.controlEditDialogVisible = false
            this.$message.error('修改用户信息失败')
          } else {
            //! 修改用户信息成功
            //! 关闭对话框，给出提示信息，重新获取列表数据
            this.controlEditDialogVisible = false
            this.$message.success('修改用户信息成功')
            this.getUserList()
          }
        }
      })
    },
    //! 点击用户列表中的每一行数据中的删除按钮，触发该事件
    deleteUser (row) {
      this.$confirm('此操作将永久删除该用户信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        //! 使用axios发送删除指定的id对应的用户信息
        const { data: res } = await this.$http.delete('users/' + row.id)
        if (res.meta.status !== 200) {
          //! 删除失败
          this.$message.error('删除用户失败')
        } else {
          //! 删除成功
          this.$message.error('删除用户成功')
          //! 重新获取列表数据
          this.getUserList()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }

  }
}
</script>

<style lang="less" scoped>

</style>
