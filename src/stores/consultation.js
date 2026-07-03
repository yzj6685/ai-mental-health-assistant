import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConsultationStore = defineStore('consultation', () => {
    // 当前会话
    const currentChat = ref(null)
    
    // 输入框内容
    const inputMessage = ref('')
    
    // 是否正在发送
    const isSending = ref(false)
    
    // 聊天消息列表
    const chatMessages = ref([])
    
    // 会话历史列表
    const sessionList = ref([])
    
    // 当前情绪分析
    const currentEmotion = ref({
        primaryEmotion: '中性',
        emotionScore: 50,
        isNegative: false,
        riskLevel: 0,
        suggestion: '情绪状态平稳',
        improvementSuggestions: [],
        riskDescription: '',
    })

    return {
        currentChat,
        inputMessage,
        isSending,
        chatMessages,
        sessionList,
        currentEmotion
    }
})
