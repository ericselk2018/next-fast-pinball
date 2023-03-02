export type AudioNames = 'tires' | 'horn' | 'shot' | 'rev';

export interface AudioFile {
	readonly name: AudioNames;
	readonly file: string;
}

const audioFiles: ReadonlyArray<AudioFile> = [
	{
		name: 'tires',
		file: 'tires.mp3',
	},
	{
		name: 'horn',
		file: 'horn.mp3',
	},
	{
		name: 'shot',
		file: 'shot.mp3',
	},
	{
		name: 'rev',
		file: 'rev.mp3',
	},
];

export default audioFiles;
