import { DependencyList, useEffect, useRef } from 'react';

declare const UNDEFINED_VOID_ONLY: unique symbol;
type Destructor = () => void | { [UNDEFINED_VOID_ONLY]: never };

// Thin wrapper around useEffect that tracks a value that is provided and updated after each call.
// If renamed, update name in .eslintrc.json so that exhaustive-deps will detect depedency issues.
export const useEffectWithPreviousValue = <T>(
	effect: (previousValue: T) => void | Destructor,
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
