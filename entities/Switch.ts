import { SwitchInfo } from '../const/Switches/Switches';

export default interface Switch extends SwitchInfo {
	readonly name: string;
	readonly id: number;
	readonly closed: boolean;
	readonly addHitHandler: (args: { onHit: () => void }) => () => void;
	readonly addToggleHandler: (args: { onToggle: (args: { closed: boolean }) => void }) => () => void;
}
