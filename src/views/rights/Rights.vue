<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
     <!-- 表格区域 -->
     <el-table
     :data="rightsList"
      :border="true"
      :tripe="true">
       <el-table-column label="#" type="index"></el-table-column>
       <el-table-column label="权限名称" prop="authName"></el-table-column>
       <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <!-- 使用作用域插槽可以自定义表格中每一列的组件，并且获取的scope是所在行的所有数据 -->
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level==='0'" type="danger">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level==='1'">二级</el-tag>
            <el-tag  v-else>三级</el-tag>
          </template>
        </el-table-column>
     </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Rights',
  data () {
    return {
      //! 权限列表数据模型
      rightsList: []
    }
  },
  created () {
    //* 当页面初始化前期，获取权限列表数据
    this.getRightsList()
  },
  methods: {
    //* 获取权限列表数据
    async getRightsList () {
      const { data: res } = await this.$http.get('rights/list')
      // console.log(res)
      if (res.meta.status !== 200) {
        this.$message.error('获取权限列表数据失败')
      } else {
        //* 将获取到的权限列表的数组保存到rightsList数组中
        this.rightsList = res.data
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
