export interface NodeBoard {
	readonly switchCount: number;
	readonly coilCount: number;
}

export const lowerThirdNodeBoard: NodeBoard = {
	switchCount: 32,
	coilCount: 8,
};

export const nodeBoards: ReadonlyArray<NodeBoard> = [lowerThirdNodeBoard];
