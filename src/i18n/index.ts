import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh-CN'
import zhTW from './locales/zh-TW'
import en from './locales/en'
import ja from './locales/ja'
import fr from './locales/fr'
import de from './locales/de'
import pt from './locales/pt'
import it from './locales/it'
import cs from './locales/cs'
import pl from './locales/pl'

export const SUPPORTED_LOCALES = [
  { code: 'zh-CN', label: '简体中文' },
  { code: 'zh-TW', label: '繁體中文' },
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'pt', label: 'Português' },
  { code: 'it', label: 'Italiano' },
  { code: 'cs', label: 'Čeština' },
  { code: 'pl', label: 'Polski' }
] as const

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]['code']

const LANG_KEY = 'stackPrismLang'

export const getSupportedLocale = (lang: string): SupportedLocale => {
  const lower = lang.toLowerCase()
  if (lower.startsWith('zh')) {
    return lower.includes('tw') || lower.includes('hk') || lower.includes('mo') ? 'zh-TW' : 'zh-CN'
  }
  for (const { code } of SUPPORTED_LOCALES) {
    if (lower.startsWith(code.split('-')[0])) return code as SupportedLocale
  }
  return 'en'
}

export const getStoredLocale = async (): Promise<SupportedLocale> => {
  try {
    const stored = await chrome.storage.sync.get(LANG_KEY)
    const saved = stored[LANG_KEY]
    if (saved && SUPPORTED_LOCALES.some(l => l.code === saved)) return saved as SupportedLocale
  } catch {}
  return getSupportedLocale(navigator.language)
}

export const setStoredLocale = async (locale: SupportedLocale): Promise<void> => {
  try {
    await chrome.storage.sync.set({ [LANG_KEY]: locale })
  } catch {}
}

export const createAppI18n = (locale: SupportedLocale) =>
  createI18n({
    legacy: false,
    locale,
    fallbackLocale: 'en',
    messages: { 'zh-CN': zhCN, 'zh-TW': zhTW, en, ja, fr, de, pt, it, cs, pl }
  })
