import { NodeBoard } from '../../const/NodeBoards/NodeBoards';
import { coilId, switchId } from './id';

const mockNodeBoardsGetter = jest.fn();

jest.mock('../../const/NodeBoards/NodeBoards', () => ({
	get nodeBoards() {
		return mockNodeBoardsGetter();
	},
}));

describe('id', () => {
	describe('switchId', () => {
		it('should return correct ID for 2nd board with 3rd board setup', () => {
			const board1: NodeBoard = {
				coilCount: 1,
				switchCount: 123,
			};
			const board2: NodeBoard = {
				coilCount: 12,
				switchCount: 9,
			};
			const board3: NodeBoard = {
				coilCount: 15,
				switchCount: 456,
			};

			const boards = [board1, board2, board3];
			const header = 2;
			const pin = 4;

			mockNodeBoardsGetter.mockReturnValue(boards);

			const id = switchId({ board: board2, header, pin });

			expect(id).toBe(board1.switchCount + header * 8 + pin);
		});
	});

	describe('coilId', () => {
		it('should return correct ID for 2nd board with 3rd board setup', () => {
			const board1: NodeBoard = {
				coilCount: 123,
				switchCount: 1,
			};
			const board2: NodeBoard = {
				coilCount: 9,
				switchCount: 12,
			};
			const board3: NodeBoard = {
				coilCount: 456,
				switchCount: 15,
			};

			const boards = [board1, board2, board3];
			const header = 3;
			const pin = 7;

			mockNodeBoardsGetter.mockReturnValue(boards);

			const id = coilId({ board: board2, header, pin });

			expect(id).toBe(board1.coilCount + header * 8 + pin);
		});
	});
});
