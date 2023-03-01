import {
	leftFlipperButtonSwitch,
	leftFlipperEndOfStrokeSwitch,
	rightFlipperButtonSwitch,
	rightFlipperEndOfStrokeSwitch,
	SwitchInfo,
} from '../Switches/Switches';

export interface FlipperInfo {
	readonly buttonSwitch: SwitchInfo;
	readonly endOfStrokeSwitch: SwitchInfo;
}

export const leftFlipper: FlipperInfo = {
	buttonSwitch: leftFlipperButtonSwitch,
	endOfStrokeSwitch: leftFlipperEndOfStrokeSwitch,
};

export const rightFlipper: FlipperInfo = {
	buttonSwitch: rightFlipperButtonSwitch,
	endOfStrokeSwitch: rightFlipperEndOfStrokeSwitch,
};

const flippers: ReadonlyArray<FlipperInfo> = [leftFlipper, rightFlipper];

export default flippers;
