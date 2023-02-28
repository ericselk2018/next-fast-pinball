import Player from '../Player/Player';

export default class Game {
	private _players: Player[];
	private _startingBallsPerPlayer = 4;
	private _currentPlayerIndex = 0;

	constructor(args: { playerCount: number }) {
		const { playerCount } = args;
		this._players = Array.from(Array(playerCount)).map(() => new Player());
	}

	public addPlayer = () => {
		this._players.push({
			...new Player(),
			ballsRemaining: this._startingBallsPerPlayer,
		});
	};

	public get currentPlayer() {
		return this._players[this._currentPlayerIndex];
	}

	public get players() {
		return this._players;
	}

	public get startingBallsPerPlayer() {
		return this._startingBallsPerPlayer;
	}
}
