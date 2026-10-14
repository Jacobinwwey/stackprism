<template>
  <main class="shell">
    <header class="topbar">
      <div>
        <h1>
          <a class="app-title-link" :href="repoUrl" target="_blank" rel="noreferrer" @click="openRepository">{{ t('app.title') }}</a>
          <span v-if="version" class="version-badge">v{{ version }}</span>
        </h1>
        <p class="url">{{ pageUrl }}</p>
      </div>
      <div class="actions">
        <RippleButton class="icon-btn" :title="t('theme.toggle', { label: themeLabel(theme) })" @click="toggleTheme">
          <Sun v-if="theme === 'light'" :size="16" :stroke-width="2" />
          <Moon v-else-if="theme === 'dark'" :size="16" :stroke-width="2" />
          <Monitor v-else :size="16" :stroke-width="2" />
        </RippleButton>
        <RippleButton class="icon-btn" :title="t('nav.openSettings')" @click="openSettings">
          <Settings2 :size="16" :stroke-width="2" />
        </RippleButton>
        <RippleButton class="icon-btn" :title="t('lang.label')" @click="showLangMenu = !showLangMenu">
          <Languages :size="16" :stroke-width="2" />
        </RippleButton>
        <RippleButton class="icon-btn" :title="t('nav.copyUrl')" @click="copyResult">
          <Copy :size="16" :stroke-width="2" />
        </RippleButton>
        <RippleButton class="icon-btn primary" variant="primary" :title="t('nav.redetect')" @click="runDetection({ force: true })">
          <RefreshCw :size="16" :stroke-width="2" />
        </RippleButton>
      </div>
      <Transition name="lang-menu">
        <div v-if="showLangMenu" class="lang-menu" role="menu">
          <button
            v-for="loc in SUPPORTED_LOCALES"
            :key="loc.code"
            type="button"
            class="lang-option"
            :class="{ active: locale === loc.code }"
            role="menuitem"
            @click="switchLocale(loc.code as SupportedLocale)"
          >
            {{ loc.label }}
          </button>
        </div>
      </Transition>
    </header>

    <div v-if="!state.pageSupported" class="unsupported">
      <Ban class="empty-icon" :size="36" :stroke-width="1.5" />
      <h2>{{ t('state.unsupported') }}</h2>
      <p>{{ unsupportedReason }}</p>
      <p class="unsupported-hint">{{ t('state.unsupportedHint') }}</p>
    </div>

    <template v-else>
      <Transition name="msg-fade">
        <div v-if="status.message" class="msg" :class="status.type" role="status" aria-live="polite">
          {{ status.message }}
        </div>
      </Transition>

      <div v-if="isLoading" class="loading">
        <Loader2 class="loading-spinner" :size="28" :stroke-width="1.8" />
        <p>{{ t('state.loading') }}</p>
      </div>

      <template v-else>
        <section class="summary" aria-label="检测概览">
          <RippleButton
            :class="['summary-tile', { active: state.activeCategory === FOCUS_CATEGORY && !footerPanel }]"
            :title="t('summary.focusTitle')"
            @click="focusTechnologyList"
          >
            <span>{{ animatedTotal }}</span>
            <label>{{ t('summary.tech') }}</label>
          </RippleButton>
          <RippleButton
            :class="['summary-tile', { active: footerPanel === 'resources' }]"
            :title="t('summary.resourcesTitle')"
            @click="openSummaryDetail('resources')"
          >
            <span>{{ animatedResource }}</span>
            <label>{{ t('summary.resources') }}</label>
          </RippleButton>
          <RippleButton
            :class="['summary-tile', { active: footerPanel === 'headers' }]"
            :title="t('summary.headersTitle')"
            @click="openSummaryDetail('headers')"
          >
            <span>{{ animatedHeader }}</span>
            <label class="summary-label">
              {{ t('summary.headers') }}
              <Loader2 v-if="isDetecting" class="detection-spinner" :size="12" :stroke-width="2" />
            </label>
          </RippleButton>
        </section>

        <nav class="filter-bar" aria-label="技术分类过滤">
          <div class="segment" role="tablist">
            <RippleButton
              role="tab"
              :class="['segment-btn', { active: state.activeCategory === FOCUS_CATEGORY }]"
              :aria-selected="state.activeCategory === FOCUS_CATEGORY"
              @click="selectCategory(FOCUS_CATEGORY)"
            >
              <span>{{ t('summary.focus') }}</span>
              <span class="segment-count">{{ focusCount }}</span>
            </RippleButton>
            <RippleButton
              role="tab"
              :class="['segment-btn', { active: state.activeCategory === allCategory }]"
              :aria-selected="state.activeCategory === allCategory"
              @click="selectCategory(allCategory)"
            >
              <span>{{ t('summary.all') }}</span>
              <span class="segment-count">{{ totalCount }}</span>
            </RippleButton>
          </div>
          <div class="filter-select">
            <Select v-model="categoryFilterValue" :options="categoryFilterOptions" :placeholder="t('summary.selectCategory')" />
          </div>
        </nav>

        <div ref="sectionsScroller" class="sections-scroller" @scroll="onSectionsScroll">
          <Transition name="sections-fade" mode="out-in">
            <section :key="`${state.activeCategory}|${filteredSections.length ? 'd' : 'e'}`" class="sections">
              <div v-if="!state.result?.technologies?.length" class="empty">
                <SearchX class="empty-icon" :size="32" :stroke-width="1.5" />
                <p>{{ t('state.noTech') }}</p>
                <p class="empty-hint">{{ t('state.noTechHint') }}</p>
              </div>
              <div v-else-if="!filteredSections.length" class="empty">
                <Inbox class="empty-icon" :size="28" :stroke-width="1.5" />
                <p>{{ t('state.noCategoryResult') }}</p>
              </div>
              <section v-for="group in filteredSections" :key="group.category" class="category">
                <h2>
                  <span>{{ tCat(group.category) }}</span>
                  <span class="count">{{ t('count', { n: group.items.length }) }}</span>
                </h2>
                <div class="tech-grid">
                  <button
                    v-for="tech in group.items"
                    :key="`${tech.name}|${tech.category}`"
                    type="button"
                    class="tech-row"
                    :title="t('detail.viewDetail', { name: tech.name })"
                    @click="openTechDetail(tech)"
                  >
                    <TechChip :name="tech.name" :display-name="tTechName(tech.name)" :url="tech.url" />
                    <span class="tech-row-name">
                      {{ tTechName(tech.name) }}
                      <span v-if="tech.version" class="tech-row-version">{{ tech.version }}</span>
                    </span>
                  </button>
                </div>
              </section>
            </section>
          </Transition>
        </div>

        <Transition name="scroll-top-fade">
          <RippleButton v-show="showScrollTop" class="scroll-top" :title="t('nav.scrollTop')" @click="scrollSectionsTop">
            <ArrowUp :size="16" :stroke-width="2" />
          </RippleButton>
        </Transition>
      </template>
    </template>

    <Transition name="footer-mask">
      <div v-if="footerPanel" class="footer-mask" aria-hidden="true" @click="closeFooterPanel" />
    </Transition>

    <Transition name="footer-panel">
      <section v-if="footerPanel" class="footer-panel" :aria-label="footerPanelTitle">
        <header class="footer-panel-head">
          <span class="footer-panel-title">{{ footerPanelTitle }}</span>
          <div class="footer-panel-actions">
            <RippleButton
              v-if="footerPanel === 'raw'"
              class="footer-panel-copy"
              :title="t('footer.downloadRaw')"
              @click="downloadRawOutput"
            >
              <Download :size="12" :stroke-width="2" />
            </RippleButton>
            <RippleButton v-if="footerPanel === 'raw'" class="footer-panel-copy" :title="t('footer.copyRaw')" @click="copyRawOutput">
              <Copy :size="12" :stroke-width="2" />
            </RippleButton>
            <RippleButton class="footer-panel-close" :title="t('footer.close')" @click="closeFooterPanel">
              <X :size="14" :stroke-width="2" />
            </RippleButton>
          </div>
        </header>
        <div v-if="footerPanel === 'search'" class="footer-panel-body">
          <div class="search-row">
            <Input v-model="search.query" type="search" :placeholder="t('search.placeholder')" @keydown="onSearchKeydown" />
            <RippleButton @click="searchPageSourceFromPopup">{{ t('footer.search') }}</RippleButton>
          </div>
          <div class="search-options">
            <label>
              <Checkbox v-model="search.caseSensitive" />
              {{ t('search.caseSensitive') }}
            </label>
            <label>
              <Checkbox v-model="search.wholeWord" />
              {{ t('search.wholeWord') }}
            </label>
            <label>
              <Checkbox v-model="search.useRegex" />
              {{ t('search.useRegex') }}
            </label>
          </div>
          <div class="search-meta">{{ search.meta }}</div>
          <pre v-if="search.output" class="search-output">{{ search.output }}</pre>
        </div>
        <div v-else-if="footerPanel === 'raw'" class="footer-panel-body">
          <pre>{{ rawOutputText }}</pre>
        </div>
        <div v-else-if="footerPanel === 'resources'" class="footer-panel-body detail-body">
          <div v-if="detailLoading" class="detail-empty">{{ t('state.loadingDetail') }}</div>
          <div v-else-if="!detailResources.length" class="detail-empty">{{ t('state.noResources') }}</div>
          <ul v-else class="resource-list">
            <li v-for="url in detailResources" :key="url">
              <button type="button" class="resource-link" :title="url" @click="openResourceLink(url)">
                <ExternalLink class="resource-link-icon" :size="11" :stroke-width="2" />
                <span>{{ url }}</span>
              </button>
            </li>
          </ul>
        </div>
        <div v-else-if="footerPanel === 'headers'" class="footer-panel-body detail-body">
          <div v-if="detailLoading" class="detail-empty">{{ t('state.loadingDetail') }}</div>
          <div v-else-if="!Object.keys(detailHeaders).length" class="detail-empty">{{ t('state.noHeaders') }}</div>
          <dl v-else class="header-list">
            <template v-for="(value, key) in detailHeaders" :key="key">
              <dt>{{ key }}</dt>
              <dd>{{ value }}</dd>
            </template>
          </dl>
        </div>
        <div v-else-if="footerPanel === 'tech' && selectedTech" class="footer-panel-body tech-detail-body">
          <div class="tech-detail-head">
            <TechChip :name="selectedTech.name" :display-name="tTechName(selectedTech.name)" :url="selectedTech.url" large />
            <div class="tech-detail-meta">
              <span class="tech-detail-category">{{ tCat(selectedTech.category) }}</span>
              <span class="tech-detail-name">{{ tTechName(selectedTech.name) }}</span>
            </div>
            <span :class="['confidence', confidenceClass(selectedTech.confidence)]">
              {{ t('detail.confidence', { level: tConfidence(selectedTech.confidence) }) }}
            </span>
          </div>
          <button
            v-if="selectedTech.url"
            type="button"
            class="tech-detail-link"
            :title="t('detail.openSite', { name: selectedTech.name })"
            @click="openTechnologyLink(selectedTech)"
          >
            <ExternalLink :size="12" :stroke-width="2" />
            <span>{{ selectedTech.url }}</span>
          </button>
          <section v-if="selectedTech.evidence?.length" class="tech-detail-section">
            <h3>{{ t('detail.evidence') }}</h3>
            <ul class="tech-detail-evidence">
              <li v-for="(ev, i) in selectedTech.evidence" :key="i">{{ tEvidence(ev) }}</li>
            </ul>
          </section>
          <section v-if="selectedTech.sources?.length" class="tech-detail-section">
            <h3>{{ t('detail.sources') }}</h3>
            <div class="tech-detail-sources">
              <button
                v-for="src in selectedTech.sources"
                :key="src"
                type="button"
                class="tech-detail-source"
                :title="t('detail.viewSource', { source: tSource(src) })"
                @click="openSourceRaw(selectedTech, src)"
              >
                {{ tSource(src) }}
              </button>
            </div>
          </section>
          <button type="button" class="tech-detail-correction" title="" @click="openCorrectionIssue(selectedTech)">
            <Flag :size="12" :stroke-width="2" />
            <span>{{ t('detail.correct') }}</span>
          </button>
        </div>
      </section>
    </Transition>

    <footer class="app-footer">
      <div class="footer-tools">
        <RippleButton
          :class="['footer-tool-btn', { active: footerPanel === 'search' }]"
          :title="t('footer.searchTitle')"
          @click="toggleFooterPanel('search')"
        >
          <Search :size="13" :stroke-width="2" />
          <span>{{ t('footer.search') }}</span>
        </RippleButton>
        <RippleButton
          :class="['footer-tool-btn', { active: footerPanel === 'raw' }]"
          :title="t('footer.rawTitle')"
          @click="toggleFooterPanel('raw')"
        >
          <FileCode :size="13" :stroke-width="2" />
          <span>{{ t('footer.raw') }}</span>
        </RippleButton>
        <RippleButton class="footer-tool-btn" :title="t('footer.copyAllTitle')" @click="copyTechStackReport">
          <ClipboardList :size="13" :stroke-width="2" />
          <span>{{ t('footer.copyAll') }}</span>
        </RippleButton>
      </div>
      <a class="footer-repo" :href="repoUrl" target="_blank" rel="noreferrer" @click="openRepository">GitHub</a>
    </footer>
  </main>
