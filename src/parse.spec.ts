import * as P from 'parsimmon'
import { v, eq, show, Term, l, a } from './term'
import { termParser } from './parse'

describe('var', () => {
  it('allows single alpha chars', () => {
    expectGood('x', v('x'))
  })
  it('allows multiple alpha chars', () => {
    expectGood('xlksajfk', v('xlksajfk'))
  })
  it('does not allow spaces', () => {
    expectBad('kfj ksd')
  })
  it('does not allow numeric characters at the beginning', () => {
    expectBad('9kfj')
  })
  it('does allow numeric characters after the first', () => {
    expectGood('js9', v('js9'))
  })
  it('does not allow empty strings', () => {
    expectBad('')
  })
  it('allows parentheses surrounding it', () => {
    expectGood('((x))', v('x'))
  })
})

describe('lam', () => {
  it('identity', () => {
    expectGood('x => x', l('x', v('x')))
  })
  it('allows spaces', () => {
    expectGood('x=> x', l('x', v('x')))
    expectGood('x =>x', l('x', v('x')))
  })
})

describe('app', () => {
  it('basic', () => {
    expectGood('x(x)', a(v('x'), v('x')))
  })
  it('with spaces', () => {
    expectGood('x (x)', a(v('x'), v('x')))
    expectGood('x( x)', a(v('x'), v('x')))
    expectGood('x(x ) ', a(v('x'), v('x')))
    expectGood('x( x ) ', a(v('x'), v('x')))
    expectGood('x ( x ) ', a(v('x'), v('x')))
  })
})

;(expect as any).extend({
  toBeTerm(received: Term, actual: Term) {
    const pass = eq(received, actual)
    return {
      pass,
      message() {
        return `expected ${show(received)} ${pass ? 'not ' : ''}to be ${show(actual)}`
      }
    }
  }
})

function expectVar(s: string): void {
  expectGood(s, v(s))
}

function expectGood(s: string, expectedTerm?: Term): void {
  const term = termParser.tryParse(s)
  if (expectedTerm)
    (expect as any)(term).toBeTerm(expectedTerm)
}

function expectBad(s: string): void {
  expect(termParser.parse(s).status).toBe(false)
}
