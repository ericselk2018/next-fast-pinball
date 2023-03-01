import Switch from './Switch';

export default interface KeyBinding {
	readonly key: string;
	readonly location?: number;
	readonly switch: Switch;
}
