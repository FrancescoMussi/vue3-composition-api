<template>
  <div class="columns">
    <div class="column">
      <div class="field">
        <div class="label">New Post</div>
        <input 
          type="text" 
          class="input" 
          v-model="title"
          data-test="title"
        >
      </div>
    </div>
  </div>
  <div class="columns">
    <div class="column">
      <div 
        contenteditable 
        ref="contentEditable" 
        @input="handleInput"
        data-test="content"
      >
      </div>
    </div>
    <div class="column">
      <div v-html="html"></div>
    </div>
  </div>
  <div class="columns">
    <div class="column">
      <button 
        @click="save" 
        class="button is-primary is-pulled-right"
        data-test="submit"
      >
        Submit
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Post } from '../mocks';
import { defineComponent, ref, onMounted, watch, watchEffect } from 'vue';
import { parse } from 'marked' // take a string and transform it into html
import highlight from 'highlight.js'
import debounce from 'lodash/debounce'

export default defineComponent({
  name: 'PostWriter',
  props: {
    post: {
      type: Object as () => Post,
      required: true,
      
    }
  },
  emits: {
    save: (post: Post) => {
      // validation
      return true
    }
  },
  setup(props, ctx) {
    const title = ref(props.post.title)
    // const markdown = ref('## Title\nEnter your post content...')
    const markdown = ref(props.post.markdown || '')
    const html = ref('')
    const contentEditable = ref<HTMLDivElement | null>(null)

    // console.log(html.value) // <h2 id="title">Title</h2> <p>Enter your post content...</p>
    // console.log(contentEditable.value) // null

    // using debounce, is going to update when the user stop to type for 250ms
    const parseHtml = debounce((str: string) => {
      html.value = parse(str, {
        gfm: true,
        breaks: true,
        highlight: (code: string) => {
          return highlight.highlightAuto(code).value
        }
      }) 
    }, 250)

    // watch(markdown, (newValue) => {
    //    parseHtml(newValue)
    // }, {immediate: true}) 

    watchEffect(() => {
      parseHtml(markdown.value)
    })

    const handleInput = () => {
      markdown.value = contentEditable.value?.innerText || ''
    }

    onMounted(() => {
      if (!contentEditable.value) {
        throw Error('This shoul never happen')
      }

      contentEditable.value.innerText = markdown.value
      // console.log(contentEditable.value) // <div contenteditable></div>
    })

    const save = () => {
      const newPost: Post = {
        ...props.post,
        title: title.value,
        html: html.value,
        markdown: markdown.value
      }

      ctx.emit('save', newPost)
    }

    return {
      title,
      markdown,
      html,
      contentEditable,
      handleInput,
      save
    }
  }
});
</script>

<style>
.column {
  overflow-y: scroll;
}
</style>