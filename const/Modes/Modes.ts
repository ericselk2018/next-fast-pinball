import Mode from '../../entities/Mode/Mode';
import ModeStep from '../../entities/ModeStep/ModeStep';

export const boostCarsMode = new Mode({
	name: 'Boost Cars',
	video: 'boost-cars.mp4',
	steps: [
		new ModeStep({ name: 'Select Driver' }),
		new ModeStep({ name: 'Boost Car' }),
		new ModeStep({ name: 'Hide Car' }),
	],
});

const modes: Mode[] = [
	boostCarsMode,
	new Mode({
		name: 'Truck Heist',
		video: 'truck-heist.mp4',
		steps: [
			new ModeStep({ name: 'Get Team' }),
			new ModeStep({ name: 'Intercept Truck' }),
			new ModeStep({ name: 'Insane Stunt' }),
		],
	}),
];

export default modes;
