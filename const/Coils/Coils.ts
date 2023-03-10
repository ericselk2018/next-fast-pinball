import { coilId } from '../../lib/id/id';
import { lowerThirdNodeBoard } from '../NodeBoards/NodeBoards';

export interface CoilInfo {
	name: string;
	id: number;
}

declare type PinNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

// Coils are groupped by board and sorted by header and pin.
// This is to assist in wiring and finding available pins.
let id = (pin: PinNumber) => coilId({ board: lowerThirdNodeBoard, header: 0, pin });
export const leftFlipperMainCoil: CoilInfo = { name: 'Left Flipper', id: id(0) };
export const leftFlipperHoldCoil: CoilInfo = { name: 'Left Flipper Hold', id: id(1) };
export const rightFlipperMainCoil: CoilInfo = { name: 'Right Flipper', id: id(2) };
export const rightFlipperHoldCoil: CoilInfo = { name: 'Right Flipper Hold', id: id(3) };
export const leftSlingshotCoil: CoilInfo = { name: 'Left Slingshot', id: id(4) };
export const rightSlingshotCoil: CoilInfo = { name: 'Right Slingshot', id: id(5) };
export const rightBumperCoil: CoilInfo = { name: 'Right Bumper', id: id(6) };
export const middleKickerCoil: CoilInfo = { name: 'Middle Kicker', id: id(7) };

id = (pin: PinNumber) => coilId({ board: lowerThirdNodeBoard, header: 1, pin });
export const topKickerCoil: CoilInfo = { name: 'Top Kicker', id: id(0) };
export const rightKickerCoil: CoilInfo = { name: 'Right Kicker', id: id(2) };
export const leftKickerCoil: CoilInfo = { name: 'Left Kicker', id: id(3) };

const coils: CoilInfo[] = [leftFlipperMainCoil, leftFlipperHoldCoil, rightFlipperMainCoil, rightFlipperHoldCoil];

export default coils;
