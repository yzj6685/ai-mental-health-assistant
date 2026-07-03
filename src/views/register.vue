<template>
    <div class="container">
        <div class="title">
            <div class="title-text">
                <h2>创建你的账户</h2>
                <p>请填写注册信息</p>
            </div>
        </div>
        <div class="form-container">
            <el-form label-position="top" :model="formData" :rules="rules" ref="formRef" label-width="120px">
                <el-form-item label="用户名或邮箱" prop="username">
                    <el-input v-model="formData.username" placeholder="请输入用户名" size="large"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="formData.email" placeholder="请输入邮箱" size="large"></el-input>
                </el-form-item>
                <el-form-item label="昵称" prop="nickname">
                    <el-input v-model="formData.nickname" placeholder="请输入昵称" size="large"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="formData.phone" placeholder="请输入手机号" size="large"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="formData.password" placeholder="请输入密码" show-password size="large"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword">
                    <el-input type="password" v-model="formData.confirmPassword" placeholder="请再次输入密码" show-password size="large"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm" class="btn" size="large">注册</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import { registerApi } from '@/api/register'
import {useRouter} from 'vue-router'
import {ElMessage} from 'element-plus'
const router=useRouter()
const formData = ref({
    "username": "",
    "email": "",
    "nickname": "",
    "phone": "",
    "password": "",
    "confirmPassword": "",
    "gender": 1,
    "userType": 1
})
const rules = ref({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
    ],
    confirmPassword: [
        { required: true, message: '请确认密码', trigger: 'blur' }
    ]
})
const formRef = ref(null)
const submitForm =() => {
    if (!formRef.value) {
        return
    }
    else {
        formRef.value.validate().then(()=>{
            registerApi(formData.value).then(res=>{
                if(res.code==200){
                    ElMessage.success('注册成功')
                    router.push('/auth/login')
                }
                else{
                    ElMessage.error(res.msg)
                }
            })
        })
    }
}
</script>
<style lang="scss" scoped>
.container {
    width: 384px;
    .flex-box {
        display: flex;
        align-items: center;
    }
    .title {
        .title-text {
            text-align: center;
            h2 {
                font-size: 36px;
                margin-bottom: 10px;
            }
            p {
                font-size: 18px;
                color: #6b7280;
            }
        }
    }
    .form-container {
        margin-top: 30px;
        .btn {
            margin-top: 30px;
            width: 100%;
        }
        .footer {
            padding: 30px;
            text-align: center;
        }
    }
}
</style>
