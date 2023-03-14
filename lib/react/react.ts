import { DependencyList, EffectCallback, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';

type Cleanup = () => void;

// Thin wrapper around useEffect that tracks a value that is provided and updated after each call.
// If renamed, update name in .eslintrc.json so that exhaustive-deps will detect depedency issues.
export const useEffectWithPreviousValue = <T>(
	effect: (previousValue: T) => void | Cleanup,
	deps: DependencyList,
	currentValue: T
) => {
	const previousValue = useRef(currentValue);

	useEffect(() => {
		const maybeCleanup = effect(previousValue.current);
		previousValue.current = currentValue;
		return () => {
			maybeCleanup?.();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps);
};

// Thin wrapper around useEffect that ensures callback is only called once per update loop.
// If renamed, update name in .eslintrc.json so that exhaustive-deps will detect depedency issues.
export const useDeferredEffect = (effect: EffectCallback, deps: DependencyList) => {
	useEffect(() => {
		let cleanupFunction: Cleanup | undefined = undefined;

		const timeout = setTimeout(() => {
			const maybeCleanup = effect();
			if (maybeCleanup) {
				cleanupFunction = maybeCleanup;
			}
		});
		return () => {
			clearTimeout(timeout);
			cleanupFunction?.();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps);
};

// Like useState but you can pass a callback function to the setter that will run after the state update completes.
// If renamed, update name in .eslintrc.json so that exhaustive-deps will detect depedency issues.
export const useStateCallback = <T>(
	initialState: T
): [T, (state: SetStateAction<T>, cb?: (state: T) => void) => void] => {
	const [state, setState] = useState(initialState);
	const cbRef = useRef<((state: T) => void) | undefined>(undefined);

	const setStateCallback = useCallback((state: SetStateAction<T>, cb?: (state: T) => void) => {
		cbRef.current = cb;
		setState(state);
	}, []);

	useEffect(() => {
		if (cbRef.current) {
			cbRef.current(state);
			cbRef.current = undefined;
		}
	}, [state]);

	return [state, setStateCallback];
};
