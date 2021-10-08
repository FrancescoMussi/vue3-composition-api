<template>
  <suspense>
    <template #default>
      <PostViewer />
    </template>

    <template #fallback>
      <Spinner />
    </template>
  </suspense>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PostViewer from './PostViewer.vue';
import Spinner from './Spinner.vue';

export default defineComponent({
  components: {
    PostViewer,
    Spinner
  }
});
</script>