</template>

<script setup lang="ts">
  import { onMounted, onBeforeUnmount, reactive, ref, computed, watch, type Ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import {
    ArrowUp,
    Ban,
    ClipboardList,
    Copy,
    Download,
    ExternalLink,
    FileCode,
    Flag,
    Inbox,
    Languages,
    Loader2,
    Monitor,
    Moon,
    RefreshCw,
    Search,
    SearchX,
    Settings2,
    Sun,
    X
  } from 'lucide-vue-next'
  import Select from '@/ui/components/Select.vue'
  import Checkbox from '@/ui/components/Checkbox.vue'
  import Input from '@/ui/components/Input.vue'
  import RippleButton from '@/ui/components/RippleButton.vue'
  import TechChip from '@/ui/components/TechChip.vue'
  import { categoryIndex, confidenceClass, confidenceRank } from '@/utils/category-order'
  import { applyCustomCss } from '@/utils/apply-custom-css'
  import { normalizeSettings } from '@/utils/normalize-settings'
  import { buildCorrectionIssueUrl } from '@/utils/build-issue-url'
  import {
    CACHE_REFRESH_DELAYS,
    FOCUS_CATEGORY,
    REPOSITORY_URL,
    RAW_PLACEHOLDER,
    SETTINGS_STORAGE_KEY,
    STATUS_HIDE_DELAY,
    getReadmeUrl
  } from '@/utils/constants'
  import { cycleTheme, getStoredTheme, setStoredTheme, themeLabel, type ThemeMode } from '@/utils/theme'
  import { checkPageSupport } from '@/utils/page-support'
  import { SUPPORTED_LOCALES, setStoredLocale, type SupportedLocale } from '@/i18n'
  import { formatTechStackReport } from '@/utils/format-tech-stack'

  const props = withDefaults(
    defineProps<{
      initialTheme?: ThemeMode
      isolatedTheme?: boolean
    }>(),
    { isolatedTheme: false }
  )
  const emit = defineEmits<{
    (event: 'theme-change', theme: ThemeMode): void
  }>()

  const { t, locale, tm } = useI18n({ useScope: 'global' })

  const repoUrl = computed(() => getReadmeUrl(locale.value))

  const showLangMenu = ref(false)

  const switchLocale = async (code: SupportedLocale) => {
    locale.value = code
    showLangMenu.value = false
    await setStoredLocale(code)
  }

  // 把后台返回的中文分类名翻译成当前语言
  const tCat = (zhName: string): string => {
    const map = tm('categoryMap') as Record<string, string> | undefined
    return (map && map[zhName]) || zhName
  }

  // 把置信度中文值翻译成当前语言
  const tConfidence = (level: string): string => {
    if (level === '高') return t('settings.form.confidenceHigh')
    if (level === '中') return t('settings.form.confidenceMid')
    if (level === '低') return t('settings.form.confidenceLow')
    return level
  }

  // 翻译 kind 前缀（技术子类型，来自规则 kind 字段）
  const tKind = (zhKind: string): string => {
    if (!zhKind) return zhKind
    const map = tm('kindMap') as Record<string, string> | undefined
    return (map && map[zhKind]) || zhKind
  }

  // 翻译证据字符串（前缀匹配后翻译前缀，保留后面的具体内容）
  const EVIDENCE_PREFIX_MAP: Record<string, string> = {
    'DOM 匹配': 'ev.domMatch',
    '资源 URL 匹配': 'ev.resourceMatch',
    '页面 URL 匹配': 'ev.urlMatch',
    'CSS 变量匹配': 'ev.cssVarMatch',
    'JS 版权注释匹配': 'ev.licenseMatch',
    '兜底识别：': 'ev.fallback',
    '疑似前端库:': 'suspect.frontendLib',
    '疑似前端库：': 'suspect.frontendLib'
  }
  const tEvidence = (ev: string): string => {
    if (!ev) return ev
    // 精确命中 evidenceMap（来自规则 JSON 的 evidence 字段，已预翻译）
    const evMap = tm('evidenceMap') as Record<string, string> | undefined
    if (evMap?.[ev]) return evMap[ev]
    // 兜底识别 — 脚本文件名格式
    const scriptMatch = ev.match(/^兜底识别：根据脚本文件名 (.+?) 判断，未匹配到内置规则或官网链接$/)
    if (scriptMatch) return `${t('ev.fallback')}${t('ev.fallbackScript', { file: scriptMatch[1] })}`
    const dynMatch = ev.match(/^兜底识别：根据动态脚本文件名 (.+?) 判断，未匹配到内置规则或官网链接$/)
    if (dynMatch) return `${t('ev.fallback')}${t('ev.fallbackDynamic', { file: dynMatch[1] })}`
    // 私有 CDN
    const cdnMatch = ev.match(/^(\d+) 个资源域名疑似私有 CDN，如 (.+)$/)
    if (cdnMatch) return t('ev.privateCdn', { count: cdnMatch[1], examples: cdnMatch[2] })
    // 规则数据里的 evidence 前缀模式
    const setCookieMatch = ev.match(/^Set-Cookie 包含 (.+)$/)
    if (setCookieMatch) return t('ev.setCookieContains', { value: setCookieMatch[1] })
    const headerContainsMatch = ev.match(/^响应头包含 (.+)$/)
    if (headerContainsMatch) return t('ev.headerContains', { value: headerContainsMatch[1] })
    const serverMatch = ev.match(/^Server 头包含 (.+)$/)
    if (serverMatch) return t('ev.serverHeaderContains', { value: serverMatch[1] })
    const xCacheMatch = ev.match(/^X-Cache 包含 (.+)$/)
    if (xCacheMatch) return t('ev.xCacheContains', { value: xCacheMatch[1] })
    const viaMatch = ev.match(/^Via 包含 (.+)$/)
    if (viaMatch) return t('ev.viaContains', { value: viaMatch[1] })
    // React Fiber
    if (ev === 'DOM 节点存在 React Fiber 标记') return t('ev.reactFiber')
    // HTTPS
    if (ev === '当前页面使用 HTTPS') return t('ev.httpsPage')
    // HTTP/2 / HTTP/3
    const httpProtoMatch = ev.match(/^资源使用 (HTTP\/[23]) 协议（如 (.+)）$/)
    if (httpProtoMatch) return t('ev.httpProtocol', { proto: httpProtoMatch[1], example: httpProtoMatch[2] })
    // window.X
    const windowMatch = ev.match(/^存在 window\.(.+)$/)
    if (windowMatch) return t('ev.windowGlobal', { name: windowMatch[1] })
    // 页面源码匹配
    if (ev === '页面源码或资源索引包含规则特征') return t('ev.pageSourceMatch')
    // Service Worker
    if (ev === '当前页面受 Service Worker 控制') return t('ev.serviceWorker')
    // CSP meta
    if (ev === '页面包含 CSP meta 标签') return t('ev.cspMeta')
    // CDN/Edge 缓存线索
    if (ev === '响应头包含 CDN 或 Edge 缓存线索') return t('ev.cdnEdgeHint')
    // Tailwind atomic
    if (ev === '存在大量 Tailwind 风格原子类名') return t('ev.tailwindAtomic')
    // spoofed headers
    if (ev === '响应头里同时出现多种不同主体身份字段，识别结果可能被伪造') return t('ev.spoofedHeaders')
    // UnoCSS / Tailwind CSS variable prefixes (exact strings from page-detector)
    if (ev === '存在 --un-* CSS 变量(UnoCSS 默认前缀)') return t('ev.unocssVar')
    if (ev === '存在 --tw-* CSS 变量(Tailwind 默认前缀)') return t('ev.tailwindVar')
    // PHP runtime inference
    const phpBackendMatch = ev.match(/^由 (.+?) 后端框架推断 PHP 后端运行时$/)
    if (phpBackendMatch) return t('ev.phpFromBackend', { name: phpBackendMatch[1] })
    const phpCmsMatch = ev.match(/^由 (.+?) 站点程序推断 PHP 后端运行时$/)
    if (phpCmsMatch) return t('ev.phpFromCms', { name: phpCmsMatch[1] })
    const phpClueMatch = ev.match(/^由 (.+?) 技术线索推断 PHP 后端运行时$/)
    if (phpClueMatch) return t('ev.phpFromClue', { name: phpClueMatch[1] })
    // JS 包体内嵌 OAuth 入口（前面可能有 "类型：" 前缀，全角或半角冒号）
    const oauthMatch = ev.match(/^(?:(.+?)[：:]\s)?JS 包体内嵌 OAuth 入口 (.+)$/)
    if (oauthMatch) {
      const kindMap = tm('kindMap') as Record<string, string> | undefined
      const rawKind = oauthMatch[1]
      const translatedKind = rawKind ? (kindMap && kindMap[rawKind]) || rawKind : ''
      const prefix = translatedKind ? `${translatedKind}: ` : ''
      return prefix + t('ev.oauthEmbed', { url: oauthMatch[2] })
    }
    // CSS 变量前缀：存在 --prefix-* CSS 变量
    const cssVarPrefixMatch = ev.match(/^存在 (--[\w-]+\*) CSS 变量/)
    if (cssVarPrefixMatch) return t('ev.cssVarPrefix', { prefix: cssVarPrefixMatch[1] })
    // 类名前缀：存在 prefix-* 类名
    const classPrefixMatch = ev.match(/^存在 ([\w-]+\*) 类名$/)
    if (classPrefixMatch) return t('ev.classNamePrefix', { prefix: classPrefixMatch[1] })
    // 具体类名：存在 className 类名
    const classMatch = ev.match(/^存在 ([\w-]+) 类名$/)
    if (classMatch) return t('ev.className', { name: classMatch[1] })
    // 资源或源码路径包含
    const resourcePathMatch = ev.match(/^资源或源码路径包含 (.+)$/)
    if (resourcePathMatch) return t('ev.resourcePathContains', { path: resourcePathMatch[1] })
    // 动态资源路径包含
    const dynamicPathMatch = ev.match(/^动态资源路径包含 (.+)$/)
    if (dynamicPathMatch) return t('ev.dynamicPathContains', { path: dynamicPathMatch[1] })
    // feed 链接
    const feedMatch = ev.match(/^发现 feed 链接：(.+)$/)
    if (feedMatch) return t('ev.feedFound', { url: feedMatch[1] })
    const dynFeedMatch = ev.match(/^动态发现 feed 链接：(.+)$/)
    if (dynFeedMatch) return t('ev.dynamicFeedFound', { url: dynFeedMatch[1] })
    // JS 版权注释匹配 URL
    const licenseUrlMatch = ev.match(/^JS 版权注释匹配 (.+)$/)
    if (licenseUrlMatch) return `${t('ev.licenseMatch')} ${licenseUrlMatch[1]}`
    // 资源 URL 匹配 X 等 N 个
    const resourceUrlMatch = ev.match(/^资源 URL 匹配 (.+)$/)
    if (resourceUrlMatch) return `${t('ev.resourceMatch')} ${resourceUrlMatch[1]}`
    // DOM 匹配 selector
    const domSelectorMatch = ev.match(/^DOM 匹配 (.+)$/)
    if (domSelectorMatch) return `${t('ev.domMatch')} ${domSelectorMatch[1]}`
    // CSS 变量匹配 X
    const cssVarMatch = ev.match(/^CSS 变量匹配 (.+)$/)
    if (cssVarMatch) return `${t('ev.cssVarMatch')} ${cssVarMatch[1]}`
    // "kind：具体证据" 格式 — kind 前缀通过 kindMap 翻译（必须在 sourceMatchSuffix 之前，
    // 否则 "自有埋点 SDK：JSON 统计动态规则 匹配" 会被后者提前吞掉）
    const kindPrefixMatch = ev.match(/^(.+?)：(.+)$/)
    if (kindPrefixMatch) {
      const translatedKind = tKind(kindPrefixMatch[1])
      const translatedEvidence = tEvidence(kindPrefixMatch[2])
      return `${translatedKind}: ${translatedEvidence}`
    }
    // "X 匹配" 格式 — sourceLabel + 匹配（[^：] 保证不含全角冒号，避免误匹配上面格式的剩余部分）
    const sourceMatchSuffix = ev.match(/^([^：]+) 匹配$/)
    if (sourceMatchSuffix) return t('ev.ruleMatch', { source: tSource(sourceMatchSuffix[1]) })
    for (const [prefix, key] of Object.entries(EVIDENCE_PREFIX_MAP)) {
      if (ev.startsWith(prefix)) {
        const translatedPrefix = t(key)
        const rest = ev.slice(prefix.length)
        return rest ? `${translatedPrefix} ${rest.trimStart()}` : translatedPrefix
      }
    }
    return ev
  }

  // 翻译技术名称中的 "疑似前端库:" 前缀
  const tTechName = (name: string): string => {
    if (!name) return name
    const m = name.match(/^疑似前端库[：:]\s*(.+)$/u)
    if (m) return `${t('suspect.frontendLib')} ${m[1]}`
    // 翻译生成的固定技术名称（如私有 CDN 兜底名）
    const nameMap = tm('techNameMap') as Record<string, string> | undefined
    if (nameMap?.[name]) return nameMap[name]
    return name
  }

  // 把后台返回的中文来源字符串翻译成当前语言
  const tSource = (zhSource: string): string => {
    if (!zhSource) return zhSource
    const map = tm('sourceMap') as Record<string, string> | undefined
    if (!map) return zhSource
    // 精确匹配
    if (map[zhSource]) return map[zhSource]
    // 前缀匹配（如"动态监控 · 页面交互后" / "响应头 · API" / "响应头 · iframe"）
    for (const [key, val] of Object.entries(map)) {
      if (zhSource.startsWith(key)) {
        const suffix = zhSource.slice(key.length)
        const translatedSuffix = suffix
          .replace('页面交互后', t('ev.afterInteraction'))
          .replace(' · API', ` · ${map['API'] || 'API'}`)
          .replace(' · iframe', ` · ${map['iframe'] || 'iframe'}`)
        return val + translatedSuffix
      }
    }
    return zhSource
  }
  const RAW_LOADING_TEXT = t('state.loadingRaw')

  // 当前语言的"全部"分类标签（英语等用 'all'，中文用 '全部'）
  const allCategory = computed(() => t('summary.all'))

  const state = reactive({
    result: null as any,
    rawResult: null as any,
    rawLoaded: false,
    activeCategory: FOCUS_CATEGORY as string,
    currentTabId: 0,
    settings: normalizeSettings(),
    cacheRefreshTimer: 0,
    pageSupported: true
  })

  const status = reactive({ message: '', type: '' as 'ok' | 'error' | '' })
  let statusTimer = 0
  const pageUrl = ref(t('state.detecting'))
  const unsupportedReason = ref('')
  const version = ref('')
  const isLoading = ref(true)
  const isDetecting = computed(() => isLoading.value || Boolean(state.cacheRefreshTimer))
  const search = reactive({
    query: '',
    caseSensitive: false,
    wholeWord: false,
    useRegex: false,
    meta: t('search.meta'),
    output: ''
  })
  const rawOutputText = ref('')
  const getRawPlaceholder = () => t('msg.rawPlaceholder')
  const theme = ref<ThemeMode>('auto')
  const footerPanel = ref<'search' | 'raw' | 'resources' | 'headers' | 'tech' | null>(null)
  const rawSourceContext = ref<{ tech: any; source: string } | null>(null)
  const selectedTech = ref<any>(null)
  const sectionsScroller = ref<HTMLElement | null>(null)
  const showScrollTop = ref(false)
  const detailLoading = ref(false)
  const detailResources = ref<string[]>([])
  const detailHeaders = ref<Record<string, string>>({})

  const rawPanelTitle = computed(() => {
    if (footerPanel.value !== 'raw') return ''
    const ctx = rawSourceContext.value
    if (!ctx) return t('footer.raw')
    return `${t('footer.raw')} · ${ctx.tech ? tTechName(ctx.tech.name) : ''} · ${tSource(ctx.source)}`
  })

  const footerPanelTitle = computed(() => {
    if (footerPanel.value === 'search') return t('footer.searchTitle')
    if (footerPanel.value === 'raw') return rawPanelTitle.value
    if (footerPanel.value === 'resources') return `${t('summary.resources')}（${detailResources.value.length}）`
    if (footerPanel.value === 'headers') return `${t('summary.headers')}（${Object.keys(detailHeaders.value).length}）`
    if (footerPanel.value === 'tech') return selectedTech.value ? tTechName(selectedTech.value.name) : t('app.title')
    return ''
  })

  const openTechDetail = (tech: any) => {
    selectedTech.value = tech
    rawSourceContext.value = null
    footerPanel.value = 'tech'
  }

  const toggleFooterPanel = (name: 'search' | 'raw') => {
    if (footerPanel.value === name && !rawSourceContext.value) {
      footerPanel.value = null
      return
    }
    rawSourceContext.value = null
    footerPanel.value = name
    if (name === 'raw') {
      renderRawOutput().catch(() => {})
    }
  }

  const closeFooterPanel = () => {
    footerPanel.value = null
    rawSourceContext.value = null
  }

  const openSourceRaw = (tech: any, source: string) => {
    rawSourceContext.value = { tech, source }
    footerPanel.value = 'raw'
    renderRawOutput().catch(() => {})
  }

  const loadDetailFromRaw = async () => {
    detailLoading.value = true
    try {
      const raw = state.rawResult || (state.currentTabId ? await requestPopupRawResult(state.currentTabId) : null)
      if (raw && !state.rawResult) {
        state.rawResult = raw
        state.rawLoaded = true
      }
      detailResources.value = Array.isArray(raw?.resources?.all) ? raw.resources.all : []
      detailHeaders.value = raw?.headers && typeof raw.headers === 'object' ? raw.headers : {}
    } catch {
      detailResources.value = []
      detailHeaders.value = {}
    } finally {
      detailLoading.value = false
    }
  }

  const openSummaryDetail = (kind: 'resources' | 'headers') => {
    if (footerPanel.value === kind) {
      footerPanel.value = null
      return
    }
    rawSourceContext.value = null
    footerPanel.value = kind
    loadDetailFromRaw().catch(() => {})
  }

  const openResourceLink = (url: string) => {
    if (!url) return
    chrome.tabs.create({ url })
  }

  const onSectionsScroll = (event: Event) => {
    const target = event.currentTarget as HTMLElement
    showScrollTop.value = target.scrollTop > 240
  }

  const scrollSectionsTop = () => {
    sectionsScroller.value?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleTheme = async () => {
    const next = props.isolatedTheme ? (theme.value === 'dark' ? 'light' : 'dark') : cycleTheme(theme.value)
    theme.value = next
    if (props.isolatedTheme) {
      emit('theme-change', next)
      return
    }
    await setStoredTheme(next)
  }

  const setStatus = (message: string, type: '' | 'ok' | 'error' = '') => {
    status.message = message
    status.type = type
    if (statusTimer) {
      clearTimeout(statusTimer)
      statusTimer = 0
    }
    if (message) {
      statusTimer = window.setTimeout(() => {
        status.message = ''
        status.type = ''
        statusTimer = 0
      }, STATUS_HIDE_DELAY)
    }
  }

  const showError = (message: string) => {
    setStatus(message, 'error')
    state.result = null
  }

  const headerCount = computed(() => {
    if (!state.result) return 0
    if (typeof state.result.headerCount === 'number') return state.result.headerCount
    const headers = state.result.headers
    if (Array.isArray(headers)) return headers.length
    return Object.keys(headers || {}).length
  })

  const totalCount = computed(() => state.result?.technologies?.length ?? 0)
  const resourceCount = computed(() => state.result?.resources?.total ?? 0)

  const useAnimatedCounter = (target: Ref<number>, duration = 480) => {
    const display = ref(target.value || 0)
    let frame = 0
    watch(target, newVal => {
      const start = display.value
      const end = Number(newVal) || 0
      if (start === end) {
        display.value = end
        return
      }
      if (frame) cancelAnimationFrame(frame)
      const startTime = performance.now()
      const tick = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        display.value = Math.round(start + (end - start) * eased)
        if (progress < 1) {
          frame = requestAnimationFrame(tick)
        } else {
          display.value = end
          frame = 0
        }
      }
      frame = requestAnimationFrame(tick)
    })
    return display
  }

  const animatedTotal = useAnimatedCounter(totalCount)
  const animatedResource = useAnimatedCounter(resourceCount)
  const animatedHeader = useAnimatedCounter(headerCount)

  const focusCount = computed(() => {
    if (!state.result?.technologies?.length) return 0
    return getFocusTechnologies(state.result.technologies).length
  })

  const groupedTechnologies = computed(() => {
    const result = state.result
    if (!result?.technologies) return {}
    return result.technologies.reduce((acc: any, item: any) => {
      if (!acc[item.category]) acc[item.category] = []
      acc[item.category].push(item)
      return acc
    }, {})
  })

  const tabItems = computed(() => {
    const result = state.result
    if (!result?.technologies) return []
    const grouped = groupedTechnologies.value
    const categories = Object.keys(grouped).sort((a, b) => categoryIndex(a) - categoryIndex(b))
    return categories.map(category => ({ category, count: grouped[category].length }))
  })

  const categoryFilterOptions = computed(() =>
    tabItems.value.map(item => ({ value: item.category, label: `${tCat(item.category)} · ${item.count}` }))
  )

  const categoryFilterValue = computed({
    get: () => {
      const cat = state.activeCategory
      if (cat === FOCUS_CATEGORY || cat === allCategory.value) return ''
      return cat
    },
    set: value => {
      if (!value) {
        state.activeCategory = FOCUS_CATEGORY
        return
      }
      if (value !== FOCUS_CATEGORY && value !== allCategory.value) {
        state.activeCategory = value
      }
    }
  })

  const filteredSections = computed(() => {
    const result = state.result
    if (!result?.technologies?.length) return []
    const filtered = getFilteredTechnologies(result)
    const grouped = filtered.reduce((acc: any, item: any) => {
      if (!acc[item.category]) acc[item.category] = []
      acc[item.category].push(item)
      return acc
    }, {})
    return Object.keys(grouped)
      .sort((a, b) => categoryIndex(a) - categoryIndex(b))
      .map(category => ({ category, items: grouped[category] }))
  })

  const getFocusTechnologies = (technologies: any[]) => {
    const high = technologies.filter(tech => tech.confidence === '高')
    if (high.length) return high.slice(0, 60)
    return [...technologies].sort((a, b) => confidenceRank(b.confidence) - confidenceRank(a.confidence)).slice(0, 30)
  }

  const getFilteredTechnologies = (result: any) => {
    if (state.activeCategory === FOCUS_CATEGORY) return getFocusTechnologies(result.technologies)
    if (state.activeCategory === allCategory.value) return result.technologies
    return result.technologies.filter((tech: any) => tech.category === state.activeCategory)
  }

  const loadSettings = async () => {
    try {
      const stored = await chrome.storage.sync.get(SETTINGS_STORAGE_KEY)
      return normalizeSettings(stored[SETTINGS_STORAGE_KEY])
    } catch {
      return normalizeSettings()
    }
  }

  const emptyPopupResult = (tab: any = {}) => {
    return {
      url: tab.url || '',
      title: tab.title || '',
      generatedAt: new Date().toISOString(),
      updatedAt: 0,
      technologies: [],
      counts: { total: 0, high: 0, medium: 0, low: 0 },
      categoryCounts: {},
      resources: { total: 0 },
      headerCount: 0
    }
  }

  const requestPopupResult = async (tabId: number) => {
    const response = await chrome.runtime.sendMessage({ type: 'GET_POPUP_RESULT', tabId })
    if (!response?.ok) throw new Error(response?.error || t('msg.noCache'))
    return response
  }

  const requestPopupRawResult = async (tabId: number) => {
    const response = await chrome.runtime.sendMessage({ type: 'GET_POPUP_RAW_RESULT', tabId })
    if (!response?.ok) throw new Error(response?.error || t('msg.noRaw'))
    return response.data || {}
  }

  const requestBackgroundDetection = (tabId: number) => {
    chrome.runtime.sendMessage({ type: 'START_BACKGROUND_DETECTION', tabId }).catch(() => {})
  }

  const clearCacheRefreshTimer = () => {
    if (state.cacheRefreshTimer) {
      clearTimeout(state.cacheRefreshTimer)
      state.cacheRefreshTimer = 0
    }
  }

  const scheduleCachedResultRefresh = (tabId: number, previousUpdatedAt: number, attempt: number) => {
    clearCacheRefreshTimer()
    if (attempt >= CACHE_REFRESH_DELAYS.length) return
    state.cacheRefreshTimer = window.setTimeout(() => {
      state.cacheRefreshTimer = 0
      refreshCachedResultIfReady(tabId, previousUpdatedAt, attempt).catch(() => {})
    }, CACHE_REFRESH_DELAYS[attempt])
  }

  const refreshCachedResultIfReady = async (tabId: number, previousUpdatedAt: number, attempt: number) => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (!tab || tab.id !== tabId) return

    const response = await requestPopupResult(tabId)
    const updatedAt = Number(response.updatedAt || response.data?.updatedAt || 0)
    if (response.hasCache && updatedAt && updatedAt !== previousUpdatedAt) {
      const result = response.data || emptyPopupResult(tab)
      state.result = result
      state.activeCategory = FOCUS_CATEGORY
      resetRawState()
      setStatus('')
      return
    }

    scheduleCachedResultRefresh(tabId, previousUpdatedAt, attempt + 1)
  }

  const markUnsupportedPage = (url: string, reasonCode?: string) => {
    state.pageSupported = false
    state.result = null
    const code = reasonCode || 'unsupportedProtocol'
    const reasonMap = tm('state.unsupportedReasons') as Record<string, string> | undefined
    unsupportedReason.value = (reasonMap && reasonMap[code]) || t('state.unsupported')
    pageUrl.value = url || t('msg.currentTab')
    setStatus('')
    clearCacheRefreshTimer()
  }

  const loadCachedDetection = async () => {
    state.result = null
    isLoading.value = true
    clearCacheRefreshTimer()

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (!tab || !tab.id) {
      isLoading.value = false
      showError(t('msg.noTab'))
      return
    }

    const support = checkPageSupport(tab.url || '')
    if (!support.supported) {
      isLoading.value = false
      markUnsupportedPage(tab.url || '', support.reasonCode)
      return
    }

    state.pageSupported = true
    pageUrl.value = tab.url || t('msg.currentTab')
    state.currentTabId = tab.id
    setStatus('')

    try {
      state.settings = state.settings || (await loadSettings())
      applyCustomCss(state.settings.customCss)
      const response = await requestPopupResult(tab.id)
      const result = response.data || emptyPopupResult(tab)

      state.result = result
      state.activeCategory = FOCUS_CATEGORY
      isLoading.value = false

      if (!response.hasCache) {
        setStatus(t('msg.noCache'))
        requestBackgroundDetection(tab.id)
        scheduleCachedResultRefresh(tab.id, response.updatedAt || 0, 0)
        return
      }

      if (response.stale) {
        setStatus(t('msg.cacheUpdating'))
        requestBackgroundDetection(tab.id)
        scheduleCachedResultRefresh(tab.id, response.updatedAt || 0, 0)
        return
      }

      setStatus(t('msg.loaded'), 'ok')
    } catch (error: any) {
      isLoading.value = false
      showError(t('msg.cacheReadFailed', { msg: String(error?.message || error) }))
    }
  }

  const runDetection = async ({ force = false } = {}) => {
    clearCacheRefreshTimer()

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (!tab || !tab.id) {
      showError(t('msg.noTab'))
      return
    }

    const support = checkPageSupport(tab.url || '')
    if (!support.supported) {
      markUnsupportedPage(tab.url || '', support.reasonCode)
      return
    }

    state.pageSupported = true
    setStatus(force ? t('msg.redetectRequested') : t('msg.detectRequested'), 'ok')
    pageUrl.value = tab.url || t('msg.currentTab')
    state.currentTabId = tab.id

    const previousUpdatedAt = Number(state.result?.updatedAt || 0)
    requestBackgroundDetection(tab.id)
    scheduleCachedResultRefresh(tab.id, previousUpdatedAt, 0)
  }

  const selectCategory = (category: string) => {
    state.activeCategory = category
  }

  const focusTechnologyList = () => {
    closeFooterPanel()
    state.activeCategory = FOCUS_CATEGORY
    sectionsScroller.value?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openTechnologyLink = (tech: any) => {
    if (!tech.url) return
    chrome.tabs.create({ url: tech.url })
  }

  const openCorrectionIssue = async (tech: any) => {
    let rawCopied = false
    try {
      let raw: any = state.rawResult
      if (!raw && state.currentTabId) {
        raw = await requestPopupRawResult(state.currentTabId)
        if (raw) {
          state.rawResult = raw
          state.rawLoaded = true
        }
      }
      if (raw) {
        await navigator.clipboard.writeText(JSON.stringify(raw, null, 2))
        rawCopied = true
      }
    } catch {
      rawCopied = false
    }
    const ctx = {
      url: state.result?.url || '',
      title: state.result?.title || '',
      generatedAt: state.result?.generatedAt || '',
      version: chrome.runtime.getManifest?.()?.version || '',
      rawCopied
    }
    if (rawCopied) {
      setStatus(t('msg.rawCopiedForIssue'), 'ok')
    }
    chrome.tabs.create({ url: buildCorrectionIssueUrl(tech, ctx, t, locale.value) })
  }

  const openSettings = () => {
    const settingsPage = chrome.runtime.getManifest().options_ui?.page
    const url = chrome.runtime.getURL(settingsPage || 'src/ui/settings/index.html')
    chrome.tabs.create({ url })
  }

  const openRepository = (event: Event) => {
    event.preventDefault()
    chrome.tabs.create({ url: getReadmeUrl(locale.value) })
  }

  const copyResult = async () => {
    const url = (state.result as any)?.url || pageUrl.value
    if (!url || url === t('state.detecting')) {
      setStatus(t('msg.noUrl'), 'error')
      return
    }
    try {
      await navigator.clipboard.writeText(String(url))
      setStatus(t('msg.copyUrlDone'), 'ok')
    } catch (error: any) {
      setStatus(t('msg.copyFailed', { msg: String(error?.message || error) }), 'error')
    }
  }

  const copyRawOutput = async () => {
    const text = rawOutputText.value
    if (!text || text === RAW_PLACEHOLDER || text === RAW_LOADING_TEXT) {
      setStatus(t('msg.noRawCopy'), 'error')
      return
    }
    try {
      await navigator.clipboard.writeText(text)
      setStatus(t('msg.rawCopied'), 'ok')
    } catch (error: any) {
      setStatus(t('msg.copyFailed', { msg: String(error?.message || error) }), 'error')
    }
  }

  const copyTechStackReport = async () => {
    const result = state.result
    if (!result) {
      setStatus(t('msg.noTechStack'), 'error')
      return
    }
    if (!navigator.clipboard?.writeText) {
      setStatus(t('msg.copyUnsupported'), 'error')
      return
    }
    try {
      await navigator.clipboard.writeText(formatTechStackReport(result))
      setStatus(t('msg.reportCopied'), 'ok')
    } catch (error: any) {
      setStatus(t('msg.copyFailed', { msg: String(error?.message || error) }), 'error')
    }
  }

  const sanitizeFilenameSegment = (input: string) => {
    const cleaned = String(input || '')
      .trim()
      .replace(/[\s/\\:*?"<>|]+/g, '-')
      .replace(/^-+|-+$/g, '')
    return cleaned.slice(0, 64)
  }

  const buildRawDownloadFilename = () => {
    let host = 'page'
    try {
      const target = state.result?.url || state.rawResult?.url || ''
      if (target) host = new URL(target).hostname.replace(/^www\./, '')
    } catch {
      // ignore parse error, fall back to default host
    }
    const ctx = rawSourceContext.value
    const parts = ['stackprism', host || 'page']
    if (ctx) {
      const techPart = sanitizeFilenameSegment(ctx.tech?.name || '')
      const sourcePart = sanitizeFilenameSegment(ctx.source || '')
      if (techPart) parts.push(techPart)
      if (sourcePart) parts.push(sourcePart)
    }
    parts.push(new Date().toISOString().replace(/[:.]/g, '-').replace(/Z$/, ''))
    return `${parts.filter(Boolean).join('_')}.json`
  }

  const downloadRawOutput = () => {
    const text = rawOutputText.value
    if (!text || text === RAW_PLACEHOLDER || text === RAW_LOADING_TEXT) {
      setStatus(t('msg.noRawDownload'), 'error')
      return
    }
    try {
      const blob = new Blob([text], { type: 'application/json;charset=utf-8' })
      const objectUrl = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = objectUrl
      anchor.download = buildRawDownloadFilename()
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
      setStatus(rawSourceContext.value ? t('msg.sourceDownloaded') : t('msg.rawDownloaded'), 'ok')
    } catch (error: any) {
      setStatus(t('msg.downloadFailed', { msg: String(error?.message || error) }), 'error')
    }
  }

  const getRawResult = async () => {
    if (state.rawLoaded) return state.rawResult
    const tabId = state.currentTabId || (await getActiveTabId())
    const raw = await requestPopupRawResult(tabId)
    state.rawResult = raw
    state.rawLoaded = true
    return raw
  }

  const getActiveTabId = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (!tab || !tab.id) throw new Error(t('msg.noTab'))
    const support = checkPageSupport(tab.url || '')
    if (!support.supported)
      throw new Error(
        (() => {
          const code = support.reasonCode || 'unsupportedProtocol'
          const reasonMap = tm('state.unsupportedReasons') as Record<string, string> | undefined
          return (reasonMap && reasonMap[code]) || t('state.unsupported')
        })()
      )
    state.currentTabId = tab.id
    return tab.id
  }

  const buildScopedRawJson = (raw: any, tech: any, source: string) => {
    const techName = String(tech?.name || '').toLowerCase()
    const matchTech = (item: any) => String(item?.name || '').toLowerCase() === techName
    const trimmed = String(source || '').trim()
    const isHeaderApi = /·\s*api/i.test(trimmed)
    const isHeaderFrame = /·\s*iframe/i.test(trimmed)
    const isDynamic = trimmed.startsWith('动态监控')
    const isBundle = trimmed.startsWith('JS 版权注释')
    const isHeader = !isHeaderApi && !isHeaderFrame && trimmed.startsWith('响应头')

    // 响应头无论 source 是哪个都带上：spoof 场景下排查时方便交叉对照
    const baseInfo = {
      url: raw?.url || '',
      title: raw?.title || '',
      technology: tech?.name || '',
      source: trimmed,
      headers: raw?.headers || {}
    }

    if (isHeader) {
      return {
        ...baseInfo,
        technologies: (raw?.technologies || []).filter(matchTech)
      }
    }

    if (isHeaderApi) {
      const records = (raw?.apiObservations || [])
        .map((rec: any) => ({ ...rec, technologies: (rec?.technologies || []).filter(matchTech) }))
        .filter((rec: any) => rec.technologies.length)
      return { ...baseInfo, apiObservations: records }
    }

    if (isHeaderFrame) {
      const records = (raw?.frameObservations || [])
        .map((rec: any) => ({ ...rec, technologies: (rec?.technologies || []).filter(matchTech) }))
        .filter((rec: any) => rec.technologies.length)
      return { ...baseInfo, frameObservations: records }
    }

    if (isDynamic) {
      const dyn = raw?.dynamicObservations || {}
      return {
        ...baseInfo,
        dynamicObservations: {
          ...dyn,
          technologies: (dyn?.technologies || []).filter(matchTech)
        }
      }
    }

    if (isBundle) {
      const bundle = raw?.bundleObservations || {}
      return {
        ...baseInfo,
        bundleObservations: {
          ...bundle,
          technologies: (bundle?.technologies || []).filter(matchTech)
        }
      }
    }

    return {
      ...baseInfo,
      technologies: (raw?.technologies || []).filter(matchTech)
    }
  }

  const resetRawState = () => {
    state.rawResult = null
    state.rawLoaded = false
    if (footerPanel.value === 'raw') {
      void renderRawOutput()
    } else {
      rawOutputText.value = getRawPlaceholder()
    }
  }

  // 把 raw JSON 里的技术记录字段翻译成当前语言，供 Raw data 面板展示
  const translateRawForDisplay = (obj: any): any => {
    if (!obj || typeof obj !== 'object') return obj
    if (Array.isArray(obj)) return obj.map(translateRawForDisplay)

    const result: Record<string, any> = {}
    for (const [k, v] of Object.entries(obj)) {
      if (k === 'technologies' && Array.isArray(v)) {
        result[k] = v.map((tech: any) => {
          if (!tech || typeof tech !== 'object') return tech
          return {
            ...tech,
            name: tTechName(tech.name),
            category: tCat(tech.category),
            confidence: tConfidence(tech.confidence),
            source: tech.source ? tSource(tech.source) : tech.source,
            sources: Array.isArray(tech.sources) ? tech.sources.map(tSource) : tech.sources,
            evidence: Array.isArray(tech.evidence) ? tech.evidence.map(tEvidence) : tech.evidence
          }
        })
      } else if (k === 'source' && typeof v === 'string') {
        result[k] = tSource(v)
      } else if (k === 'technology' && typeof v === 'string') {
        result[k] = tTechName(v)
      } else if (k === 'notes' && Array.isArray(v)) {
        const notesMap = tm('rawNotes') as Record<string, string> | undefined
        result[k] = v.map((note: string) => notesMap?.[note] || note)
      } else if (['apiObservations', 'frameObservations', 'dynamicObservations', 'bundleObservations'].includes(k)) {
        result[k] = translateRawForDisplay(v)
      } else {
        result[k] = v
      }
    }
    return result
  }

  const renderRawOutput = async () => {
    if (!state.result) {
      rawOutputText.value = t('msg.noRaw')
      return
    }
    rawOutputText.value = RAW_LOADING_TEXT
    try {
      const raw = await getRawResult()
      const ctx = rawSourceContext.value
      if (ctx) {
        rawOutputText.value = JSON.stringify(translateRawForDisplay(buildScopedRawJson(raw, ctx.tech, ctx.source)), null, 2)
      } else {
        rawOutputText.value = JSON.stringify(translateRawForDisplay(raw), null, 2)
      }
    } catch (error: any) {
      rawOutputText.value = t('msg.rawFailed', { msg: String(error?.message || error) })
    }
  }

  const onSearchKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      searchPageSourceFromPopup()
    }
  }

  const searchPageSourceFromPopup = async () => {
    const query = search.query
    if (!query) {
      search.meta = t('search.queryRequired')
      search.output = ''
      return
    }

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (!tab || !tab.id) {
      search.meta = t('search.noTab')
      search.output = ''
      return
    }
    const support = checkPageSupport(tab.url || '')
    if (!support.supported) {
      search.meta = support.reason
      search.output = ''
      return
    }

    const options = {
      query,
      caseSensitive: search.caseSensitive,
      wholeWord: search.wholeWord,
      useRegex: search.useRegex
    }

    search.meta = t('search.searching')
    search.output = ''

    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        world: 'MAIN',
        func: (opts: any) => {
          ;(window as any).__SP_SEARCH__ = opts
        },
        args: [options]
      })
      const [injection] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        world: 'MAIN',
        files: ['injected/page-source-search.iife.js']
      })
      const result = injection?.result as any

      if (!result?.ok) {
        search.meta = result?.error || t('search.searchFailed')
        search.output = ''
        return
      }

      search.meta = t('search.searchFound', { count: result.totalMatchesText, length: result.sourceLength.toLocaleString() })
      search.output = formatSearchResult(result)
    } catch (error: any) {
      search.meta = t('search.searchFailed') + ': ' + String(error?.message || error)
      search.output = ''
    }
  }

  const formatSearchResult = (result: any) => {
    const lines = [
      `${t('search.queryLabel')}: ${result.query}`,
      `${t('search.modeLabel')}: ${describeSearchOptions(result.options)}`,
      `${t('search.sourceLabel')}: ${result.sourceKind}`,
      `${t('search.sourceLength')}: ${result.sourceLength.toLocaleString()}`,
      `${t('search.matchCount')}: ${result.totalMatchesText}`
    ]

    if (!result.snippets.length) {
      lines.push('', t('search.noMatch'))
      return lines.join('\n')
    }
    if (result.truncated) lines.push(t('search.truncated', { n: result.snippets.length }))

    lines.push('', '----------------------------------------')
    for (const snippet of result.snippets) {
      lines.push(
        t('search.matchLocation', { index: snippet.index, line: snippet.line, col: snippet.column, offset: snippet.offset }),
        snippet.preview,
        '----------------------------------------'
      )
    }
    return lines.join('\n')
  }

  const describeSearchOptions = (options: any) => {
    const parts: string[] = []
    parts.push(options.useRegex ? t('search.modeRegex') : t('search.modePlain'))
    parts.push(options.caseSensitive ? t('search.modeCaseSensitive') : t('search.modeCaseInsensitive'))
    if (options.wholeWord) parts.push(t('search.modeWholeWord'))
    return parts.join(' / ')
  }

  const popupCacheSignature = (popup: any): string => {
    if (!popup || typeof popup !== 'object') return ''
    const counts = popup.counts || {}
    const resources = popup.resources || {}
    return [
      Number(popup.sourceUpdatedAt || popup.updatedAt || 0),
      Number(counts.total || popup.technologies?.length || 0),
      Number(counts.high || 0),
      Number(resources.total || 0),
      Number(popup.headerCount || 0)
    ].join('|')
  }

  const onStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }, area: string) => {
    if (area !== 'session' || !state.currentTabId) return
    const popupKey = `popup:${state.currentTabId}`
    if (!(popupKey in changes)) return
    const newPopup = changes[popupKey].newValue
    if (!newPopup || typeof newPopup !== 'object') return
    if (popupCacheSignature(newPopup) === popupCacheSignature(state.result)) return
    state.result = newPopup
    resetRawState()
    setStatus('')
  }

  onMounted(async () => {
    version.value = chrome.runtime.getManifest?.()?.version || ''
    theme.value = props.initialTheme || (await getStoredTheme())
    state.settings = await loadSettings()
    applyCustomCss(state.settings.customCss)
    chrome.storage.onChanged.addListener(onStorageChange)
    await loadCachedDetection()
  })

  onBeforeUnmount(() => {
    clearCacheRefreshTimer()
    chrome.storage.onChanged.removeListener(onStorageChange)
  })
