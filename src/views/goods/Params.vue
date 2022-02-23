<template>
  <div>
     <!-- 面包屑导航区域 -->
<el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>参数列表</el-breadcrumb-item>
</el-breadcrumb>
<!-- 卡片视图区域 -->
<el-card>
  <!-- Alert 警告 -->
   <el-alert
    title="注意：只允许为第三级分类设置相关参数"
    :closable="false"
    show-icon
    type="warning">
  </el-alert>
  <!-- 选择商品分类的区域 -->
  <el-row class="elRowStyle">
    <el-col>
      <span>选择商品分类：</span>
      <!-- 选择商品分类的级联选择框 -->
      <el-cascader
      :clearable="true"
    :change-on-select="true"
    v-model="selectedCateKeys"
    :options="cateList"
    :props="cateProps"
    @change="cascaderitemsSelected"></el-cascader>
    </el-col>
  </el-row>
  <!-- tabs页签区域 -->
  <!--
    参数的含义：
    1、v-model：选中了哪个tab，就把tab对应的name值，保存到v-model中
    2、name：tab本身所表示的名称
  -->
   <el-tabs v-model="tabsactiveName" @tab-click="tabsitemSelected">
     <!-- 添加动态参数的面板 -->
    <el-tab-pane label="动态参数" name="many">
      <!--
         按钮的禁用与显示的原理：
         当用户选择的是三级商品分类，按钮不被禁用，反之其他情况都被禁用
         按钮的禁用与否，与selectedCateKeys数组的长度有关，所以使用计算属性来动态的控制按钮的禁用与否
         selectedCateKeys数组长度等于3，开启，否则禁用
       -->
      <el-button type="primary" :disabled="isBtnDisabled" @click="addParamsDialogVisible=true">添加参数</el-button>
      <!-- 展示动态参数的表格 -->
      <el-table
      :data="manyTableData"
      :border="true"
      :stripe="true"
      >
      <!-- 展开行 -->
       <el-table-column type="expand">
         <!-- 作用域插槽 -->
         <template slot-scope="scope">
           <!-- 循环渲染tag标签 -->
           <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" :closable="true" @close="deleteTag(i,scope.row)">
             {{item}}
           </el-tag>
           <!-- 输入的文本框 -->
           <el-input
             class="input-new-tag"
             v-if="scope.row.tagInputVisible"
             v-model="scope.row.tagInputValue"
             ref="saveTagInput"
             size="small"
             @keyup.enter.native="tagHandleInputConfirm(scope.row)"
             @blur="tagHandleInputConfirm(scope.row)"
            ></el-input>
            <!-- 添加按钮 -->
        <el-button v-else class="button-new-tag" size="small" @click="tagShowInput(scope.row)">+ New Tag</el-button>
         </template>
       </el-table-column>
      <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
         <el-table-column label="参数名称" prop="attr_name"></el-table-column>
          <el-table-column label="操作">
            <!-- 添加作用域插槽 -->
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
            </template>
          </el-table-column>
      </el-table>
    </el-tab-pane>
    <!-- 添加静态属性的面板 -->
    <el-tab-pane label="静态属性" name="only">
      <el-button type="primary" :disabled="isBtnDisabled" @click="addParamsDialogVisible=true">添加属性</el-button>
      <!-- 展示静态属性的表格 -->
      <el-table
      :data="onlyTableData"
      :border="true"
      :stripe="true"
      >
      <!-- 展开行 -->
       <el-table-column type="expand">
         <!-- 作用域插槽 -->
         <template slot-scope="scope">
           <!-- 循环渲染tag标签 -->
           <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" :closable="true" @close="deleteTag(i,scope.row)">
             {{item}}
           </el-tag>
           <!-- 输入的文本框 -->
           <el-input
             class="input-new-tag"
             v-if="scope.row.tagInputVisible"
             v-model="scope.row.tagInputValue"
             ref="saveTagInput"
             size="small"
             @keyup.enter.native="tagHandleInputConfirm(scope.row)"
             @blur="tagHandleInputConfirm(scope.row)"
            ></el-input>
            <!-- 添加按钮 -->
        <el-button v-else class="button-new-tag" size="small" @click="tagShowInput(scope.row)">+ New Tag</el-button>
         </template>
       </el-table-column>
      <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
         <el-table-column label="属性名称" prop="attr_name"></el-table-column>
          <el-table-column label="操作">
            <!-- 使用作用域插槽 -->
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
            </template>
          </el-table-column>
      </el-table>
    </el-tab-pane>
  </el-tabs>
</el-card>
<!-- 添加参数的对话框，动态参数和静态属性的添加共用一个对话框 -->
<el-dialog
  :title="'添加'+titleText"
  :visible.sync="addParamsDialogVisible"
  width="40%"
  @close="closeAddParamsDialog"
  >
  <!-- 输入参数的表单 -->
  <el-form
  :model="addParamsInfo"
  :rules="addParamsRules"
  ref="addParamsRef"
  label-width="100px" >
  <el-form-item :label="titleText" prop="attr_name">
    <el-input v-model="addParamsInfo.attr_name"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addParamsDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addParamsFun">确 定</el-button>
  </span>
