<template>
    <el-form :model="form" ref="formRef">
      <el-row :gutter="24"> 
        <template
          v-for="item in formItemAttrs"
          :key="item.prop"
        >
        <el-col v-bind="item.col">
          <el-form-item
            :label="item.label"
            :prop="item.prop"
          >
            <component
              :is="isComp(item.comp)"
              v-model="form[item.prop]"
              :placeholder="item.placeholder"
              :popper-append-to-body="item.comp === 'select'"
            >
              <template v-if="item.comp==='select'">
                <el-option
                  label="全部"
                  value=""
                />
                <el-option
                  v-for="option in item.options" 
                  :key="option.value" 
                  :label="option.label" 
                  :value="option.value"
                />
              </template>
            </component>
          </el-form-item>
        </el-col>
        </template>
      </el-row>
    </el-form>
    <el-button
      type="primary"
      @click="handleSubmit"
    >
      查询
    </el-button>
    <el-button
      type="primary"
      @click="handleReset"
    >
      重置
    </el-button>
</template>

<script setup>
import { computed, ref } from 'vue'

const form = ref({})
const formRef = ref()

const props = defineProps({
  formItem: {
    type: Array,
    default: () => [],
  }
})

const emit = defineEmits(['search'])

const formItemAttrs = computed(() => {
  const { formItem } = props
  formItem.forEach(item => {
    item.col = { xs: 24, sm: 12, md: 8, lg: 6, xl: 6 }
  })
  return formItem
})

const isComp = (comp) => {
  return {
    input: 'el-input',
    select: 'el-select',
  }[comp]
}

const handleSubmit = () => {
  emit('search', form.value)
}

const handleReset = () => {
  if (!formRef.value) return
  formRef.value.resetFields()
}
</script>

<style lang="scss" scoped>

</style>