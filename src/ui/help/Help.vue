<template>
  <header class="help-header">
    <div class="help-header-inner">
      <div>
        <h1>
          {{ t('help.title') }}
          <span v-if="version" class="version-badge">v{{ version }}</span>
        </h1>
        <p>{{ t('help.subtitle') }}</p>
      </div>
      <div class="header-actions">
        <RippleButton class="icon-btn primary" variant="primary" :title="t('help.openSettings')" @click="openSettings">
          <Settings2 :size="16" :stroke-width="2" />
        </RippleButton>
        <RippleButton class="icon-btn" :title="t('help.github')" @click="openRepo">
          <ExternalLink :size="16" :stroke-width="2" />
        </RippleButton>
      </div>
    </div>
  </header>
  <main class="help-shell" v-html="t('help.body')" />
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { ExternalLink, Settings2 } from 'lucide-vue-next'
  import RippleButton from '@/ui/components/RippleButton.vue'
  import { getReadmeUrl } from '@/utils/constants'

  const { t, locale } = useI18n()

  const version = ref('')

  const openSettings = () => {
    const settingsPage = chrome.runtime.getManifest().options_ui?.page
    chrome.tabs.create({ url: chrome.runtime.getURL(settingsPage || 'src/ui/settings/index.html') })
  }

  const openRepo = () => {
    chrome.tabs.create({ url: getReadmeUrl(locale.value) })
  }

  onMounted(() => {
    version.value = chrome.runtime.getManifest?.()?.version || ''
  })
</script>

<style lang="scss">
  body {
    font-size: 15px;
    line-height: 1.65;
    padding-top: 132px;
  }
</style>

<style lang="scss">
  .help-shell {
    margin: 0 auto;
    max-width: 720px;
    padding: 24px 24px 80px;
  }

  // header：fixed 顶部，背景毛玻璃，内容靠 inner 居中
  .help-header {
    backdrop-filter: saturate(180%) blur(8px);
    background: var(--panel-translucent);
    border-bottom: 1px solid var(--line);
    left: 0;
    margin: 0;
    padding: 0;
    position: fixed;
    right: 0;
    top: 0;
    z-index: 30;

    > div:first-child > p {
      color: var(--muted);
      font-size: 14px;
      line-height: 1.6;
      max-width: 60ch;
    }
  }

  .help-header-inner {
    align-items: flex-start;
    display: flex;
    gap: 24px;
    justify-content: space-between;
    margin: 0 auto;
    max-width: 720px;
    padding: 16px 24px;
  }

  .header-actions {
    display: flex;
    flex-shrink: 0;
    flex-wrap: wrap;
    gap: 6px;

    .icon-btn {
      height: 32px;
      justify-content: center;
      padding: 0;
      width: 32px;
    }

    button {
      align-items: center;
      background: transparent;
      border: 0;
      border-radius: 6px;
      color: var(--muted);
      cursor: pointer;
      display: inline-flex;
      font-size: 13px;
      gap: 6px;
      padding: 6px 12px;
      transition:
        background 0.15s ease,
        color 0.15s ease;

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

  .help-header,
  .help-shell {
    h1,
    h2,
    h3,
    p {
      margin: 0;
    }
  }

  .help-header h1,
  .help-shell h1 {
    align-items: baseline;
    display: flex;
    flex-wrap: wrap;
    font-size: 24px;
    font-weight: 600;
    gap: 10px;
    letter-spacing: -0.01em;
    line-height: 1.2;
    margin-bottom: 8px;
  }

  .help-header h2,
  .help-shell h2 {
    color: var(--text);
    font-size: 16px;
    font-weight: 600;
    letter-spacing: -0.005em;
    margin-bottom: 12px;
  }

  .help-header h3,
  .help-shell h3 {
    color: var(--text);
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 4px;
  }

  .help-header p + p,
  .help-shell p + p {
    margin-top: 8px;
  }

  .version-badge {
    color: var(--muted);
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.02em;
  }

  .plain-list,
  .steps {
    color: var(--muted);
    padding-left: 20px;

    li {
      margin: 6px 0;
    }
  }

  // panel：去 box-shadow + border + 圆角，仅靠间距 + 标题层级划分（长篇阅读）
  .panel {
    margin-bottom: 36px;

    p {
      color: var(--muted);
      line-height: 1.65;
    }
  }

  // field-grid：去单 box 边框，hairline 列分隔
  .field-grid {
    display: grid;
    gap: 4px 32px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    margin-top: 12px;

    &.compact {
      grid-template-columns: repeat(3, minmax(0, 1fr));

      > div:nth-child(-n + 3) {
        border-top: 0;
      }
    }

    > div {
      padding: 12px 0;

      + div {
        border-top: 1px solid var(--line);
      }

      &:nth-child(1),
      &:nth-child(2) {
        border-top: 0;
      }

      p {
        color: var(--muted);
        font-size: 13px;
        line-height: 1.55;
        margin-top: 4px;
      }
    }
  }

  .help-shell {
    code {
      background: var(--code-inline-bg);
      border-radius: 4px;
      color: var(--code-inline-text);
      font-family: ui-monospace, SFMono-Regular, Consolas, 'Liberation Mono', monospace;
      font-size: 0.88em;
      padding: 1px 5px;
    }

    dl {
      display: grid;
      grid-template-columns: 120px minmax(0, 1fr);
      margin: 0;
    }

    dt,
    dd {
      border-bottom: 1px solid var(--line);
      font-size: 13px;
      margin: 0;
      padding: 8px 12px;
    }

    dt {
      color: var(--muted);
      font-weight: 500;
      letter-spacing: 0.01em;
    }

    dd:last-child,
    dt:nth-last-child(2) {
      border-bottom: 0;
    }

    pre {
      background: var(--code-bg);
      border-radius: 6px;
      color: var(--code-text);
      font-family: ui-monospace, SFMono-Regular, Consolas, 'Liberation Mono', monospace;
      font-size: 12px;
      line-height: 1.55;
      margin: 0;
      overflow: auto;
      padding: 10px 12px;
      white-space: pre-wrap;
      word-break: break-word;
    }
  }

  @media (max-width: 760px) {
    .help-shell {
      padding: 16px 16px 48px;
    }

    .help-header-inner {
      flex-direction: column;
      padding: 12px 16px;
    }

    .field-grid,
    .field-grid.compact,
    dl {
      grid-template-columns: 1fr;
    }

    .field-grid > div {
      border-top: 1px solid var(--line);

      &:first-child {
        border-top: 0;
      }
    }

    dt {
      border-bottom: 0;
      padding-bottom: 4px;
    }
  }
</style>
