<template>
  <div>
    <PageHead title="知识文章">
      <template #button>
        <el-button type="primary" @click="handleEdit({})">新增</el-button>
      </template>
    </PageHead>
    <TableSearch :formItem="formItem" @search="handleSearch"></TableSearch>
    <el-table :data="tableData" style="width: 100%; margin-top: 20px;">
      <el-table-column label="文章标题" width="300" fixed="left">
        <template #default="scope">
          <div style="display: flex; align-items: center;">
            <el-icon><Timer /></el-icon>
            {{ scope.row.title }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="分类" width="200">
        <template #default="scope">
          <div style="display: flex; align-items: center;">
            <el-icon><timer /></el-icon>
            {{ categoryMap[scope.row.categoryId] }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="authorName" label="作者" width="150" />
      <el-table-column prop="readCount" label="阅读量" width="150" />
      <el-table-column prop="updatedAt" label="发布时间" width="150" />
      <el-table-column label="操作" width="240" fixed="right">
        <template #default="scope">
          <div style="display: flex; align-items: center;">
            <el-button type="primary" @click="handleEdit(scope.row)" >编辑</el-button>
            <el-button v-if="scope.row.status===0||scope.row.status===2" type="success" @click="handlePublish(scope.row)" >发布</el-button>
            <el-button v-if="scope.row.status===1" type="info" @click="handleOffline(scope.row)" >下线</el-button>
            <el-button type="danger" @click="handleDelete(scope.row)" >删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 20px;"
      :total="pagination.total"
      :page-size="pagination.size"
      :current-page="pagination.currentPage"
      @current-change="handlePageChange"
      layout=" prev, pager, next"
    ></el-pagination>
    <ArticleDialog v-model="dialogVisible" :categoryList="categoryList" :article="currentArticle" @success="handleSuccess"></ArticleDialog>
  </div>
</template>

<script setup>
import PageHead from '@/components/PageHead.vue'
import TableSearch from '@/components/TableSearch.vue'
import { ref } from 'vue'
import { getCategoryListApi } from '@/api/category'
import { onMounted } from 'vue'
import { getArticlePageApi } from '@/api/articlepage'
import { Timer } from '@element-plus/icons-vue'
import ArticleDialog from '@/components/ArticleDialog.vue'
import { getArticleListApi,publishArticleApi,deleteArticleApi } from '@/api/admin'
import {ElMessage,ElMessageBox} from 'element-plus'
const formItem = ref([
  {
    comp: 'input',
    label: '文章标题',
    prop: 'title',
    placeholder: '请输入文章标题'
  },
  {
    comp: 'select',
    label: '文章内容',
    prop: 'categoryId',
    placeholder: '选择文章内容',
    options: []
  },
  {
    comp: 'select',
    label: '状态',
    prop: 'status',
    placeholder: '选择状态',
    options: [
      {
        label: '草稿',
        value: '0'
      },
      {
        label: '已发布',
        value: '1'
      },
      {
        label: '已下线',
        value: '2'
      }
    ]
  },
])

const categoryList = ref([])
const categoryMap = ref({})
const tableData = ref([])  // 新增：定义响应式的 tableData

const pagination = ref({
  size: '10',      // 改为数字
  currentPage: '1' ,// 改为数字
  total: 0 // 新增：定义响应式的 total 变量
})

onMounted(async () => {
  const res = await getCategoryListApi()
  categoryList.value = res.data.map(item => {  
    categoryMap.value[item.id] = item.categoryName
    return {
      label: item.categoryName,
      value: item.id   
    }
  })
  formItem.value[1].options = categoryList.value
})

const handleSearch = async (formData) => {
  const params = {
    ...pagination.value,
    ...formData
  }
  const res = await getArticlePageApi(params)
  tableData.value = res.data.records  
  pagination.value.total = res.data.total  
}
onMounted(() => {
  handleSearch()
})
const dialogVisible = ref(false)
const currentArticle = ref({})
const handleEdit = async (row) => {
  if(!row.id){
    currentArticle.value = null
    dialogVisible.value = true
    return
  }
  const res = await getArticleListApi(row.id)
  console.log(res.data)
  currentArticle.value = res.data
  dialogVisible.value = true
}
const handlePageChange = (page) => {
  pagination.value.currentPage = page
  handleSearch()
}
const handleSuccess = () => {
  dialogVisible.value = false
  handleSearch()
}
const handlePublish=(row)=>{
  ElMessageBox.confirm('确认发布吗？', '提示', {
    confirmButtonText: '确定发布',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    publishArticleApi(row.id,{status:1}).then(res=>{
      ElMessage.success('发布成功')
      handleSearch()
    }).catch(err=>{
      ElMessage.error('发布失败')
    })
  }).catch(() => {
    // 取消发布
    console.log('取消发布')
  })
}
const handleOffline=(row)=>{
  ElMessageBox.confirm('确认下线吗？', '提示', {
    confirmButtonText: '确定下线',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    publishArticleApi(row.id,{status:2}).then(res=>{
      ElMessage.success('下线成功')
      handleSearch()
    }).catch(err=>{
      ElMessage.error('下线失败')
    })
  }).catch(() => {
    // 取消下线
    console.log('取消下线')
  })
}
const handleDelete=(row)=>{
  ElMessageBox.confirm('确认删除吗？', '提示', {
    confirmButtonText: '确定删除',
    cancelButtonText: '取消',
    type: 'danger'
  }).then(() => {
    deleteArticleApi(row.id).then(res=>{
      ElMessage.success('删除成功')
      handleSearch()
    }).catch(err=>{
      ElMessage.error('删除失败')
    })
  }).catch(() => {
    // 取消删除
    console.log('取消删除')
  })
}
</script>

<style lang="scss" scoped>

</style>