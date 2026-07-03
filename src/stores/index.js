import { createPinia } from 'pinia'
const pinia = createPinia()
export default pinia
export { useUserStore } from './user'
export { useAdminStore } from './admin'
export { useConsultationStore } from './consultation'