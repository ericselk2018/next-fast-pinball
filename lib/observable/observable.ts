const observable = <T>(args: { initialValue: T; onChange: (newValue: T) => void }) => {
	const { initialValue, onChange } = args;
	let _value = initialValue;
	return {
		get() {
			return _value;
		},
		set(newValue: T) {
			if (newValue !== _value) {
				_value = newValue;
				onChange(newValue);
			}
		},
	};
};

export default observable;
