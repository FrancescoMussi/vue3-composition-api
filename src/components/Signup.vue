<template>
  <form @submit.prevent="submit">
    <FormInput 
      name="Username" 
      v-model="username" 
      type="text" 
      :error="usernameStatus.message" 
    />

    <FormInput 
      name="Password" 
      v-model="password" 
      type="password" 
      :error="passwordStatus.message" 
    />

    <button 
      class="button is-primary"
      :disabled="!usernameStatus.valid || !passwordStatus.valid"
    >
      Submit
    </button>
  </form>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import FormInput from './FormInput.vue'
import { required, length, Status, validate } from '../validation'
import { User, useStore } from '../store'
import { useModal } from '../useModal'

export default defineComponent({
  name: 'Signup',
  components: {FormInput},
  setup() {
    const username = ref('username')
    const usernameStatus = computed<Status>(() => {
      return validate(username.value, [required(), length({min: 5, max: 10})])
    })

    const password = ref('pw')
    const passwordStatus = computed<Status>(() => {
      return validate(password.value, [required(), length({min: 8, max: 30})])
    })

    const store = useStore()
    const modal = useModal()

    const submit = async (evt: Event) => {
      if (!usernameStatus.value.valid || !passwordStatus.value.valid) {
        return
      }

      const newUser: User = {
        id: '-1',
        username: username.value,
        password: password.value
      }

      await store.createUser(newUser)
      modal.hideModal()
    }

    return {
      username,
      usernameStatus,
      password,
      passwordStatus,
      submit,
    }
  }
});
</script>

<style scoped>
form {
  padding: 15px;
  background: white;
}
</style>
