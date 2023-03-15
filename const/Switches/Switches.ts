import { switchId } from '../../lib/id/id';
import { cabinetNodeBoard, lowerThirdNodeBoard, upperThirdNodeBoard } from '../NodeBoards/NodeBoards';

export interface SwitchInfo {
	readonly id: number;
	readonly name: string;
	readonly normallyClosed?: boolean;
}

export interface TargetSwitchInfo extends SwitchInfo {
	readonly image: string;
	readonly videos: ReadonlyArray<string>;
}

declare type PinNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

// Switches are groupped by board and sorted by header and pin.
// This is to assist in wiring and finding available pins.
let id = (pin: PinNumber) => switchId({ board: lowerThirdNodeBoard, header: 0, pin });
export const leftFlipperEndOfStrokeSwitch: SwitchInfo = {
	id: id(0),
	name: 'Left Flipper End of Stroke',
};
export const leftSlingshotSwitch: SwitchInfo = {
	id: id(1),
	name: 'Left Slingshot',
};
export const leftRolloverSwitch: SwitchInfo = {
	id: id(2),
	name: 'Left Rollover',
	normallyClosed: true,
};
export const rightFlipperEndOfStrokeSwitch: SwitchInfo = {
	id: id(3),
	name: 'Right Flipper End of Stroke',
};
export const rightSlingshotSwitch: SwitchInfo = {
	id: id(4),
	name: 'Right Slingshot',
};
export const rightRolloverSwitch: SwitchInfo = {
	id: id(5),
	name: 'Right Rollover',
	normallyClosed: true,
};
export const leftMiddleRolloverSwitch: TargetSwitchInfo = {
	id: id(6),
	name: 'Left Middle Rollover',
	normallyClosed: true,
	image: 'images/dom.jpg',
	videos: ['videos/dom1.mp4'],
};
export const fourTargetGroupTopSwitch: TargetSwitchInfo = {
	id: id(7),
	name: '4-Target Group - Top',
	image: 'images/dom.jpg',
	videos: ['videos/dom1.mp4'],
};

id = (pin: number) => switchId({ board: lowerThirdNodeBoard, header: 1, pin });
export const fourTargetGroupBottomSwitch: TargetSwitchInfo = {
	id: id(0),
	name: '4-Target Group - Bottom',
	image: 'images/letty.jpg',
	videos: ['videos/letty1.mp4'],
};
export const fourTargetGroupSecondFromBottomSwitch: TargetSwitchInfo = {
	id: id(1),
	name: '4-Target Group - 2nd From Bottom',
	image: 'images/mia.jpg',
	videos: ['videos/mia1.mp4'],
};
export const fourTargetGroupSecondFromTopSwitch: TargetSwitchInfo = {
	id: id(2),
	name: '4-Target Group - 2nd From Top',
	image: 'images/brian.jpg',
	videos: ['videos/brian1.mp4'],
};
export const troughBallOneSwitch: SwitchInfo = { id: id(3), name: 'Trough Ball 1', normallyClosed: true };
export const troughJamSwitch: SwitchInfo = { id: id(4), name: 'Trough Jam', normallyClosed: true };
export const troughBallTwoSwitch: SwitchInfo = { id: id(5), name: 'Trough Ball 2', normallyClosed: true };
export const troughBallThreeSwitch: SwitchInfo = { id: id(6), name: 'Trough Ball 3', normallyClosed: true };
export const troughBallFourSwitch: SwitchInfo = { id: id(7), name: 'Trough Ball 4', normallyClosed: true };

id = (pin: number) => switchId({ board: lowerThirdNodeBoard, header: 2, pin });
export const troughBallFiveSwitch: SwitchInfo = { id: id(0), name: 'Trough Ball 5', normallyClosed: true };
export const plungerRolloverSwitch: SwitchInfo = {
	id: id(1),
	name: 'Plunger Rollover',
	normallyClosed: true,
};

id = (pin: number) => switchId({ board: upperThirdNodeBoard, header: 0, pin });
export const middleBumperSwitch: SwitchInfo = { id: id(0), name: 'Middle Bumper' };
export const leftBumperSwitch: SwitchInfo = { id: id(1), name: 'Left Bumper' };
export const topRolloverInsideSwitch: SwitchInfo = { id: id(2), name: 'Top Rollover Inside', normallyClosed: true };
export const topRolloverOutsideSwitch: SwitchInfo = { id: id(3), name: 'Top Rollover Outside', normallyClosed: true };
export const topLeftTargetSwitch: TargetSwitchInfo = {
	id: id(4),
	name: 'Top Left Target',
	image: 'images/domHome.jpg',
	videos: ['videos/domHome1.mp4'],
};
export const leftKickerSwitch: TargetSwitchInfo = {
	id: id(5),
	name: 'Left Kicker',
	normallyClosed: true,
	image: 'images/domHome.jpg',
	videos: ['videos/domHome1.mp4'],
};

