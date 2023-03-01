import {
	carSwitches,
	driverSwitches,
	hideSwitches,
	stuntSwitches,
	TargetSwitchInfo,
	truckSwitches,
} from '../Switches/Switches';

export interface ModeStepInfo {
	readonly name: string;
	readonly switches: ReadonlyArray<TargetSwitchInfo>;
	readonly count?: number;
}

export interface ModeInfo {
	readonly name: string;
	readonly video: string;
	readonly steps: ReadonlyArray<ModeStepInfo>;
}

export const boostCarsMode: ModeInfo = {
	name: 'Boost Car',
	video: 'boost-cars.mp4',
	steps: [
		{ name: 'Select Driver', switches: driverSwitches },
		{ name: 'Boost Car', switches: carSwitches },
		{ name: 'Hide Car', switches: hideSwitches },
	],
};

export const truckHeistMode: ModeInfo = {
	name: 'Truck Heist',
	video: 'truck-heist.mp4',
	steps: [
		{ name: 'Get Team', switches: driverSwitches, count: 2 },
		{ name: 'Intercept Truck', switches: truckSwitches },
		{ name: 'Insane Stunt', switches: stuntSwitches },
	],
};

const modes: ReadonlyArray<ModeInfo> = [boostCarsMode, truckHeistMode];

export default modes;
