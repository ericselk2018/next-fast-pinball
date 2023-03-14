import { DependencyList, EffectCallback, useEffect, useRef } from 'react';

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
