<template>
  <PostWriter :post="newPost" @save="save" />
</template>

<script lang="ts">
import { Post } from '../mocks';
import { defineComponent } from 'vue';
import PostWriter from './PostWriter.vue'
import moment from 'moment';
import { useStore } from '../store';
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'App',
  components: { PostWriter },
  setup() {
    const store = useStore()
    const router = useRouter()

    const authorId = store.getState().authors.currentUserId

    if (!authorId) {
      throw Error('currentUsedIs was not found')
    }

    const newPost: Post = {
      id: '-1',
      title: 'Enter your title...',
      created: moment(),
      authorId
    }

    const save = async (post: Post) => {
      // we wait for the post to be created
      await store.createPost(post)
      router.push('/')
    }

    return {
      newPost,
      save
    }
  }
});
</script>