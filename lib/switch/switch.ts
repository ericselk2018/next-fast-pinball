import { leftFlipperButtonSwitch, rightFlipperButtonSwitch, SwitchInfo } from '@/const/Switches/Switches';
import HardwareContext from '@/contexts/HardwareContext/HardwareContext';
import { DependencyList, EffectCallback, useContext, useEffect, useRef } from 'react';

const useSwitchesInternal = (
	args: {
		onToggle?: (args: { switchInfo: SwitchInfo; closed: boolean }) => void | EffectCallback;
		onHit?: (switchInfo: SwitchInfo) => void | EffectCallback;
	},
	deps: DependencyList,
	switches: ReadonlyArray<SwitchInfo>
) => {
	const { onToggle, onHit } = args;
	const { addSwitchHandler: addSwitchHitHandler } = useContext(HardwareContext);

	// Using a reference to the callbacks so that caller doesn't need to worry about dependecy management.
	// We will always call the latest version of the callback method given, this is how React hooks are expected to work.
	const onToggleRef = useRef(onToggle);
	onToggleRef.current = onToggle;
	const onHitRef = useRef(onHit);
	onHitRef.current = onHit;

	// We also keep a reference to cleanup functions that callbacks can return (optional) and call it the same
	//  way other React hooks do, so that this works like other React hooks such as useEffect.
	const cleanupToggle = useRef<EffectCallback>();
	const cleanupHit = useRef<EffectCallback>();

	useEffect(() => {
		const onHit = (switchInfo: SwitchInfo) => {
			// React hooks always call cleanup before calling the hook callback again.
			cleanupHit.current?.();

			const result = onHitRef.current?.(switchInfo);

			// Save latest cleanup function if we have one.
			cleanupHit.current = typeof result === 'function' ? result : undefined;
		};

		const onToggle = (args: { switchInfo: SwitchInfo; closed: boolean }) => {
			const { switchInfo, closed } = args;

			// React hooks always call cleanup before calling the hook callback again.
			cleanupToggle.current?.();

			const result = onToggleRef.current?.({ switchInfo, closed });

			// Save latest cleanup function if we have one.
			cleanupToggle.current = typeof result === 'function' ? result : undefined;
		};

		const close = addSwitchHitHandler({ switches, onHit, onToggle });
		return () => {
			// We cleanup our internal things, clear the hit handler.
			close();

			// Now we also allow for cleanup by the caller, the same as native React hooks do.
			if (cleanupToggle.current) {
				cleanupToggle.current();
				cleanupToggle.current = undefined;
			}
			if (cleanupHit.current) {
				cleanupHit.current();
				cleanupHit.current = undefined;
			}
		};

		// exhaustive-deps cannot detect issues at this level, but it will detect issues everywhere this hook is used
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [...deps, addSwitchHitHandler]);
};

// If renamed, update name in .eslintrc.json so that exhaustive-deps will detect depedency issues.
export const useToggleSwitches = (
	onToggle: (args: { switchInfo: SwitchInfo; closed: boolean }) => void | EffectCallback,
	deps: DependencyList,
	switches: ReadonlyArray<SwitchInfo>
) => {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useSwitchesInternal({ onToggle }, deps, switches);
};

// If renamed, update name in .eslintrc.json so that exhaustive-deps will detect depedency issues.
export const useSwitches = (
	onHit: (switchInfo: SwitchInfo) => void | EffectCallback,
	deps: DependencyList,
	switches: ReadonlyArray<SwitchInfo>
) => {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useSwitchesInternal({ onHit }, deps, switches);
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
