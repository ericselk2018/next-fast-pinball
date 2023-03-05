export interface NodeBoard {
	switchCount: number;
	coilCount: number;
}

export const lowerThirdNodeBoard: NodeBoard = {
	switchCount: 32,
	coilCount: 8,
};

export const nodeBoards: NodeBoard[] = [lowerThirdNodeBoard];
