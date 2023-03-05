export interface CoilInfo {
	name: string;
	id: number;
}

export const leftFlipperMainCoil: CoilInfo = { name: 'Left Flipper', id: 0 };
export const leftFlipperHoldCoil: CoilInfo = { name: 'Left Flipper Hold', id: 1 };

const coils: CoilInfo[] = [];

export default coils;
