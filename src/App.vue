<template>

  <div class="modal" :style="style">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div id="modal">

      </div>
    </div>
    <button class="modal-close is-large" @click="closeModal">Close</button>
  </div>


  <section class="section">
    <div class="container">
      <Navbar />
      <router-view />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import Navbar from './components/Navbar.vue'
import FormInput from './components/FormInput.vue'
import { useModal } from './useModal'

export default defineComponent({
  name: 'App',
  components: {Navbar, FormInput},
  setup() {
    const modal = useModal()
    const style = computed(() => {
      return {
        display: modal.show.value ? 'block' : 'none'
      }
    })

    const closeModal = () => {
      modal.hideModal()
    }
    
    return {
      style,
      closeModal,
    }
  }
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
