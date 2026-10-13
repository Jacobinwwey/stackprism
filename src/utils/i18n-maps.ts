/**
 * 分类名映射表 — 中文 key → i18n 路径后缀
 * 用于把后台返回的中文类别名翻译成当前语言
 */
export const CATEGORY_I18N_KEYS: Record<string, string> = {
  前端框架: 'cat.frontendFramework',
  'UI / CSS 框架': 'cat.uiFramework',
  前端库: 'cat.frontendLib',
  构建与运行时: 'cat.buildRuntime',
  'CDN / 托管': 'cat.cdn',
  'WAF / 防火墙': 'cat.waf',
  'Web 服务器': 'cat.webServer',
  '后端 / 服务器框架': 'cat.backendFramework',
  '开发语言 / 运行时': 'cat.language',
  网站程序: 'cat.cms',
  '主题 / 模板': 'cat.theme',
  网站源码线索: 'cat.sourceClue',
  '探针 / 监控': 'cat.monitoring',
  'CMS / 电商平台': 'cat.ecommerce',
  'RSS / 订阅': 'cat.rss',
  'SaaS / 第三方服务': 'cat.saas',
  'AI / 大模型': 'cat.ai',
  '第三方登录 / OAuth': 'cat.oauth',
  支付系统: 'cat.payment',
  '广告 / 营销': 'cat.ads',
  '统计 / 分析': 'cat.analytics',
  分析与标签: 'cat.tagManager',
  安全与协议: 'cat.security',
  其他库: 'cat.other'
}

/**
 * 来源字符串映射表 — 中文来源前缀 → i18n key
 */
export const SOURCE_I18N_KEYS: Record<string, string> = {
  页面扫描: 'src.pageScan',
  'JS 版权注释': 'src.bundleLicense',
  动态监控: 'src.dynamic',
  'JSON 动态技术规则': 'src.jsonDynamic',
  'JSON 前端框架动态规则': 'src.jsonFrontendDynamic',
  'JSON 前端库动态规则': 'src.jsonFrontendLibDynamic',
  'JSON 前端框架规则': 'src.jsonFrontend',
  'JSON 前端补充规则': 'src.jsonFrontendExtra',
  派生推断: 'src.derived',
  主题样式表: 'src.themeStylesheet'
}

/**
 * 证据字符串前缀映射表 — 中文前缀 → i18n key
 */
export const EVIDENCE_PREFIX_I18N_KEYS: Record<string, string> = {
  'DOM 匹配': 'ev.domMatch',
  '资源 URL 匹配': 'ev.resourceMatch',
  '页面 URL 匹配': 'ev.urlMatch',
  'CSS 变量匹配': 'ev.cssVarMatch',
  'JS 版权注释匹配': 'ev.licenseMatch',
  '兜底识别：': 'ev.fallback',
  响应头里同时出现多种不同主体身份字段: 'ev.spoofWarning',
  由: 'ev.inferredFrom'
}
