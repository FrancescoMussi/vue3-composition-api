import { mount, flushPromises } from '@vue/test-utils'
import { Store } from '@/store'
import ShowPost from '@/components/ShowPost.vue'
import { today } from '../../src/mocks'
import { routerWithStore } from '../../src/router' // In this test we are using the real router

describe('Show Post', () => {
  it('Does not show Edit button when user not authenticated', async () => {
    const store = new Store({
      posts: {
        ids: [today.id],
        all: new Map([[today.id, today]]),
        loaded: true
      },
      authors: {
        ids: [],
        all: new Map(),
        loaded: true,
        currentUserId: undefined
      }
    })

    const router = routerWithStore(store)
    router.push(`/posts/${today.id}`)

    // we have to await the routing, before we continue with the test
    await router.isReady()

    const wrapper = mount(ShowPost, {
      global: {
        plugins: [store, router]
      }
    })

    await flushPromises() // otherwise we would have the ShowPost suspense fallback, instead of the content

    expect(wrapper.find('[data-test="can-edit"]').exists()).toBe(false)
  })

  it('Does not show Edit button when user not authorized', async () => {
    const store = new Store({
      posts: {
        ids: [today.id],
        all: new Map([[today.id, today]]),
        loaded: true
      },
      authors: {
        ids: ['100000'],
        all: new Map([['100000', {
          id: '100000',
          username: 'username'
        }]]),
        loaded: true,
        currentUserId: undefined
      }
    })

    const router = routerWithStore(store)
    router.push(`/posts/${today.id}`)

    // we have to await the routing, before we continue with the test
    await router.isReady()

    const wrapper = mount(ShowPost, {
      global: {
        plugins: [store, router]
      }
    })

    await flushPromises() // otherwise we would have the ShowPost suspense fallback, instead of the content

    expect(wrapper.find('[data-test="can-edit"]').exists()).toBe(false)
  })

  it('Show Edit button when user not authenticated', async () => {
    const store = new Store({
      posts: {
        ids: [today.id],
        all: new Map([[today.id, today]]),
        loaded: true
      },
      authors: {
        ids: ['1'],
        all: new Map([['1', {
          id: '1',
          username: 'username'
        }]]),
        loaded: true,
        currentUserId: '1'
      }
    })

    const router = routerWithStore(store)
    router.push(`/posts/${today.id}`)

    // we have to await the routing, before we continue with the test
    await router.isReady()

    const wrapper = mount(ShowPost, {
      global: {
        plugins: [store, router]
      }
    })

    await flushPromises() // otherwise we would have the ShowPost suspense fallback, instead of the content

    expect(wrapper.find('[data-test="can-edit"]').exists()).toBe(true)
  })
})