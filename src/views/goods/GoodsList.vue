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
      <!-- el-card的头部区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 文本输入框带搜索按钮 -->
          <el-input placeholder="请输入内容" v-model="queryGoodsInfo.query" :clearable="true" @clear="getNewGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="searchGoodsList"></el-button>
          </el-input>
        </el-col>
        <!-- button按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="addGoodsFun">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品列表的表格 -->
      <el-table
      :data="goodsList"
      :border="true"
      :stripe="true"
      >
      <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(￥)" prop="goods_price" width="105px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="80px"></el-table-column>
         <el-table-column label="创建时间" prop="add_time" width="160px">
           <!-- 使用作用域插槽，来使用插值语法渲染创建时间，使用过滤器指定日期格式 -->
           <template slot-scope="scope">
             {{scope.row.add_time|dateFormat}}
           </template>
         </el-table-column>
         <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
            <!-- 操作的按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteGoodsFun(scope.row.goods_id)"></el-button>
          </template>
         </el-table-column>
      </el-table>
      <!-- 分页条 -->
      <el-pagination
      :background="true"
      @size-change="GoodsLiitSizeChange"
      @current-change="GoodsListHandleCurrentChange"
      :current-page="queryGoodsInfo.pagenum"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="queryGoodsInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Goods',
  created () {
    this.getGoodsList()
  },
  data () {
    return {
      // - 查询参数对象，axios发起请求时，所携带的请求参数对象
      queryGoodsInfo: {
        // ? 商品查询参数，与商品的搜索框进行绑定
        query: '',
        pagenum: 1,
        pagesize: 100
      },
      // - 商品列表的数据模型
      goodsList: [],
      // - 商品列表中商品的条数
      total: 0
    }
  },
  methods: {
    // - 获取商品列表的数据
    async getGoodsList () {
      const { data: res } = await this.$http.get('goods', { params: this.queryGoodsInfo })
      if (res.meta.status !== 200) {
        this.$message.error('获取商品列表数据失败')
      } else {
        // - 获取商品列表数据
        this.goodsList = res.data.goods
        // - 获取商品列表数据的总数
        this.total = res.data.total
      }
    },
    // - 点击文本输入框的叉号，触发该事件,重新获取列表中的数据（重新渲染）
    getNewGoodsList () {
      this.getGoodsList()
    },
    // - 分页条上每页显示的条数发生改变会触发该事件
    GoodsLiitSizeChange (newPageSize) {
      this.queryGoodsInfo.pagesize = newPageSize
      // - 重新获取列表中的数据（重新渲染）
      this.getGoodsList()
    },
    // - 分页条上当前的页码数发生改变，触发该事件
    GoodsListHandleCurrentChange (newCurrNum) {
      this.queryGoodsInfo.pagenum = newCurrNum
      // - 重新获取列表中的数据（重新渲染）
      this.getGoodsList()
    },
    // - 点击搜索按钮，触发该事件
    searchGoodsList () {
      this.getGoodsList()
    },
    // - 点击表格中每一行的删除按钮，触发该事件
    deleteGoodsFun (goodsId) {
      console.log(11)
      this.$confirm('此操作将永久删除该条商品信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`goods/${goodsId}`)
        if (res.meta.status !== 200) {
          this.$message.error('商品信息删除失败')
        } else {
          this.$message.success('商品信息删除成功')
          // - 重新获取商品列表数据
          this.getGoodsList()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // - 点击添加商品的按钮，触发该事件
    addGoodsFun () {
      this.$router.push('/goods/addgoods')
    }
  }

}
</script>

<style lang="less" scoped>

</style>
