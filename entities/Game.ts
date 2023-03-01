import Mode from './Mode';
import Player from './Player';
import Shot from './Shot';

export default interface Game {
	readonly players: ReadonlyArray<Player>;
	currentPlayer: Player;
	readonly nextPlayer: Player;
	ballsInPlay: number;
	currentMode: Mode;
	readonly shots: ReadonlyArray<Shot>;
	videoPlaying: string;
}
