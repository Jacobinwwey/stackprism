import '@/ui/tokens.css'
import { createApp } from 'vue'
import { initTheme } from '@/utils/theme'
import { createAppI18n, getStoredLocale } from '@/i18n'
import Help from './Help.vue'

initTheme()
getStoredLocale().then(locale => {
  const i18n = createAppI18n(locale)
  createApp(Help).use(i18n).mount('#app')
})
