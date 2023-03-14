import { DependencyList, useCallback, useEffect, useRef } from 'react';

interface Listener {
	readonly close: () => void;
}

declare type ListenerCallback = () => void;
export declare type EventSource = (callback: ListenerCallback) => Listener;
declare type NotifyListeners = () => void;

// Create an event that will fire to all active listeners each time the event fires.
// Listeners need to manually close themselves when they no longer want to receive events.
// If renamed, must update .eslintrc.json with new name for exhaustive-deps to detect dependency issues.
export const useEvent = (): [EventSource, NotifyListeners] => {
	const listeners = useRef<{ callback: ListenerCallback }[]>([]).current;

	const eventSource: EventSource = useCallback(
		(callback: ListenerCallback): Listener => {
			const listener = { callback };
			listeners.push(listener);
			return {
				close: () => {
					const index = listeners.indexOf(listener);
					if (index !== -1) {
						listeners.splice(index, 1);
					}
				},
			};
		},
		[listeners]
	);

	const notifyListeners: NotifyListeners = useCallback(() => {
		listeners.forEach(({ callback }) => callback());
	}, [listeners]);

	return [eventSource, notifyListeners];
};

// Hook that can be used to create a listener using the provided method.
// The listener will call the provided callback when an event fires.
// If renamed, must update .eslintrc.json with new name for exhaustive-deps to detect dependency issues.
export const useListener = (callback: () => void, deps: DependencyList, eventSource: EventSource) => {
	const callbackRef = useRef(callback);
	const eventSourceRef = useRef(eventSource);
	const cleanupRef = useRef<() => void>();

	callbackRef.current = callback;
	eventSourceRef.current = eventSource;

	useEffect(() => {
		const handleEvent = () => {
			// Call cleanup method if one was given on the previous call, before calling again.
			// Cleanup functions are expected to always run before callback is called again.
			cleanupRef.current?.();

			const result = callbackRef.current();

			// Update cleanup method.
			cleanupRef.current = typeof result === 'function' ? result : undefined;
		};

		const listener = eventSourceRef.current(handleEvent);

		return () => {
			listener.close();

			// We also need to call custom cleanup method on unmount if we got one on last callback invoke.
			cleanupRef.current?.();
		};

		// exhaustive-deps cannot detect problems at this level, but it will detect issues everywhere we use this custom hook
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [...deps]);
};
