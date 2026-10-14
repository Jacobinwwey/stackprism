<script setup lang="ts">
  import { ref } from 'vue'
  import { useData } from 'vitepress'
  import Popup from '@/ui/popup/Popup.vue'
  import realResult from '../data/stackprism_github.com_2026-10-14T16-45-04-752.json'
  import '@/ui/tokens.css'

  const props = withDefaults(defineProps<{ dark?: boolean; className?: string }>(), { dark: false, className: '' })
  const { lang } = useData()
  const currentTheme = ref<'light' | 'dark'>(props.dark ? 'dark' : 'light')

  // This fixture is a real StackPrism export captured from github.com.
  const previewResult = realResult
  const rawResult = realResult

  const localeFromPath = () => {
    const segment = typeof window === 'undefined' ? '' : window.location.pathname.split('/').filter(Boolean)[0]
    return segment || lang.value || 'zh-CN'
  }

  const makeChromeMock = () => {
    const mock = {
      runtime: {
        getManifest: () => ({ version: '1.3.90', options_ui: { page: 'src/ui/settings/index.html' } }),
        getURL: (value: string) => `/${value}`,
        sendMessage: async (message: { type?: string }) => {
          if (message.type === 'GET_POPUP_RAW_RESULT') return { ok: true, data: rawResult }
          if (message.type === 'GET_POPUP_RESULT') return { ok: true, hasCache: true, stale: false, updatedAt: 1, data: previewResult }
          return { ok: true }
        }
      },
      tabs: {
        query: async () => [{ id: 1, url: previewResult.url, title: previewResult.title }],
        create: async () => undefined
      },
      storage: {
        sync: {
          get: async (key?: string) => {
            if (key === 'stackPrismLang') return { stackPrismLang: localeFromPath() }
            if (key === 'stackPrismTheme') return { stackPrismTheme: currentTheme.value }
            return {}
          },
          set: async () => undefined
        },
        session: { get: async () => ({}), set: async () => undefined, remove: async () => undefined },
        local: { get: async () => ({}), set: async () => undefined, remove: async () => undefined },
        onChanged: { addListener: () => undefined, removeListener: () => undefined }
      },
      scripting: { executeScript: async () => [{ result: { ok: true } }] },
      webNavigation: {},
      webRequest: {}
    }
    ;(globalThis as typeof globalThis & { chrome?: unknown }).chrome = mock
  }

  makeChromeMock()
</script>

<template>
    <div class="sp-shot sp-real-popup popup-host" :data-theme="currentTheme" :class="[{ 'is-dark': currentTheme === 'dark' }, props.className]">
    <ClientOnly>
      <Popup :initial-theme="currentTheme" isolated-theme @theme-change="currentTheme = $event" />
    </ClientOnly>
  </div>
</template>
