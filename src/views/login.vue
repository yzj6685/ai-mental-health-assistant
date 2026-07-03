<template>
    <div class="container">
        <div class="title">
            <div class="back-home" role="button" tabindex="0" @click="goHome" @keydown.enter="goHome">
                <el-icon><Back /></el-icon>
                <span>返回首页</span>
            </div>
            <div class="title-text">
                <h2>登录</h2>
                <p>请输入您的账号和密码</p>
            </div>
        </div>
        <div class="form-container">
            <el-form 
            ref="formRef"
            :model="formDate"
            :rules="rules"
            label-position="top"
            >
            <el-form-item label="账号" prop="username">
                <el-input v-model="formDate.username" placeholder="请输入账号" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="formDate.password" placeholder="请输入密码" type="password" show-password />
            </el-form-item>
            <el-form-item>
                <el-button  class="login-btn" type="primary" @click="submitForm">登录</el-button>
            </el-form-item>
            </el-form>
        </div>
        <div class="footer">
            <p>没有账号？<router-link to="/auth/register">点击注册</router-link></p>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import { LoginApi } from '@/api/admin'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const formRef = ref()
const formDate = ref({
    username: '',
    password: ''
})
const goHome = () => {
    router.push('/')
}
const rules = ref({
    username: [
        { required: true, message: '请输入账号', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
    ]
})
const submitForm = () => {
    formRef.value.validate(async(valid) => {
        if (valid) {
            const res = await LoginApi(formDate.value)
            ElMessage.success('登录成功')
            console.log(res)
            userStore.setToken(res.data.token)
            userStore.setUserInfo(res.data.userInfo)
            if(Number(res.data.userInfo.userType)===2){
                router.push('/back/dashboard')
            }
            else{
                router.push(route.query.redirect || '/')
            }
        } else {
            console.log('登录失败')
        }
    })
}
</script>
<style lang="scss" scoped>
.container{
    width: 384px;
    .title{
        .back-home{
            margin-bottom: 60px;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            cursor: pointer;
            user-select: none;
            color: #111827;
            &:hover {
                color: #409eff;
            }
        }
        .title-text{
            text-align: center;
            h2{
                font-size: 30px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            p{
                font-size: 20px;
                color: #666;
                margin-bottom: 20px;
            }
        }
    }
    .form-container{
        .login-btn{
            margin-top: 10px;
            width: 100%;
        }
    }
    .footer{
        text-align: center;
        p{
            font-size: 16px;
            color: #666;
        }
    }
}
</style>
