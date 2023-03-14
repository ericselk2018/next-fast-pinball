import { Dispatch, SetStateAction, useCallback, useRef, useState } from 'react';

// // Similar to useState but keeps track of the most recent (actual) value and provides
// // a function to get that value.  In game logic most of what we do needs to be real-time
// // and work off actual state, only the rendering uses batched/async state values.
export function useGameState<S>(initialValue: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
export function useGameState<S = undefined>(): [S | undefined, Dispatch<SetStateAction<S | undefined>>];
export function useGameState<S>(initialValue?: S | (() => S)) {
	const actualValue = useRef(typeof initialValue === 'function' ? (initialValue as () => S)() : initialValue);
	const [stateValue, setStateValue] = useState(initialValue);
	const setValue = useCallback((newValue: SetStateAction<S | undefined>) => {
		if (typeof newValue === 'function') {
			// Not sure how to avoid this dangerous as cast.  I defined this the same
			//  way React does, so I assume their code also uses an as cast, if TypeScript.
			actualValue.current = (newValue as (actualValue: S | undefined) => S | undefined)(actualValue.current);
		} else {
			actualValue.current = newValue;
		}
		setStateValue(newValue);
	}, []);
	return [stateValue, setValue, () => actualValue.current];
}
