import KeyBinding from '@/entities/KeyBinding/KeyBinding';
import {
	coinSlotSwitch,
	domSwitch,
	inlaneSwitch,
	leftFlipperButtonSwitch,
	rightFlipperButtonSwitch,
	startButtonSwitch,
} from '../Switches/Switches';

const keyBindings: KeyBinding[] = [
	new KeyBinding({ key: 'Shift', location: 1, switch: leftFlipperButtonSwitch }),
	new KeyBinding({ key: 'Shift', location: 2, switch: rightFlipperButtonSwitch }),
	new KeyBinding({ key: 'c', switch: coinSlotSwitch }),
	new KeyBinding({ key: 's', switch: startButtonSwitch }),
	new KeyBinding({ key: 'i', switch: inlaneSwitch }),
	new KeyBinding({ key: 'd', switch: domSwitch }),
];

export default keyBindings;
