import Flipper from '../../entities/Flipper/Flipper';
import {
	leftFlipperButtonSwitch,
	leftFlipperEndOfStroke,
	rightFlipperButtonSwitch,
	rightFlipperEndOfStroke,
} from '../Switches/Switches';

export const leftFlipper = new Flipper({
	buttonSwitch: leftFlipperButtonSwitch,
	endOfStrokeSwitch: leftFlipperEndOfStroke,
});

export const rightFlipper = new Flipper({
	buttonSwitch: rightFlipperButtonSwitch,
	endOfStrokeSwitch: rightFlipperEndOfStroke,
});

const flippers: Flipper[] = [leftFlipper, rightFlipper];

export default flippers;
