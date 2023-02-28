import { deepClone } from './object';

describe('object', () => {
	describe('deepClone', () => {
		it('should create a unique deep copy', () => {
			const source = { foo: { more: 'bar' } };
			const clone = deepClone(source);
			clone.foo.more = 'new bar';
			expect(source.foo.more).toBe('bar');
		});
	});
});
