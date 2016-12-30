import * as P from 'parsimmon'
import { v, eq, show, Term, l, a } from './term'

namespace tokens {
  export const lparen = token(P.string('('))
  export const rparen = token(P.string(')'))
  export const arrow = token(P.string('=>'))
  export const identifier = token(P.regexp(/[a-zA-Z][a-zA-Z0-9]*/).desc('variable name'))
}

export const termParser: P.Parser<Term> = P.lazy(() => {
  const varParser = tokens.identifier.map(v)

  const lamParser = P.seqMap(
    tokens.identifier.skip(tokens.arrow),
    termParser,
    (name, term) => l(name, term)
  )

  const nonAppParser = P.alt(
    lamParser,
    varParser,
    parenthesized(termParser),
  )

  const appParser = P.seqMap(
    nonAppParser,
    parenthesized(termParser),
    a
  )

  return P.optWhitespace.then(P.alt(
    appParser,
    nonAppParser,
  ))
})

function parenthesized<A>(p: P.Parser<A>): P.Parser<A> {
  return tokens.lparen.then(p).skip(tokens.rparen)
}

function token<A>(p: P.Parser<A>): P.Parser<A> {
  return p.skip(P.optWhitespace)
}
