<template>
    <div class="consultation-container">
        <div class="sidebar">
            <div class="ai-assistant-info">
                <div class="breathing-circle">
                    <el-image :src="imageUrl" style="width: 25px; height: 25px;" alt="AI助手" />
                </div>
                <div class="assistant-name">宁静AI心理健康助手</div>
                <div class="online-status">
                    <div class="status-dot"></div>
                    在线服务中
                </div>
            </div>
            <div class="emotion-garden">
                <div class="garden-header">
                    <div class="garden-title">情感花园</div>
                </div>
                <div class="emotion-info">
                    <div class="emotion-name">{{ currentEmotion.primaryEmotion }}</div>
                    <div class="emotion-score">{{ currentEmotion.emotionScore }}</div>
                </div>
                <div class="warm-tips">
                    <div class="emotion-status-text">
                        <div class="status-label">今天感觉:</div>
                        <div class="status-emotion">{{ currentEmotion.isNegative ? '需要处理' : '很不错' }}</div>
                        <div class="emotion-intensity">
                            <span class="intensity-dots">
                                <span v-for="dot in 3" :key="dot" class="dot"
                                    :class="{ 'active': getIntensityClass(currentEmotion.emotionScore) >= dot }"></span>
                            </span>
                            <span class="intensity-text">{{ getIntensityLevel(currentEmotion.riskLevel) }}</span>
                        </div>
                        <div class="warm-suggestion" v-if="currentEmotion.suggestion">
                            <div class="suggestion-icon">💝</div>
                            <div class="suggestion-content">
                                <div class="suggestion-title">给你的小建议</div>
                                <div class="suggestion-text">{{ currentEmotion.suggestion }}</div>
                            </div>
                        </div>
                        <div class="healing-actions" v-if="currentEmotion.improvementSuggestions&&currentEmotion.improvementSuggestions.length > 0">
                            <div class="actions-title">治愈小行动</div>
                            <div class="actions-list">
                                <div class="action-item" v-for="item in currentEmotion.improvementSuggestions" :key="item">
                                    <div class="action-icon">✨</div>
                                    <div class="action-text">{{ item }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="risk-notice" v-if="currentEmotion.isNegative&&currentEmotion.riskLevel>1">
                            <div class="notice-icon">🤗</div>
                            <div class="notice-content">
                                <div class="notice-title">温馨提示</div>
                                <div class="notice-text">{{ currentEmotion.riskDescription }}</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div class="session-history">
                <div class="section-title">会话历史</div>
                <div class="session-list">
                    <div class="session-item" v-for="item in sessionList" :key="item.id" @click="handleClick(item)">
                        <div class="session-info">
                            <div class="session-title">
                                <span>{{ item.sessionTitle }}</span>
                            </div>
                            <div class="session-meta">
                                <span>{{ item.startedAt }}</span>
                            </div>
                            <div class="session-preview">
                                <span>{{ item.lastMessageContent }}</span>
                            </div>
                            <div class="session-stats">
                                <span>
                                    <el-icon>
                                        <ChatRound />
                                    </el-icon>
                                    {{ item.messageCount || 0 }}
                                </span>
                                <span>
                                    <el-icon>
                                        <Clock />
                                    </el-icon>
                                    {{ item.durationMinutes || 0 }}分钟
                                </span>
                            </div>
                        </div>
                        <div class="session-actions">
                            <el-button text type="danger" size="mini" @click.stop="handleDelete(item.id)"><el-icon>
                                    <Delete />
                                </el-icon></el-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="chat-main">
            <div class="chat-header">
                <div class="header-left">
                    <div class="chat-avatar">
                        <el-image :src="imageUrl1" style="width: 30px; height: 30px;" />
                    </div>
                    <div class="chat-info">
                        <h2>宁静AI心理健康助手</h2>
                        <p>您的贴心助手，随时为您服务</p>
                    </div>
                </div>
                <el-button circle @click="TocreateNewChat" title="创建新对话">
                    <el-icon>
                        <Plus />
                    </el-icon>
                </el-button>
            </div>
            <div class="chat-messages">
                <div class="message-item ai-message" v-if="chatMessages.length === 0">
                    <div class="message-avatar">
                        <el-image :src="imageUrl" style="width: 18px; height: 18px;" />
                    </div>
                    <div class="message-content">
                        <div class="message-bubble">
                            您好我是小暖您的AI心理健康助手。很高兴陪伴您为您提供温暖的心理支持。请告诉我今天您感觉怎么样？
                        </div>
                        <div class="message-time">
                            刚刚
                        </div>
                    </div>
                </div>
                <div class="message-item" v-for="item in chatMessages" :key="item.id"
                    :class="item.senderType === 1 ? 'user-message' : 'ai-message'">
                    <div class="message-avatar">
                        <el-image v-if="item.senderType === 1" :src="imageUrl2" style="width: 18px; height: 18px;" />
                        <el-image v-else :src="imageUrl" style="width: 18px; height: 18px;" />
                    </div>
                    <div class="message-content">
                        <div class="message-bubble">
                            <div class="typing-indicator" v-if="item.senderType === 2 && isSending && !item.content">
                                <div class="typing-dot"></div>
                                <div class="typing-dot"></div>
                                <div class="typing-dot"></div>
                            </div>
                            <div class="err-message" v-else-if="item.isError">
                                {{ item.content }}
                            </div>
                            <MarkdownRenderer v-else-if="item.senderType === 2 && !item.isError" :content="item.content"
                                :isAiMessage="true" />
                            <p v-else-if="item.content" v-html="formatMarkdowm(item.content)"></p>
                        </div>
                        <div class="message-time">
                            {{ item.senderType === 2 && isSending ? '输入中...' : item.createdAt }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="chat-input">
                <div class="input-container">
                    <el-input v-model="inputMessage" placeholder="请分享你今天发生的一些事情" type="textarea" :rows="3"
                        @keydown.enter="sendMessage" :disabled="isSending" clearable />
                    <div class="input-footer">
                        <p>
                            按Enter发送，Shift+Enter换行输入
                        </p>
                        <p>{{ inputMessage.length }}/500</p>
                    </div>
                </div>
                <el-button v-if="!isSending" :disabled="!inputMessage.trim() || inputMessage.length > 500" type="primary"
                    @click="sendMessage" class="send-btn">发送</el-button>
                <el-button v-else type="danger" @click="stopResponse" class="send-btn">
                    <el-icon><VideoPause /></el-icon>暂停
                </el-button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useConsultationStore } from '@/stores'

let abortControllerRef = null
let retryTimer = null
let isPageActive = false
let retryCount = 0
const MAX_RETRY = 3
const RETRY_DELAY = 1000
const imageUrl = new URL('@/assets/images/robot-fill.png', import.meta.url).href
const imageUrl1 = new URL('@/assets/images/like.png', import.meta.url).href
const imageUrl2 = new URL('@/assets/images/users.png', import.meta.url).href

import { Plus, ChatRound, Clock, Delete, VideoPause } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { startSessionApi } from '@/api/startSession'
import { getSessionDetailApi } from '@/api/consulation'
import { deleteSessionListApi, getChatMessagesApi, getEmotionAnalysisApi } from '@/api/fontend'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'
import { fetchEventSource } from '@microsoft/fetch-event-source'

const consultationStore = useConsultationStore()
const { currentChat, inputMessage, isSending, chatMessages, sessionList, currentEmotion } = storeToRefs(consultationStore)
const TocreateNewChat = () => {
    chatMessages.value = []
    createNewChat()
}
const createNewChat = () => {
    const newChat = {
        sessionid: `temp_${Date.now()}`,
        status: 'TEMP',
        sessionTitle: '新对话'
    }
    currentChat.value = newChat
}
const formatMarkdowm = (content) => {
    return content.replace(/\n/g, '<br>')
}
onMounted(() => {
    isPageActive = true
    createNewChat()
    getSessionList()
})
// 情感花园 - 状态已迁移到 consultation store
const getIntensityLevel = (level) => {
    if (level === 3) {
        return '高度风险'
    }
    else if (level === 2) {
        return '中风险'
    }
    else if (level === 1) {
        return '低风险'
    }
    else {
        return '正常'
    }
}
const getIntensityClass = (score) => {
    if (score >= 61) {
        return 3
    }
    else if (score >= 41) {
        return 2
    }
    else {
        return 1
    }
}
const getEmotionAnalysis = async (sessionId) => {
    const id=sessionId.toString().startsWith('session_')?sessionId:'session_'+sessionId
    const res = await getEmotionAnalysisApi(id)
    currentEmotion.value = res.data
}
// 状态已从 consultation store 解构获取
const handleClick = async (item) => {
    console.log(item)
    const res = await getChatMessagesApi(item.id)
    chatMessages.value = res.data
    getEmotionAnalysis(item.id)
    console.log(chatMessages.value)
    const SessionData = {
        sessionId: 'session_' + item.id,
        status: 'ACTIVE',
        sessionTitle: item.sessionTitle,
    }
    currentChat.value = SessionData
}
const handleDelete = async (sessionId) => {
    await deleteSessionListApi(sessionId)
    getSessionList()
}
const getSessionList = async () => {
    const params = {
        pageNum: '1',
        pageSize: '10'
    }
    const res = await getSessionDetailApi(params)
    sessionList.value = res.data.records
    console.log(sessionList.value)
}
const sendMessage = () => {
    if (!inputMessage.value.trim()) {
        return
    }
    if (isSending.value) {
        ElMessage.warning('请等待当前回复完成或点击暂停')
        return
    }
    const message = inputMessage.value
    inputMessage.value = ''
    if (currentChat.value && currentChat.value.status === 'TEMP') {
        startSession(message)
    } else {
        chatMessages.value.push({
            id: new Date(),
            senderType: 1,
            content: message,
            createdAt: new Date().toISOString()
        })
        startAIResponse(currentChat.value.sessionId, message)
    }
}
const startSession = async (message) => {
    const SessionParams = {
        initialMessage: message
    }
    if (currentChat.value.sessionTitle === '新对话') {
        SessionParams.sessionTitle = `宁静AI心理健康助手-${new Date().toLocaleString()}`
    }
    else {
        SessionParams.sessionTitle = currentChat.value.sessionTitle
    }
    const res = await startSessionApi(SessionParams)
    const sessionData = {
        sessionId: res.data.sessionId,
        status: res.data.status,
        sessionTitle: SessionParams.sessionTitle
    }
    if (currentChat.value.status === 'TEMP') {
        Object.assign(currentChat.value, sessionData)
    }
    else {
        currentChat.value = sessionData
    }
    chatMessages.value.push({
        id: new Date(),
        senderType: 1,
        content: message,
        createdAt: new Date().toISOString()
    })
    startAIResponse(currentChat.value.sessionId, message)
    getSessionList()
}

const startAIResponse = async (sessionId, userMessage) => {
    if (!isPageActive) {
        return
    }
    if (isSending.value && retryCount === 0) {
        return
    }
    isSending.value = true
    
    // 首次请求创建消息，重连时不创建新消息
    if (retryCount === 0) {
        const aiMessage = {
            id: 'session_' + new Date(),
            senderType: 2,
            content: '',
            createdAt: new Date().toISOString()
        }
        chatMessages.value.push(aiMessage)
    }
    
    const ctrl = new AbortController()
    abortControllerRef = ctrl
    fetchEventSource('/api/psychological-chat/stream', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': localStorage.getItem('token'),
            'Accept': 'text/event-stream',
        },
        body: JSON.stringify({
            sessionId,
            userMessage
        }),
        signal: ctrl.signal,
        onopen: (response) => {
            if (!isPageActive) {
                ctrl.abort()
                return
            }
            // 连接成功，重置重试计数
            retryCount = 0
            if (response.headers.get('content-type') !== 'text/event-stream') {
                ElMessage.error('服务器返回非事件/event-stream格式')
            }
        },
        onmessage: (event) => {
            if (!isPageActive) {
                ctrl.abort()
                return
            }
            const row = event.data
            console.log(event)
            if (!row) {
                return
            }
            const eventName = event.event
            const aiMessage = chatMessages.value[chatMessages.value.length - 1]
            if (eventName === 'done') {
                isSending.value = false
                retryCount = 0
                getEmotionAnalysis(currentChat.value.sessionId)
                ctrl.abort()
                return
            }
            const payload = JSON.parse(row)
            const ok = String(payload.code) === '200'
            if (ok && payload.data && payload.data.content) {
                aiMessage.content += payload.data.content
            } else if (!ok) {
                handleError(payload.message || 'AI助手返回错误')
            }
        },
        onerror: (error) => {
            if (!isPageActive || ctrl.signal.aborted) {
                return
            }
            // 网络错误时尝试重连
            if (retryCount < MAX_RETRY) {
                retryCount++
                const aiMessage = chatMessages.value[chatMessages.value.length - 1]
                if (aiMessage) {
                    aiMessage.content += `\n\n[网络断开，${RETRY_DELAY / 1000}秒后第${retryCount}次重连...]`
                }
                retryTimer = setTimeout(() => {
                    retryTimer = null
                    startAIResponse(sessionId, userMessage)
                }, RETRY_DELAY * retryCount) // 指数退避
                return
            }
            // 超过重试次数，显示失败
            retryCount = 0
            handleError('网络连接失败，请检查网络后重试')
        },
        onclose: () => {
            abortControllerRef = null
        }
    }).catch((error) => {
        if (isPageActive && !ctrl.signal.aborted) {
            handleError(error?.message || 'AI助手连接异常')
        }
    })


}
const handleError = (message, isRetry = false) => {
    const aiMessage = chatMessages.value[chatMessages.value.length - 1]
    if (aiMessage && !isRetry) {
        aiMessage.content = 'AI回复失败'
    }
    ElMessage.error(message)
    isSending.value = false
    retryCount = 0
}

