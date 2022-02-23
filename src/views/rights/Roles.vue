<template>
<!--
  //! 暂未实现的功能：
  //todo 删除按钮的操作
  //todo 修改按钮的操作
 -->
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 使用栅格系统布局方式添加一个按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddRoleDialog">添加角色</el-button>
        </el-col>
      </el-row>
       <!-- 角色表格 -->
    <el-table :data="rolesList" :border="true" :stripe="true">
      <!-- 展开列 -->
      <el-table-column type="expand">
        <!-- 通过作用域插槽可以拿到当前所在行的所有数据 -->
        <template slot-scope="scope">
           <!-- 通过栅格系统来展示获取到到对应角色的一二三级权限 -->
           <!-- class为栅格系统添加上边框和下边框 -->
           <el-row v-for="(item,i) in scope.row.children" :key="item.id" :class="['row-border-bottom',i===0 ?'row-border-top' : '','vcenter']">
             <!-- 一级权限的位置，spanv表示每一列所占的格数 -->
             <el-col :span="5">
               <el-tag @close="romoveRightsById(scope.row,item.id)" closable>{{item.authName}}</el-tag>
               <i class="el-icon-caret-right"></i>
             </el-col>
             <!-- 二级权限的位置 -->
             <el-col :span="19">
               <!-- 通过for循环 嵌套渲染二级权限 -->
               <el-row v-for="(item1,i1) in item.children" :key="item1.id" :class="[i1===0 ?'':'row-border-top','vcenter']">
                 <el-col :span="6">
                   <el-tag type="success" @close="romoveRightsById(scope.row,item1.id)" closable>{{item1.authName}}</el-tag>
                   <i class="el-icon-caret-right"></i>
                 </el-col>
                 <!-- 三级权限 -->
                 <el-col :span="18" class="vcenter-v3">
                   <el-tag type="warning" v-for="(item2) in item1.children" :key="item2.id" closable @close="romoveRightsById(scope.row,item2.id)">
                     {{item2.authName}}
                   </el-tag>
                   <!-- {{scope.row}} -->
                 </el-col>
               </el-row>
             </el-col>
           </el-row>
        </template>
      </el-table-column>
      <!-- 索引列 -->
      <el-table-column label="#" type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
        <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditRoleDialog(scope.row)">编辑</el-button>
        <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteRoleInfo(scope.row.id)">删除</el-button>
        <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    </el-card>
     <!-- 分配权限的对话框 -->
     <el-dialog
    title="分配权限"
    :visible.sync="setRightsdialogVisible"
    width="40%"
       >
    <!-- 树形控件，用于展示权限树 -->
    <el-tree
    :data="rightsTree"
    :props="treeProps"
    show-checkbox
    node-key="id"
    :default-expand-all="true"
    :default-checked-keys="rightsTreeDefaultCheckedKeys"
    ref="treeRef"
    ></el-tree>
  <span slot="footer" class="dialog-footer">
  <el-button @click="setRightsdialogVisible = false">取 消</el-button>
  <el-button type="primary" @click="allotRightForRoles">确 定</el-button>
  </span>
</el-dialog>
  <!-- 编辑角色的对话框-->
  <el-dialog
  title="编辑角色"
  :visible.sync="controlEditRoledialogVisible"
  width="40%"
  @close="closeEditRoleDialog">
  <el-form
  :model="editRoleInfo"
  :rules="editRoleRules"
  ref="editRoleRef"
  label-width="100px"
  >
  <el-form-item label="角色名称" prop="name">
    <el-input v-model="editRoleInfo.roleName"></el-input>
  </el-form-item>
  <el-form-item label="角色描述" prop="desc">
    <el-input v-model="editRoleInfo.roleDesc"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="controlEditRoledialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editRoleForever">确 定</el-button>
  </span>
