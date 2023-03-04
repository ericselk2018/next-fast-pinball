export type AudioNames = 'tires' | 'horn' | 'shot' | 'rev' | 'crash';

export interface AudioFile {
	readonly name: AudioNames;
	readonly file: string;
}

const audioFiles: ReadonlyArray<AudioFile> = [
	{
		name: 'tires',
		file: 'audio/tires.mp3',
	},
	{
		name: 'horn',
		file: 'audio/horn.mp3',
	},
	{
		name: 'shot',
		file: 'audio/shot.mp3',
	},
	{
		name: 'rev',
		file: 'audio/rev.mp3',
	},
	{
		name: 'crash',
		file: 'audio/crash.mp3',
	},
];

export default audioFiles;
