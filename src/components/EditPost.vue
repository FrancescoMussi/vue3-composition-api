<template>
  <suspense>
    <template #default>
      <PostEditor />
    </template>

    <template #fallback>
      <Spinner />
    </template>
  </suspense>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PostEditor from './PostEditor.vue';
import Spinner from './Spinner.vue';

export default defineComponent({
  components: {
    PostEditor,
    Spinner
  }
});
</script>
