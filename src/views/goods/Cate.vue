<template>
  <div>
 <!-- 面包屑导航区域 -->
<el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>商品分类</el-breadcrumb-item>
</el-breadcrumb>
<!-- 卡片视图区域 -->
<el-card>
  <el-row>
    <el-col>
      <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
    </el-col>
  </el-row>
  <!-- 表格 -->
   <!-- :show-row-hover="false" -->
  <tree-table
  :data="cateList"
  :columns="columns"
  :selection-type="false"
  :expand-type="false"
  :show-index="true"
  index-text="#"
  border
  class="treeTable"
  :show-row-hover="false"
  >
  <!-- 是否有效 -->
  <template slot="isOk" slot-scope="scope">
     <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:lightgreen;fontSize:16px"></i>
     <i class="el-icon-error" v-else style="color:red;fontSize:16px"></i>
  </template>
  <!-- 排序 -->
  <template slot="order" slot-scope="scope">
    <el-tag type="success" v-if="scope.row.cat_level===0">一级</el-tag>
    <el-tag type="warning" v-else-if="scope.row.cat_level===1">二级</el-tag>
    <el-tag  v-else>三级</el-tag>
  </template>
  <!-- 操作 -->
  <template slot="opt" slot-scope="scope">
    <el-button type="primary" icon="el-icon-edit" size="mini" @click="editGoodsCateFun(scope.row)">编辑</el-button>
    <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteGoodsCateFun(scope.row)">删除</el-button>
  </template>
  </tree-table>
  <!-- 分页条 -->
  <el-pagination
      @size-change="cateHandleSizeChange"
      @current-change="cateHandleCurrentChange"
      :current-page="cateQueryInfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="cateQueryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</el-card>
<!-- 添加商品分类的对话框 -->
<el-dialog
  title="添加分类"
  :visible.sync="controlAddCatedialogVisible"
  width="40%"
  @close="closeAddCateDialog"
  >
  <!-- 添加分类的表单 -->
  <el-form
  :model="addCateInfo"
  :rules="addCateRules"
  ref="addCateRef"
  label-width="100px" >
  <el-form-item label="分类名称:" prop="cat_name">
    <el-input v-model="addCateInfo.cat_name"></el-input>
  </el-form-item>
   <el-form-item label="父级分类:">
    <!-- 级联选择器 -->
    <!--
      参数的含义：
      options：用来指定数据源
      props：用来指定配置对象
      v-model:：用来把选中的数据对应的id值，保存数据绑定对应的selectedKeys数组中
      clearable：显示清除内容的叉号
      change-on-select：允许任意一级的选项被选中
     -->
    <el-cascader
    v-model="selectedKeys"
    :options="parentCateList"
    :props="cascaderProps"
    :clearable="true"
    :change-on-select="true"
    @change="parentCateChanged">
    </el-cascader>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="controlAddCatedialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCateFun">确 定</el-button>
  </span>