</el-dialog>
<!-- 点击表格中每行编辑按钮显示的对话框 -->
<el-dialog
  :title="'修改'+titleText"
  :visible.sync="editParamsDialogVisible"
  width="40%"
  @close="closeEditParamsDialog"
  >
  <!-- 输入参数的表单 -->
  <el-form
  :model="editParamsInfo"
  :rules="editParamsRules"
  ref="editParamsRef"
  label-width="100px" >
  <el-form-item :label="titleText" prop="attr_name">
    <el-input v-model="editParamsInfo.attr_name"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editParamsDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editParamsFun" >确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Params',
  created () {
    this.getCateList()
  },
  data () {
    return {
      //* 商品分类列表的数据模型
      cateList: [],
      //* 级联选择器的prop属性
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'

      },
      //* 级联选择器中的选中的项的id，双向绑定到该数组中
      selectedCateKeys: [],
      //* tabs中被选中标签页的名称
      tabsactiveName: 'many',
      //* 保存分类参数的动态参数
      manyTableData: [],
      //* 保存分类参数的静态参数
      onlyTableData: [],
      //* 控制添加动态参数或静态属性的对话框的显示与隐藏
      addParamsDialogVisible: false,
      //* 添加参数的表单双向绑定的数据模型
      addParamsInfo: {},
      //* 添加参数表单的验证规则
      addParamsRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ]
      },
      //* 控制编辑参数的对话框的显示与隐藏
      editParamsDialogVisible: false,
      // - 修改参数的表单的数据模型
      editParamsInfo: {},
      // - 修改参数的表单的验证规则
      editParamsRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ]
      }
      // // - 控制展开行中的文本输入框和按钮的切换
      // tagInputVisible: false,
      // // - 展开行的文本输入框对应的数据模型
      // tagInputValue: ''
    }
  },
  methods: {
    // - 发动axios请求获取商品分类列表数据
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        //! 获取商品列表数据失败
        this.$message.error('获取商品分类的数据失败')
      } else {
        // - 对cateList进行赋值
        this.cateList = res.data
        // console.log(this.cateList)
      }
    },
    // - 当级联选择器中选项被选择时，触发该事件
    cascaderitemsSelected () {
      // - 当级联选择器被触发时也要发起axios请求，请求分类参数数据
      this.getParamsData()
    },
    // - tabs标签中任意一项也被选中时，触发该事件
    tabsitemSelected () {
      // - 当切换tabs的标签项的时候也要发起axios请求，请求分类参数数据
      this.getParamsData()
    },
    // - 获取分类参数数据
    async getParamsData () {
      //! 由于设置商品的参数要针对的是具体的商品，所以要获取的是第三级别上的商品，所以要判断选择的分类所属的级别
      //! 判断selectedCateKeys数组的长度，当数组的长度为3时表示选中的是三级别上的商品
      if (this.selectedCateKeys.length !== 3) {
        // - 选中的不是三级分类商品，初始化级联选择器选择框
        this.selectedCateKeys = []
        // - 需要请空manyTableData和onlyTableData中的数据，防止当级联选择器被初始化之后，表格仍然存在的问题
        this.manyTableData = []
        this.onlyTableData = []
      } else {
        // - 发起axios请求，获取分类参数
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.tabsactiveName } })
        if (res.meta.status !== 200) {
          this.$$message.error('获取分类参数列表失败')
        } else {
          // - 由于切换tabs标签发起的axios请求获取的数据，是不一样的，有静态参数（only），有动态参数（many），
          // - 所以需要使用不同的数据源进行保存
          // ? 获取到的是动态参数
          if (this.tabsactiveName === 'many') {
            this.manyTableData = res.data
            // console.log(this.manyTableData)
          } else {
            // ? 获取到是静态参数
            this.onlyTableData = res.data
            // console.log(this.onlyTableData)
          }
          //! 将data中的每一个参数中对应的attr_vals(参数所包含的基本的信息，也就是展示列中药显示的tag标签)
          res.data.forEach(item => {
            // ? 将attrvals字符串转化为数组
            //! 利用三元运算符，来判断attr_vals是否为空字符串
            item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
            // ? 由于展开行中的文本输入框，由于forEach的原因，导致每个参数的对应的文本输入框的数据模型都是共用的
            // ? 可以获取的参数列表的数据中，循环添加控制文本输入框显示与隐藏的参数和对应各自的数据模型
            // ? 以下的这种方式不能实现的原因是：如果在实例创建之后添加新的属性到实例上，它不会触发视图更新。
            // ? 受现代 JavaScript 的限制 (以及废弃 Object.observe)，Vue 不能检测到对象属性的添加或删除。
            // ? 由于 Vue 会在初始化实例时对属性执行
            // ? getter/setter 转化过程，所以属性必须在 data 对象上存在才能让 Vue 转换它，这样才能让它是响应的。
            //! 将整体一到if else上面可以产生作用
            // item.tagInputVisible = false
            // item.tagInputValue = ''
            // - 使用绑定的Vue原型上的set函数，可以为data中的属性，在实例化之后再在上面绑定数据
            this.$set(item, 'tagInputVisible', false)
            this.$set(item, 'tagInputValue', '')
          })
          // console.log(this.manyTableData)
        }
      }
    },
    // - 当添加参数的对话框关闭时会触发该事件
    closeAddParamsDialog () {
      // ? 清空表单的校验结果和数据框的内容
      this.$refs.addParamsRef.resetFields()
    },
    // - 点击添加参数的表单的确定按钮，对表单进行预验证，验证成功，持久化保存数据
    addParamsFun () {
      this.$refs.addParamsRef.validate(async isValid => {
        if (!isValid) {
          //! 表单预验证失败
          this.$message.error('表单预验证失败,请添加合法数据')
        } else {
          const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
            attr_name: this.addParamsInfo.attr_name,
            attr_sel: this.tabsactiveName
          })
          if (res.meta.status !== 201) {
            this.$message.error('添加' + this.titleText + '失败')
          } else {
            this.$message.success('添加' + this.titleText + '成功')
            this.getParamsData()
          }
        }
      })
      // - 关闭对话框
      this.addParamsDialogVisible = false
    },
    // - 点击表格中每一行的编辑按钮，触发该事件
    async showEditDialog (attrId) {
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${attrId}`, {
        params: { attr_sel: this.tabsactiveName }
      })
      if (res.meta.status !== 200) {
        this.$message.error('获取对应参数信息失败')
      } else {
        // -将解构的数据赋值给编辑表单的数据模型
        this.editParamsInfo = res.data
      }
      this.editParamsDialogVisible = true
    },
    // - 关闭编辑参数的对话框，会触发该事件
    closeEditParamsDialog () {
      // - 清除表单的校验结果和输入框中的内容
      this.$refs.editParamsRef.resetFields()
    },
    // - 点击修改参数的表单的确定按钮，响应该事件，对表单进行预验证，验证通过持久化修改数据
    editParamsFun () {
      this.$refs.editParamsRef.validate(async isValid => {
        if (!isValid) {
          this.$message.error('修改参数失败')
        } else {
          const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editParamsInfo.attr_id}`, {
            attr_name: this.editParamsInfo.attr_name,
            attr_sel: this.tabsactiveName
          })
          if (res.meta.status !== 200) {
            this.$message.error('修改参数失败')
          } else {
            this.$message.success('修改参数成功')
            // - 重新获取参数表格中的数据
            this.getParamsData()
          }
        }
      })
      // ? 关闭对话框
      this.editParamsDialogVisible = false
    },
    // - 点击表格的每一行的删除按钮，触发该事件
    removeParams (attrId) {
      this.$confirm('此操作将永久删除该参数信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${attrId}`)
        if (res.meta.status !== 200) {
          this.$message.error('删除失败')
        } else {
          this.$message.success('删除成功')
          this.getParamsData()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // - 展开行中文本输入框失去焦点或者按下enter键，会触发该事件
    async tagHandleInputConfirm (row) {
      //! 在文本输入框关闭之前，判断输入的内容是否合法，不合法将文本输入框重置
      if (row.tagInputValue.trim().length === 0) {
        // - 输入的是空文本，清空文本输入框
        row.tagInputValue = ''
        row.tagInputVisible = false
      } else {
        // - 输入的数据合法，应该获取到该数据，将其放入展开列的tag的数据模型，使其可以v-for出对应的tag标签
        row.attr_vals.push(row.tagInputValue.trim())
        row.tagInputValue = ''
        row.tagInputVisible = false
      }
      this.saveattrValsForManyTableData(row)
    },
    // - 将持久化修改manyTableData中的attr_vals封装成一个函数
    async saveattrValsForManyTableData (row) {
      //! 发起axios请求，持久化保存新添加的标签
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) {
        this.$message.error('修改参数项失败')
      } else {
        this.$message.success('修改参数项成功')
      }
    },
    // - 点击展开行的按钮，会触发该事件,显示文本框
    tagShowInput (row) {
      row.tagInputVisible = true
      //! 当点击+new tag按钮的时候，页面还没渲染完成，如果立即执行 this.$refs.saveTagInput.$refs.input.focus()
      //! 会报错（由于dom对象未被渲染出来，需要使用nextTick生命周期函数，在页面渲染完成之后，调用该语言）
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // - 点击tag标签上的小叉号，触发该事件
    deleteTag (tagIndex, row) {
      row.attr_vals.splice(tagIndex, 1)
      this.saveattrValsForManyTableData(row)
    }
  },
  computed: {
    // - 计算按钮是否被禁用
    isBtnDisabled () {
      if (this.selectedCateKeys.length === 3) {
        return false
      }
      return true
    },
    // - 计算选中的三级分类的id
    cateId () {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    // - 动态计算标题的文本
    titleText () {
      if (this.tabsactiveName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  }
}
</script>

<style lang="less" scoped>
//? 设置el-row的上外边距的距离
.elRowStyle{
  margin: 16px 0;
}
.el-tag{
  margin: 10px;
  font-size: 13px;
  font-weight: bold;
}
.input-new-tag{
  width: 120px;
}
</style>
