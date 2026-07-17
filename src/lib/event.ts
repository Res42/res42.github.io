export function preventDefaults(e: Event) {
  e.preventDefault()
  e.stopPropagation()
}