</el-dialog>
 <!-- 添加角色的对话框 -->
 <el-dialog
  title="添加角色"
  :visible.sync="controlAddRoleDialogVisible"
  width="40%"
  @close="closeAddRoleDialog"
  >
  <!-- 添加角色的表单 -->
  <el-form
  :model="addRoleInfo"
  :rules="addRoleRules"
  ref="addRoleRef"
  label-width="100px"
  >
  <el-form-item label="角色名称" prop="roleName">
    <el-input v-model="addRoleInfo.roleName"></el-input>
  </el-form-item>
  <el-form-item label="角色描述" prop="roleDesc">
    <el-input v-model="addRoleInfo.roleDesc"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="controlAddRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRoleForever">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data () {
    //* 自定义检查角色名称的规则
    const checkRoleName = (rule, value, cb) => {
      if (this.editRoleInfo.roleName.length >= 2 && this.editRoleInfo.roleName.length <= 5) {
        cb()
      } else if (this.editRoleInfo.roleName.length === 0) {
        cb(new Error('请填写角色名称'))
      } else {
        cb(new Error('长度在 2 到 5 个字符'))
      }
    }
    //* 自定义检测角色描述信息的规则
    const checkRoleDesc = (rule, value, cb) => {
      if (this.editRoleInfo.roleDesc.length >= 2 && this.editRoleInfo.roleDesc.length <= 10) {
        cb()
      } else if (this.editRoleInfo.roleDesc.length === 0) {
        cb(new Error('请填写角色描述信息'))
      } else {
        cb(new Error('长度在 2 到 10 个字符'))
      }
    }
    return {
      //! 角色列表数据模型
      rolesList: [],
      //* 控制分配权限的对话框的展示与隐藏
      setRightsdialogVisible: false,
      //* 权限树数据模型
      rightsTree: [],
      //* 树形控件绑定的数据模型
      treeProps: {
        // ? 标题名称
        label: 'authName',
        // ? 对应的树形数据模型
        children: 'children'
      },
      //* 保存当前角色对应的三级权限的id值的数组
      rightsTreeDefaultCheckedKeys: [],
      //* 保存角色对应的id
      roleId: '',
      //* 控制编辑角色的对话框的展示与隐藏
      controlEditRoledialogVisible: false,
      //* 编辑角色对话框中的表单的数据模型
      editRoleInfo: {
        roleName: '',
        roleDesc: ''
      },
      //* 编辑角色的对话框的表单的验证规则
      editRoleRules: {
        name: [
          { validator: checkRoleName, trigger: 'blur' }

        ],
        desc: [
          { validator: checkRoleDesc, trigger: 'blur' }
        ]
      },
      //* 编辑角色按钮对应的角色id值
      editRoleId: '',
      //* 控制添加角色的对话框的显示与隐藏
      controlAddRoleDialogVisible: false,
      //* 添加角色的表单的数据模型
      addRoleInfo: {
        roleName: '',
        roleDesc: ''
      },
      //* 添加角色名称和描述信息的规则
      addRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ]

      }

    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    //* 获取角色列表数据
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        this.$message.error('获取角色列表数据失败')
      } else {
        this.rolesList = res.data
      }
    },
    //* 根据id，删除指定的权限（三级）
    //* role:对应角色数据数据模型中的data rightId:权限的ID
    romoveRightsById (role, rightId) {
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if (res.meta.status !== 200) {
          this.$message.error('权限移除失败')
        } else {
          this.$message.success('权限已成功移除')
          //* 删除指定的权限，响应回来的数据中包含最新的权限数据，即把原来data中的children替换掉即可
          role.children = res.data
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    //* 点击每一行中的分配权限按钮，触发该事件，弹出对话框
    async showSetRightDialog (role) {
      this.roleId = role.id
      //* 发送axios请求，获取树形的数据列表
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        // - 权限树获取失败
        this.$message.error('获取权限数据失败')
      } else {
        // - 将获取到的权限列表赋值给对应的数据模型
        this.rightsTree = res.data
        // console.log(role)
      }
      //! 调用获取当前角色拥有的权限的id值
      //! 在调用该方法前，需要将上一次保存在数组中的数据进行清空
      this.rightsTreeDefaultCheckedKeys = []
      this.getCheckedRightsKeys(role, this.rightsTreeDefaultCheckedKeys)
      this.setRightsdialogVisible = true
    },
    //* 获取当前角色对应的所有三级权限的id值，保存到RightsTreeDefaultCheckedKeys数组中
    //! 通过递归的形式，获取角色下的所有三级权限的id，并将其保存到RightsTreeDefaultCheckedKeys数组中
    getCheckedRightsKeys (node, arr) {
      // - 如果当前node节点不包含children属性，这是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getCheckedRightsKeys(item, arr)
      })
    },
    //* 点击分配权限对话框的确定按钮，触发该事件，为角色分配权限
    async allotRightForRoles () {
      // - 获取到的已选中的权限的id数组和对应的一级权限和二级权限的id值的数组
      // - getCheckedKeys-若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点的 key 所组成的数组
      // - getHalfCheckedKeys-若节点可被选择（即 show-checkbox 为 true），则返回目前半选中的节点的 key 所组成的数组
      const keys = [...this.$refs.treeRef.getCheckedKeys(), this.$refs.treeRef.getHalfCheckedKeys()]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        this.$message.error('分配角色权限失败')
      } else {
        this.$message.success('分配角色权限成功')
        // - 刷新角色的列表数据
        this.getRolesList()
        // - 关闭对话框
        this.setRightsdialogVisible = false
      }
    },
    //* 点击角色删除按钮，删除指定的角色的信息
    deleteRoleInfo (roleId) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`roles/${roleId}`)
        if (res.meta.status !== 200) {
          this.$message.error('角色删除失败')
        } else {
          // -重新获取角色列表数据
          this.getRolesList()
          this.$message.success('角色删除成功')
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    //* 点击编辑角色按钮，弹出指定的对话框
    showEditRoleDialog (roleInfo) {
      //! 将当前编辑的角色的id值赋值给editRoleId
      this.editRoleId = roleInfo.id
      this.controlEditRoledialogVisible = true
      //* 将当前对应角色的名称和描述信息回显到表单中
      this.editRoleInfo.roleName = roleInfo.roleName
      this.editRoleInfo.roleDesc = roleInfo.roleDesc
    },
    //* 关闭对话框，清除表单的验证规则
    closeEditRoleDialog () {
      this.$refs.editRoleRef.clearValidate()
    },
    //* 点击对话框的确定按钮，对表单进行提交前的校验，校验成功持久化修改数据
    editRoleForever () {
      this.$refs.editRoleRef.validate(async isValid => {
        console.log(this.roleId)
        if (!isValid) {
          //! 校验失败
          this.$message.error('规则校验失败，请输入合法信息')
          //* 关闭对话框
          this.controlEditRoledialogVisible = false
        } else {
          //* 规则校验成成功，持久化修改数据
          const { data: res } = await this.$http.put(`roles/${this.editRoleId}`, {
            roleName: this.editRoleInfo.roleName,
            roleDesc: this.editRoleInfo.roleDesc
          })
          // console.log(res)
          if (res.meta.status !== 200) {
            this.$message.error('角色信息修改失败')
          } else {
            // -重新获取角色列表数据
            this.getRolesList()
            //* 展示提示信息
            this.$message.success('角色信息修改成功')
            //* 关闭对话框
            this.controlEditRoledialogVisible = false
          }
          //* 关闭对话框
          this.controlEditRoledialogVisible = false
        }
      })
    },
    //* 点击添加角色的对话框，触发该事件
    showAddRoleDialog () {
      this.controlAddRoleDialogVisible = true
      this.addRoleInfo = {}
    },
    //* 关闭对话框，重置添加角色的表单
    closeAddRoleDialog () {
      //! 重置表单的输入框和表单的验证信息
      this.$refs.addRoleRef.resetFields()
    },
    //* 点击表单的确定按钮，对表单信息进行初验证，验证通过，持久化保存数据
    addRoleForever () {
      this.$refs.addRoleRef.validate(async isvalid => {
        // ? 预验证不通过
        if (!isvalid) {
          this.$message.error('预验证失败，请添加合法的角色信息')
          this.controlAddRoleDialogVisible = false
        } else {
          //! 表单预验证通过，持久化保存数据
          const { data: res } = await this.$http.post('roles', {
            roleName: this.addRoleInfo.roleName,
            roleDesc: this.addRoleInfo.roleDesc
          })
          if (res.meta.status !== 201) {
            this.$message.error('角色添加失败')
            this.controlAddRoleDialogVisible = false
          } else {
            this.$message.success('角色添加成功')
            // -重新获取角色列表数据
            this.getRolesList()
            // - 关闭对话框
            this.controlAddRoleDialogVisible = false
          }
        }
      })
      //* 关闭对话框
      this.controlAddRoleDialogVisible = false
    }

  }

}
</script>

<style lang="less" scoped>
//! 设置标签的外边距
.el-tag{
  margin: 10px;
}
//! 设置栅格系统的上边框
.row-border-top{
  border-top: 1px solid #eee;
}
//! 设置栅格系统的下边框
.row-border-bottom{
  border-bottom: 1px solid #eee;
}
//! tag在row中的col中居中显示
.vcenter{
  display: flex;
  // align-items: center;
  text-align: center;
}
.vcenter-v3{
  text-align: left;
}
</style>
