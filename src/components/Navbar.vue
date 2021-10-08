<template>
  <div class="navbar">
    <div class="navbar-end">
      <div class="buttons" v-if="auth">
        <router-link class="button" to="/posts/new">New Post</router-link>
        <button class="button" @click="signOut">Sign out</button>
      </div>

      <div class="buttons" v-else>
        <button class="button" @click="signUp" data-test="sign-up">Sign up</button>
        <button class="button" @click="signIn">Sign in</button>
      </div>
    </div>
  </div>
  <teleport to="#modal">
    <component :is="component" />
  </teleport>
</template>

<script lang="ts">
import { defineComponent, computed, h, markRaw } from 'vue';
import { useModal } from '../useModal'
import { useStore } from '../store'
import Signup from './Signup.vue'

export default defineComponent({
  name: 'Navbar',
  components: {
    Signup
  },
  setup() {
    const modal = useModal()
    const store = useStore()

    const auth = computed(() => {
      return !!store.getState().authors.currentUserId
    })

    const signUp = () => {
      modal.component.value = markRaw(Signup)
      modal.showModal()
    }
    const signIn = () => {
      const Demo = defineComponent({
        setup() {
          return () => h('div', 'Demo')
        }
      })
      modal.component.value = markRaw(Demo)
      modal.showModal()
    }
    const signOut = () => {
      
    }

    
    return {
      signUp,
      signIn,
      signOut,
      auth,
      component: modal.component
    }
  }
});
</script>