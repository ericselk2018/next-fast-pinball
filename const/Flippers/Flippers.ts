import { CoilInfo, leftFlipperHoldCoil, leftFlipperMainCoil } from 'const/Coils/Coils';
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
	readonly mainCoil: CoilInfo;
	readonly holdCoil: CoilInfo;
}

export const leftFlipper: FlipperInfo = {
	buttonSwitch: leftFlipperButtonSwitch,
	endOfStrokeSwitch: leftFlipperEndOfStrokeSwitch,
	mainCoil: leftFlipperMainCoil,
	holdCoil: leftFlipperHoldCoil,
};

export const rightFlipper: FlipperInfo = {
	buttonSwitch: rightFlipperButtonSwitch,
	endOfStrokeSwitch: rightFlipperEndOfStrokeSwitch,
	mainCoil: leftFlipperMainCoil,
	holdCoil: leftFlipperHoldCoil,
};

const flippers: ReadonlyArray<FlipperInfo> = [leftFlipper, rightFlipper];

export default flippers;
