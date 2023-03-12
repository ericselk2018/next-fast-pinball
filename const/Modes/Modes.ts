import {
	carSwitches,
	driverSwitches,
	kickerSwitches,
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
	video: 'videos/boost-cars.mp4',
	steps: [
		{ name: 'Select Driver', switches: driverSwitches },
		{ name: 'Boost Car', switches: carSwitches },
		{ name: 'Hide Car', switches: kickerSwitches },
	],
};

export const truckHeistMode: ModeInfo = {
	name: 'Truck Heist',
	video: 'videos/truck-heist.mp4',
	steps: [
		{ name: 'Get Team', switches: driverSwitches, count: 2 },
		{ name: 'Rob Truck', switches: truckSwitches },
		{ name: 'Do Stunt', switches: stuntSwitches },
	],
};

const modes: ReadonlyArray<ModeInfo> = [boostCarsMode, truckHeistMode];

export default modes;
