export const SETTINGS_STORAGE_KEY = 'stackPrismSettings'
export const REPOSITORY_URL = 'https://github.com/setube/stackprism'
export const DOCS_URL = 'https://stackprism.wenzi.games'
export const RULE_CONTRIBUTION_URL = `${REPOSITORY_URL}/issues/new?template=rule_contribution.yml`

const README_LOCALES: Record<string, string> = {
  'zh-CN': '',
  en: '',
  'zh-TW': 'i18n/README.zh-Hant.md',
  ja: 'i18n/README.ja.md',
  fr: 'i18n/README.fr.md',
  de: 'i18n/README.de.md',
  pt: 'i18n/README.pt.md',
  it: 'i18n/README.it.md',
  cs: 'i18n/README.cs.md',
  pl: 'i18n/README.pl.md'
}

export const getReadmeUrl = (locale: string): string => {
  const path = README_LOCALES[locale]
  if (path) return `${REPOSITORY_URL}/blob/main/${path}`
  return REPOSITORY_URL
}
export const DETECTION_CORRECTION_TEMPLATE = 'detection_correction.md'

export const FOCUS_CATEGORY = '重点'
export const RAW_PLACEHOLDER = '展开后生成原始线索。'
export const CACHE_REFRESH_DELAYS = [1200, 2600, 5000] as const

export const STATUS_HIDE_DELAY = 3000
