import Switch from './Switch';

export default interface TargetSwitch extends Switch {
	readonly image: string;
	readonly videos: ReadonlyArray<string>;
}
