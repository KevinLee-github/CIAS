<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 文本提示区域 -->
       <el-alert
         title="添加商品信息"
         type="info"
         center
         :closable="false"
         show-icon>
       </el-alert>
       <!-- 步骤条区域 -->
       <el-steps :space="200" :active="stepsActiveIndex-0" finish-status="success" align-center="">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
       </el-steps>
       <!-- tabs侧边栏 -->
       <!--
         value / v-model绑定值，选中选项卡的 name，当激活某一项panel时，会将对应的name值赋值给v-model绑定的数据上
        -->
        <!-- 由于tabs标签页的整体，才是一个商品的数据，所以应该使用form表单将其包裹成一个整体 -->
        <el-form :model="addGoodsInfo" :rules="addGoodsRules" ref="addGoodsRef" label-width="100px" label-position="top">
       <el-tabs
       :tab-position="'left'"
        style="marginTop:16px"
        v-model="stepsActiveIndex"
        :before-leave="beforeTabLeave"
        @tab-click="tabClickFun"
        >
         <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsInfo.goods_name"></el-input>
            </el-form-item>
             <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addGoodsInfo.goods_price" type="number"></el-input>
            </el-form-item>
             <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addGoodsInfo.goods_weight" type="number"></el-input>
            </el-form-item>
             <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addGoodsInfo.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
               <el-cascader
                  :clearable="true"
                  v-model="addGoodsInfo.goods_cat"
                  :options="cateList"
                  :props="cascaderProps"
                  @change="cascaderHandleChange">
               </el-cascader>
            </el-form-item>
         </el-tab-pane>
         <el-tab-pane label="商品参数" name="1">
           <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
            <!-- 复选框组  -->
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i" :border="true"></el-checkbox>
            </el-checkbox-group>
           </el-form-item>
         </el-tab-pane>
         <el-tab-pane label="商品属性" name="2">
           <el-form-item :label="item.attr_name" v-for="item in onlyTableDate" :key="item.attr_id">
             <el-input v-model="item.attr_vals"></el-input>
           </el-form-item>
         </el-tab-pane>
         <el-tab-pane label="商品图片" name="3">
           <!-- 上传图片 action 表示上传图片的url地址 -->
           <el-upload
            :action="uploadUrl"
            :on-preview="uploadHandlePreview"
            :on-remove="uploadHandleRemove"
            :headers="headerObj"
            :on-success="uploadImgSuccess"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
         </el-tab-pane>
         <el-tab-pane label="商品内容" name="4">
           <quill-editor v-model="addGoodsInfo.goods_introduce"></quill-editor>
           <el-button type="primary" class="addBtn" @click="addGoodsForever">添加商品</el-button>
         </el-tab-pane>
       </el-tabs>
        </el-form>
    </el-card>
    <!-- 预览图片的对话框 -->
    <el-dialog
    title="图片预览"
    :visible.sync="previewImageDialogVisible"
    width="50%">
    <img :src="previewImagPath" class="previewImage">
