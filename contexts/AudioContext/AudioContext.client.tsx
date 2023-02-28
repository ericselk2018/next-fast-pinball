import Game from '@/entities/Game/Game';
import { createContext, ReactNode, RefObject, useCallback, useMemo, useRef } from 'react';

type AudioNames = 'tires' | 'horn' | 'shot';

interface AudioContext {
	play: (args: { name: AudioNames }) => void;
}

const AudioContext = createContext<AudioContext>(null!);

export const AudioContextProvider = ({ children }: { children: ReactNode }) => {
	const tiresElement = useRef<HTMLAudioElement>(null);
	const hornElement = useRef<HTMLAudioElement>(null);
	const shotElement = useRef<HTMLAudioElement>(null);

	const playElement = (_element: RefObject<HTMLAudioElement>) => {
		const element = _element.current;
		if (element) {
			element.volume = 1;
			element.play();
		}
	};

	const play = useCallback((args: { name: AudioNames }) => {
		const { name } = args;
		switch (name) {
			case 'tires':
				playElement(tiresElement);
			case 'horn':
				playElement(hornElement);
			case 'shot':
				playElement(shotElement);
		}
	}, []);

	const context: AudioContext = useMemo(() => ({ play }), [play]);

	return (
		<AudioContext.Provider value={context}>
			<audio ref={tiresElement} src="tires.mp3" />
			<audio ref={hornElement} src="horn.mp3" />
			<audio ref={shotElement} src="shot.mp3" />
			{children}
		</AudioContext.Provider>
	);
};

export default AudioContext;
