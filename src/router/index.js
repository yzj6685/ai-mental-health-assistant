import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import BackendLayout from '@/components/BackendLayout.vue'
import AuthLayout from '@/components/AuthLayout.vue'
import FontLayout from '@/components/FontLayout.vue'

const backendRouter = [
  {
    path: '/back',
    redirect: '/back/dashboard',
    component: BackendLayout,
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard.vue'),
        meta: {
          title: '数据分析',
          icon: 'PieChart'
        }
      },
      {
        path: 'knowledge',
        component: () => import('@/views/knowledge.vue'),
        meta: {
          title: '知识文章',
          icon: 'ChatLineSquare'
        }
      },
      {
        path: 'consulation',
        component: () => import('@/views/consulation.vue'),
        meta: {
          title: '咨询记录',
          icon: 'Message'
        }
      },
      {
        path: 'emotional',
        component: () => import('@/views/emotional.vue'),
        meta: {
          title: '情绪日志',
          icon: 'User'
        }
      }
    ]
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        component: () => import('@/views/login.vue'),
        meta: {
          title: '登录'
        }
      },
      {
        path: 'register',
        component: () => import('@/views/register.vue'),
        meta: {
          title: '注册'
        }
      }
    ]
  }
]

const frontendRouter = [
  {
    path: '/',
    component: FontLayout,
    children: [
      {
        path: '',
        component: () => import('@/views/home.vue'),
        meta: {
          title: '首页'
        }
      },
      {
        path: 'consultation',
        component: () => import('@/views/FontConsultation.vue'),
        meta: {
          title: 'AI咨询',
          requiresAuth: true
        }
      },
      {
        path: 'emotion-diary',
        component: () => import('@/views/emotionalDiary.vue'),
        meta: {
          title: '情绪日记',
          requiresAuth: true
        }
      },
      {
        path: 'knowledge',
        component: () => import('@/views/FontKnowledge.vue'),
        meta: {
          title: '知识文章'
        }
      },
      {
        path: 'knowledge-detail/:id',
        component: () => import('@/views/FontKnowledgeDetail.vue'),
        meta: {
          title: '知识文章详情'
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: [...backendRouter, ...frontendRouter]
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const isLoggedIn = Boolean(userStore.token && userStore.userInfo)

  if (!isLoggedIn) {
    if (to.meta.requiresAuth) {
      ElMessage.warning('该功能需要登录后才能使用')
      next(false)
    } else if (to.path.startsWith('/back')) {
      next({
        path: '/auth/login'
      })
    } else {
      next()
    }
    return
  }

  const userType = Number(userStore.userInfo.userType)

  if (userType === 2) {
    if (to.path.startsWith('/back')) {
      next()
    } else {
      next('/back/dashboard')
    }
    return
  }

  if (userType === 1) {
    if (to.path.startsWith('/back') || to.path.startsWith('/auth')) {
      next('/')
    } else {
      next()
    }
    return
  }

  userStore.logout()
  next('/auth/login')
})

export default router
