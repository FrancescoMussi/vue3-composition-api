import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import { today, thisWeek, thisMonth, Post } from './mocks'
import { routerWithStore } from './router'
import random from 'lodash/random'
import 'highlight.js/styles/atom-one-dark.css' // SYNTAX HIGHLIGHTING
import { store, storeKey, User, Author } from './store'

// artifically slow down fetching of data
function delay() {
  // we return a new promise, and we force it to wait 2sec before it has resolved
  return new Promise(res => {
    setTimeout(res, 2000)
  })
}

// we override the axios methods
// @ts-ignore
axios.get = async (url: string) => {
  // console.warn('axios url: ', url)
  if (url === '/posts') {
    await delay() // wait 2 secs
    return Promise.resolve({ // return a promise, similarly to axios
      data: [today, thisWeek, thisMonth]
    })
  }
}

// @ts-ignore
axios.post = async (url: string, payload: any) => {
  if (url === '/posts') {
    const id = random(100, 10000)
    await delay() // wait 2 secs
    const post: Post = {
      id: id.toString(),
      title: payload.title,
      created: payload.created,
      authorId: payload.authorId,
      ...payload
    }
    return Promise.resolve<{data: Post}>({ // return a promise, similarly to axios
      data: post
    })
  }
  if (url === '/users') {
    const id = random(100, 10000)
    await delay() // wait 2 secs
    const author: Author = {
      id: id.toString(),
      username: payload.username
    }
    return Promise.resolve({ // return a promise, similarly to axios
      data: author
    })
  }
}

// @ts-ignore
axios.put = async (url: string, payload: any) => {
  if (url === '/posts') {
    await delay() // wait 2 secs
    const post: Post = {
      title: payload.title,
      created: payload.created,
      authorId: payload.authorId,
      ...payload
    }
    return Promise.resolve<{data: Post}>({ // return a promise, similarly to axios
      data: post
    })
  }
}

const app = createApp(App)
const router = routerWithStore(store)
// here you can install plugins
app.use(router)
// app.provide(storeKey, store)
app.use(store)

app.mount('#app')