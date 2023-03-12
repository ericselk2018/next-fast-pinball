export interface KeyBindingInfo {
	readonly key: string;
	readonly location?: number;
	readonly switch: SwitchInfo;
}

import {
	coinSlotSwitch,
	fourTargetGroupTopSwitch,
	plungerRolloverSwitch,
	leftFlipperButtonSwitch,
	rightFlipperButtonSwitch,
	selectButtonSwitch,
	startButtonSwitch,
	SwitchInfo,
} from '../Switches/Switches';

const keyBindings: ReadonlyArray<KeyBindingInfo> = [
	{ key: 'Shift', location: 1, switch: leftFlipperButtonSwitch },
	{ key: 'Shift', location: 2, switch: rightFlipperButtonSwitch },
	{ key: 'c', switch: coinSlotSwitch },
	{ key: 's', switch: startButtonSwitch },
	{ key: 'Tab', switch: selectButtonSwitch },
	{ key: 'p', switch: plungerRolloverSwitch },
	{ key: 'd', switch: fourTargetGroupTopSwitch },
];

export default keyBindings;
