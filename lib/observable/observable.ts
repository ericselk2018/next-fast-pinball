interface Observable<T> {
	get(): T;
	set(newValue: T): void;
}

interface ObservableNumber extends Observable<number> {
	increment(): void;
	decrement(): void;
}

interface ObservableNumberArray {
	get(): number[];
	get(index: number): number;
	set(newValue: number[]): void;
	set(newValue: number, index: number): void;
	increment(index: number): void;
	decrement(index: number): void;
	fill(value: number): void;
}

export default function observable(args: {
	initialValue: number;
	onChange: (newValue: number) => void;
	max?: number;
	min?: number;
}): ObservableNumber;
export default function observable(args: {
	initialValue: number[];
	onChange: (newValue: number[]) => void;
}): ObservableNumberArray;
export default function observable<T>(args: { initialValue: T; onChange: (newValue: T) => void }): Observable<T>;
export default function observable<T>(args: {
	initialValue: T;
	onChange: (newValue: T) => void;
	max?: number;
	min?: number;
}): Observable<T> | ObservableNumber | ObservableNumberArray {
	const { initialValue, onChange, max, min } = args;
	let _value = initialValue;

	return {
		get(index?: number) {
			if (Array.isArray(_value) && index !== undefined) {
				return _value[index];
			}
			return _value;
		},
		set(newValue: T, index?: number) {
			if (Array.isArray(_value) && index !== undefined) {
				const oldValue = _value[index];
				if (oldValue !== newValue) {
					_value[index] = newValue;
					onChange(newValue);
				}
			} else if (newValue !== _value) {
				_value = newValue;
				onChange(newValue);
			}
		},
		increment(index?: number) {
			if (typeof _value === 'number') {
				if (_value === max) {
					// FUTURE: Why doesn't TypeScript know this is a number?  Must need to tell TypeScript
					//  that this type is const somehow.
					(_value as number) = min || 0;
				} else {
					_value++;
				}
				onChange(_value);

				// FUTURE: figure out how to use set without TypeScript errors.  These lines both give compile-time errors.
				// this.set(this.get() + 1);
				// this.set(_value + 1);
			} else if (Array.isArray(_value) && index !== undefined) {
				_value[index]++;
				onChange(_value);
			}
		},
		decrement(index?: number) {
			if (typeof _value === 'number') {
				if (_value === min) {
					if (max !== undefined) {
						// FUTURE: Why doesn't TypeScript know this is a number?  Must need to tell TypeScript
						//  that this type is const somehow.
						(_value as number) = max;
					} else {
						// stay at min
						return;
					}
				} else {
					_value--;
				}
				onChange(_value);
			} else if (Array.isArray(_value) && index !== undefined) {
				_value[index]--;
				onChange(_value);
			}
		},
		fill(value: number) {
			if (Array.isArray(_value)) {
				_value.fill(value);
				onChange(_value);
			}
		},
	};
}
