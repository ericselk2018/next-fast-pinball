import Switch from './Switch';

export default interface Target extends Switch {
	readonly image: string;
	readonly videos: ReadonlyArray<string>;
}
