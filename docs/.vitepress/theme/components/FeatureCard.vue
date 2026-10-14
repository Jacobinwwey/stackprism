<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  icon: Component
  title: string
  detail: string
  eyebrow: string
}>()
</script>

<template>
  <article class="sp-feature-card">
    <div class="sp-feature-icon"><component :is="icon" :size="21" :stroke-width="1.8" /></div>
    <div class="sp-feature-copy">
      <span class="sp-eyebrow">{{ eyebrow }}</span>
      <h3>{{ title }}</h3>
      <p>{{ detail }}</p>
    </div>
    <span class="sp-feature-arrow" aria-hidden="true">↗</span>
  </article>
</template>

