import { leftFlipperButtonSwitch, rightFlipperButtonSwitch, SwitchInfo } from '@/const/Switches/Switches';
import HardwareContext from '@/contexts/HardwareContext/HardwareContext';
import { DependencyList, EffectCallback, useContext, useEffect, useRef } from 'react';

// If renamed, update name in .eslintrc.json so that exhaustive-deps will detect depedency issues.
export const useSwitches = (
	onHit: (switchInfo: SwitchInfo) => void | EffectCallback,
	deps: DependencyList,
	switches: SwitchInfo[]
) => {
	const { addSwitchHitHandler } = useContext(HardwareContext);

	// Using a reference to the callback so that caller doesn't need to worry about dependecy management.
	// We will always call the latest version of the callback method given, this is how React hooks are expected to work.
	const onHitRef = useRef(onHit);
	onHitRef.current = onHit;

	// We also keep a reference to a cleanup function that onHit can return (optional) and call it the same
	//  way other React hooks do, so that this works like other React hooks such as useEffect.
	const cleanup = useRef<EffectCallback>();

	useEffect(() => {
		const onHit = (switchInfo: SwitchInfo) => {
			// React hooks always call cleanup before calling the hook callback again.
			cleanup.current?.();

			const result = onHitRef.current?.(switchInfo);

			// Save latest cleanup function if we have one.
			cleanup.current = typeof result === 'function' ? result : undefined;
		};

		const close = addSwitchHitHandler({ switches, onHit });
		return () => {
			// We cleanup our internal things, clear the hit handler.
			close();

			// Now we also allow for cleanup by the caller, the same as native React hooks do.
			if (cleanup.current) {
				cleanup.current();
				cleanup.current = undefined;
			}
		};

		// exhaustive-deps cannot detect issues at this level, but it will detect issues everywhere this hook is used
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [...deps, addSwitchHitHandler]);
};

// If renamed, update name in .eslintrc.json so that exhaustive-deps will detect depedency issues.
export const useSwitch = (onHit: () => void | EffectCallback, deps: DependencyList, switchInfo: SwitchInfo) => {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useSwitches(onHit, deps, [switchInfo]);
};

// If renamed, update name in .eslintrc.json so that exhaustive-deps will detect depedency issues.
export const useFlippers = (onHit: (left: boolean) => void | EffectCallback, deps: DependencyList) => {
	useSwitches(
		(switchInfo: SwitchInfo) => {
			return onHit(switchInfo === leftFlipperButtonSwitch);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		deps,
		[leftFlipperButtonSwitch, rightFlipperButtonSwitch]
	);
};