id = (pin: number) => switchId({ board: upperThirdNodeBoard, header: 1, pin });
export const rightKickerSwitch: TargetSwitchInfo = {
	id: id(0),
	name: 'Right Kicker',
	normallyClosed: true,
	image: 'images/domHome.jpg',
	videos: ['videos/domHome1.mp4'],
};
export const rightTargetSwitch: TargetSwitchInfo = {
	id: id(1),
	name: 'Right Target',
	image: 'images/domHome.jpg',
	videos: ['videos/domHome1.mp4'],
};
export const rightBumperSwitch: SwitchInfo = { id: id(2), name: 'Right Bumper' };
export const middleKickerSwitch: TargetSwitchInfo = {
	id: id(3),
	name: 'Middle Kicker',
	normallyClosed: true,
	image: 'images/domHome.jpg',
	videos: ['videos/domHome1.mp4'],
};
export const topKickerSwitch: TargetSwitchInfo = {
	id: id(4),
	name: 'Top Kicker',
	normallyClosed: true,
	image: 'images/domHome.jpg',
	videos: ['videos/domHome1.mp4'],
};
export const threeTargetGroupOutsideSwitch: TargetSwitchInfo = {
	id: id(5),
	name: '3-Target Group - Outside',
	image: 'images/charger.jpg',
	videos: ['videos/charger1.mp4'],
};
export const threeTargetGroupCenterSwitch: TargetSwitchInfo = {
	id: id(6),
	name: '3-Target Group - Center',
	image: 'images/skyline.jpg',
	videos: ['videos/skyline1.mp4'],
};
export const threeTargetGroupInsideSwitch: TargetSwitchInfo = {
	id: id(7),
	name: '3-Target Group - Inside',
	image: 'images/skyline.jpg',
	videos: ['videos/skyline1.mp4'],
};

id = (pin: number) => switchId({ board: cabinetNodeBoard, header: 0, pin });
export const leftFlipperButtonSwitch: SwitchInfo = { id: id(0), name: 'Left Flipper Button' };
export const rightFlipperButtonSwitch: SwitchInfo = { id: id(1), name: 'Right Flipper Button' };
export const startButtonSwitch: SwitchInfo = { id: id(2), name: 'Start Button' };
export const selectButtonSwitch: SwitchInfo = { id: id(3), name: 'Select Button' };
export const tiltSwitch: SwitchInfo = { id: id(4), name: 'Tilt' };
export const coinDoorSwitch: SwitchInfo = { id: id(5), name: 'Coin Door' };
export const coinSlotSwitch: SwitchInfo = { id: id(6), name: 'Coin Slot' };

export const driverSwitches: ReadonlyArray<TargetSwitchInfo> = [
	fourTargetGroupTopSwitch,
	fourTargetGroupSecondFromTopSwitch,
	fourTargetGroupSecondFromBottomSwitch,
	fourTargetGroupBottomSwitch,
];
export const carSwitches: ReadonlyArray<TargetSwitchInfo> = [
	threeTargetGroupOutsideSwitch,
	threeTargetGroupCenterSwitch,
	threeTargetGroupInsideSwitch,
];
export const truckSwitches: ReadonlyArray<TargetSwitchInfo> = [topLeftTargetSwitch];
export const stuntSwitches: ReadonlyArray<TargetSwitchInfo> = [leftMiddleRolloverSwitch];
export const kickerSwitches: ReadonlyArray<TargetSwitchInfo> = [
	leftKickerSwitch,
	middleKickerSwitch,
	topKickerSwitch,
	rightKickerSwitch,
];
export const bumperSwitches: ReadonlyArray<SwitchInfo> = [rightBumperSwitch, leftBumperSwitch, middleBumperSwitch];
export const troughSwitches: ReadonlyArray<SwitchInfo> = [
	troughBallOneSwitch,
	troughBallTwoSwitch,
	troughBallThreeSwitch,
	troughBallFourSwitch,
	troughBallFiveSwitch,
];

// In virtual hardware mode, we need a default state, so we list switches that should be closed on startup here.
export const virtualClosedAtStartSwitches: ReadonlyArray<SwitchInfo> = [
	troughBallOneSwitch,
	// troughBallTwoSwitch,
	// troughBallThreeSwitch,
	// troughBallFourSwitch,
	// troughBallFiveSwitch,
];

const switches: ReadonlyArray<SwitchInfo> = [
	leftFlipperEndOfStrokeSwitch,
	leftSlingshotSwitch,
	leftRolloverSwitch,
	rightFlipperEndOfStrokeSwitch,
	rightSlingshotSwitch,
	rightRolloverSwitch,
	leftMiddleRolloverSwitch,
	fourTargetGroupTopSwitch,
	fourTargetGroupBottomSwitch,
	fourTargetGroupSecondFromBottomSwitch,
	fourTargetGroupSecondFromTopSwitch,
	troughBallOneSwitch,
	troughJamSwitch,
	troughBallTwoSwitch,
	troughBallThreeSwitch,
	troughBallFourSwitch,
	troughBallFiveSwitch,
	plungerRolloverSwitch,
	middleBumperSwitch,
	leftBumperSwitch,
	topRolloverInsideSwitch,
	topRolloverOutsideSwitch,
	topLeftTargetSwitch,
	leftKickerSwitch,
	rightKickerSwitch,
	rightTargetSwitch,
	rightBumperSwitch,
	middleKickerSwitch,
	topKickerSwitch,
	threeTargetGroupOutsideSwitch,
	threeTargetGroupCenterSwitch,
	threeTargetGroupInsideSwitch,
	leftFlipperButtonSwitch,
	rightFlipperButtonSwitch,
	startButtonSwitch,
	selectButtonSwitch,
	tiltSwitch,
	coinDoorSwitch,
	coinSlotSwitch,
];

export default switches;
