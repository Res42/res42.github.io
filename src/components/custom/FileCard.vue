<script setup lang="ts">
import { cn } from '@/lib/utils'
import { useDropZone } from '@vueuse/core'
import { ref, useTemplateRef, type HTMLAttributes, type InputHTMLAttributes } from 'vue'
import { Button } from '../ui/button'
import { Card, CardFooter } from '../ui/card'

const props = defineProps<{
  class?: HTMLAttributes['class']
  multiple?: InputHTMLAttributes['multiple']
  accept: string[]
}>()

const emit = defineEmits<{
  (e: 'files-changed', files: File[]): void
}>()

const dropZoneRef = useTemplateRef<HTMLElement>('dropZoneRef')
const fileInputRef = ref<HTMLInputElement | null>(null)

const handleFiles = (files: Event | FileList | File[] | null | undefined) => {
  if (files instanceof Event) {
    files = (files.target as HTMLInputElement | null)?.files
  }

  if (!files?.length) {
    return
  }

  emit('files-changed', Array.from(files))
}

const { isOverDropZone } = useDropZone(dropZoneRef, {
  onDrop: handleFiles,
  dataTypes: props.accept,
  multiple: !!props.multiple,
  preventDefaultForUnhandled: true,
})
</script>

<template>
  <Card
    ref="dropZoneRef"
    :class="cn(props.class, isOverDropZone ? 'outline-2 outline-dashed outline-primary' : '')"
  >
    <slot />
    <CardFooter>
      <input
        type="file"
        ref="fileInputRef"
        class="hidden"
        :accept="props.accept.join(',')"
        :multiple="props.multiple"
        @change="handleFiles"
      />

      <Button class="w-full" @click="fileInputRef?.click()">Húzd ide a fájlt</Button>
    </CardFooter>
  </Card>
</template>
