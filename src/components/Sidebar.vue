<template>
  <div class="sidebar">
    <el-aside :width="isCollapsed ? '64px' : '264px'">
      <el-menu
        default-active="2"
        @open="handleOpen"
        @close="handleClose"
        class="sidebar-menu-content"
        :collapse="isCollapsed"
      >
      <div class="brand">
        <el-image v-show="!isCollapsed" :src="robotIcon" alt="机器人" style="width: 50px; height: 50px;">
        </el-image>
        <div v-show="!isCollapsed" class="info-card">
          <h1 class="brand-title">心理健康AI</h1>
          <p class="brand-subtitle">后台管理系统</p>
        </div>
      </div>
        <el-menu-item @click="handleClick(item.path)" v-for="item in router.options.routes[0].children" :key='item.path' :index="item.path">
          <el-icon><component :is="item.meta.icon" /></el-icon>
          <span>{{item.meta.title}}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
  </div>
</template>

<script setup>
import {computed} from 'vue'
import {useRouter} from 'vue-router'
import { useAdminStore } from '@/stores/admin'
const adminStore = useAdminStore()
const isCollapsed = computed(() => adminStore.isCollapsed)

const router = useRouter()
const robotIcon = new URL('@/assets/images/机器人.png', import.meta.url).href

const handleClick = (path) => {
  router.push(path)
}
</script>

<style lang="scss" scoped>
// .sidebar {
//   height: 100%;
// }

.el-aside {
  height: 100%;
  transition: width 0.3s ease;
}

.sidebar-menu-content{
  height: 100%;
  .brand{
    display:flex;
    align-items:center;
    padding: 10px;
    background-color: #fff;
    border-bottom: 1px solid #e5e7eb;
    .info-card{
      .brand-title{
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 5px;
        color: #303133;
      }
      .brand-subtitle{
        font-size: 14px;
        font-weight: normal;
        color: #303133;
      }
    }

  }
}

  
</style>    