const stopResponse = () => {
    if (abortControllerRef) {
        abortControllerRef.abort()
        abortControllerRef = null
    }
    isSending.value = false
    const aiMessage = chatMessages.value[chatMessages.value.length - 1]
    if (aiMessage && aiMessage.senderType === 2) {
        aiMessage.content += '\n\n[用户已暂停]'
    }
}

const cleanupConsultationRuntime = () => {
    isPageActive = false
    if (retryTimer) {
        clearTimeout(retryTimer)
        retryTimer = null
    }
    if (abortControllerRef) {
        abortControllerRef.abort()
        abortControllerRef = null
    }
    isSending.value = false
    retryCount = 0
}

onBeforeRouteLeave((to, from, next) => {
    cleanupConsultationRuntime()
    next()
})

onUnmounted(() => {
    cleanupConsultationRuntime()
})


</script>
<style scoped lang="scss">
.consultation-container {
    margin: 0 auto;
    width: 1200px;
    display: flex;
    gap: 20px;
    padding: 20px;

    .sidebar {
        width: 320px;

        .ai-assistant-info {
            margin-bottom: 20px;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 252, 248, 0.95) 100%);
            border-radius: 16px;
            padding: 16px;
            box-shadow: 0 8px 32px rgba(251, 146, 60, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04);
            border: 1px solid rgba(251, 146, 60, 0.08);
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;

            .breathing-circle {
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #fb923c 0%, #f59e0b 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 12px;
                animation: breathing 4s ease-in-out infinite;
                box-shadow: 0 6px 24px rgba(251, 146, 60, 0.25);
                position: relative;
            }

            .assistant-name {
                font-size: 16px;
                font-weight: 700;
                background: linear-gradient(135deg, #fb923c, #f59e0b);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                text-align: center;
                background-clip: text;
                margin: 0 0 12px;
            }

            .online-status {
                display: flex;
                align-items: center;
                justify-content: center;
                color: #059669;
                font-size: 12px;
                font-weight: 600;

                .status-dot {
                    width: 8px;
                    height: 8px;
                    background: #059669;
                    border-radius: 50%;
                    margin-right: 8px;
                    animation: pulse 2s infinite;
                    box-shadow: 0 0 8px rgba(5, 150, 105, 0.4);
                }
            }
        }

        .session-history {
            background: white;
            border-radius: 16px;
            padding: 16px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
            margin-bottom: 20px;
            min-height: 250px;
            display: flex;
            flex-direction: column;

            .section-title {
                font-size: 16px;
                font-weight: 600;
                color: #333;
                margin: 0 0 16px;
                display: flex;
                align-items: center;
                justify-content: space-between;

            }

            .session-list {
                overflow-y: auto;
                max-height: 200px;
                scrollbar-width: thin;
                scrollbar-color: rgba(64, 150, 255, 0.3) transparent;

                .session-item {
                    position: relative;
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    padding: 12px;
                    margin-bottom: 8px;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border: 2px solid transparent;

                    &:hover {
                        background: #f8f9ff;
                        border-color: #e6f0ff;
                    }

                    &.active {
                        background: #e6f0ff;
                        border-color: #4096ff;
                    }

                    .session-info {
                        flex: 1;

                        .session-title {
                            font-weight: 500;
                            font-size: 14px;
                            color: #333;
                            margin-bottom: 4px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }

                        .session-meta {
                            display: flex;
                            align-items: center;
                            gap: 8px;
                            margin-bottom: 6px;
                            font-size: 12px;
                            color: #999;
                        }

                        .session-preview {
                            width: 200px;
                            font-size: 12px;
                            color: #666;
                            margin-bottom: 6px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }

                        .session-stats {
                            display: flex;
                            align-items: center;
                            gap: 12px;

                            span {
                                font-size: 12px;
                                color: #999;
                                display: flex;
                                align-items: center;
                                gap: 4px;
                            }
                        }

                        .session-actions {
                            position: absolute;
                            top: 10px;
                            right: 12px;
                        }
                    }
                }

                .no-sessions-text {
                    text-align: center;
                    font-size: 14px;
                    color: #999;
                }
            }
        }

        .emotion-garden {
            background: linear-gradient(135deg, #fef9e7 0%, #fcf4e6 50%, #f6f0e8 100%);
            border-radius: 20px;
            padding: 16px;
            margin-bottom: 20px;
            box-shadow: 0 8px 32px rgba(252, 244, 230, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.2);
            position: relative;
            overflow: hidden;
            min-height: 300px;

            .garden-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 20px;
                position: relative;
                z-index: 2;

                .garden-title {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    color: #8b4513;
                }
            }

            .emotion-info {
                margin: 0 auto;
                width: 80px;
                height: 80px;
                border-radius: 50%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 10;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
                border: 2px solid rgba(255, 255, 255, 0.8);
                background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
                color: #fff;

                .emotion-name {
                    font-size: 15px;
                    font-weight: 600;
                    line-height: 1;
                    margin-bottom: 2px;
                }

                .emotion-score {
                    font-size: 14px;
                    font-weight: 700;
                    opacity: 0.9;
                }
            }

            .warm-tips {
                text-align: center;
                margin-bottom: 16px;

                .emotion-status-text {
                    margin-bottom: 12px;

                    .status-label {
                        font-size: 14px;
                        color: #8b7355;
                        margin-right: 8px;
                    }

                    .status-emotion {
                        font-size: 16px;
                        font-weight: 600;
                        padding: 4px 12px;
                        border-radius: 16px;
                        display: inline-block;
                    }
                }

                .emotion-intensity {
                    margin-bottom: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;

                    .intensity-dots {
                        display: flex;
                        gap: 4px;

                        .dot {
                            width: 8px;
                            height: 8px;
                            border-radius: 50%;
                            background: #e0e0e0;
                            transition: all 0.3s ease;

                            &.active {
                                background: linear-gradient(135deg, #ff9a9e, #fecfef);
                                transform: scale(1.2);
                                box-shadow: 0 2px 8px rgba(255, 154, 158, 0.4);
                            }
                        }
                    }

                    .intensity-text {
                        font-size: 12px;
                        color: #8b7355;
                        font-weight: 500;
                    }
                }

                .warm-suggestion {
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.8));
                    border-radius: 16px;
                    padding: 12px;
                    margin-bottom: 16px;
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    border: 1px solid rgba(255, 255, 255, 0.6);
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);

                    .suggestion-icon {
                        font-size: 20px;
                        flex-shrink: 0;
                        margin-top: 2px;
                    }

                    .suggestion-content {
                        text-align: left;
                        flex: 1;

                        .suggestion-title {
                            font-size: 14px;
                            font-weight: 600;
                            color: #8b7355;
                            margin-bottom: 6px;
                        }

                        .suggestion-text {
                            font-size: 13px;
                            color: #6b5b47;
                            line-height: 1.5;
                        }
                    }
                }

                .healing-actions {
                    margin-bottom: 16px;

                    .actions-title {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                        font-size: 14px;
                        font-weight: 600;
                        color: #8b7355;
                        margin-bottom: 16px;
                    }

                    .actions-list {
                        display: flex;
                        flex-direction: column;
                        gap: 10px;

                        .action-item {
                            background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
                            border-radius: 12px;
                            padding: 12px;
                            display: flex;
                            align-items: center;
                            gap: 10px;
                            border: 1px solid rgba(255, 255, 255, 0.5);
                            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
                            text-align: left;

                            .action-icon {
                                font-size: 14px;
                                color: #ffd700;
                                flex-shrink: 0;
                            }

                            .action-text {
                                font-size: 12px;
                                color: #6b5b47;
                                line-height: 1.4;
                                flex: 1;
                            }
                        }
                    }
                }

                .risk-notice {
                    background: linear-gradient(135deg, #fff9e6, #ffeaa7);
                    border-radius: 16px;
                    padding: 16px;
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    border: 1px solid rgba(255, 234, 167, 0.6);
                    box-shadow: 0 6px 20px rgba(255, 234, 167, 0.3);

                    .notice-icon {
                        font-size: 20px;
                        flex-shrink: 0;
                        margin-top: 2px;
                    }

                    .notice-content {
                        flex: 1;

                        .notice-title {
                            font-size: 14px;
                            font-weight: 600;
                            color: #d4840f;
                            margin-bottom: 6px;
                        }

                        .notice-text {
                            font-size: 13px;
                            color: #b8740c;
                            line-height: 1.5;
                        }
                    }
                }
            }
        }
    }

    .chat-main {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 252, 250, 0.98) 100%);
        border-radius: 20px;
        box-shadow: 0 12px 40px rgba(251, 146, 60, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04);
        border: 1px solid rgba(251, 146, 60, 0.1);
        backdrop-filter: blur(10px);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        flex: 1;

        .chat-header {
            background: linear-gradient(135deg, #fb923c 0%, #f59e0b 100%);
            color: white;
            padding: 20px 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;
            flex-shrink: 0;

            .header-left {
                display: flex;
                align-items: center;

                .chat-avatar {
                    width: 48px;
                    height: 48px;
                    background: rgba(255, 255, 255, 0.25);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 16px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    position: relative;
                    z-index: 1;
                }

                .chat-info {
                    h2 {
                        font-size: 20px;
                        font-weight: 700;
                        margin-bottom: 4px;
                    }

                    p {
                        font-size: 14px;
                    }
                }
            }
        }

        .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 24px;
            display: flex;
            flex-direction: column;
            gap: 16px;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 252, 248, 0.05) 100%);
            min-height: 0;
            max-height: calc(100vh - 200px);
            scrollbar-width: thin;
            scrollbar-color: rgba(251, 146, 60, 0.3) transparent;

            .message-item {
                display: flex;
                align-items: flex-start;
                gap: 12px;

                .message-avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    color: white;
                    flex-shrink: 0;
                }

                &.ai-message {
                    .message-avatar {
                        background: linear-gradient(135deg, #fb923c, #f59e0b);
                        box-shadow: 0 4px 12px rgba(251, 146, 60, 0.3);
                    }
                }

                &.user-message {
                    .message-avatar {
                        background: linear-gradient(135deg, #6b7280, #4b5563);
                        box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
                    }
                }

                .message-content {
                    max-width: 70%;

                    .message-bubble {
                        background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 252, 248, 0.95) 100%);
                        border-radius: 16px;
                        padding: 12px 16px;
                        position: relative;
                        animation: fadeInUp 0.4s ease-out;
                        border: 1px solid rgba(251, 146, 60, 0.1);
                        box-shadow: 0 4px 16px rgba(251, 146, 60, 0.05);

                        .typing-indicator {
                            display: flex;
                            gap: 4px;
                            padding: 8px 0;

                            .typing-dot {
                                width: 8px;
                                height: 8px;
                                background: #ccc;
                                border-radius: 50%;
                                animation: typing 1.5s ease-in-out infinite;

                                &:nth-child(2) {
                                    animation-delay: 0.2s;
                                }

                                &:nth-child(3) {
                                    animation-delay: 0.4s;
                                }
                            }
                        }

                        /* 错误消息样式 */
                        .error-message {
                            background: linear-gradient(135deg, #FEF2F2 0%, #FECACA 100%);
                            border: 1px solid #F87171;
                            border-radius: 12px;
                            padding: 12px 16px;
                            color: #991B1B;
                            font-weight: 500;
                            display: flex;
                            align-items: center;
                            gap: 8px;
                        }
                    }

                    .message-time {
                        font-size: 12px;
                        color: #999;
                        margin-top: 4px;
                    }
                }
            }
        }

        .chat-input {
            border-top: 1px solid rgba(251, 146, 60, 0.1);
            padding: 20px 24px;
            display: flex;
            gap: 12px;
            align-items: flex-end;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 252, 248, 0.7) 100%);
            backdrop-filter: blur(10px);
            flex-shrink: 0;

            .input-container {
                flex: 1;
            }

            .input-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 12px;
                color: #78716c;
                font-weight: 500;
            }

            .send-btn {
                height: 60px;
                width: 60px;
                border-radius: 16px;
                background: linear-gradient(135deg, #fb923c 0%, #f59e0b 100%) !important;
                border: none !important;
                box-shadow: 0 6px 20px rgba(251, 146, 60, 0.25);
                transition: all 0.3s ease;
            }

        }

    }
}
</style>
