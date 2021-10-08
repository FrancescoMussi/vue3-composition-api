import { mount, flushPromises } from '@vue/test-utils'
import { wrap } from 'lodash'
import PostWriter from '../../src/components/PostWriter.vue'

// We test the component is emitting the save event, making sure all the attributes are set correctly
describe('PostWriter component', () => {
  it('emits a save event with the new post', async (done) => { // we pass the done callback to be sure the test does not finish running until done callback has been called
    const wrapper = mount(PostWriter, {
      props: {
        post: {
          title: 'New Title from suite'
        }
      }
    })

    await wrapper.find('[data-test="title"]').setValue('My new title') // find the input and set the value of its v-model

    // we cannot use setValue on the content, because it doesn't have v-model. We are going to set its innerText and trigger the input event to use the handleInput function
    const $content = wrapper.find<HTMLDivElement>('[data-test="content"]')
    $content.element.innerText = '## New content'
    await $content.trigger('input') // usually better to use await, to be sure we wait for reactivity

    // waiting 300ms for debounce
    setTimeout(async () => {
      await wrapper.find('[data-test="submit"]').trigger('click')

      const emitted = (wrapper.emitted()['save'] as any)[0][0]
      // console.log(emitted)

      expect(emitted.title).toBe('My new title')
      expect(emitted.markdown).toBe('## New content')
      expect(emitted.html).toBe('<h2 id="new-content">New content</h2>\n')
      done()
    }, 300);
  })
})