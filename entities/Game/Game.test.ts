import Game from './Game';

describe('Game', () => {
	describe('addPlayer', () => {
		it('should add player with balls remaining equal to starting balls per player', () => {
			const game = new Game({ playerCount: 0 });
			game.addPlayer();
			expect(game.players[0].ballsRemaining).toBe(game.startingBallsPerPlayer);
		});
	});
});
