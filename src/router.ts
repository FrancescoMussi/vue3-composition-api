import {
  createRouter,
  createWebHistory
} from 'vue-router'

import Home from './components/Home.vue'
import NewPost from './components/NewPost.vue'
import ShowPost from './components/ShowPost.vue'
import EditPost from './components/EditPost.vue'
import { Store } from './store'

// in this way we can access the store inside the router - otherwise we cannot use useStore outside of setup()
export function routerWithStore(store: Store) {
  const router = createRouter({
    // history: createWebHistory(),
    history: createWebHistory(process.env.NODE_ENV === 'production' ? '/vue3-composition-api' : undefined),
    routes: [
      {
        path: '/',
        component: Home
      },
      {
        path: '/posts/new',
        component: NewPost,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/posts/:id',
        component: ShowPost,
      },
      {
        path: '/posts/:id/edit',
        component: EditPost,
        meta: {
          requiresAuth: true
        }
      }
    ]
  })

  router.beforeEach((to, from, next) => {
    // console.log({to})
    // console.log({from})
    // const store = useStore() // cannot do it
    const auth = store.getState().authors.currentUserId
    if (!to.meta.requiresAuth) {
      next()
      return
    }
    if (to.meta.requiresAuth && auth) {
      next()
    } else {
      next({
        path: '/'
      })
    }
  })

  return router
}