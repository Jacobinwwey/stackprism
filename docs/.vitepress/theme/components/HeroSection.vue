<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ArrowRight, Check, Download, Github } from 'lucide-vue-next'
import PopupDemo from './PopupDemo.vue'
import BrowserCard from './BrowserCard.vue'

type StoreKey = 'chrome' | 'edge' | 'firefox'

defineProps<{
  eyebrow: string
  title: string
  highlight: string
  tagline: string
  primaryCta: string
  secondaryCta: string
  primaryLink: string
  secondaryLink: string
  browserLabel: string
  installMenuTitle: string
}>()

const stores: Record<StoreKey, { name: string; url: string }> = {
  chrome: {
    name: 'Chrome Web Store',
    url: 'https://chromewebstore.google.com/detail/stackprism/cagpdifljieeiajlhlcboelglkalofak'
  },
  edge: {
    name: 'Edge Add-ons',
    url: 'https://microsoftedge.microsoft.com/addons/detail/stackprism/ojgmhlogaoiegdonnlnibeoikbleccno'
  },
  firefox: {
    name: 'Firefox Add-ons',
    url: 'https://addons.mozilla.org/firefox/addon/stackprism/'
  }
}

const detectedBrowser = ref<StoreKey | null>(null)
const installMenuOpen = ref(false)
const activePreview = ref<'light' | 'dark'>('light')
const detectedStore = computed(() => (detectedBrowser.value ? stores[detectedBrowser.value] : null))

onMounted(() => {
  const ua = navigator.userAgent
  if (/Edg\//.test(ua)) detectedBrowser.value = 'edge'
  else if (/Firefox\//.test(ua)) detectedBrowser.value = 'firefox'
  else if (/Chrome\//.test(ua) && !/Edg\//.test(ua) && !/OPR\//.test(ua) && !/Brave\//i.test(ua) && !/Vivaldi\//.test(ua)) detectedBrowser.value = 'chrome'
})

const handleInstallClick = (event: MouseEvent) => {
  if (detectedStore.value) return
  event.preventDefault()
  installMenuOpen.value = !installMenuOpen.value
}

const closeInstallMenu = () => {
  installMenuOpen.value = false
}
</script>

<template>
  <section class="sp-hero-section">
    <div class="sp-hero-copy">
      <div class="sp-hero-eyebrow"><span class="sp-status-dot"></span>{{ eyebrow }}</div>
      <h1>{{ title }} <span>{{ highlight }}</span></h1>
      <p class="sp-hero-tagline">{{ tagline }}</p>
      <div class="sp-hero-actions">
        <div class="sp-install-wrap">
          <a class="sp-button sp-button-primary" :href="detectedStore?.url || primaryLink" :aria-expanded="!detectedStore && installMenuOpen" @click="handleInstallClick"><Download :size="16" />{{ primaryCta }}<ArrowRight :size="16" /></a>
          <div v-if="installMenuOpen && !detectedStore" class="sp-install-menu" role="menu">
            <div class="sp-install-menu-title">{{ installMenuTitle }}</div>
            <a v-for="store in Object.values(stores)" :key="store.url" :href="store.url" role="menuitem" @click="closeInstallMenu">{{ store.name }}</a>
          </div>
        </div>
        <a class="sp-button sp-button-ghost" :href="secondaryLink"><Github :size="16" />{{ secondaryCta }}</a>
      </div>
      <div class="sp-hero-proof"><span><Check :size="14" /> Manifest V3</span><span><Check :size="14" /> Local-first detection</span></div>
      <div class="sp-browser-row">
        <span class="sp-browser-label">{{ browserLabel }}</span>
        <BrowserCard name="Chrome" tone="chrome" />
        <BrowserCard name="Edge" tone="edge" />
        <BrowserCard name="Firefox" tone="firefox" />
      </div>
    </div>
    <div class="sp-hero-visual" aria-label="StackPrism detection popup preview">
      <div class="sp-visual-orbit orbit-one"></div>
      <div class="sp-visual-orbit orbit-two"></div>
      <div class="sp-visual-grid"></div>
      <PopupDemo
        :class-name="`sp-shot-back ${activePreview === 'dark' ? 'is-preview-active' : ''}`"
        dark
        @click.stop="activePreview = 'dark'"
      />
      <PopupDemo
        :class-name="`sp-shot-front ${activePreview === 'light' ? 'is-preview-active' : ''}`"
        @click.stop="activePreview = 'light'"
      />
    </div>
  </section>
</template>

