import { reactive, readonly, provide, inject, App } from "vue"
import { Post, today, thisWeek, thisMonth } from './mocks'
import axios from 'axios'

// ref => can be used for primitive: 'asd' 1 boolean
// reactive => works really well with objects 


export const storeKey = Symbol('store') // a constant used to inject and provide the store. (It's a symbol instead of plain string just to be a bit more fancy)

export interface User {
  id: string
  username: string
  password: string
}

// Author represent the users saved in the store (without password)
export type Author = Omit<User, 'password'>

// It takes a generic parameter, which we forward to the Map
interface BaseState<T> {
  ids: string[] // ['1', '2', '3', ..] --> all the ids
  all: Map<string, T> // (o(1)
  loaded: boolean
}

type PostsState = BaseState<Post>
interface AuthorState extends BaseState<Author> {
  currentUserId: string | undefined
}

export interface State {
  // test: string,
  posts: PostsState,
  authors: AuthorState
}

// posts.get(1) => {}
// store.state.posts.ids
// store.state.posts.all[1]

export class Store {
  private state: State

  constructor(intial: State) {
    this.state = reactive(intial) // in this way Vue is going to make this objet reactive
  }

  // in this way I can use the store as a plugin and install by doing app.use(store)
  install(app: App) {
    app.provide(storeKey, this)
  }

  getState() {
    return readonly(this.state) // it can only be read, it cannot be modified
  }

  // updateTest(test: string) {
  //   this.state.test = test
  // }

  async createPost(post: Post) {
    const response = await axios.post<Post>('/posts', post)
    // console.log('createPosts response: ', response)
    const postId = response.data.id
    this.state.posts.all.set(postId, response.data)
    this.state.posts.ids.push(postId)
  }

  async updatePost(post: Post) {
    const response = await axios.put<Post>('/posts', post)
    this.state.posts.all.set(response.data.id, response.data)
  }

  async fetchPosts() {
    // console.warn('fetchPosts')
    const response = await axios.get<Post[]>('/posts') // I am expecting the server to return an array of posts

    // we create a new variable, not reactive, to load all the data. We will not trigger reactivity. If it would be reactive it would be slower
    const postsState: PostsState = {
      ids: [],
      all: new Map(),
      loaded: true
    }

    for (const post of response.data) {
      postsState.ids.push(post.id)
      postsState.all.set(post.id, post)
    }

    this.state.posts = postsState
  }

  async createUser(user: User) {
    const response = await axios.post<Author>('/users', user)
    this.state.authors.all.set(response.data.id, response.data)
    this.state.authors.ids.push(response.data.id)
    this.state.authors.currentUserId = response.data.id
    console.log(this.state.authors)
  }
}

const all = new Map<string, Post>()

export const store = new Store({
  // test: 'test',
  authors:{
    all: new Map<string, Author>(), // it's going to map string to Author type
    ids: [],
    loaded: false,
    currentUserId: undefined
  },
  posts: {
    all: all,
    ids: [],
    loaded: false
  }
})

// a reusable function to make it very easy to access the store in the components
// In this way we can provide a clean fresh store to our tests, so they can run in isolation
// Otherwise all tests would be using the same instance of the store, and they would affect each other
export function useStore(): Store {
  const _store = inject<Store>(storeKey)
  if (!_store) {
    throw new Error('Did you forgot to call provide?')
  }
  return _store
}

// store.getState().test
// store.updateTest('asdasd')
// store.getState().posts.ids