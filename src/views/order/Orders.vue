<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" :clearable="true" v-model="orderQueryinfo.query" @clear="clearFun">
            <el-button icon="el-icon-search" slot="append" @click="orderQueryFun"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 显示订单信息的表格 -->
      <el-table :data="orderList" :border="true" :stripe="true">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price" width="100px"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status" width="100px">
          <template slot-scope="scope">
             <el-tag type="success" v-if="scope.row.pay_status==='1'">已付款</el-tag>
          <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send" width="100px"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{scope.row.create_time|dateFormat}}
          </template>
        </el-table-column>
         <el-table-column label="操作">
           <template>
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editAddressFun">编辑</el-button>
             <el-button type="success" icon="el-icon-location" size="mini" @click="showProgressDialog">物流</el-button>
           </template>
         </el-table-column>
      </el-table>
      <!-- 分页条 -->
       <el-pagination
       :background="true"
      @size-change="orderHandleSizeChange"
      @current-change="orderHandleCurrentChange"
      :current-page="orderQueryinfo.pagenum"
      :page-sizes="[10,15,20,25]"
      :page-size="orderQueryinfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
    <!-- 修改地址的对话框 -->
    <el-dialog
      @close="closeEditAddressDialog"
      title="修改地址"
      :visible.sync="controlAddressDialogVisible"
      width="40%">
      <el-form
      :model="editAddressInfo"
      :rules="editAddressRules"
      ref="editAddressRef"
      label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
        <!-- 级联选择器 -->
          <el-cascader
            :clearable="true"
            v-model="editAddressInfo.address1"
            :options="citydata">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="editAddressInfo.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="controlAddressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="controlAddressDialogVisible = false">确 定</el-button>
      </span>
   </el-dialog>
   <!-- 显示物流信息的对话框 -->
   <el-dialog
    title="物流进度"
    :visible.sync="controlProgressDialogVisible"
    width="50%">
    <!-- 时间轴 -->
      <el-timeline reverse="reverse">
    <el-timeline-item
      v-for="(activity, index) in progressInfo"
      :key="index"
      :timestamp="activity.time"
      :color="activity.color"
      >
      {{activity.context}}
    </el-timeline-item>
  </el-timeline>
</el-dialog>
  </div>
</template>

<script>
import citydata from '@/views/order/citydata'
export default {
  name: 'Orders',
  created () {
    this.getOrderList()
  },
  data () {
    return {
      // - 获取商品列表数据时，发送的请求信息
      orderQueryinfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // - 订单的总条数
      total: 0,
      // - 订单的列表的数据模型
      orderList: [],
      // - 控制修改地址的对话框的显示与隐藏
      controlAddressDialogVisible: false,
      // -修改地址的表单绑定的数据模型
      editAddressInfo: {
        address1: [],
        address2: ''
      },
      // - 表单验证规则
      editAddressRules: {
        address1: [
          { type: 'date', required: true, message: '请选择省市区/县', trigger: 'blur' }
        ],
        address2: [
          { type: 'date', required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      // -供级联选择器使用的地址数据
      citydata: citydata,
      // - 控制显示物流进度的对话框的显示与隐藏
      controlProgressDialogVisible: false,
      // - 物流信息（假数据）
      progressInfo: [
        {
          'time': '2018-05-10 09:39:00',
          'ftime': '2018-05-10 09:39:00',
          'context': '已签收,感谢使用顺丰,期待再次为您服务',
          'location': ''
        },
        {
          'time': '2018-05-10 08:23:00',
          'ftime': '2018-05-10 08:23:00',
          'context': '[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件',
          'location': ''
        },
        {
          'time': '2018-05-10 07:32:00',
          'ftime': '2018-05-10 07:32:00',
          'context': '快件到达 [北京海淀育新小区营业点]',
          'location': ''
        },
        {
          'time': '2018-05-10 02:03:00',
          'ftime': '2018-05-10 02:03:00',
          'context': '快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]',
          'location': ''
        },
        {
          'time': '2018-05-09 23:05:00',
          'ftime': '2018-05-09 23:05:00',
          'context': '快件到达 [北京顺义集散中心]',
          'location': '',
          'color': '#0bbd87'
        },
        {
          'time': '2018-05-09 21:21:00',
          'ftime': '2018-05-09 21:21:00',
          'context': '快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]',
          'location': '',
          'color': '#0bbd87'
        },
        {
          'time': '2018-05-09 13:07:00',
          'ftime': '2018-05-09 13:07:00',
          'context': '顺丰速运 已收取快件',
          'location': '',
          'color': '#0bbd87'
        },
        {
          'time': '2018-05-09 12:25:03',
          'ftime': '2018-05-09 12:25:03',
          'context': '卖家发货',
          'location': '',
          'color': '#0bbd87'
        },
        {
          'time': '2018-05-09 12:22:24',
          'ftime': '2018-05-09 12:22:24',
          'context': '您的订单将由HLA（北京海淀区清河中街店）门店安排发货。',
          'location': '',
          'color': '#0bbd87'
        },
        {
          'time': '2018-05-08 21:36:04',
          'ftime': '2018-05-08 21:36:04',
          'context': '商品已经下单',
          'location': '',
          'color': '#0bbd87'
        }
      ]
    }
  },
  methods: {
    // - 获取订单列表数据
    async getOrderList () {
      const { data: res } = await this.$http.get('orders', { params: this.orderQueryinfo })
      if (res.meta.status !== 200) {
        this.$message.error('商品订单列表获取失败')
      } else {
        this.orderList = res.data.goods
        this.total = res.data.total
      }
    },
    // - 当分页条的一页显示的条数发生改变时，触发该事件
    orderHandleSizeChange (newPageSize) {
      this.orderQueryinfo.pagesize = newPageSize
      this.getOrderList()
    },
    // - 当分页条的页码数发生改变时，触发该事件
    orderHandleCurrentChange (newPageNum) {
      this.orderQueryinfo.pagenum = newPageNum
      this.getOrderList()
    },
    // - 点击头部的搜索订单的按钮，触发该事件
    orderQueryFun () {
      console.log(this.orderQueryinfo.query)
      this.getOrderList()
    },
    // - 点击搜索框的清除按钮，触发该事件
    clearFun () {
      console.log(22)
      this.getOrderList()
    },
    // - 点击修改地址的按钮，触发该事件
    editAddressFun () {
      this.controlAddressDialogVisible = true
    },
    // - 关闭修改地址的对话框，触发该事件
    closeEditAddressDialog () {
      this.$refs.editAddressRef.resetFields()
    },
    // - 点击查看物流按钮，触发该事件
    async showProgressDialog () {
      // - 获取物流的数据

      this.controlProgressDialogVisible = true
    }
  }

}
</script>

<style lang="less" scoped>
.el-cascader{
  width: 100%;
}
</style>
