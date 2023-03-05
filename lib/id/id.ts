import { NodeBoard, nodeBoards } from '../../const/NodeBoards/NodeBoards';

export const switchId = (args: { board: NodeBoard; header: number; pin: number }) => {
	const { board, header, pin } = args;
	const boardIndex = nodeBoards.indexOf(board);
	const baseId = nodeBoards
		.slice(0, boardIndex)
		.reduce((previousValue, currentValue) => previousValue + currentValue.switchCount, 0);
	return baseId + header * 8 + pin;
};

export const coilId = (args: { board: NodeBoard; header: number; pin: number }) => {
	const { board, header, pin } = args;
	const boardIndex = nodeBoards.indexOf(board);
	const baseId = nodeBoards
		.slice(0, boardIndex)
		.reduce((previousValue, currentValue) => previousValue + currentValue.coilCount, 0);
	return baseId + header * 8 + pin;
};
