import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'
import { createAppI18n, SUPPORTED_LOCALES, type SupportedLocale } from '../../../src/i18n'
import './style.css'
import './stackprism.css'
import IssueFeedback from './IssueFeedback.vue'
import StackPrismHome from './StackPrismHome.vue'

// 根据当前路径找到对应语言的菜单项并加上 active 标记
function markCurrentLang() {
  const path = window.location.pathname
  // 取第一个路径段作为语言前缀
  const match = path.match(/^\/([a-z]{2}(?:-[A-Z]{2})?)\//)
  const currentLang = match ? match[1] : 'root'

  // VitePress 语言菜单里 href 是 /<lang>/ 或 /
  const langLinks = document.querySelectorAll('.VPMenuLink a.VPLink')
  langLinks.forEach(link => {
    const a = link as HTMLAnchorElement
    const href = a.getAttribute('href') || ''
    const isRoot = currentLang === 'root' && href === '/'
    const isMatch = currentLang !== 'root' && href === `/${currentLang}/`
    const wrapper = a.closest('.VPMenuLink') as HTMLElement | null
    if (wrapper) {
      wrapper.classList.toggle('is-current-lang', isRoot || isMatch)
    }
  })
}

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router }) {
    const popupI18n = createAppI18n('zh-CN')
    if (typeof window !== 'undefined') app.use(popupI18n)
    app.component('IssueFeedback', IssueFeedback)
    app.component('StackPrismHome', StackPrismHome)
    const syncPopupLocale = () => {
      if (typeof window === 'undefined') return
      const segment = window.location.pathname.split('/').filter(Boolean)[0] || 'zh-CN'
      const locale = SUPPORTED_LOCALES.some(item => item.code === segment) ? segment : 'zh-CN'
      popupI18n.global.locale.value = locale as SupportedLocale
    }
    if (typeof window !== 'undefined') {
      router.onAfterRouteChanged = () => {
        nextTick(() => {
          markCurrentLang()
          syncPopupLocale()
        })
      }
      nextTick(syncPopupLocale)
    }
  },
  setup() {
    if (typeof window !== 'undefined') {
      nextTick(markCurrentLang)
    }
  }
} satisfies Theme
