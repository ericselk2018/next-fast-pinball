import modes, { boostCarsMode } from './Modes';

describe('Modes', () => {
	describe('modes', () => {
		it('should contain boost cars mode', () => {
			expect(modes).toContain(boostCarsMode);
		});
	});
});
