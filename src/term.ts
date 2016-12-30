export type Term = Var | Lam | App

type Var = {
  tag: 'var'
  name: string
}

type Lam = {
  tag: 'lam'
  name: string
  body: Term
}

type App = {
  tag: 'app'
  t1: Term
  t2: Term
}

// Constructors
export function v(name: string): Term {
  return { tag: 'var', name }
}

export function l(name: string, body: Term): Term {
  return { tag: 'lam', name, body }
}

export function a(t1: Term, t2: Term): Term {
  return { tag: 'app', t1, t2 }
}

// Functions
export function eq(t1: Term, t2: Term): boolean {
  if (t1.tag !== t2.tag)
    return false

  switch (t1.tag) {
    case 'var':
      return t1.name === (t2 as Var).name
    case 'lam':
      const l2 = t2 as Lam
      return t1.name === l2.name && eq(t1.body, l2.body)
    case 'app':
      const a2 = t2 as App
      return eq(t1.t1, a2.t1) && eq(t1.t2, a2.t2)
  }
}

export function show(term: Term): string {
  switch (term.tag) {
    case 'var': return term.name
    case 'lam': return `${term.name} => ${show(term.body)}`
    case 'app': return `(${show(term.t1)})(${show(term.t2)})`
  }
}

// function normalize(term: Term): Term {
//   switch (term.tag) {
//     case 'var': return term
//     case 'lam': return {
//       ...term,
//       body: normalize(term.body)
//     }
//     case 'app': {
//       const t1 = normalize(term.t1)
//       const t2 = normalize(term.t2)
//       if (t1.tag !== 'lam')
//         throw new Error(`Cannot apply ${t1.tag} as a function`)
//     }
//   }
// }
