export interface SwitchInfo {
	readonly id: number;
	readonly name: string;
	readonly normallyClosed?: boolean;
}

export interface TargetSwitchInfo extends SwitchInfo {
	readonly image: string;
	readonly videos: ReadonlyArray<string>;
}

export const leftFlipperEndOfStrokeSwitch: SwitchInfo = { id: 0, name: 'Left Flipper End of Stroke' };
export const leftFlipperButtonSwitch: SwitchInfo = { id: 8, name: 'Left Flipper Button' };
export const rightFlipperEndOfStrokeSwitch: SwitchInfo = { id: 3, name: 'Right Flipper End of Stroke' };
export const rightFlipperButtonSwitch: SwitchInfo = { id: 9, name: 'Right Flipper Button' };
export const coinSlotSwitch: SwitchInfo = { id: 11, name: 'Coin Slot' };
export const startButtonSwitch: SwitchInfo = { id: 10, name: 'Start Button' };
export const selectButtonSwitch: SwitchInfo = { id: 104, name: 'Select Button' };
export const inlaneSwitch: SwitchInfo = { id: 6, name: 'Inlane Rollover' };
export const domSwitch: TargetSwitchInfo = {
	id: 7,
	name: 'Dom Target',
	image: 'images/dom.jpg',
	videos: ['videos/dom1.mp4'],
};
export const brianSwitch: TargetSwitchInfo = {
	id: 100,
	name: 'Brian Target',
	image: 'images/brian.jpg',
	videos: ['videos/brian1.mp4'],
};
export const miaSwitch: TargetSwitchInfo = {
	id: 101,
	name: 'Mia Target',
	image: 'images/mia.jpg',
	videos: ['videos/mia1.mp4'],
};
export const lettySwitch: TargetSwitchInfo = {
	id: 102,
	name: 'Letty Target',
	image: 'images/letty.jpg',
	videos: ['videos/letty1.mp4'],
};
export const skylineSwitch: TargetSwitchInfo = {
	id: 16,
	name: 'Skyline Target',
	image: 'images/skyline.jpg',
	videos: ['videos/skyline1.mp4'],
};
export const chargerSwitch: TargetSwitchInfo = {
	id: 103,
	name: 'Charger Target',
	image: 'images/charger.jpg',
	videos: ['videos/charger1.mp4'],
};
export const domHomeSwitch: TargetSwitchInfo = {
	id: 17,
	name: 'Dom Home',
	image: 'images/domHome.jpg',
	videos: ['videos/domHome1.mp4'],
};
export const rogersTruckSwitch: TargetSwitchInfo = {
	id: 18,
	name: 'Rogers Truck',
	image: 'images/rogersTruck.jpg',
	videos: ['videos/rogersTruck1.mp4'],
};
export const underRogersTruckSwitch: TargetSwitchInfo = {
	id: 19,
	name: 'Under Rogers Truck',
	image: 'images/underRogersTruck.jpg',
	videos: ['videos/underRogersTruck1.mp4'],
};

export const driverSwitches: ReadonlyArray<TargetSwitchInfo> = [domSwitch, brianSwitch, miaSwitch, lettySwitch];
export const carSwitches: ReadonlyArray<TargetSwitchInfo> = [skylineSwitch, chargerSwitch];
export const hideSwitches: ReadonlyArray<TargetSwitchInfo> = [domHomeSwitch];
export const truckSwitches: ReadonlyArray<TargetSwitchInfo> = [rogersTruckSwitch];
export const stuntSwitches: ReadonlyArray<TargetSwitchInfo> = [underRogersTruckSwitch];
export const kickerSwitches = hideSwitches;

const switches: ReadonlyArray<SwitchInfo> = [
	leftFlipperEndOfStrokeSwitch,
	leftFlipperButtonSwitch,
	rightFlipperEndOfStrokeSwitch,
	rightFlipperButtonSwitch,
	coinSlotSwitch,
	startButtonSwitch,
	inlaneSwitch,
	domSwitch,
	{ id: 1, name: 'Left Sling' },
	{ id: 2, name: 'Left Rollover' },
	{ id: 4, name: 'Right Sling' },
	{ id: 5, name: 'Right Rollover' },
];

export default switches;