</script>

<style lang="scss">
  .popup-host {
    width: var(--popup-width);
    height: 600px;
    font-size: 13px;
    line-height: 1.45;
    overflow: hidden;
  }
</style>

<style lang="scss" scoped>
  // layout shell：flex column，整体高度 100vh，sections-scroller 独占滚动区
  .shell {
    display: flex;
    flex-direction: column;
    height: 100vh;
    padding: 0;
    position: relative;
  }

  // topbar：flex 项，不再 fixed，自然占据顶部
  .topbar {
    align-items: flex-start;
    backdrop-filter: saturate(180%) blur(8px);
    background: var(--panel-translucent);
    border-bottom: 1px solid var(--line);
    display: flex;
    flex-shrink: 0;
    gap: 12px;
    height: var(--popup-header-height);
    justify-content: space-between;
    margin: 0;
    padding: 12px 16px 8px;
    z-index: 20;

    > div:first-child {
      flex: 1 1 auto;
      min-width: 0;
    }
  }

  h1 {
    align-items: center;
    display: flex;
    flex-wrap: nowrap;
    font-size: 16px;
    font-weight: 600;
    gap: 8px;
    letter-spacing: -0.01em;
    line-height: 1.2;
    margin: 0 0 4px;
  }

  .app-title-link {
    color: var(--text);
    min-width: 0;
    overflow: hidden;
    text-decoration: none;
    text-overflow: ellipsis;
    white-space: nowrap;

    &:hover {
      color: var(--accent);
    }
  }

  .version-badge {
    color: var(--muted);
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.02em;
  }

  .url {
    color: var(--muted);
    font-size: 12px;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .actions {
    align-items: center;
    display: flex;
    flex: 0 0 auto;
    gap: 4px;
    position: relative;
    white-space: nowrap;

    button {
      background: transparent;
      border: 0;
      border-radius: 5px;
      color: var(--muted);
      font-size: 12px;
      padding: 5px 8px;
      transition:
        background 0.15s ease,
        color 0.15s ease;
      white-space: nowrap;

      &:hover {
        background: var(--accent-soft);
        color: var(--accent);
      }

      &.primary {
        background: var(--accent);
        color: #ffffff;
        font-weight: 500;

        &:hover {
          background: var(--accent-dark);
          color: #ffffff;
        }
      }
    }
  }

  .icon-btn {
    align-items: center;
    display: inline-flex;
    height: 28px;
    justify-content: center;
    padding: 0 !important;
    width: 28px;
  }

  // 语言菜单
  .lang-menu {
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: 8px;
    box-shadow: var(--shadow);
    min-width: 120px;
    overflow: hidden;
    padding: 4px;
    position: absolute;
    right: 0;
    top: calc(100% + 4px);
    z-index: 100;
  }

  .lang-option {
    background: transparent;
    border: 0;
    border-radius: 5px;
    color: var(--text);
    cursor: pointer;
    display: block;
    font-size: 12px;
    padding: 5px 10px;
    text-align: left;
    transition:
      background 0.12s ease,
      color 0.12s ease;
    white-space: nowrap;
    width: 100%;

    &:hover {
      background: var(--accent-soft);
      color: var(--accent);
    }

    &.active {
      color: var(--accent);
      font-weight: 600;
    }
  }

  .lang-menu-enter-active,
  .lang-menu-leave-active {
    transition:
      opacity 0.12s ease,
      transform 0.12s ease;
  }

  .lang-menu-enter-from,
  .lang-menu-leave-to {
    opacity: 0;
    transform: translateY(-4px);
  }

  // msg 浮动通知：与 settings 一致的悬浮提示
  .msg {
    background: var(--panel);
    border: 1px solid var(--line);
    border-left: 3px solid var(--accent);
    border-radius: 6px;
    box-shadow: var(--shadow);
    color: var(--text);
    font-size: 12px;
    left: 50%;
    line-height: 1.5;
    max-height: min(48vh, 280px);
    max-width: calc(100% - 32px);
    overflow: auto;
    padding: 8px 12px;
    position: fixed;
    top: 16px;
    transform: translateX(-50%);
    white-space: pre-wrap;
    z-index: 50;

    &.ok {
      border-left-color: var(--ok);
    }

    &.error {
      border-left-color: var(--danger);
      color: var(--danger);
    }
  }

  .msg-fade-enter-from,
  .msg-fade-leave-to {
    opacity: 0;
    transform: translate(-50%, -8px);
  }

  .msg-fade-enter-active,
  .msg-fade-leave-active {
    transition:
      opacity 0.2s ease,
      transform 0.2s ease;
  }

  // summary：主指标加重，去三盒子，inline baseline 对齐
  .summary {
    align-items: baseline;
    border-bottom: 1px solid var(--line);
    display: flex;
    flex-shrink: 0;
    gap: 20px;
    margin: 0;
    padding: 14px 16px;

    > div,
    .summary-tile {
      align-items: baseline;
      background: transparent;
      border: 0;
      color: inherit;
      cursor: default;
      display: flex;
      font: inherit;
      gap: 6px;
      margin: 0;
      padding: 0;
      text-align: left;
    }

    span {
      color: var(--text);
      font-size: 16px;
      font-variant-numeric: tabular-nums;
      font-weight: 600;
    }

    > div:first-child span,
    .summary-tile:first-child span {
      color: var(--accent);
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    label {
      color: var(--muted);
      font-size: 12px;
    }
  }

  .summary-tile {
    border-radius: 4px;
    cursor: pointer;
    margin: -2px -6px;
    padding: 2px 6px;
    transition:
      background 0.15s ease,
      color 0.15s ease;

    &:hover {
      background: var(--accent-soft);
    }

    &.active {
      background: var(--accent-soft);
      color: var(--accent);

      span {
        color: var(--accent);
      }
    }
  }

  .summary-label {
    align-items: center;
    display: inline-flex;
    gap: 4px;
  }

  // filter-bar：左侧 segment + 右侧分类下拉
  .filter-bar {
    align-items: center;
    border-bottom: 1px solid var(--line);
    display: flex;
    flex-shrink: 0;
    gap: 12px;
    margin: 0;
    padding: 12px 16px;
  }

  .segment {
    background: var(--bg);
    border: 1px solid var(--line);
    border-radius: 6px;
    display: inline-flex;
    flex: 0 0 auto;
    padding: 2px;
  }

  .segment-btn {
    align-items: center;
    background: transparent;
    border: 0;
    border-radius: 4px;
    color: var(--muted);
    cursor: pointer;
    display: inline-flex;
    font-size: 12px;
    gap: 6px;
    padding: 4px 10px;
    transition:
      background 0.15s ease,
      color 0.15s ease;

    &:hover:not(.active) {
      color: var(--text);
    }

    &.active {
      background: var(--panel);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
      color: var(--accent);
      font-weight: 600;

      .segment-count {
        color: var(--accent);
      }
    }
  }

  .segment-count {
    color: var(--muted);
    font-size: 11px;
    font-variant-numeric: tabular-nums;
  }

  .filter-select {
    flex: 1 1 auto;
    min-width: 0;
  }

  // loading：spinner + 文字，等后台缓存返回时占位
  .loading {
    align-items: center;
    color: var(--muted);
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    font-size: 13px;
    gap: 12px;
    justify-content: center;
    padding: 32px 24px;

    p {
      margin: 0;
    }
  }

  .detection-spinner,
  .loading-spinner {
    animation: spin 0.9s linear infinite;
    color: var(--accent);
    flex-shrink: 0;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  // scroll-top：sections 滚动 > 240px 出现，固定在 sections 区域右下角
  .scroll-top {
    align-items: center;
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: 50%;
    bottom: calc(var(--popup-footer-height) + 12px);
    box-shadow: 0 4px 12px rgba(20, 35, 50, 0.1);
    color: var(--muted);
    cursor: pointer;
    display: inline-flex;
    height: 32px;
    justify-content: center;
    padding: 0;
    position: absolute;
    right: 12px;
    transition:
      background 0.15s ease,
      border-color 0.15s ease,
      color 0.15s ease;
    width: 32px;
    z-index: 18;

    &:hover {
      background: var(--accent);
      border-color: var(--accent);
      color: #ffffff;
    }
  }

  .scroll-top-fade-enter-active,
  .scroll-top-fade-leave-active {
    transition:
      opacity 0.18s ease,
      transform 0.18s ease;
  }

  .scroll-top-fade-enter-from,
  .scroll-top-fade-leave-to {
    opacity: 0;
    transform: scale(0.8) translateY(8px);
  }

  // sections 切换淡入，从无→有数据 / 切分类时整体过渡
  .sections-fade-enter-active,
  .sections-fade-leave-active {
    transition:
      opacity 0.18s ease,
      transform 0.18s ease;
  }

  .sections-fade-enter-from {
    opacity: 0;
    transform: translateY(4px);
  }

  .sections-fade-leave-to {
    opacity: 0;
    transform: translateY(-2px);
  }

  // sections-scroller：唯一滚动容器，flex 1 占据剩余空间
  .sections-scroller {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    padding: 12px 16px;
  }

  // sections：去 panel 化，标题 + 列表条目
  .sections {
    display: grid;
    gap: 16px;
  }

  .category h2 {
    align-items: baseline;
    color: var(--muted);
    display: flex;
    font-size: 11px;
    font-weight: 600;
    gap: 8px;
    justify-content: space-between;
    letter-spacing: 0.06em;
    margin: 0 0 4px;
    padding: 0 4px;
    text-transform: uppercase;
  }

  .count {
    color: var(--muted);
    font-size: 11px;
    font-variant-numeric: tabular-nums;
    font-weight: 500;
    letter-spacing: 0;
    text-transform: none;
  }

  // 同类目里多个技术用 flex-wrap 排开:按内容宽度自然换行,密度更高
  .tech-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 2px;
  }

  // 单个技术 chip:色块图标 + 名字
  .tech-row {
    align-items: center;
    background: transparent;
    border: 0;
    border-radius: 5px;
    color: var(--text);
    cursor: pointer;
    display: inline-flex;
    font: inherit;
    gap: 6px;
    padding: 4px 8px;
    text-align: left;
    transition: background 0.15s ease;

    &:hover {
      background: var(--accent-soft);
    }

    &:focus-visible {
      background: var(--accent-soft);
      outline: 2px solid var(--accent);
      outline-offset: -2px;
    }
  }

  .tech-row-name {
    font-size: 13px;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .tech-row-version {
    color: var(--muted);
    font-size: 11px;
    font-variant-numeric: tabular-nums;
    font-weight: 400;
    margin-left: 4px;
  }

  // 详情面板里仍保留的彩色置信度徽章(详情视图里信息密度低,徽章撑得开)
  .confidence {
    border-radius: 4px;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.02em;
    padding: 1px 6px;
    white-space: nowrap;

    &.high {
      background: var(--confidence-high-bg);
      color: var(--confidence-high-text);
    }
    &.medium {
      background: var(--confidence-medium-bg);
      color: var(--confidence-medium-text);
    }
    &.low {
      background: var(--confidence-low-bg);
      color: var(--confidence-low-text);
    }
  }

  // tech-detail 面板:点击 .tech-row 后从底部滑上来,展示完整 evidence / sources / 纠错入口
  .tech-detail-body {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 14px 16px 16px;
  }

  .tech-detail-head {
    align-items: center;
    display: flex;
    gap: 12px;
  }

  .tech-detail-meta {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .tech-detail-category {
    color: var(--muted);
    font-size: 11px;
    letter-spacing: 0.02em;
  }

  .tech-detail-name {
    font-size: 15px;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .tech-detail-link {
    align-items: center;
    background: transparent;
    border: 1px solid var(--line);
    border-radius: 5px;
    color: var(--muted);
    cursor: pointer;
    display: inline-flex;
    font: inherit;
    font-size: 11px;
    gap: 6px;
    overflow: hidden;
    padding: 6px 10px;
    text-overflow: ellipsis;
    transition:
      border-color 0.15s ease,
      color 0.15s ease;
    white-space: nowrap;

    span {
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &:hover {
      border-color: var(--accent);
      color: var(--accent);
    }
  }

  .tech-detail-section {
    display: flex;
    flex-direction: column;
    gap: 6px;

    h3 {
      color: var(--muted);
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.04em;
      margin: 0;
      text-transform: uppercase;
    }
  }

  .tech-detail-evidence {
    color: var(--text);
    font-size: 12px;
    line-height: 1.55;
    margin: 0;
    padding-left: 16px;

    li {
      margin: 2px 0;
      overflow-wrap: anywhere;
    }
  }

  .tech-detail-sources {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .tech-detail-source {
    background: transparent;
    border: 1px solid var(--line);
    border-radius: 4px;
    color: var(--muted);
    cursor: pointer;
    font: inherit;
    font-size: 11px;
    padding: 3px 8px;
    transition:
      border-color 0.15s ease,
      color 0.15s ease;

    &:hover {
      border-color: var(--accent);
      color: var(--accent);
    }
  }

  .tech-detail-correction {
    align-items: center;
    align-self: flex-start;
    background: transparent;
    border: 0;
    color: var(--muted);
    cursor: pointer;
    display: inline-flex;
    font-size: 11px;
    gap: 4px;
    margin-top: 2px;
    padding: 0;
    transition: color 0.15s ease;

    &:hover {
      color: var(--accent);
    }
  }

  .empty {
    align-items: center;
    color: var(--muted);
    display: flex;
    flex-direction: column;
    font-size: 13px;
    gap: 4px;
    padding: 32px 12px 24px;
    text-align: center;

    p {
      margin: 0;
    }
  }

  .empty-hint {
    font-size: 12px;
    opacity: 0.75;
  }

  // 通用空状态图标：所有空 / 不支持页面共用
  .empty-icon {
    color: var(--muted);
    margin-bottom: 8px;
    opacity: 0.55;
  }

  // unsupported：当前页面（chrome:// / 扩展页 / about:）无法注入检测脚本
  .unsupported {
    align-items: center;
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    justify-content: center;
    padding: 24px;
    text-align: center;

    h2 {
      color: var(--text);
      font-size: 15px;
      font-weight: 600;
      letter-spacing: -0.01em;
      margin: 0 0 6px;
      text-transform: none;
    }

    p {
      color: var(--muted);
      font-size: 12px;
      line-height: 1.55;
      margin: 0;
      max-width: 28ch;
    }
  }

  .unsupported-hint {
    color: var(--muted);
    font-size: 12px;
    margin-top: 8px !important;
    opacity: 0.75;
  }

  // footer：toolbar 风格，左侧两个工具按钮 + 右侧 GitHub
  .app-footer {
    align-items: center;
    backdrop-filter: saturate(180%) blur(8px);
    background: var(--panel-translucent);
    border-top: 1px solid var(--line);
    color: var(--muted);
    display: flex;
    flex-shrink: 0;
    gap: 8px;
    justify-content: space-between;
    margin: 0;
    min-height: var(--popup-footer-height);
    padding: 6px 12px;
    z-index: 20;
  }

  .footer-tools {
    display: flex;
    gap: 4px;
  }

  .footer-tool-btn {
    align-items: center;
    background: transparent;
    border: 0;
    border-radius: 5px;
    color: var(--muted);
    cursor: pointer;
    display: inline-flex;
    font-size: 12px;
    gap: 5px;
    padding: 5px 10px;
    transition:
      background 0.15s ease,
      color 0.15s ease;

    &:hover,
    &.active {
      background: var(--accent-soft);
      color: var(--accent);
    }

    &.active {
      font-weight: 500;
    }
  }

  .footer-repo {
    color: var(--muted);
    font-size: 11px;
    text-decoration: none;
    transition: color 0.15s ease;

    &:hover {
      color: var(--accent);
    }
  }

  // footer-mask：覆盖 topbar 与 app-footer 之间的主体内容，点击关闭面板
  .footer-mask {
    background: rgba(15, 23, 42, 0.32);
    bottom: var(--popup-footer-height);
    cursor: pointer;
    left: 0;
    position: absolute;
    right: 0;
    top: var(--popup-header-height);
    z-index: 18;
  }

  [data-theme='dark'] .footer-mask {
    background: rgba(0, 0, 0, 0.45);
  }

  .footer-mask-enter-from,
  .footer-mask-leave-to {
    opacity: 0;
  }

  .footer-mask-enter-active,
  .footer-mask-leave-active {
    transition: opacity 0.2s ease;
  }

  // footer-panel：从底部抽屉式滑出，相对 .shell 绝对定位在 footer 上方
  .footer-panel {
    background: var(--panel);
    border-top: 1px solid var(--line);
    bottom: var(--popup-footer-height);
    box-shadow: 0 -8px 24px rgba(20, 35, 50, 0.06);
    display: flex;
    flex-direction: column;
    left: 0;
    max-height: 60%;
    position: absolute;
    right: 0;
    z-index: 19;
  }

  .footer-panel-head {
    align-items: center;
    border-bottom: 1px solid var(--line);
    display: flex;
    flex-shrink: 0;
    justify-content: space-between;
    padding: 8px 12px;
  }

  .footer-panel-title {
    color: var(--muted);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .footer-panel-actions {
    display: inline-flex;
    flex-shrink: 0;
    gap: 4px;
  }

  .footer-panel-close,
  .footer-panel-copy {
    align-items: center;
    background: transparent;
    border: 0;
    border-radius: 4px;
    color: var(--muted);
    cursor: pointer;
    display: inline-flex;
    height: 22px;
    justify-content: center;
    padding: 0;
    transition:
      background 0.15s ease,
      color 0.15s ease;
    width: 22px;

    &:hover {
      background: var(--accent-soft);
      color: var(--accent);
    }
  }

  .footer-panel-body {
    flex: 1 1 auto;
    overflow-y: auto;
    padding: 12px;
  }

  .detail-body {
    font-size: 12px;
    padding: 8px 0;
  }

  .detail-empty {
    color: var(--muted);
    padding: 12px 16px;
  }

  .resource-list {
    list-style: none;
    margin: 0;
    padding: 0;

    li {
      border-bottom: 1px solid var(--line);

      &:last-child {
        border-bottom: 0;
      }
    }
  }

  .resource-link {
    align-items: center;
    background: transparent;
    border: 0;
    color: var(--text);
    cursor: pointer;
    display: flex;
    font: inherit;
    font-size: 12px;
    gap: 6px;
    overflow: hidden;
    padding: 8px 16px;
    text-align: left;
    transition:
      background 0.15s ease,
      color 0.15s ease;
    width: 100%;

    &:hover {
      background: var(--accent-soft);
      color: var(--accent);

      .resource-link-icon {
        color: var(--accent);
      }
    }

    span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .resource-link-icon {
    color: var(--muted);
    flex-shrink: 0;
  }

  .header-list {
    display: grid;
    gap: 4px 12px;
    grid-template-columns: auto 1fr;
    margin: 0;
    padding: 4px 16px 12px;

    dt,
    dd {
      font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
      font-size: 11px;
      padding-top: 4px;
      word-break: break-all;
    }

    dt {
      color: var(--muted);
      font-weight: 500;
    }

    dd {
      color: var(--text);
      margin: 0;
    }
  }

  .footer-panel-enter-active,
  .footer-panel-leave-active {
    transition:
      opacity 0.18s ease,
      transform 0.2s ease;
  }

  .footer-panel-enter-from,
  .footer-panel-leave-to {
    opacity: 0;
    transform: translateY(8px);
  }

  // 搜索 UI（footer-panel 内）
  .search-row {
    display: grid;
    gap: 6px;
    grid-template-columns: 1fr auto;

    input {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 6px;
      color: var(--text);
      min-width: 0;
      padding: 7px 10px;
      transition: border-color 0.15s ease;

      &:focus {
        border-color: var(--accent);
        outline: none;
      }
    }

    button {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 6px;
      color: var(--text);
      cursor: pointer;
      font: inherit;
      padding: 7px 14px;
      transition:
        border-color 0.15s ease,
        color 0.15s ease;

      &:hover {
        border-color: var(--accent);
        color: var(--accent);
      }
    }
  }

  .search-options {
    color: var(--muted);
    display: flex;
    flex-wrap: wrap;
    font-size: 12px;
    gap: 12px;
    margin-top: 8px;

    label {
      align-items: center;
      cursor: pointer;
      display: inline-flex;
      gap: 5px;
    }
  }

  .search-meta {
    color: var(--muted);
    font-size: 11px;
    margin-top: 8px;
  }

  .search-output {
    margin-top: 8px;
  }

  pre {
    background: var(--code-bg);
    border-radius: 6px;
    color: var(--code-text);
    font-family: ui-monospace, SFMono-Regular, Consolas, 'Liberation Mono', monospace;
    font-size: 11px;
    line-height: 1.5;
    margin: 8px 0 0;
    max-height: 260px;
    overflow: auto;
    padding: 10px 12px;
    white-space: pre-wrap;
    word-break: break-word;
  }
</style>
