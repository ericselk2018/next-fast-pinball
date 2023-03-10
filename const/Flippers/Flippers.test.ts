import {
	leftFlipperButtonSwitch,
	leftFlipperEndOfStrokeSwitch,
	rightFlipperButtonSwitch,
	rightFlipperEndOfStrokeSwitch,
} from '../Switches/Switches';
import flippers, { leftFlipper, rightFlipper } from './Flippers';

describe('Flippers', () => {
	describe('flippers', () => {
		it('should contain left flipper', () => {
			expect(flippers).toContain(leftFlipper);
		});
		it('should contain right flipper', () => {
			expect(flippers).toContain(rightFlipper);
		});
	});

	describe('leftFlipper', () => {
		it('should have correct end of stroke switch', () => {
			expect(leftFlipper.endOfStrokeSwitch).toBe(leftFlipperEndOfStrokeSwitch);
		});
		it('should have correct button switch', () => {
			expect(leftFlipper.buttonSwitch).toBe(leftFlipperButtonSwitch);
		});
	});

	describe('rightFlipper', () => {
		it('should have correct end of stroke switch', () => {
			expect(rightFlipper.endOfStrokeSwitch).toBe(rightFlipperEndOfStrokeSwitch);
		});
		it('should have correct button switch', () => {
			expect(rightFlipper.buttonSwitch).toBe(rightFlipperButtonSwitch);
		});
	});
});
