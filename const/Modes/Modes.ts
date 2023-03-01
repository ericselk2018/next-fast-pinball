import {
	carSwitches,
	driverSwitches,
	hideSwitches,
	stuntSwitches,
	SwitchInfo,
	truckSwitches,
} from '../Switches/Switches';

export interface ModeStepTaskInfo {
	readonly switches: ReadonlyArray<SwitchInfo>;
	readonly count?: number;
}

export interface ModeStepInfo {
	readonly name: string;
	readonly tasks: ReadonlyArray<ModeStepTaskInfo>;
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
		{ name: 'Select Driver', tasks: [{ switches: driverSwitches }] },
		{ name: 'Boost Car', tasks: [{ switches: carSwitches }] },
		{ name: 'Hide Car', tasks: [{ switches: hideSwitches }] },
	],
};

export const truckHeistMode: ModeInfo = {
	name: 'Truck Heist',
	video: 'truck-heist.mp4',
	steps: [
		{ name: 'Get Team', tasks: [{ switches: driverSwitches, count: 2 }] },
		{ name: 'Intercept Truck', tasks: [{ switches: truckSwitches }] },
		{ name: 'Insane Stunt', tasks: [{ switches: stuntSwitches }] },
	],
};

const modes: ReadonlyArray<ModeInfo> = [boostCarsMode, truckHeistMode];

export default modes;
