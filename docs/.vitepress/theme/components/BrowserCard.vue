<script setup lang="ts">
defineProps<{
  name: string
  tone: 'chrome' | 'edge' | 'firefox'
}>()

const ICON_URLS = {
  chrome: 'https://www.google.com/chrome/static/images/favicons/favicon-32x32.png',
  edge: 'https://edgecdn-embza6g8cacagcbn.z01.azurefd.net/welcome/static/favicon.png',
  firefox: 'https://www.firefox.com/media/img/favicons/firefox/browser/favicon-196x196.59e3822720be.png'
} as const
</script>

<template>
  <div class="sp-browser-card">
    <img class="sp-browser-mark" :src="ICON_URLS[tone]" :alt="`${name} browser`" />
    <span>{{ name }}</span>
  </div>
</template>

