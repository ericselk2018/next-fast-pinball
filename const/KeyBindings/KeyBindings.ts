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
	troughSwitches,
	troughBallOneSwitch,
} from '../Switches/Switches';

const keyBindings: ReadonlyArray<KeyBindingInfo> = [
	{ key: 'Shift', location: 1, switch: leftFlipperButtonSwitch },
	{ key: 'Shift', location: 2, switch: rightFlipperButtonSwitch },
	{ key: 'c', switch: coinSlotSwitch },
	{ key: 's', switch: startButtonSwitch },
	{ key: 'Tab', switch: selectButtonSwitch },
	{ key: 'p', switch: plungerRolloverSwitch },
	{ key: '4', switch: fourTargetGroupTopSwitch },
	{ key: '5', switch: fourTargetGroupBottomSwitch },
	{ key: '1', switch: threeTargetGroupOutsideSwitch },
	{ key: '2', switch: threeTargetGroupCenterSwitch },
	{ key: '3', switch: threeTargetGroupInsideSwitch },
	{ key: 'd', switch: troughSwitches[troughSwitches.length - 1] },
	{ key: 't', switch: troughBallOneSwitch },
];

export default keyBindings;
