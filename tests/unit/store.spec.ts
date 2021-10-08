import { today, Post } from '../../src/mocks'
import { Store, State } from "@/store";

const mockPost: Post = {
  ...today
}

jest.mock('axios', () => ({
  get: () => {
    return {
      data: [mockPost]
    }
  }
}))

describe('store/fetch posts', () => {
  it('fetches posts and update state', async () => {
    const store = new Store({
      posts: {
        ids: [],
        all: new Map(),
        loaded: false,
      },
      authors: {
        ids: [],
        all: new Map(),
        loaded: false,
        currentUserId: undefined
      }
    })

    await store.fetchPosts() // fetchPosts has an async function. We must wait for it.

    const expected: State = {
      posts: {
        ids: ['1'],
        all: new Map([['1', mockPost]]),
        loaded: true,
      },
      authors: {
        ids: [],
        all: new Map(),
        loaded: false,
        currentUserId: undefined
      }
    }

    expect(expected).toEqual(store.getState())
  })
})