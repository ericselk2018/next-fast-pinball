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
	fourTargetGroupBottomSwitch,
	threeTargetGroupOutsideSwitch,
	threeTargetGroupCenterSwitch,
	threeTargetGroupInsideSwitch,
} from '../Switches/Switches';

const keyBindings: ReadonlyArray<KeyBindingInfo> = [
	{ key: 'Shift', location: 1, switch: leftFlipperButtonSwitch },
	{ key: 'Shift', location: 2, switch: rightFlipperButtonSwitch },
	{ key: 'c', switch: coinSlotSwitch },
	{ key: 's', switch: startButtonSwitch },
	{ key: 'Tab', switch: selectButtonSwitch },
	{ key: 'p', switch: plungerRolloverSwitch },
	{ key: 'd', switch: fourTargetGroupTopSwitch },
	{ key: 'l', switch: fourTargetGroupBottomSwitch },
	{ key: '1', switch: threeTargetGroupOutsideSwitch },
	{ key: '2', switch: threeTargetGroupCenterSwitch },
	{ key: '3', switch: threeTargetGroupInsideSwitch },
];

export default keyBindings;
