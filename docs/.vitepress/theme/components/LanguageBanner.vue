<script setup lang="ts">
import { Globe2 } from 'lucide-vue-next'

defineProps<{
  label: string
  languages: string[]
}>()
</script>

<template>
  <section class="sp-language-banner">
    <div class="sp-language-title"><span class="sp-language-icon"><Globe2 :size="21" /></span><strong>{{ label }}</strong></div>
    <div class="sp-language-list">
      <span v-for="language in languages" :key="language">{{ language }}</span>
    </div>
  </section>
</template>

