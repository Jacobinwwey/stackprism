import type { TechnologyRecord } from '@/types/rules'
import { DOCS_URL } from './constants'

export interface CorrectionContext {
  url?: string
  title?: string
  generatedAt?: string
  version?: string
  rawCopied?: boolean
}

type TFn = (key: string, values?: Record<string, string | number>) => string

const fallbackT: TFn = key => {
  const defaults: Record<string, string> = {
    'issue.correctionTitle': '识别纠正：',
    'issue.unknownTech': '未知技术',
    'issue.noEvidence': '无',
    'issue.sectionNeeds': '## 需要纠正的识别结果',
    'issue.fieldName': '- 技术名称：',
    'issue.fieldCategory': '- 分类：',
    'issue.fieldConfidence': '- 置信度：',
    'issue.fieldSources': '- 来源：',
    'issue.fieldPageTitle': '- 页面标题：',
    'issue.fieldPageUrl': '- 页面 URL：',
    'issue.fieldVersion': '- 插件版本：v',
    'issue.fieldGeneratedAt': '- 生成时间：',
    'issue.sectionEvidence': '## 当前证据',
    'issue.sectionCorrect': '## 你认为正确的结果',
    'issue.correctName': '- 正确技术名称：',
    'issue.correctCategory': '- 正确分类：',
    'issue.correctReason': '- 纠正原因：',
    'issue.sectionSupplement': '## 补充线索',
    'issue.rawCopiedHint': '完整原始线索 JSON 已复制到你的剪贴板，请在下方粘贴（Ctrl+V / Cmd+V），便于排查规则误判位置：',
    'issue.rawNotCopiedHint': '请粘贴页面源码片段、资源 URL、响应头、截图或其他可以帮助修正规则的信息。',
    'issue.ruleContributionTitle': '规则贡献：'
  }
  return defaults[key] ?? key
}

export const buildCorrectionIssueUrl = (
  tech: TechnologyRecord,
  ctx: CorrectionContext = {},
  t: TFn = fallbackT,
  locale?: string
): string => {
  const feedbackUrl = new URL(`${DOCS_URL}/feedback`)
  feedbackUrl.searchParams.set('tab', 'bug')
  if (tech.name) feedbackUrl.searchParams.set('tech', tech.name)
  if (tech.category) feedbackUrl.searchParams.set('category', tech.category)
  if (ctx.version) feedbackUrl.searchParams.set('version', ctx.version)
  if (ctx.url) feedbackUrl.searchParams.set('url', ctx.url)
  if (locale) feedbackUrl.searchParams.set('lang', locale)
  return feedbackUrl.toString()
}

export const buildRuleContributionUrl = (name?: string, category?: string, t: TFn = fallbackT, locale?: string): string => {
  const trimmedName = (name ?? '').trim()
  const trimmedCategory = (category ?? '').trim()
  const feedbackUrl = new URL(`${DOCS_URL}/feedback`)
  feedbackUrl.searchParams.set('tab', 'rule')
  if (trimmedName) feedbackUrl.searchParams.set('tech', trimmedName)
  if (trimmedCategory) feedbackUrl.searchParams.set('category', trimmedCategory)
  if (locale) feedbackUrl.searchParams.set('lang', locale)
  return feedbackUrl.toString()
}
