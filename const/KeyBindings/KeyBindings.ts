export interface KeyBindingInfo {
	readonly key: string;
	readonly location?: number;
	readonly switch: SwitchInfo;
}

import {
	coinSlotSwitch,
	domSwitch,
	inlaneSwitch,
	leftFlipperButtonSwitch,
	rightFlipperButtonSwitch,
	startButtonSwitch,
	SwitchInfo,
} from '../Switches/Switches';

const keyBindings: ReadonlyArray<KeyBindingInfo> = [
	{ key: 'Shift', location: 1, switch: leftFlipperButtonSwitch },
	{ key: 'Shift', location: 2, switch: rightFlipperButtonSwitch },
	{ key: 'c', switch: coinSlotSwitch },
	{ key: 's', switch: startButtonSwitch },
	{ key: 'i', switch: inlaneSwitch },
	{ key: 'd', switch: domSwitch },
];

export default keyBindings;
