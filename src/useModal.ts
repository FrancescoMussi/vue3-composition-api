import { ref } from 'vue'

const show = ref(false)
const component = ref()

export function useModal() {
  return {
    show,
    showModal: () => show.value = true,
    hideModal: () => show.value = false,
    component
  }
}