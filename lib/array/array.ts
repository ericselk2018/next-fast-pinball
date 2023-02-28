export const removeDuplicates = <T>(args: { array: Array<T>; isSame: (a: T, b: T) => boolean }) => {
	const { array, isSame } = args;
	return array.filter((a, index, array) => array.findIndex((b) => isSame(a, b)) === index);
};
