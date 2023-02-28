import { replaceItemAtIndex } from '@/lib/array/array';
import Player from '../Player/Player';

export default class Game {
	private _players: Player[];
	private _startingBallsPerPlayer = 4;
	private _currentPlayerIndex = 0;
	private _update: (game: Game) => void;

	constructor(args: { playerCount: number; update: (game: Game) => void }) {
		const { playerCount, update } = args;
		this._update = update;
		this._players = Array.from(Array(playerCount)).map(
			(_, index) => new Player({ update: (player) => this.updatePlayer({ index, player }) })
		);
	}

	private updatePlayer(args: { index: number; player: Player }) {
		const { index, player } = args;
		this._update({ ...this, _players: replaceItemAtIndex({ array: this._players, index, item: player }) });
	}

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
