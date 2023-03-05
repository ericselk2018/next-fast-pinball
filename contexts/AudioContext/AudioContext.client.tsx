import audioFiles, { AudioNames } from '../../const/AudioFiles/AudioFiles';
import { createContext, ReactNode, useCallback, useMemo } from 'react';

interface AudioContext {
	play: (args: { name: AudioNames }) => void;
}

// This context wraps everything, so non-null assertion is pretty safe and keeps consumer code cleaner.
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const AudioContext = createContext<AudioContext>(null!);

export const AudioContextProvider = ({ children }: { children: ReactNode }) => {
	const play = useCallback((args: { name: AudioNames }) => {
		const { name } = args;
		const audioFile = audioFiles.find((audioFile) => audioFile.name === name);
		if (audioFile) {
			const audio = new Audio(audioFile.file);
			audio.play();
		}
	}, []);

	const context: AudioContext = useMemo(() => ({ play }), [play]);

	return (
		<AudioContext.Provider value={context}>
			{/* preload audio files */}
			{/* {audioFiles.map(({ name, file }) => (
				<audio key={name} src={file} preload="auto" />
			))} */}
			{children}
		</AudioContext.Provider>
	);
};

export default AudioContext;
