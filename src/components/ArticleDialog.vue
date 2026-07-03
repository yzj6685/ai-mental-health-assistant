<template>
    <el-dialog
        :title="isEdit ? '编辑文章' : '新增文章'"
        v-model="dialogVisible"
        width="50%"
        @close="handleClose"
    >
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="文章标题" prop="title" >
            <el-input v-model="formData.title" placeholder="请输入文章标题" maxlength="50" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="所属分类" prop="categoryId">
            <el-select v-model="formData.categoryId" placeholder="请选择所属分类">
                <el-option v-for="item in categoryList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="文章摘要" prop="summary">
            <el-input type="textarea" v-model="formData.summary" placeholder="请输入文章摘要" maxlength="500" show-word-limit rows="4"></el-input>
        </el-form-item>
        <el-form-item label="标签">
            <el-select v-model="formData.tagsArray" placeholder="请选择标签" maxlength="50" show-word-limit multiple filterable >
                <el-option v-for="item in commonTags" :key="item" :label="item" :value="item"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="封面图片" >
            <div class="upload-container">
                <el-upload
                    class="avatar-uploader"
                    action="#"
                    :before-upload="beforeAvatarUpload"
                    :http-request="handleAvatarSuccess"
                    :show-file-list="false"
                >
                    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                </el-upload>
                <el-button v-if="imageUrl" type="danger" size="small" @click.stop="handleRemove">移除</el-button>
            </div>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
            <RichTextEditor
            v-model="formData.content" 
            mini-height="400px"
            @created="handleEditorCreated" 
            @change="handleEditorChange" />
        </el-form-item>
    </el-form>
    <div v-if="btnPreview">
        <p>内容预览</p>
        <div v-html="formData.content"></div>
    </div>
    <template #footer>
        <el-button type="info" @click="btnPreview = !btnPreview">{{ btnPreview ? '关闭预览' : '预览' }}</el-button>
        <el-button type="info" @click="handleClose">关闭</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">{{isEdit ? '更新' : '新增'}}</el-button>
    </template>
    </el-dialog>
</template>
<script setup>
import { ref ,watch} from 'vue'
import { defineEmits , defineProps , computed ,nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { upLoadFileApi ,formDataSubmitApi ,updateArticleApi } from '@/api/admin'
import { fileBaseUrl } from '@/config/index.js'
import RichTextEditor from '@/components/RichTextEditor.vue'

const commonTags = [
  '情绪管理', '焦虑', '抑郁', '压力', '睡眠', 
  '冥想', '正念', '放松', '心理健康', '自我成长',
  '人际关系', '工作压力', '学习方法', '生活技巧'
]
const imageUrl = ref('')
const emits = defineEmits(['update:modelValue'])
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    categoryList: {
        type: Array,
        default: () => []
    },
    article: {
        type: Object,
        default: null
    }
})
const isEdit = computed(()=>{
    return !!props.article?.id
})
console.log(props.categoryList)
const dialogVisible = computed({
    get: () => props.modelValue,
    set: (val) => {
        emits('update:modelValue', val)
    }
})
const handleDialog = () => {
    
}
const formData = ref({
    "title": '',
    "content": '',
    "coverImage": '',
    "categoryId": '',
    "summary": '',
    "tags": '',
    "id": '',
    "tagsArray": []
})
const rules = ref({
    title: [
        { required: true, message: '请输入文章标题', trigger: 'blur' }
    ],
    categoryId: [
        { required: true, message: '请选择所属分类', trigger: 'change' }
    ]
})
const formRef = ref(null)
const beforeAvatarUpload = (file) => {
    const isImage = file.type.startsWith('image/')
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isImage) {
        ElMessage.error('请上传图片文件')
        return false
    }
    if (!isLt2M) {
        ElMessage.error('图片大小不能超过2MB')
        return false
    }
    return true
}
const businessId = ref('')
const handleAvatarSuccess=async({file})=>{
    businessId.value = crypto.randomUUID()
    console.log(businessId.value)
    const fileres = await upLoadFileApi(file,{
        businessId:businessId.value 
    })
    imageUrl.value = fileBaseUrl+fileres.data.filePath
    formData.value.coverImage = fileres.data.filePath
    
}
const handleRemove = () => {
    imageUrl.value = ''
    formData.value.coverImage = ''
}
const handleEditorCreated = (editor) => {
    //编辑
  if (editor&&formData.value.content) {
    nextTick(()=>{
        editor.setHtml(formData.value.content)
    })
  }
}
const handleEditorChange = (data) => {
    console.log(data)
    formData.value.content = data.html
}
const btnPreview =ref(false)
const handleClose=()=>{
    formRef.value.resetFields()
    businessId.value = ''
    imageUrl.value = ''
    formData.value.coverImage = ''
    formData.value.tagsArray = []
    emits('update:modelValue', false)
}
const loading = ref(false)
const sumitData = ref({})
const handleSubmit=()=>{
    formRef.value.validate((valid)=>{
        if (valid) {
            loading.value = true
            
            sumitData.value={
                ...formData.value,
                tags:formData.value.tagsArray.join(',')
            }
           delete sumitData.value.tagsArray
           sumitData.value.id = businessId.value
        } else {
            ElMessage.error('请填写完整信息')
        }
        if (isEdit.value) {
            updateArticleApi(props.article.id,sumitData.value).then(res=>{
                console.log(res)
                loading.value = false
                ElMessage.success('更新成功')
                emits('success')
            }).catch(err=>{
                loading.value = false
            })
        } else {
            formDataSubmitApi(sumitData.value).then(res=>{
                console.log(res)
                loading.value = false
                ElMessage.success('新增成功')
                emits('success')
            }).catch(err=>{
                loading.value = false
            })
        }
        
    })
}
watch(() => props.article, (newVal) => {
    if (newVal) {
        nextTick(() => {
            Object.assign(formData.value, newVal)
            businessId.value = newVal.businessId
            imageUrl.value = fileBaseUrl + newVal.coverImage
        })
    }
})


</script>


<style lang="scss" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  border: 1px dashed var(--el-border-color);
}
.avatar {
    width: 178px;
    height: 178px;
    display: block;
}

.upload-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
</style>
