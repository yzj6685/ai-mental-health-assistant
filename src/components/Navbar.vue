<template>
  <div class="navbar">
    <div class="flex-box">
     <el-button @click="handleCollapse"><el-icon><Expand /></el-icon></el-button>
     <p class="page-title">{{route.meta.title}}</p>
    </div>
    <div class="flex-box">
      <el-dropdown @command="handleCommand">
        <div class="flex-box">
          <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
          <p class="user-name">admin</p>
          <el-icon><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu >
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { useAdminStore } from '@/stores/admin'
import {useRouter,useRoute} from 'vue-router'
import {logoutApi} from '@/api/admin'
import {ElMessageBox} from 'element-plus'
const adminStore = useAdminStore()
const router = useRouter()
const route = useRoute()
const handleCollapse = () => {
    adminStore.toggleCollapsed()
}
const handleCommand = (command) => {
  if(command === 'logout'){
    ElMessageBox.confirm('确定退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      logoutApi().then(res => {
        
          router.push('/auth/login')
          localStorage.removeItem('token')
          localStorage.removeItem('userInfo')
        
      })
    })
  }
 }



</script>

<style lang="scss" scoped>
.navbar {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f5f7fa;
  padding: 0 20px;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex: 1;
  .flex-box{
    display: flex;
    align-items: center;
    justify-content: center;
    .page-title {
        margin-left: 20px;
        font-size: 26px;
        font-weight: bold;
        color: #1f2937;
    }
    .user-name {
        margin: 0 5px;
        font-weight: bold;
    }
  }
}

</style>