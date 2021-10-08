import { mount } from "@vue/test-utils";
import Navbar from '@/components/Navbar.vue'
import Signup from '@/components/Signup.vue'
import { Store } from "@/store";

describe('Navbar', () => {
  it('shows a signup modal via teleport', async () => {
    const store = new Store({
      posts: {
        all: new Map(),
        ids: [],
        loaded: false
      },
      authors: {
        ids: [],
        all: new Map(),
        loaded: false,
        currentUserId: undefined
      }
    })

    // we create a div with id of modal and put at the beginning of the body
    const el = document.createElement('div')
    el.id = 'modal'
    document.body.appendChild(el)

    // vue-test-utils doesn't mount the element in the actual DOM, it just creates an element in memory
    const wrapper = mount(Navbar, {
      attachTo: document.body, // for the purpose of this test, we are going to mount this in the DOM, alonside the modal component  
      global: {
        components: {
          RouterLink: {
            template: '<div></div>' // stubbing the router-link component to avoid warning
          }
        },
        plugins: [store]
      }
    })

    await wrapper.get('[data-test="sign-up"]').trigger('click')

    const form = wrapper.getComponent(Signup)
    // console.log(form) // VueWrapper
    // console.log(document.body.outerHTML) 
    expect(document.body.outerHTML).toContain('The value must be between 8 and 30')

    await form.find('#Username').setValue('Custom username')
    await form.find('#Password').setValue('password22')

    expect(document.body.outerHTML).not.toContain('The value must be between 8 and 30')

    await form.trigger('submit.prevent')

    
  })
})