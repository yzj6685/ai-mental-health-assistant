<template>
    <div class="emotionDiary-container">
        <div class="header-section">
            <div class="header-content">
                <el-image :src="imageUrl" style="width: 60px; height: 60px;"  />
                <h1>情绪日记</h1>
            </div>
        </div>
        <div class="content">
            <div class="diary-card">
                <div class="title">今日情绪评分</div>
                <div class="section">
                    <p>您今天的整体情绪状态如何?(0-10分) </p>
                    <div class="rate">
                        <el-rate 
                        v-model="emotionDiary.moodScore" 
                        :texts="moodScoreTexts" 
                        show-text
                        :max="10" />
                    </div>
                </div>
            </div>
            <div class="diary-card">
                <div class="title">主要情绪</div>
                <div class="emotion-grid">
                    <div class="emotion-card" v-for="item in emotionOptions" :key="item.name" @click="selectEmotion(item.name)" :class="{'selected':item.name===emotionDiary.dominantEmotion}">
                        <el-image :src="item.url" style="width: 50px; height: 50px;"  />
                        <div class="emotion-name">{{item.name}}</div>
                    </div>
                </div>
            </div>
            <div class="diary-card">
                <div class="title">详细记录</div>
                <div class="detail-form">
                    <div class="form-group">
                        <div class="form-label">情绪触发因素</div>
                        <el-input v-model="emotionDiary.emotionTriggers" placeholder="今天什么事情影响了您的情绪?"type="textarea":rows="3"maxlength="100" show-word-limit />
                    </div>
                     <div class="form-group">
                        <div class="form-label">今日感想</div>
                        <el-input v-model="emotionDiary.diaryContent" placeholder="写下您今天的想法、感受或发的有趣事情..."type="textarea":rows="5"maxlength="200" show-word-limit />
                    </div>
                    <div class="life-indicators">
                        <div class="indicator-group">
                            <div class="form-label">睡眠质量</div>
                            <el-select v-model="emotionDiary.sleepQuality" placeholder="请选择睡眠质量">
                                <el-option label="很差" value="1" />
                                <el-option label="较差" value="2" />
                                <el-option label="一般" value="3" />
                                <el-option label="良好" value="4" />
                                <el-option label="优秀" value="5" />
                            </el-select>
                        </div>
                        <div class="indicator-group">
                            <div class="form-label">压力水平</div>
                            <el-select v-model="emotionDiary.stressLevel" placeholder="请选择压力水平">
                                <el-option label="很低" value="1" />
                                <el-option label="较低" value="2" />
                                <el-option label="中等" value="3" />
                                <el-option label="较高" value="4" />
                                <el-option label="很高" value="5" />
                            </el-select>
                        </div>
                    </div>
                </div>
                <div class="action-buttons">
                    <el-button @click="resetForm">重置</el-button>
                    <el-button type="primary" @click="submitForm">提交</el-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import { setEmotionAnalysisApi } from '@/api/fontend'
import { ElMessage } from 'element-plus'
import {dayjs} from 'element-plus'
const imageUrl =new URL('/src/assets/images/like.png', import.meta.url).href
const moodScoreTexts = ['绝望崩溃','非常沮丧','沮丧','一般','还行','满足','很满足','非常满足','好的飞起','笑飞了']
const emotionOptions=ref([
    {name:'开心',url:new URL('/src/assets/images/开心.png', import.meta.url).href},
    {name:'平静',url:new URL('/src/assets/images/平静.png', import.meta.url).href},
    {name:'焦虑',url:new URL('/src/assets/images/焦虑.png', import.meta.url).href},
    {name:'惊讶',url:new URL('/src/assets/images/惊讶.png', import.meta.url).href},
    {name:'悲伤',url:new URL('/src/assets/images/悲伤.png', import.meta.url).href},
    {name:'兴奋',url:new URL('/src/assets/images/兴奋.png', import.meta.url).href},
    {name:'疲惫',url:new URL('/src/assets/images/疲惫.png', import.meta.url).href},
    {name:'困惑',url:new URL('/src/assets/images/困惑.png', import.meta.url).href},
])
const emotionDiary = ref({
  diaryDate: dayjs().format('YYYY-MM-DD'),
  moodScore:null,
  dominantEmotion:'',
  emotionTriggers:'',
  diaryContent:'',
  sleepQuality:null,
  stressLevel:null
})
const selectEmotion=(name)=>{
    emotionDiary.value.dominantEmotion=name

}
const resetForm=()=>{
    Object.assign(emotionDiary.value,{
        moodScore:null,
        dominantEmotion:'',
        emotionTriggers:'',
        diaryContent:'',
        sleepQuality:null,
        stressLevel:null
    })
}
const submitForm=async()=>{
    const res=await setEmotionAnalysisApi(emotionDiary.value)
    ElMessage.success('提交成功')
    console.log(res)
    resetForm()
}
</script>
<style scoped lang="scss">
.emotionDiary-container {
    background: linear-gradient(135deg, #fafbfc 0%, #f7f9fc 50%, #f2f6fa 100%);
    .header-section {
        background: linear-gradient(135deg, #7ED321 0%, #F5A623 100%);
        color: white;
        padding: 48px;
        .header-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }
    }
    .content {
        margin: 0 auto;
        width: 980px;
        padding: 20px;
        .diary-card {
            margin-bottom: 20px;
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            .title {
                margin-bottom: 20px;
                font-size: 25px;
                font-weight: 600;
                color: #374151;
            }
            .section {
                margin-bottom: 20px;
                p {
                    font-size: 15px;
                    color: #6B7280;
                    margin-bottom: 15px;
                }
            }
            .emotion-grid {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                .emotion-card {
                    padding: 15px;
                    border: 2px solid #E5E7EB;
                    border-radius: 15px;
                    text-align: center;
                    cursor: pointer;
                    background: #F9FAFB;
                    .emotion-name {
                        margin-top: 10px;
                        padding: 0 75px;
                        color: #374151;
                    }
                    &.selected {
                        border-color: #7ED321;
                        background: #F0FDF4;
                        transform: translateY(-3px);
                    }
                }
            }
            .detail-form {
                .form-group {
                    margin-bottom: 15px;
                }
                .form-label {
                    margin: 10px 0;
                    color: #374151;
                }
                .life-indicators {
                    display: flex;
                    gap: 20px;
                    .indicator-group {
                        flex: 1;
                    }
                }
            }
            .rate {
                margin-top: 10px;
            }
            .action-buttons {
                margin-top: 40px;
                display: flex;
                gap: 12px;
                justify-content: flex-end;
            }
        }
    }
}
</style>

