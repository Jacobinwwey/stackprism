import '@/ui/tokens.css'
import { createApp } from 'vue'
import { initTheme } from '@/utils/theme'
import { createAppI18n, getStoredLocale } from '@/i18n'
import Popup from './Popup.vue'

document.body.classList.add('popup-host')
initTheme()
getStoredLocale().then(locale => {
  const i18n = createAppI18n(locale)
  createApp(Popup).use(i18n).mount('#app')
})
