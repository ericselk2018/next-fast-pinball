export interface CoilInfo {
	name: string;
	number: number;
}

export const leftFlipperMainCoil: CoilInfo = { name: 'Left Flipper', number: 0 };
export const leftFlipperHoldCoil: CoilInfo = { name: 'Left Flipper Hold', number: 1 };

const coils: CoilInfo[] = [];

export default coils;
