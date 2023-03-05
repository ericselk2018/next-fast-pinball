import { removeDuplicates } from '../../lib/array/array';
import switches, { leftFlipperButtonSwitch } from './Switches';

describe('Switches', () => {
	describe('switches', () => {
		it('should contain left flipper button switch', () => {
			expect(switches).toContain(leftFlipperButtonSwitch);
		});
		it('should not contain duplicate numbers', () => {
			const withoutDuplicates = removeDuplicates({ array: switches, isSame: (a, b) => a.id === b.id });
			expect(withoutDuplicates).toEqual(switches);
		});
	});
});
