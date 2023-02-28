export const removeDuplicates = <T>(args: { array: Array<T>; isSame: (a: T, b: T) => boolean }) => {
	const { array, isSame } = args;
	return array.filter((a, index, array) => array.findIndex((b) => isSame(a, b)) === index);
};

export const replaceItemAtIndex = <T>(args: { array: Array<T>; index: number; item: T }) => {
	const { array } = args;
	return array.map((item, index) => (index === args.index ? args.item : item));
};
