export interface SwitchInfo {
	readonly number: number;
	readonly name: string;
}

export interface TargetInfo extends SwitchInfo {
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
export const domSwitch: SwitchInfo = { number: 7, name: 'Dom Target' };
export const skylineSwitch: SwitchInfo = { number: 16, name: 'Skyline Target' };
export const domHomeSwitch: TargetInfo = { number: 17, name: 'Dom Home', image: 'dom.jpg', videos: ['dom1.mp4'] };
export const rogersTruckSwitch: SwitchInfo = { number: 18, name: 'Rogers Truck' };
export const underRogersTruckSwitch: SwitchInfo = { number: 19, name: 'Under Rogers Truck' };

export const driverSwitches: ReadonlyArray<SwitchInfo> = [domSwitch];
export const carSwitches: ReadonlyArray<SwitchInfo> = [skylineSwitch];
export const hideSwitches: ReadonlyArray<TargetInfo> = [domHomeSwitch];
export const truckSwitches: ReadonlyArray<SwitchInfo> = [rogersTruckSwitch];
export const stuntSwitches: ReadonlyArray<SwitchInfo> = [underRogersTruckSwitch];
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
