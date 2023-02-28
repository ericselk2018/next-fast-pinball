import ModeTask from '@/entities/ModeTask/ModeTask';
import Mode from '../../entities/Mode/Mode';
import ModeStep from '../../entities/ModeStep/ModeStep';
import { carSwitches, driverSwitches, hideSwitches, stuntSwitches, truckSwitches } from '../Switches/Switches';

export const boostCarsMode = new Mode({
	name: 'Boost Car',
	video: 'boost-cars.mp4',
	steps: [
		new ModeStep({ name: 'Select Driver', tasks: [new ModeTask({ switches: driverSwitches })] }),
		new ModeStep({ name: 'Boost Car', tasks: [new ModeTask({ switches: carSwitches })] }),
		new ModeStep({ name: 'Hide Car', tasks: [new ModeTask({ switches: hideSwitches })] }),
	],
});

export const truckHeistMode = new Mode({
	name: 'Truck Heist',
	video: 'truck-heist.mp4',
	steps: [
		new ModeStep({ name: 'Get Team', tasks: [new ModeTask({ switches: driverSwitches, count: 2 })] }),
		new ModeStep({ name: 'Intercept Truck', tasks: [new ModeTask({ switches: truckSwitches })] }),
		new ModeStep({ name: 'Insane Stunt', tasks: [new ModeTask({ switches: stuntSwitches })] }),
	],
});

const modes: Mode[] = [boostCarsMode, truckHeistMode];

export default modes;