</el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'AddGoods',
  created () {
    this.getCateList()
  },
  data () {
    return {
      // - 步骤条的当前显示的索引值
      stepsActiveIndex: '0',
      // - 表单的数据源
      addGoodsInfo: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // - 级联选择器中，选中的item项对应id保存在该数组中
        goods_cat: [],
        // - 保存上传成功图片的临时地址对象
        pics: [],
        // - 商品的详情描述信息
        goods_introduce: '',
        // - 包含商品的参数（静态参数和动态参数）
        attrs: []
      },
      // - 表单的验证规则
      addGoodsRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 2, message: '长度最小为2个字符', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      // - 商品分类数据列表的数据模型
      cateList: [],
      // - 级联选择器的配置项
      cascaderProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'

      },
      // - 三级商品的动态参数的数组
      manyTableData: [],
      // - 三级商品的静态属性的数组
      onlyTableDate: [],
      // -图片上传的地址
      uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      // -上传图片组件的headers请求头
      headerObj: {
        // - 此处的目的是，为upload的请求头，添加一个请求头，配置一个token，这样才能成功访问对应的接口
        Authorization: window.sessionStorage.getItem('token')
      },
      // - 要预览的图片的url地址
      previewImagPath: '',
      // - 控制图片预览对话框的显示与隐藏
      previewImageDialogVisible: false
    }
  },
  computed: {
    cat_id () {
      if (this.addGoodsInfo.goods_cat.length === 3) {
        return this.addGoodsInfo.goods_cat[2]
      } else {
        return null
      }
    }
  },
  methods: {
    //* 获取商品分类参数的数据
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        this.$message.error('商品分类数据获取失败')
      } else {
        this.cateList = res.data
      }
    },
    // - 当级联选择器的选择项被选中时会触发该事件
    cascaderHandleChange () {
      if (this.addGoodsInfo.goods_cat.length !== 3) {
        this.addGoodsInfo.goods_cat = []
      }
    },
    //* 切换tabs标签页前，触发该事件
    //* activeName:即将离开的标签页的名字 oldActiveName：当前标签页的名字
    beforeTabLeave (activeName, oldActiveName) {
      //! 当处于第一个标签页-基本信息栏，商品分类项是否已勾选（cascader）
      if (oldActiveName === '0' && this.addGoodsInfo.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    // - 当点击tabs标签页的每一项，都会出触发该事件
    async tabClickFun () {
      if (this.stepsActiveIndex === '1') {
        //! 判断index（当前激活页的stepsActiveIndex是否等于1，等于话表示可以发起获取对应三级商品动态属性的请求）
        const { data: res } = await this.$http.get(`categories/${this.cat_id}/attributes`, { params: { sel: 'many' } })
        if (res.meta.status !== 200) {
          this.$message.error('获取动态参数列表失败')
        } else {
          this.manyTableData = res.data
          // 将manyTableData数组元素的attr_vals（动态商品参数项）字符串转换为字符串数组
          this.manyTableData.forEach(item => {
            item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
          })
        }
      } else if (this.stepsActiveIndex === '2') {
        // - tab页已经切换到静态属性页面，应该发起axios请求，获取对应静态参数信息
        const { data: res } = await this.$http.get(`categories/${this.cat_id}/attributes`, { params: { sel: 'only' } })
        if (res.meta.status !== 200) {
          this.$message.error('获取静态参数列表失败')
        } else {
          this.onlyTableDate = res.data
          // console.log(this.onlyTableDate)
        }
      }
    },
    // - 处理图片的预览效果，点击图片的标题，该事件徽菜被触发
    uploadHandlePreview (file) {
      // - 将获取的图片的url地址，赋值给previewImagePath，供图片预览使用
      this.previewImagPath = file.response.data.url
      this.previewImageDialogVisible = true
    },
    // - 移除要上传的图片，触发该事件
    uploadHandleRemove (file) {
      // - 1、获取将要删除图片的临时路径
      const filePath = file.response.data.tep_path
      // - 2、从pics数组中，找到这个图片对应的索引值
      const i = this.addGoodsInfo.pics.findIndex(x => x.pic === filePath)
      // - 3、调用数组的splice方法，把图片信息对象，从pics数组中移除
      this.addGoodsInfo.pics.splice(i, 1)
      // console.log(this.addGoodsInfo)
    },
    // - 图片上传成功，触发该事件
    uploadImgSuccess (response) {
      // - 创建一个保存图片路径的对象，对象中包含一个pic属性，保存临时图片的地址
      const picInfo = { pic: response.data.tmp_path }
      this.addGoodsInfo.pics.push(picInfo)
      // console.log(this.addGoodsInfo)
    },
    // - 点击富文本编辑器下方的添加商品的按钮，触发该事件
    addGoodsForever () {
      // console.log(this.addGoodsInfo)
      // - 添加商品前对表单进行预验证
      this.$refs.addGoodsRef.validate(async isValid => {
        if (!isValid) {
          this.$message.error('请将表单中的必填项填写完整')
        } else {
          // - 执行添加商品的业务逻辑
          // - 使用lodash的cloneCopy进行深拷贝，原因是因为级联选择器使用的goods_cat要求是数组而axios发送请求时，
          // - 请求参数中的goods_cat 要求是一个字符串
          const form = _.cloneDeep(this.addGoodsInfo)
          form.goods_cat = form.goods_cat.join(',')
          // console.log(form)
          // - 处理动态参数，将其保存在attrs数组中
          this.manyTableData.forEach(item => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(' ')
            }
            this.addGoodsInfo.attrs.push(newInfo)
          })
          // - 处理静态属性，将其保存在attrs数组中
          this.onlyTableDate.forEach(item => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals
            }
            this.addGoodsInfo.attrs.push(newInfo)
          })
          form.attrs = this.addGoodsInfo.attrs
          console.log(form)
          // -发起axios请求，持久化添加商品数据
          const { data: res } = await this.$http.post('goods', form)
          if (res.meta.status !== 201) {
            console.log(res.meta.msg)
            this.$message.error('商品添加失败')
          } else {
            this.$message.success('商品添加成功')
            this.$router.push('/goods')
          }
        }
      })
    }

  }
}
</script>

<style lang="less" scoped>
.el-checkbox{
  margin:0px 5px 0px 0px;
}
.previewImage{
  width: 100%;
}
.addBtn{
  margin-top: 16px;
}
</style>
