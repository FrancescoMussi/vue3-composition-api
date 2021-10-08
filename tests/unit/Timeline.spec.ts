import { nextTick } from 'vue'
import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils'
import Timeline from '../../src/components/Timeline.vue'
import { today, thisWeek, thisMonth } from '../../src/mocks'
import { Store } from '@/store'

// you can pass any node modules, for example axios, and provide any custom implementation.
jest.mock('axios', () => ({
  get: (url: string) => {
    return Promise.resolve({
      data: [today, thisWeek, thisMonth]
    })
  }
}))

// Timeline component use async setup. Therefore it has to be wrapped inside a <suspense>
// If we wanted to pass different state to our state, we could pass it to mountTimeline and pass it to the store
function mountTimeline() {
  const store = new Store({
    posts: {
      ids: [],
      all: new Map(),
      loaded: false
    },
    authors: {
      ids: [],
      all: new Map(),
      loaded: false,
      currentUserId: undefined
    }
  })
  const comp = {
    components: { Timeline },
    template: `
      <suspense>
        <template #default>
          <Timeline />
        </template>
        <template #fallback>
          Loading...
        </template>
      </suspense>
    `
  }
  return mount(comp, {
    global: { // all global options, including installing plugins and providing data
      components: {
        RouterLink: RouterLinkStub
      },
      plugins: [store]
    }
  })
}

describe('Timeline component', () => {
  it('render today post default', async () => {
    const wrapper = mountTimeline()

    // nextTick is used for Vue internal promises
    // flushPromises is going to resolve any external promises, for example axios
    await flushPromises()

    // console.log(wrapper.html())
    expect(wrapper.html()).toContain(today.created.format('Do MMM'))
  })

  it('updates when the period is clicked', async () => {
    const wrapper = mountTimeline()
    await flushPromises()

    // console.log(wrapper.get('[data-test="This Week"]')) // wrapperElement: HTMLAnchorElement { _vei: { onClick: [Function] } }

    // trigger return nextTick by default, so we can use await
    await wrapper.get('[data-test="This Week"]').trigger('click')

    // Wait for the next frame
    // nextTick is the same as calling requestAnimationFrame - it tells Vue to udpate - we make sure everything is been updated
    // we are going to wait for the next render before making our assertion
    // await nextTick()

    expect(wrapper.html()).toContain(today.created.format('Do MMM'))
    expect(wrapper.html()).toContain(thisWeek.created.format('Do MMM'))
  })

  it('updates when the period is clicked', async () => {
    const wrapper = mountTimeline()
    await flushPromises()
    await wrapper.get('[data-test="This Month"]').trigger('click')

    expect(wrapper.html()).toContain(today.created.format('Do MMM'))
    expect(wrapper.html()).toContain(thisWeek.created.format('Do MMM'))
    expect(wrapper.html()).toContain(thisMonth.created.format('Do MMM'))
  })
})