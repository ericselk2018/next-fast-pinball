export interface NodeBoard {
	readonly switchCount: number;
	readonly coilCount: number;
}

export const lowerThirdNodeBoard: NodeBoard = {
	switchCount: 32,
	coilCount: 8,
};

export const upperThirdNodeBoard: NodeBoard = {
	switchCount: 16,
	coilCount: 16,
};

export const cabinetNodeBoard: NodeBoard = {
	switchCount: 8,
	coilCount: 4,
};

// Order of boards in this array must match the order they are in your FAST loop (the network cables in/out).
export const nodeBoards: ReadonlyArray<NodeBoard> = [lowerThirdNodeBoard, upperThirdNodeBoard, cabinetNodeBoard];
