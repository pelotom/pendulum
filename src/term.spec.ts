import { v, a, l, show } from './term'

const id = l('x', v('x'))

describe('show', () => {
  it('id', () => {
    expect(show(id)).toBe('λx.x')
  })
  it('id id', () => {
    expect(show(a(id, id))).toBe('(λx.x)(λx.x)')
  })
})

