import Switch from '../../entities/Switch/Switch';

export const leftFlipperEndOfStroke = new Switch({ number: 0, name: 'Left Flipper End of Stroke' });
export const leftFlipperButtonSwitch = new Switch(new Switch({ number: 8, name: 'Left Flipper Button' }));
export const rightFlipperEndOfStroke = new Switch({ number: 3, name: 'Right Flipper End of Stroke' });
export const rightFlipperButtonSwitch = new Switch(new Switch({ number: 9, name: 'Right Flipper Button' }));
export const coinSlotSwitch = new Switch(new Switch({ number: 11, name: 'Coin Slot' }));
export const startButtonSwitch = new Switch({ number: 10, name: 'Start Button' });
export const inlaneSwitch = new Switch({ number: 6, name: 'Inlane Rollover' });
export const domSwitch = new Switch({ number: 7, name: 'Dom Target' });
export const skylineSwitch = new Switch({ number: 16, name: 'Skyline Target' });
export const domHomeSwitch = new Switch({ number: 17, name: 'Dom Home' });
export const rogersTruckSwitch = new Switch({ number: 18, name: 'Rogers Truck' });
export const underRogersTruckSwitch = new Switch({ number: 19, name: 'Under Rogers Truck' });

export const driverSwitches: Switch[] = [domSwitch];
export const carSwitches: Switch[] = [skylineSwitch];
export const hideSwitches: Switch[] = [domHomeSwitch];
export const truckSwitches: Switch[] = [rogersTruckSwitch];
export const stuntSwitches: Switch[] = [underRogersTruckSwitch];

const switches: Switch[] = [
	leftFlipperEndOfStroke,
	leftFlipperButtonSwitch,
	rightFlipperEndOfStroke,
	rightFlipperButtonSwitch,
	coinSlotSwitch,
	startButtonSwitch,
	inlaneSwitch,
	domSwitch,
	new Switch({ number: 1, name: 'Left Sling' }),
	new Switch({ number: 2, name: 'Left Rollover' }),
	new Switch({ number: 4, name: 'Right Sling' }),
	new Switch({ number: 5, name: 'Right Rollover' }),
];

export default switches;
