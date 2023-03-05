import { coilId } from '../../lib/id/id';
import { lowerThirdNodeBoard } from '../NodeBoards/NodeBoards';

export interface CoilInfo {
	name: string;
	id: number;
}

declare type PinNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

// Coils are groupped by board and sorted by header and pin.
// This is to assist in wiring and finding available pins.
const id = (pin: PinNumber) => coilId({ board: lowerThirdNodeBoard, header: 0, pin });
export const leftFlipperMainCoil: CoilInfo = { name: 'Left Flipper', id: id(0) };
export const leftFlipperHoldCoil: CoilInfo = { name: 'Left Flipper Hold', id: id(1) };

const coils: CoilInfo[] = [leftFlipperMainCoil, leftFlipperHoldCoil];

export default coils;
