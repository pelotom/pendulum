import * as P from 'parsimmon'
import { v, eq, show, Term, l, a } from './term'

const termParser: P.Parser<Term> = P.lazy(() => {

  const varNameParser = P.regexp(/[a-zA-Z][a-zA-Z0-9]*/).desc('variable name')
  const varParser = varNameParser.map(v)

  const lamParser = P.oneOf('\\λ')
    .desc('lambda expression')
    .then(P.seqMap(
      varNameParser
        .skip(P.optWhitespace)
        .skip(P.string('.'))
        .skip(P.optWhitespace)
        ,
      termParser,
      (name, term) => l(name, term)
    ))

  const parenthesized = P.string('(')
    .then(termParser)
    .skip(P.string(')'))
    .desc('parenthesized term')

  return P.optWhitespace.then(P.alt(
    varParser,
    lamParser,
    parenthesized,
  )).atLeast(1).map(handleTermList)
})

function handleTermList([term, ...terms]: Term[]): Term {
  if (terms.length === 0)
    return term
  const [term2, ...terms2] = terms
  return handleTermList([a(term, term2), ...terms2])
}

describe('var', () => {
  it('allows single alpha chars', () => {
    expectGood('x', v('x'))
  })
  it('allows multiple alpha chars', () => {
    expectGood('xlksajfk', v('xlksajfk'))
  })
  it('does not allow spaces', () => {
    expectGood('kfj ksd', a(v('kfj'), v('ksd')))
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
  it('parses with double backslash', () => {
    expectGood('\\x.x', l('x', v('x')))
  })
  it('parses with λ', () => {
    expectGood('λx.x', l('x', v('x')))
  })
  it('allows spaces', () => {
    expectGood('λx. x', l('x', v('x')))
    expectGood('λx .x', l('x', v('x')))
  })
})

describe('app', () => {
  it('parses', () => {
    expectGood('x x', a(v('x'), v('x')))
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
