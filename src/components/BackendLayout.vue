<template>
  <div class="backend-layout">
    <el-container class="main-sidebar">
      <Sidebar></Sidebar>
      <el-container>
        <el-header height="60px"><Navbar></Navbar></el-header>
        <el-main class="main-content"><router-view></router-view></el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import Sidebar from './Sidebar.vue'
import Navbar from './Navbar.vue'
</script>

<style lang="scss" scoped>
.backend-layout {
  height: 100vh;
}

.main-sidebar {
  height: 100%;
}
.main-content {
        flex: 1;
        .content-container {
            padding: 20px;
            background-color: #fff;
            min-height: calc(100% - 74px);
        }
      }
</style>