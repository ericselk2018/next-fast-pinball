export interface SwitchInfo {
	readonly number: number;
	readonly name: string;
}

export interface TargetSwitchInfo extends SwitchInfo {
	readonly image: string;
	readonly videos: ReadonlyArray<string>;
}

export const leftFlipperEndOfStrokeSwitch: SwitchInfo = { number: 0, name: 'Left Flipper End of Stroke' };
export const leftFlipperButtonSwitch: SwitchInfo = { number: 8, name: 'Left Flipper Button' };
export const rightFlipperEndOfStrokeSwitch: SwitchInfo = { number: 3, name: 'Right Flipper End of Stroke' };
export const rightFlipperButtonSwitch: SwitchInfo = { number: 9, name: 'Right Flipper Button' };
export const coinSlotSwitch: SwitchInfo = { number: 11, name: 'Coin Slot' };
export const startButtonSwitch: SwitchInfo = { number: 10, name: 'Start Button' };
export const inlaneSwitch: SwitchInfo = { number: 6, name: 'Inlane Rollover' };
export const domSwitch: TargetSwitchInfo = {
	number: 7,
	name: 'Dom Target',
	image: 'dom.jpg',
	videos: ['dom1.mp4'],
};
export const brianSwitch: TargetSwitchInfo = {
	number: 100,
	name: 'Brian Target',
	image: 'brian.jpg',
	videos: ['brian1.mp4'],
};
export const miaSwitch: TargetSwitchInfo = {
	number: 101,
	name: 'Mia Target',
	image: 'mia.jpg',
	videos: ['mia1.mp4'],
};
export const lettySwitch: TargetSwitchInfo = {
	number: 102,
	name: 'Letty Target',
	image: 'letty.jpg',
	videos: ['letty1.mp4'],
};
export const skylineSwitch: TargetSwitchInfo = {
	number: 16,
	name: 'Skyline Target',
	image: 'skyline.jpg',
	videos: ['skyline1.mp4'],
};
export const chargerSwitch: TargetSwitchInfo = {
	number: 103,
	name: 'Charger Target',
	image: 'charger.jpg',
	videos: ['charger1.mp4'],
};
export const domHomeSwitch: TargetSwitchInfo = {
	number: 17,
	name: 'Dom Home',
	image: 'domHome.jpg',
	videos: ['domHome1.mp4'],
};
export const rogersTruckSwitch: TargetSwitchInfo = {
	number: 18,
	name: 'Rogers Truck',
	image: 'rogersTruck.jpg',
	videos: ['rogersTruck1.mp4'],
};
export const underRogersTruckSwitch: TargetSwitchInfo = {
	number: 19,
	name: 'Under Rogers Truck',
	image: 'underRogersTruck.jpg',
	videos: ['underRogersTruck1.mp4'],
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
	{ number: 1, name: 'Left Sling' },
	{ number: 2, name: 'Left Rollover' },
	{ number: 4, name: 'Right Sling' },
	{ number: 5, name: 'Right Rollover' },
];

export default switches;
