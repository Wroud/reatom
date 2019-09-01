# @reatom/react

Package for bindings [ReAtom](github.com/artalar/reatom) store with React


## Install

Yarn
```
yarn add @reatom/react
```

NPM
```
npm i -S @reatom/react
```

## Hooks


### useAtom
Connects the atom to the store represented in context and returns the state of the atom from the store (or default atom state)
```ts
useAtom(atom: Atom, onlyInit: boolean = true): AtomState
```

### useAction
Binds action with dispatch to the store provided in the context
```ts
useAction(atom: Action, deps: any[] = [])
``` 

## Usage

### Step 1. Create store
```jsx
// App

import React from 'react';
import { createStore } from '@reatom/core'
import { context } from '@reatom/react'
import { Counter } from './components/Counter'

import './App.css';

export const App = () => {
  // preloaded state (not required)
  const state = { greeting: 'Hello Reatom' }

  // create root entry point for all atoms
  const store = createStore(state);

  return (
    <div className='App'>
      <context.Provide value={store}>
        <Counter />
      </context.Provide>
    </div>
  );
}
```

### Step 2. Use in component

```jsx
// components/Counter

import { declareAction, declareAtom } from '@reatom/core'
import { useAction, useAtom } from '@reatom/react'

const increment = declareAction()
const decrement = declareAction()

const GreetingAtom = declareAtom(['greeting'], '', on => [])
const CounterAtom = declareAtom(['counter'], 0, on => [
  on(increment, state => state + 1),
  on(decrement, state => state - 1)
])

export const Counter = () => {
  const greeting = useAtom(GreetingAtom)
  const count = useAtom(CounterAtom)
  const doIncrement = useAction(increment)
  const doDecrement = useAction(decrement)

  return (
    <div>
      <h1>{greeting}</h1>
      <button key='decrement'>-</button>
      {count}
      <button key='increment'>+</button>
    </div>
  )
}
```