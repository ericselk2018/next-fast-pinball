import { bitTest } from './math';

describe('math', () => {
	describe('bitTest', () => {
		it('should test true if bit 1 is set and test bit is 0 -- zero based', () => {
			expect(bitTest(0b1, 0)).toBe(true);
		});
		it('should test false if bit 2 is set and test bit is 0', () => {
			expect(bitTest(0b10, 0)).toBe(false);
		});
		it('should test true if bit 2 is set and test bit is 1', () => {
			expect(bitTest(0b10, 1)).toBe(true);
		});
		it('should test true if bit 32 is set and test bit is 31', () => {
			expect(bitTest(0b10000000000000000000000000000000, 31)).toBe(true);
		});
		it('should test true if bit 32 is set and test bit is 32', () => {
			expect(bitTest(0b10000000000000000000000000000000, 32)).toBe(false);
		});
	});
});
