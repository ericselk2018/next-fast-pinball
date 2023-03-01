import audioFiles, { AudioFile, AudioNames } from '@/const/AudioFiles/AudioFiles';
import { createContext, ReactNode, RefObject, useCallback, useMemo, useRef } from 'react';

interface AudioElement extends AudioFile {
	ref?: RefObject<HTMLAudioElement>;
}

interface AudioContext {
	play: (args: { name: AudioNames }) => void;
}

const AudioContext = createContext<AudioContext>(null!);

export const AudioContextProvider = ({ children }: { children: ReactNode }) => {
	const audioElements: AudioElement[] = useMemo(() => [...audioFiles], []);
	for (const audioElement of audioElements) {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		audioElement.ref = useRef<HTMLAudioElement>(null);
	}

	const play = useCallback(
		(args: { name: AudioNames }) => {
			const { name } = args;
			const audioElement = audioElements.find((audioFile) => audioFile.name === name);
			const element = audioElement?.ref?.current;
			if (element) {
				element.volume = 1;
				element.play();
			}
		},
		[audioElements]
	);

	const context: AudioContext = useMemo(() => ({ play }), [play]);

	return (
		<AudioContext.Provider value={context}>
			{audioElements.map(({ name, file, ref }) => (
				<audio key={name} ref={ref} src={file} />
			))}
			{children}
		</AudioContext.Provider>
	);
};

export default AudioContext;
