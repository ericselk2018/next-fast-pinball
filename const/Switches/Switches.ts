import { switchId } from '../../lib/id/id';
import { lowerThirdNodeBoard } from '../NodeBoards/NodeBoards';

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
export const drainSwitch: SwitchInfo = {
	id: id(1),
	name: 'Drain',
};
export const coinSlotSwitch: SwitchInfo = { id: id(2), name: 'Coin Slot', normallyClosed: true };
export const rightFlipperEndOfStrokeSwitch: SwitchInfo = {
	id: id(3),
	name: 'Right Flipper End of Stroke',
};
export const inlaneSwitch: SwitchInfo = {
	id: id(4),
	name: 'Inlane Rollover',
};
export const startButtonSwitch: SwitchInfo = { id: id(5), name: 'Start Button', normallyClosed: true };
export const rightSlingshotSwitch: SwitchInfo = {
	id: id(6),
	name: 'Right Slingshot',
};
export const domSwitch: TargetSwitchInfo = {
	id: id(7),
	name: 'Dom Target',
	image: 'images/dom.jpg',
	videos: ['videos/dom1.mp4'],
};

id = (pin: number) => switchId({ board: lowerThirdNodeBoard, header: 1, pin });
export const leftFlipperButtonSwitch: SwitchInfo = { id: id(0), name: 'Left Flipper Button' };
export const rightFlipperButtonSwitch: SwitchInfo = { id: id(1), name: 'Right Flipper Button' };
export const rightRolloverSwitch: SwitchInfo = {
	id: id(2),
	name: 'Right Rollover',
};
export const leftRolloverSwitch: SwitchInfo = {
	id: id(3),
	name: 'Left Rollover',
};
export const selectButtonSwitch: SwitchInfo = { id: id(4), name: 'Select Button' };
export const leftSlingshotSwitch: SwitchInfo = {
	id: id(5),
	name: 'Left Slingshot',
};

id = (pin: number) => switchId({ board: lowerThirdNodeBoard, header: 2, pin });
export const brianSwitch: TargetSwitchInfo = {
	id: id(0),
	name: 'Brian Target',
	image: 'images/brian.jpg',
	videos: ['videos/brian1.mp4'],
};
export const miaSwitch: TargetSwitchInfo = {
	id: id(1),
	name: 'Mia Target',
	image: 'images/mia.jpg',
	videos: ['videos/mia1.mp4'],
};
export const lettySwitch: TargetSwitchInfo = {
	id: id(2),
	name: 'Letty Target',
	image: 'images/letty.jpg',
	videos: ['videos/letty1.mp4'],
};
export const skylineSwitch: TargetSwitchInfo = {
	id: id(3),
	name: 'Skyline Target',
	image: 'images/skyline.jpg',
	videos: ['videos/skyline1.mp4'],
};
export const chargerSwitch: TargetSwitchInfo = {
	id: id(4),
	name: 'Charger Target',
	image: 'images/charger.jpg',
	videos: ['videos/charger1.mp4'],
};
export const leftKickerSwitch: TargetSwitchInfo = {
	id: id(5),
	name: 'Dom Home',
	image: 'images/domHome.jpg',
	videos: ['videos/domHome1.mp4'],
};
export const rogersTruckSwitch: TargetSwitchInfo = {
	id: id(6),
	name: 'Rogers Truck',
	image: 'images/rogersTruck.jpg',
	videos: ['videos/rogersTruck1.mp4'],
};

id = (pin: number) => switchId({ board: lowerThirdNodeBoard, header: 3, pin });
export const underRogersTruckSwitch: TargetSwitchInfo = {
	id: id(0),
	name: 'Under Rogers Truck',
	image: 'images/underRogersTruck.jpg',
	videos: ['videos/underRogersTruck1.mp4'],
};

export const driverSwitches: ReadonlyArray<TargetSwitchInfo> = [domSwitch, brianSwitch, miaSwitch, lettySwitch];
export const carSwitches: ReadonlyArray<TargetSwitchInfo> = [skylineSwitch, chargerSwitch];
export const kickerSwitches: ReadonlyArray<TargetSwitchInfo> = [leftKickerSwitch];
export const truckSwitches: ReadonlyArray<TargetSwitchInfo> = [rogersTruckSwitch];
export const stuntSwitches: ReadonlyArray<TargetSwitchInfo> = [underRogersTruckSwitch];

const switches: ReadonlyArray<SwitchInfo> = [
	leftFlipperEndOfStrokeSwitch,
	leftFlipperButtonSwitch,
	rightFlipperEndOfStrokeSwitch,
	rightFlipperButtonSwitch,
	coinSlotSwitch,
	startButtonSwitch,
	inlaneSwitch,
	domSwitch,
	leftSlingshotSwitch,
	leftRolloverSwitch,
	rightSlingshotSwitch,
	rightRolloverSwitch,
	drainSwitch,
];

export default switches;
