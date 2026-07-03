<template>
  <div>
    <PageHead title="情绪日志" />
    <TableSearch :formItem="formItem" @search="handleSearch" />
    <el-table :data="tableData" style="width: 100%" margin-top="20px">
      <el-table-column prop="userId" label="用户ID" width="100px">
        <template #default="scope">
          <el-avatar>{{ scope.row.userId }}</el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="updatedAt" label="记录日期" width="200px" />
      <el-table-column label="情绪评分">
        <template #default="scope">
          <el-rate :model-value="scope.row.moodScore" disabled :max="10" />
        </template>
      </el-table-column>
      <el-table-column label="生活指标" width="200px">
        <template #default="scope">
          <p>
            睡眠:{{ scope.row.sleepQuality }}/5
          </p>
        </template>
      </el-table-column>
      <el-table-column prop="emotionTriggers" label="日记内容" width="100px" />
      <el-table-column label="操作" width="200px">
        <template #default="scope">
          <el-button type="primary" size="mini" @click="handleDetail(scope.row)">详情</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="情绪日记详情" v-model="dialogVisible" width="800px" :close-on-click-modal="false">
      <div v-if="dialogData" class="detail-content">
        <div class="dialog-section">
          <h4>用户信息</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="用户名">
              {{ dialogData.username }}
            </el-descriptions-item>
            <el-descriptions-item label="昵称">
              {{ dialogData.username }}
            </el-descriptions-item><el-descriptions-item label="用户ID">
              {{ dialogData.userId }}
            </el-descriptions-item><el-descriptions-item label="记录日期">
              {{ dialogData.updatedAt }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="dialog-section">
          <h4>情绪状态</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="情绪评分">
              <el-rate :model-value="dialogData.moodScore" disabled :max="10" />
            </el-descriptions-item>
            <el-descriptions-item label="主要情绪">
              <el-tag :type="getEmotionTagType(dialogData.dominantEmotion)">{{ dialogData.dominantEmotion }}</el-tag>
            </el-descriptions-item><el-descriptions-item label="睡眠质量">
              {{ dialogData.sleepQuality }} /5
            </el-descriptions-item><el-descriptions-item label="压力水平">
              {{ dialogData.stressLevel }} /5
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="dialog-section">
          <h4>日记内容</h4>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="情绪触发因素">
              {{ dialogData.emotionTriggers }}
            </el-descriptions-item>
            <el-descriptions-item label="主要情绪">
              {{ dialogData.diaryContent }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="dialog-section">
          <h4>AI情绪分析结果</h4>
          <div class="ai-analysis-result">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="主要情绪">
                <el-tag :type="getAiEmotionTagType(dialogEmotion.primaryEmotion)">{{ dialogEmotion.primaryEmotion
                  }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="情绪强度">
                <el-progress :percentage="dialogEmotion.emotionScore" stroke-width="8" />
              </el-descriptions-item><el-descriptions-item label="风险等级">
                <el-tag :type="getRiskLevelTagType(dialogEmotion.riskLevel)">{{
                  getRiskLevelText(dialogEmotion.riskLevel)
                  }}</el-tag>
              </el-descriptions-item><el-descriptions-item label="情绪性质">
                <el-tag :type="dialogEmotion.isNegative ? 'danger' : 'success'">{{ dialogEmotion.isNegative ? '负面情绪' :
                  '正面情绪' }}</el-tag>
              </el-descriptions-item>
            </el-descriptions>
          </div>
          <div class="ai-suggestion-section">
            <h5>专业建议</h5>
            <div class="suggestion-content">{{ dialogEmotion.suggestion || '暂无建议' }}</div>
          </div>
          <div class="ai-risk-section">
            <h5>风险描述</h5>
            <div class="risk-content">{{ dialogEmotion.riskDescription || '暂无风险描述' }}</div>
          </div>
          <div class="ai-improvements-section">
            <h5>改善建议</h5>
            <ul class="improvements-list" v-if="dialogEmotion.improvementSuggestions.length > 0">
              <li v-for="item in dialogEmotion.improvementSuggestions" :key="item">{{ item }}</li>
            </ul>
            <div v-else>暂无改善建议</div>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import PageHead from '@/components/PageHead.vue'
import TableSearch from '@/components/TableSearch.vue'
import { getEmotionListApi, deleteEmotionListApi } from '@/api/emotion'
import { ref, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
const getEmotionTagType = (emotion) => {
  const emotionTypes = {
    '快乐': 'success',
    '平静': 'info',
    '兴奋': 'warning',
    '愤怒': 'danger',
    '悲伤': 'info',
    '焦虑': 'warning'
  }
  return emotionTypes[emotion] || 'info'
}

const getAiEmotionTagType = (emotion) => {
  const emotionTagMap = {
    '快乐': 'success',
    '平静': 'success',
    '兴奋': 'warning',
    '满足': 'success',
    '愤怒': 'danger',
    '悲伤': 'info',
    '焦虑': 'warning',
    '恐惧': 'danger',
    '沮丧': 'info',
    '压力': 'warning'
  }
  return emotionTagMap[emotion] || 'info'
}

const getEmotionScoreColor = (score) => {
  if (score >= 80) return '#f56c6c'
  if (score >= 60) return '#e6a23c'
  if (score >= 40) return '#909399'
  return '#67c23a'
}

const getRiskLevelTagType = (riskLevel) => {
  const riskTagMap = {
    0: 'success',
    1: 'info',
    2: 'warning',
    3: 'danger'
  }
  return riskTagMap[riskLevel] || 'info'
}

const getRiskLevelText = (riskLevel) => {
  const riskTextMap = {
    0: '正常',
    1: '关注',
    2: '预警',
    3: '危机'
  }
  return riskTextMap[riskLevel] || '未知风险等级'
}
const formItem = ref([
  {
    comp: 'input',
    label: '用户ID',
    prop: 'userId',
    placeholder: '请输入用户ID'
  },
  {
    comp: 'select',
    label: '情绪评分',
    prop: 'MoodScore',
    placeholder: '选择情绪评分',
    options: [
      {
        label: '低1-3',
        value: '1-3'
      },
      {
        label: '中4-6',
        value: '4-6'
      },
      {
        label: '高7-10',
        value: '7-10'
      }

    ]
  },
])
const tableData = ref([])  // 新增：定义响应式的 tableData
const pagination = ref({
  size: 10,
  currentPage: 1,
  total: 0
})

const handleSearch = async (formData) => {
  const params = {
    ...pagination.value,
    ...formData
  }
  const res = await getEmotionListApi(params)
  console.log(res.data)
  tableData.value = res.data.records
  pagination.value.total = res.data.total
}
onMounted(() => {
  handleSearch()
})
const dialogVisible = ref(false)
const dialogData = ref(null)
const dialogEmotion = ref(null)
const handleDetail = (row) => {
  dialogVisible.value = true
  dialogData.value = row
  dialogEmotion.value = JSON.parse(row.aiEmotionAnalysis)
}
const handleDelete=(row)=>{
  ElMessageBox.confirm('确认删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'danger'
  }).then(() => {
    deleteEmotionListApi(row.id).then(res=>{
      handleSearch()
    })
  })
}
</script>

<style lang="scss" scoped>
.detail-content {
  .dialog-section {
    margin-bottom: 24px;
    
    h4 {
      margin: 0 0 16px 0;
      color: #303133;
      font-size: 16px;
      
      i {
        margin-right: 8px;
        color: #409eff;
      }
    }
  }
}

// AI分析相关样式
.ai-analysis-status {
  .ai-status-tag {
    margin-bottom: 4px;
    
    i {
      margin-right: 4px;
    }
  }
  
  .ai-analysis-preview {
    font-size: 11px;
    color: #909399;
    margin-top: 2px;
  }
}

.ai-analysis-result {
  .ai-keywords-section {
    margin-top: 16px;
    padding: 12px;
    background-color: #f8f9fa;
    border-radius: 4px;
    
    h5 {
      margin: 0 0 8px 0;
      color: #606266;
      font-size: 14px;
      font-weight: 600;
      
      i {
        margin-right: 6px;
        color: #909399;
      }
    }
  }
  
  .keywords-container {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    
    .keyword-tag {
      background-color: #e1f3d8;
      color: #67c23a;
      border-color: #b3d8a4;
    }
  }
  
  .suggestion-content,
  .risk-content {
    line-height: 1.6;
    color: #606266;
    background-color: white;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ebeef5;
  }
  
  .improvement-list {
    margin: 0;
    padding-left: 20px;
    
    li {
      margin-bottom: 4px;
      color: #606266;
      line-height: 1.5;
    }
  }
  
  .ai-analysis-meta {
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid #ebeef5;
    
    .analysis-time {
      margin: 0;
      font-size: 12px;
      color: #909399;
      
      i {
        margin-right: 4px;
      }
    }
  }
  
  .el-progress {
    .el-progress__text {
      font-size: 12px !important;
    }
  }
}

.ai-suggestion-section,
.ai-risk-section,
.ai-improvements-section {
  margin-top: 16px;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 4px;
  
  h5 {
    margin: 0 0 8px 0;
    color: #606266;
    font-size: 14px;
    font-weight: 600;
    
    i {
      margin-right: 6px;
      color: #909399;
    }
  }
}

.improvements-list {
  margin: 0;
  padding-left: 20px;
  
  li {
    margin-bottom: 4px;
    color: #606266;
    line-height: 1.5;
  }
}
</style>