</el-dialog>
<!-- 点击编辑商品分类按钮弹出的对话框 -->
  <el-dialog
  title="修改商品分类名称"
  :visible.sync="controlEditGoodsCateDialogVisible"
  width="40%"
  @close="clearEditGoodsForm">
  <el-form
  :model="editGoodsCateModel"
  :rules="editGoodsCateRules"
  ref="editGoodsCateRef"
  label-width="100px">
  <el-form-item label="分类名称" prop="cat_name">
    <el-input v-model="editGoodsCateModel.cat_name"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="controlEditGoodsCateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editGoodsCateFeverFun">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Cate',
  data () {
    //* 自定义检查角色名称的规则
    const checkCateName = (rule, value, cb) => {
      if (this.editGoodsCateModel.cat_name.length >= 2 && this.editGoodsCateModel.cat_name.length <= 5) {
        cb()
      } else if (this.editGoodsCateModel.cat_name.length === 0) {
        cb(new Error('请填写参数分类名称'))
      } else {
        cb(new Error('长度在 2 到 5 个字符'))
      }
    }
    return {
    //* 商品分类列表的数据模型
      cateList: [],
      //* 发起获取商品分类数据的请求的请求参数
      cateQueryInfo: {
        // ? 获取所有级别的分类
        type: 3,
        // ? 初始的页码数
        pagenum: 1,
        // ? 一页显示多少条数据
        pagesize: 5

      },
      //* 商品分类数据的条数
      total: 0,
      //* tree-gridz中的自定义每一列的规则
      columns: [
        {
          // - 列对应的列名
          label: '分类名称',
          // - 列值对应的数据模型
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // - 表示当前列自定义为模版列
          type: 'template',
          // - 模版的名称
          template: 'isOk'

        },
        {
          label: '排序',
          // - 表示当前列自定义为模版列
          type: 'template',
          // - 模版的名称
          template: 'order'

        },
        {
          label: '操作',
          // - 表示当前列自定义为模版列
          type: 'template',
          // - 模版的名称
          template: 'opt'

        }
      ],
      //* 控制添加分类对话框的显示与隐藏
      controlAddCatedialogVisible: false,
      //* 添加分类的表单对应的数据模型
      addCateInfo: {
        //* 将要添加的分类的名称
        cat_name: '',
        //* 父级分类的id
        cat_pid: 0,
        //* 分类的等级，默认要填加的是一级分类
        cat_level: 0
      },
      //* 添加分类表单的验证规则
      addCateRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ]
      },
      // - 添加分类的表单中的父级分类的多级复选框所需的数据模型
      parentCateList: [],
      // -用来指定级联选择琼的配置对象
      // - 配置参数的基本含义：
      // ? value：表示勾选的数据项，实际所表示的数据类型
      // ? label：表示选择器展示的数据类型
      // ? children：表示二级项下级的三级数据（父子嵌套的属性）
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'

      },
      // - 级联选择器中的v-model对应的数据源（选中的父级分类的id数组）
      selectedKeys: [],
      // - 控制编辑商品分类的对话框的显示与隐藏
      controlEditGoodsCateDialogVisible: false,
      // - 编辑商品分类的对话框中的表单的输入框绑定的数据模型
      editGoodsCateModel: { cat_name: '', cat_id: 0 },
      // - 编辑商品分类的对话框中的表单的验证规则
      editGoodsCateRules: {
        cat_name: [
          { validator: checkCateName, trigger: 'blur' }
        ]
      }

    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // -发起axios请求，获取商品分类列表的数据
    async getCateList () {
      const { data: res } = await this.$http.get('categories', { params: this.cateQueryInfo })
      if (res.meta.status !== 200) {
        this.$message.error('获取商品分类数据失败')
      } else {
        // ? 将商品分类的数据对应的数组赋值给cateList数据模型
        // console.log(res.data)
        this.cateList = res.data.result
        this.total = res.data.total
      }
    },
    // - 分页条上的每页显示的条数发生改变，会触发该事件
    cateHandleSizeChange (newPageSize) {
      // ? 将分页条上的最新的每页显示的条数赋值cateQueryInfo.pagesize
      this.cateQueryInfo.pagesize = newPageSize
      // ? 重新获取商品分类的列表数据
      this.getCateList()
    },
    // - 当分页条上的页码数发生改变，触发该事件
    cateHandleCurrentChange (newPageNum) {
      // ? 将分页条上的最新的页码赋值cateQueryInfo.pagenum
      this.cateQueryInfo.pagenum = newPageNum
      // ? 重新获取商品分类的列表数据
      this.getCateList()
    },
    // - 点击添加分类按钮，触发该事件
    showAddCateDialog () {
      // - 先获取父级分类的数据
      this.getParentCateList()
      // - 展示对话框
      this.controlAddCatedialogVisible = true
    },
    // - 获取父级分类的商品数据列表（一级和二级），展示级联选择器
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) {
        this.$message.error('获取父级分类的商品数据失败')
      } else {
        this.parentCateList = res.data
      }
    },
    // - 级联选择器中的选择项发生变化，触发该事件
    parentCateChanged () {
      // console.log(this.selectedKeys)
      //* 如果selectedKeys数组中的length大于0，证明选中了父级分类
      //* 反之，就说明没有写选中任何父级分类
      if (this.selectedKeys.length > 0) {
        // ? 获取父级的id，即cat_pid
        this.addCateInfo.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // ? 获取当前分类的等级
        this.addCateInfo.cat_level = this.selectedKeys.length
      } else {
        //! 未选中任何父级的分类
        // - 表示当前添加的分类为一级分类
        // - 设置父级分类的id值为0
        // - 如果要添加1级分类，则父分类Id应该设置为  `0`
        this.addCateInfo.cat_pid = 0
        // - `0`表示一级分类
        this.addCateInfo.cat_level = 0
      }
    },
    // - 当添加分类的对话框关闭时，触发该事件，清除表单输入框的数据和校验结果
    closeAddCateDialog () {
      // ? 将表单初始化
      this.$refs.addCateRef.resetFields()
      // ? 将级联选择器初始化
      this.selectedKeys = []
    },
    // - 点击添加分类的表单的确定按钮，发起表单的预验证，验证通过之后将表单数据持久化
    addCateFun () {
      // console.log(this.addCateInfo)
      // - 进行添加分类的表单预验证
      this.$refs.addCateRef.validate(async isValid => {
        // console.log(isValid)
        if (!isValid) {
          // ? 表单预验证为未通过
          this.$message.error('表单预验证失败，请输入合法数据')
        } else {
          // ? 预验证通过，发送axios请求，持久化保存数据
          const { data: res } = await this.$http.post('categories', this.addCateInfo)
          if (res.meta.status !== 201) {
            // ? axios请求失败
            this.$message.error('添加商品分类失败')
          } else {
            // ? 请求成功
            this.$message.success('添加商品分类成功')
            // ? 重新获取商品分类的列表数据
            this.getCateList()
          }
        }
      })
      this.addCateInfo = {}
      this.$refs.addCateRef.resetFields()
      this.controlAddCatedialogVisible = false
    },
    // - 点击分类列表的每一行的编辑按钮，响应该事件
    editGoodsCateFun (row) {
      console.log(row)
      // - 该id值，为axios发送修改参数的请求时，参数体使用
      this.editGoodsCateModel.cat_id = row.cat_id
      // - 将对应的参数分类的名称回显到文本输入框中
      this.editGoodsCateModel.cat_name = row.cat_name
      this.controlEditGoodsCateDialogVisible = true
    },
    // - 关闭编辑商品分类的名称，触发该事件
    clearEditGoodsForm () {
      this.$refs.editGoodsCateRef.resetFields()
    },
    // - 点击修改分类商品的表单的确定按钮，响应该事件
    editGoodsCateFeverFun () {
      // - 对表单进行预验证
      this.$refs.editGoodsCateRef.validate(async isValid => {
        if (!isValid) {
          // - 预验证失败
          this.$message.error('表单预验证失败，请输入合法数据')
        } else {
          const { data: res } = await this.$http.put(`categories/${this.editGoodsCateModel.cat_id}`, { cat_name: this.editGoodsCateModel.cat_name })
          if (res.meta.status !== 200) {
            this.$message.error('修改商品分类名称失败')
          } else {
            this.$message.success('修改商品分类名称成功')
            // - 重新获取商品分类的列表数据
            this.getCateList()
          }
        }
      })
      // - 关闭对话框
      this.controlEditGoodsCateDialogVisible = false
    },
    // - 点击分类列表的每一行的编辑按钮，响应该事件
    deleteGoodsCateFun (row) {
      this.$confirm('此操作将永久删除此商品分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`categories/${row.cat_id}`)
        if (res.meta.status !== 200) {
          this.$message.error('删除商品分类失败')
        } else {
          this.$message.success('删除商品分类成功')
          // - 重新获取列表中的数据（重新渲染）
          this.getCateList()
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
.treeTable{
  margin-top: 16px;
  font-size: 14px;
}
.el-cascader{
  width: 100%;
}
// - 设置级联选择器的文本输入框的长度
.el-input__inner{
  width:268px;
}
</style>
