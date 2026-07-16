<script setup lang="ts">
import { cn, preventDefaults } from '@/lib/utils'
import { ref, type HTMLAttributes, type InputHTMLAttributes } from 'vue'
import Button from '../ui/button/Button.vue'
import { Card, CardFooter } from '../ui/card'

const props = defineProps<{
  class?: HTMLAttributes['class']
  multiple?: InputHTMLAttributes['multiple']
  accept?: InputHTMLAttributes['accept']
}>()

const emit = defineEmits<{
  (e: 'files-changed', files: File[]): void
}>()

const isDragging = ref(false)
const uploadedFiles = ref<File[]>([])

const fileInputRef = ref<HTMLInputElement | null>(null)

const handleFiles = (files: FileList | null | undefined) => {
  if (!files?.length) {
    return
  }
  uploadedFiles.value = Array.from(files)
  emit('files-changed', uploadedFiles.value)
}

const onDragEnter = (e: DragEvent) => {
  preventDefaults(e)
  isDragging.value = true
}

const onDragOver = (e: DragEvent) => {
  preventDefaults(e)
  isDragging.value = true
}

const onDragLeave = (e: DragEvent) => {
  preventDefaults(e)
  isDragging.value = false
}

const onDrop = (e: DragEvent) => {
  preventDefaults(e)
  isDragging.value = false

  handleFiles(e.dataTransfer?.files)
}

const onFileSelected = (e: Event) => {
  const target = e.target as HTMLInputElement

  handleFiles(target.files)
}
</script>

<template>
  <Card
    @dragenter="onDragEnter"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
    :class="cn(props.class, isDragging ? 'border-indigo-500 border-dashed' : '')"
  >
    <slot />
    <CardFooter>
      <input
        type="file"
        ref="fileInputRef"
        class="hidden"
        :accept="props.accept"
        :multiple="props.multiple"
        @change="onFileSelected"
      />

      <Button class="w-full" @click="fileInputRef?.click()">Húzd ide a fájlt</Button>
    </CardFooter>
  </Card>
</template>
