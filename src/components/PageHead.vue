<template>
  <div class="page-head">
    <div class="page-title">
        {{ props.title }}
    </div>
    <slot name="button"></slot>
  </div>
</template>

<script setup>
 const props = defineProps({
    title: {
        type: String,
        default: '页面标题'
    }
})
</script>

<style lang="scss" scoped>
.page-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    border-bottom: 1px solid #e5e7eb;
    margin-bottom: 20px;
}
.page-title {
    font-size: 16px;
    font-weight: bold;
}
.page-button {
    font-size: 14px;
    font-weight: bold;
}
</style>