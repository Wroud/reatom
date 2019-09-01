import {
  createContext,
  useEffect,
  useRef,
  useState,
  useContext,
  useCallback
} from 'react'

import { Store, Atom, ActionCreator } from '@reatom/core';

type Unit<T> = ActionCreator<T> | Atom<T>
type ExtractProps<T> = T extends Unit<infer P>? P: never

export const context = createContext<Store>(null as Store)

export function useForceUpdate() {
  const update = useState(0)[1]
  return useRef(() => update(v => v + 1)).current
}

function useUnsubscribe(ref: any) {
  useEffect(
    () => () => {
      ref.current()
    },
    [ref]
  )
}

export function useAtom<T extends Atom<any>, S = ExtractProps<T>>(atom: T, onlyInitialization = false): S {
  const atomRef = useRef<T>()
  const stateRef = useRef<S>()
  const unsubscribeRef = useRef<Function>()
  const store = useContext(context)
  const forceUpdate = useForceUpdate()

  if (atomRef.current === undefined) {
    atomRef.current = atom
    unsubscribeRef.current = store.subscribe(atom, (state: any) => {
      stateRef.current = state
      if (!onlyInitialization) forceUpdate()
    })

    stateRef.current = store.getState(atom)
  }

  useUnsubscribe(unsubscribeRef)

  return stateRef.current as S
}

export function useAction<T extends ActionCreator<any>, P = ExtractProps<T>>(cb: T, deps: any[] = []) {
  const store = useContext(context)

  return useCallback((p: P) => {
    const action = cb(p)
    if (typeof action === "object" && action !== null) store.dispatch(action)
  }, deps)
}