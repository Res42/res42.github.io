<script setup lang="ts">
import { cn } from '@/lib/utils'
import { type AnchorHTMLAttributes, type HTMLAttributes } from 'vue'
import { buttonVariants } from '../ui/button'

const props = defineProps<{
  class?: HTMLAttributes['class']
  href?: AnchorHTMLAttributes['href']
  openInNewTab?: boolean
  variant?: 'default' | 'button'
}>()
</script>

<template>
  <a
    :class="
      cn(props.variant === 'button' ? buttonVariants({ variant: 'link' }) : undefined, props.class)
    "
    :href="props.href"
    :target="openInNewTab ? '_blank' : undefined"
    :rel="openInNewTab ? 'noopener noreferrer' : undefined"
  >
    <slot />
  </a>
</template>
